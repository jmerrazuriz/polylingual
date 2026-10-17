import { kanjiByChar } from '../courses/ja/kanji'
import { furiganaToKana, KANJI_CHAR, parseFurigana } from './furigana'
import { beforeEach, describe, expect, it } from 'vitest'
import { courseById, courses } from '../courses'
import { grammarByCourse } from '../courses/content'
import { japaneseGrammar } from '../courses/ja/grammar'
import { allKana, kanaByChar } from '../courses/ja/kana'
import { planDaily, isDailyComplete } from './daily'
import { dayKey, emptyCourse, emptyProgress, mergeProgress, parseProgress, toStored } from './progress/model'
import { gradeForReading, review } from './progress/srs'
import { progressSnapshot, useProgress } from './progress/store'
import { unlockedGrammar } from './progress/unlock'
import { romajiReadings } from './romaji'
import { buildUnitReview, buildWeakReview, units, weakItems } from './units'

const t0 = new Date(2026, 9, 16, 10, 0).getTime()
const JP = /[぀-ヿ]/

/** Quita espacios y puntuación para comprobar que el texto solo usa kana conocidos. */
const kanaOnly = (text: string) => furiganaToKana(text).replace(/[\s、。？＿→「」]/g, '')

describe('cursos', () => {
  it('el japonés está disponible y el resto llega pronto', () => {
    expect(courses.map((c) => `${c.id}:${c.status}`)).toEqual(['ja:available', 'it:soon', 'de:soon', 'fr:soon'])
    expect(courseById('xx').id).toBe('ja')
  })

  it('cambiar de curso guarda el progreso del anterior y trae el del nuevo', () => {
    useProgress.getState().reset()
    useProgress.getState().completeLesson('vocales', 5, 5)
    useProgress.getState().setCourse('it')
    expect(useProgress.getState().lessons).toEqual({})
    expect(useProgress.getState().otherCourses.ja.lessons.vocales).toBeDefined()
    useProgress.getState().setCourse('ja')
    expect(useProgress.getState().lessons.vocales).toEqual({ correct: 5, total: 5 })
    useProgress.getState().reset()
  })
})

describe('formato guardado por cursos', () => {
  it('lee el formato anterior (todo al nivel superior) como progreso de japonés', () => {
    const legacy = { lessons: { vocales: { correct: 4, total: 5 } }, activity: { '2026-10-16': 3 }, unlockAll: true }
    const p = parseProgress(legacy)
    expect(p.course).toBe('ja')
    expect(p.lessons.vocales).toEqual({ correct: 4, total: 5 })
    expect(p.unlockAll).toBe(true)
    expect(p.activity).toEqual({ '2026-10-16': 3 })
  })

  it('guardar y leer devuelve lo mismo, con varios cursos', () => {
    const p = {
      ...emptyProgress(),
      grammar: { desu: { correct: 4, total: 5 } },
      daily: { '2026-10-16': { steps: ['nuevo'], lesson: 'k', done: ['nuevo'] } },
      otherCourses: { it: { ...emptyCourse(), lessons: { ciao: { correct: 1, total: 1 } } } },
    }
    expect(parseProgress(JSON.parse(JSON.stringify(toStored(p))))).toEqual(p)
  })

  it('al unir progresos mezcla gramática, lección del día y otros cursos', () => {
    const a = { ...emptyProgress(), grammar: { desu: { correct: 2, total: 5 } }, daily: { d: { steps: ['a', 'b'], done: ['a'] } } }
    const b = {
      ...emptyProgress(),
      grammar: { desu: { correct: 5, total: 5 } },
      daily: { d: { steps: ['a', 'b'], done: ['b'] } },
      otherCourses: { fr: emptyCourse() },
    }
    const m = mergeProgress(a, b)
    expect(m.grammar.desu).toEqual({ correct: 5, total: 5 })
    expect(m.daily.d.done.sort()).toEqual(['a', 'b'])
    expect(Object.keys(m.otherCourses)).toEqual(['fr'])
  })
})

