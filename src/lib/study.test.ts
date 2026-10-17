import { vocabLessons } from '../courses/ja/vocab'
import { readingTexts } from './readings'
import { beforeAll, describe, expect, it } from 'vitest'
import { grammarByCourse } from '../courses/content'
import { counterLessons, counters, numbers } from '../courses/ja/counters'
import { getStrokes, loadKanjiStrokes } from '../courses/ja/kana'
import { kanjiByChar, kanjiLessons, kanjiList } from '../courses/ja/kanji'
import { lessons as kanaLessons } from '../courses/ja/lessons'
import { buildExtraLesson } from './extra'
import { japanesePath, nextPathLesson, pathStatus } from './path'
import { emptyProgress } from './progress/model'
import { romajiReadings } from './romaji'
import { counterLessonExercises, kanjiLessonExercises, kanjiWritingItems } from './studyExercises'
import { units } from './units'

const readable = (kana: string) => romajiReadings(kana.replace(/[\s、。〜()]/g, ''))
const done = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, { correct: 1, total: 1 }]))

// Los trazos de kanji se cargan aparte (como en la app).
beforeAll(() => loadKanjiStrokes())

describe('contadores', () => {
  it('cada contador tiene 10 lecturas y marca bien cuáles son especiales', () => {
    for (const c of counters) {
      expect(c.readings, c.id).toHaveLength(10)
      if (c.id === 'tsu' || c.id === 'nichi') continue // lecturas propias, no número + contador
      c.readings.forEach((r, i) => {
        const regular = numbers[i].readings[0] + c.reading
        const n = i + 1
        // Las regulares son número + contador; las especiales cambian de sonido.
        if (c.irregular.includes(n)) expect(r, `${c.id} ${n}`).not.toBe(regular)
        else expect(r, `${c.id} ${n}`).toBe(regular)
      })
    }
  })

  it('todas las lecturas y ejemplos usan kana conocidos', () => {
    for (const c of counters) {
      for (const r of [...c.readings, c.question, ...(c.extra ?? []).map((e) => e.reading)]) expect(() => readable(r), r).not.toThrow()
      for (const e of c.examples) expect(() => readable(e.text), e.text).not.toThrow()
    }
  })

  it('las lecciones usan contadores existentes y generan ejercicios válidos', () => {
    for (const lesson of counterLessons) {
      for (const id of lesson.counters) expect(counters.some((c) => c.id === id), id).toBe(true)
      const exercises = counterLessonExercises(lesson)
      expect(exercises.length, lesson.id).toBeGreaterThanOrEqual(4)
      for (const ex of exercises) {
        if (ex.type === 'order' || ex.type === 'type') continue
        expect(ex.options, lesson.id).toContain(ex.answer)
        expect(new Set(ex.options).size).toBe(ex.options.length)
        expect(ex.options.length).toBeGreaterThanOrEqual(3)
      }
    }
  })
})

describe('kanji', () => {
  it('lecturas bien escritas: on en katakana, kun y ejemplos en hiragana', () => {
    for (const k of kanjiList) {
      for (const on of k.on) expect(on, k.char).toMatch(/^[ァ-ヶー]+$/)
      for (const kun of k.kun) expect(kun, k.char).toMatch(/^[ぁ-ゖ]+(\([ぁ-ゖ]+\))?$/)
      expect(k.examples.length, k.char).toBeGreaterThanOrEqual(2)
      for (const ex of k.examples) {
        expect(ex.word, k.char).toContain(k.char)
        expect(ex.reading, `${k.char}: ${ex.word}`).toMatch(/^[ぁ-ゖー]+$/)
      }
    }
  })

  it('303 kanji (106 N5 + 197 N4), cada uno en una sola lección y con sus trazos', () => {
    expect(kanjiList).toHaveLength(303)
    const taught = kanjiLessons.flatMap((l) => l.chars)
    expect(new Set(taught).size).toBe(taught.length)
    expect(new Set(taught)).toEqual(new Set(kanjiList.map((k) => k.char)))
    for (const k of kanjiList) expect(getStrokes(k.char)?.strokes.length, k.char).toBeGreaterThan(0)
  })

  it('los significados no se repiten (son la respuesta de los ejercicios)', () => {
    const meanings = kanjiList.map((k) => k.meaning)
    expect(new Set(meanings).size).toBe(meanings.length)
  })

  it('lecturas y ejemplos se pueden leer con los kana de la app', () => {
    for (const k of kanjiList) {
      for (const r of [...k.on, ...k.kun]) expect(() => readable(r), `${k.char} ${r}`).not.toThrow()
      for (const e of k.examples) {
        expect(e.word, k.char).toContain(k.char)
        expect(() => readable(e.reading), e.reading).not.toThrow()
      }
    }
  })

  it('cada lección genera significado y lectura por kanji, y escritura', () => {
    for (const lesson of kanjiLessons) {
      const exercises = kanjiLessonExercises(lesson)
      expect(exercises).toHaveLength(lesson.chars.length * 2)
      for (const ex of exercises) if (ex.type === 'choice' || ex.type === 'meaning') expect(ex.options).toContain(ex.answer)
      const writing = kanjiWritingItems(lesson)
      expect(writing.length).toBe(Math.min(4, lesson.chars.length))
      for (const w of writing) expect(kanjiByChar.get(w.kana)!.meaning).toBe(w.prompt)
    }
  })
})

describe('recorrido', () => {
  const items = japanesePath.flatMap((u) => u.stops.flatMap((s) => s.items))

  it('incluye cada lección una sola vez y todos los repasos de unidad', () => {
    const ids = items.map((i) => `${i.kind}:${i.id}`)
    expect(new Set(ids).size).toBe(ids.length)
    const expected = [
      ...kanaLessons.map((l) => `kana:${l.id}`),
      ...grammarByCourse.ja.map((g) => `grammar:${g.id}`),
      ...counterLessons.map((l) => `counters:${l.id}`),
      ...kanjiLessons.map((l) => `kanji:${l.id}`),
      ...vocabLessons.map((l) => `vocab:${l.id}`),
      ...readingTexts.map((t) => `reading:${t.id}`),
      ...units.map((u) => `unit:${u.id}`),
    ]
    expect(new Set(ids)).toEqual(new Set(expected))
  })

  it('las paradas tienen de 1 a 3 lecciones', () => {
    for (const u of japanesePath) for (const s of u.stops) expect(s.items.length).toBeGreaterThanOrEqual(1)
    for (const u of japanesePath) for (const s of u.stops) expect(s.items.length).toBeLessThanOrEqual(3)
  })

  it('para alguien nuevo la parada actual es la primera', () => {
    const { current, stops } = pathStatus(emptyProgress(), false)
    expect(current?.id).toBe(japanesePath[0].stops[0].id)
    expect(stops.get(japanesePath[0].stops[1].id)).toBe('locked')
  })

  it('al terminar los básicos del hiragana la siguiente lección es la fila G', () => {
    const p = { ...emptyProgress(), lessons: done(['vocales', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w']) }
    expect(nextPathLesson(p, false)?.id).toBe('g')
    const { current } = pathStatus(p, false)
    expect(current?.items[0].kind).toBe('unit')
  })
})

describe('lección extra', () => {
  it('sin progreso usa las vocales', () => {
    const lesson = buildExtraLesson(emptyProgress())
    expect(lesson.reading).toHaveLength(6)
    expect(lesson.writing).toHaveLength(2)
    expect(lesson.exercises).toHaveLength(0)
  })

  it('suma ejercicios de gramática, contadores y kanji ya estudiados', () => {
    const p = {
      ...emptyProgress(),
      lessons: done(['vocales', 'k', 'cont-tsu-nin', 'kanji-num-1']),
      grammar: done(['desu']),
    }
    const lesson = buildExtraLesson(p)
    expect(lesson.exercises).toHaveLength(6)
  })
})