describe('gramática de japonés', () => {
  it('ids únicos y lecciones completas', () => {
    expect(grammarByCourse.ja).toBe(japaneseGrammar)
    expect(new Set(japaneseGrammar.map((l) => l.id)).size).toBe(japaneseGrammar.length)
    for (const l of japaneseGrammar) {
      expect(l.examples.length, l.id).toBeGreaterThanOrEqual(3)
      expect(l.exercises.length, l.id).toBeGreaterThanOrEqual(3)
      for (const ex of l.examples) expect(ex.reading, ex.text).toBeTruthy()
    }
  })

  it('la respuesta de cada ejercicio de opción está entre las opciones y no se repiten', () => {
    for (const l of japaneseGrammar) {
      for (const ex of l.exercises) {
        if (ex.type === 'order' || ex.type === 'type') continue
        expect(ex.options, `${l.id}: ${ex.answer}`).toContain(ex.answer)
        expect(new Set(ex.options).size).toBe(ex.options.length)
        if (ex.type === 'choice' && JP.test(ex.prompt) && ex.prompt.includes('＿')) expect(ex.prompt.split('＿')).toHaveLength(2)
      }
    }
  })

  it('todo el japonés de ejemplos y ejercicios usa kana que la app conoce', () => {
    const texts = japaneseGrammar.flatMap((l) => [
      ...l.examples.map((e) => e.text),
      ...l.exercises.flatMap((ex) =>
        ex.type === 'order'
          ? ex.answer
          : ex.type === 'meaning'
            ? [ex.text]
            : ex.type === 'type'
              ? [ex.prompt, ...ex.answers].filter((t) => JP.test(t))
              : [ex.prompt, ...ex.options].filter((t) => JP.test(t)),
      ),
    ])
    // Las consignas en español que citan una partícula («¿Cómo se pronuncia は…?») no cuentan.
    for (const t of texts.filter((t) => !/[a-zA-Z¿«]/.test(t))) expect(() => romajiReadings(kanaOnly(t)), t).not.toThrow()
  })

  it('tiene el N5 completo, 28 lecciones N4 y 32 N3, en orden de nivel', () => {
    const levels = japaneseGrammar.map((l) => l.level ?? 'N5')
    expect(levels.filter((l) => l === 'N4')).toHaveLength(28)
    expect(levels.lastIndexOf('N5')).toBeLessThan(levels.indexOf('N4'))
    expect(levels.filter((l) => l === 'N3')).toHaveLength(64)
    expect(levels.lastIndexOf('N4')).toBeLessThan(levels.indexOf('N3'))
  })

  it('los kanji de la gramática llevan furigana y son kanji del curso', () => {
    const texts = japaneseGrammar.flatMap((l) => [
      l.pattern,
      ...l.examples.map((e) => e.text),
      ...l.exercises.flatMap((ex) =>
        ex.type === 'order' ? ex.answer : ex.type === 'meaning' ? [ex.text] : ex.type === 'type' ? [ex.prompt, ...ex.answers] : [ex.prompt, ...ex.options],
      ),
    ])
    for (const t of texts) {
      for (const seg of parseFurigana(t)) {
        if (seg.ruby) for (const ch of seg.text) expect(kanjiByChar.has(ch), `${ch} en «${t}»`).toBe(true)
        else expect(seg.text, `kanji sin furigana en «${t}»`).not.toMatch(KANJI_CHAR)
      }
    }
  })

  it('N3: ejercicios con formato JLPT (paráfrasis y uso) en cada lección de la segunda tanda', () => {
    const n3 = japaneseGrammar.filter((l) => l.level === 'N3')
    const withFormat = n3.filter((l) => l.exercises.some((e) => e.type === 'choice' && e.format))
    expect(withFormat.length).toBeGreaterThanOrEqual(24)
    for (const l of n3.slice(16)) expect(withFormat, l.id).toContain(l)
    for (const l of n3)
      for (const e of l.exercises)
        if (e.type === 'choice' && e.format) expect(new Set(e.options.map((o) => furiganaToKana(o))).size, l.id).toBe(e.options.length)
  })

  it('se abre tras los básicos del hiragana y en orden', () => {
    const ids = japaneseGrammar.map((l) => l.id)
    expect(unlockedGrammar(ids, {}, {}, false).size).toBe(0)
    expect([...unlockedGrammar(ids, {}, { w: { correct: 3, total: 3 } }, false)]).toEqual(['desu'])
    expect([...unlockedGrammar(ids, { desu: { correct: 3, total: 5 } }, { w: { correct: 3, total: 3 } }, false)]).toEqual(['desu', 'wa'])
  })
})

describe('repaso por unidad y puntos débiles', () => {
  it('las unidades cubren cada kana una sola vez', () => {
    const chars = units.flatMap((u) => u.chars)
    expect(new Set(chars).size).toBe(chars.length)
    expect(chars.length).toBe(allKana.length)
    expect(units.map((u) => u.id)).toContain('hiragana-basic')
  })

  it('el repaso de unidad tiene 10 preguntas de lectura y 3 de escritura de esa unidad', () => {
    const unit = units.find((u) => u.id === 'hiragana-basic')!
    const plan = buildUnitReview(unit)
    expect(plan.reading).toHaveLength(10)
    expect(plan.writing).toHaveLength(3)
    for (const w of plan.writing) expect(unit.chars).toContain(w.kana)
  })

  it('los puntos débiles son lo que más se falla', () => {
    const p = {
      ...emptyProgress(),
      kana: {
        ぬ: { readOk: 1, readTotal: 5, writeScore: 4, writeCount: 2 },
        め: { readOk: 5, readTotal: 5, writeScore: 0, writeCount: 0 },
        る: { readOk: 3, readTotal: 4, writeScore: 0, writeCount: 0 },
      },
    }
    expect(weakItems(p).read.map((k) => k.char)).toEqual(['ぬ', 'る'])
    expect(weakItems(p).write.map((k) => k.char)).toEqual(['ぬ'])
    expect(buildWeakReview(p).reading).toHaveLength(4)
  })
})

describe('lección del día', () => {
  beforeEach(() => useProgress.getState().reset())

  it('para alguien nuevo: solo algo nuevo (la primera lección)', () => {
    const r = planDaily(emptyProgress(), t0, false)
    expect(r.steps).toEqual(['nuevo'])
    expect(r.lesson).toBe('vocales')
  })

  it('con repasos vencidos, lección siguiente, gramática y juego', () => {
    const lessons = Object.fromEntries(
      ['vocales', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'].map((id) => [id, { correct: 5, total: 5 }]),
    )
    const card = review(undefined, gradeForReading(true), t0 - 86_400_000 * 30)
    const p = { ...emptyProgress(), lessons, cards: { 'あ:read': card } }
    const r = planDaily(p, t0, false)
    expect(r.steps).toEqual(['repasos', 'nuevo', 'gramatica', 'juego'])
    expect(r.lesson).toBe('g')
    expect(r.grammar).toBe('desu')
  })

  it('se completa cuando todos sus pasos están hechos', () => {
    expect(isDailyComplete({ steps: ['nuevo', 'juego'], done: ['nuevo'] })).toBe(false)
    expect(isDailyComplete({ steps: ['nuevo', 'juego'], done: ['juego', 'nuevo'] })).toBe(true)
    expect(isDailyComplete({ steps: [], done: [] })).toBe(false)
  })

  it('el store guarda la lección del día y descarta días viejos', () => {
    const { updateDaily } = useProgress.getState()
    for (let i = 0; i < 35; i++) updateDaily(dayKey(t0 - i * 86_400_000), () => ({ steps: ['nuevo'], done: [] }))
    expect(Object.keys(progressSnapshot().daily)).toHaveLength(30)
    expect(kanaByChar.get('あ')).toBeDefined()
  })
})
