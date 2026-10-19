import { describe, expect, it } from 'vitest'
import { dailyPathItem, planDaily } from '../../lib/daily'
import { contextFor } from '../../lib/exerciseContext'
import { emptyProgress } from '../../lib/progress/model'
import { buildReview, cardsOfCourse, isReviewable } from '../../lib/review'
import { italianCourse } from './course'
import { doublesQuestion, minimalPairQuestion } from './doubles'
import { lookupItalian } from './glossary'
import { italianGrammar } from './grammar'
import { italianPath, italianPathItems } from './path'
import { articleQuestion, conjugationQuestion, italianWordPool, numberQuestion, practiceSession, type PracticeMode, pluralQuestion } from './practice'
import { italianItemStatus } from './progress'
import { readingsA1 } from './readingsA1'
import { italianVocab, italianVocabLessons, italianWordCard, italianWordFromCard, nounLine, withArticle } from './vocab'
import { italianLessonExercises, italianWordReviewExercise } from './vocabExercises'

const word = (w: string) => italianVocab.find((x) => x.word === w)!

describe('gramática', () => {
  it('33 lecciones A1 con ejemplos y ejercicios bien armados, todos con su explicación', () => {
    expect(italianGrammar.filter((g) => g.level === 'A1')).toHaveLength(33)
    expect(new Set(italianGrammar.map((g) => g.id)).size).toBe(italianGrammar.length)
    for (const g of italianGrammar) {
      expect(g.id.startsWith('it-'), g.id).toBe(true)
      expect(g.examples.length, g.id).toBeGreaterThanOrEqual(4)
      expect(g.exercises.length, g.id).toBeGreaterThanOrEqual(5)
      for (const e of g.exercises) {
        expect(e.explanation, `${g.id}: ${JSON.stringify(e).slice(0, 60)}`).toBeTruthy()
        if (e.type === 'choice' || e.type === 'meaning') {
          expect(e.options, g.id).toContain(e.answer)
          expect(new Set(e.options).size, g.id).toBe(e.options.length)
          for (const k of Object.keys(e.whyWrong ?? {})) {
            expect(e.options, `${g.id}: ${k}`).toContain(k)
            expect(k, g.id).not.toBe(e.answer)
          }
          // Cada opción incorrecta explica por qué no sirve.
          for (const o of e.options) if (o !== e.answer) expect(e.whyWrong?.[o], `${g.id}: ${o}`).toBeTruthy()
        }
        if (e.type === 'order') for (const w of e.answer) expect(w, g.id).not.toMatch(/^[.?,!]$/)
        if (e.type === 'type') expect(e.italian, g.id).toBe(true)
        expect(contextFor(e)?.rule, g.id).toBe(g.pattern)
      }
    }
  })
})

describe('vocabulario', () => {
  it('al menos 650 palabras A1, sin ids repetidos; los sustantivos con género', () => {
    expect(italianVocab.filter((w) => w.level === 'A1').length).toBeGreaterThanOrEqual(650)
    expect(new Set(italianVocab.map((w) => w.id)).size).toBe(italianVocab.length)
    for (const w of italianVocab) {
      if (w.pos === 'noun') expect(w.gender, w.word).toBeTruthy()
      else expect(w.gender, w.word).toBeUndefined()
      if (w.feminine) expect(['noun', 'adj'], w.word).toContain(w.pos)
    }
  })

  it('la ficha muestra el artículo, el plural y los femeninos', () => {
    expect(nounLine(word('libro'))).toBe('il libro, i libri')
    expect(nounLine(word('zaino'))).toBe('lo zaino, gli zaini')
    expect(nounLine(word('uovo'))).toBe('l’uovo, le uova')
    expect(nounLine(word('amico'))).toBe('l’amico, l’amica')
    expect(nounLine(word('città'))).toBe('la città, le città')
    expect(nounLine(word('genitori'))).toBe('i genitori (solo plural)')
    expect(nounLine(word('latte'))).toBe('il latte (sin plural)')
    expect(nounLine(word('rosso'))).toBe('rosso, rossa')
    expect(nounLine(word('verde'))).toBe('verde')
    expect(withArticle(word('Stati Uniti'))).toBe('gli Stati Uniti')
    expect(withArticle(word('studente'))).toBe('lo studente')
  })

  it('lecciones de 6 a 14 palabras', () => {
    for (const l of italianVocabLessons) {
      expect(l.words.length, l.id).toBeGreaterThanOrEqual(6)
      expect(l.words.length, l.id).toBeLessThanOrEqual(14)
    }
  })

  it('los ejercicios tienen la respuesta entre opciones distintas y su explicación', () => {
    for (let round = 0; round < 3; round++) {
      for (const l of italianVocabLessons) {
        for (const e of italianLessonExercises(l.words)) {
          expect(e.explanation, l.id).toBeTruthy()
          if (e.type === 'choice' || e.type === 'meaning') {
            expect(e.options, l.id).toContain(e.answer)
            expect(new Set(e.options).size, `${l.id}: ${e.options.join(' / ')}`).toBe(e.options.length)
            for (const k of Object.keys(e.whyWrong ?? {})) expect(e.options, l.id).toContain(k)
          }
          if (e.type === 'type') expect(e.italian).toBe(true)
        }
      }
    }
  }, 30_000)

  it('las tarjetas «iw-…» se repasan solo en italiano', () => {
    const w = word('appartamento')
    const card = italianWordCard(w)
    expect(italianWordFromCard(card)).toBe(w)
    expect(isReviewable(card)).toBe(true)
    expect(italianWordReviewExercise(card, 'write').exercise.type).toBe('type')
    const srs = { due: 0, stability: 1, difficulty: 5, reps: 1, lapses: 0, state: 2, last: 0 } as never
    const cards = { [`${card}:read`]: srs, 'fw-école:read': srs, 'あ:read': srs }
    expect(Object.keys(cardsOfCourse(cards, 'it'))).toEqual([`${card}:read`])
    expect(buildReview(cardsOfCourse(cards, 'it'), 1).exercises).toHaveLength(1)
  })

  it('el glosario reconoce elisiones, plurales, femeninos y verbos conjugados', () => {
    expect(lookupItalian('l’amico,')?.word.word).toBe('amico')
    expect(lookupItalian('dell’acqua')?.word.word).toBe('acqua')
    expect(lookupItalian('zaini')?.word.word).toBe('zaino')
    expect(lookupItalian('uova')?.word.word).toBe('uovo')
    expect(lookupItalian('amica')?.word.word).toBe('amico')
    expect(lookupItalian('rosse')?.word.word).toBe('rosso')
    expect(lookupItalian('abito')?.word.word).toBe('abitare')
    expect(lookupItalian('vado')?.word.word).toBe('andare')
    expect(lookupItalian('capisco')?.word.word).toBe('capire')
    expect(lookupItalian('mi')).toBeUndefined()
  })

  it('al escribir, sin tilde cuenta como «casi» y una doble que falta, no', () => {
    expect(italianCourse.check('citta', ['città'])).toBe('almost')
    expect(italianCourse.check('l’amica', ["l'amica"])).toBe('ok')
    expect(italianCourse.check('pala', ['palla'])).toBe('wrong')
  })
})

describe('lecturas', () => {
  it('8 lecturas y 8 diálogos; cada uno pide una lección que existe y que va antes en el recorrido', () => {
    expect(readingsA1.filter((t) => t.kind === 'reading')).toHaveLength(8)
    expect(readingsA1.filter((t) => t.kind === 'dialogue')).toHaveLength(8)
    const order = italianPathItems.map((i) => `${i.kind}:${i.id}`)
    for (const t of readingsA1) {
      expect(italianGrammar.some((g) => g.id === t.requires), t.id).toBe(true)
      expect(order.indexOf(`grammar:${t.requires}`), t.id).toBeLessThan(order.indexOf(`reading:${t.id}`))
      expect(t.questions.length, t.id).toBeGreaterThanOrEqual(3)
      for (const q of t.questions) {
        expect(q.explanation, t.id).toBeTruthy()
        if (q.type === 'choice') expect(q.options).toContain(q.answer)
      }
    }
  })
})

describe('recorrido', () => {
  it('incluye cada lección una sola vez y el A1 termina en su simulacro CILS', () => {
    const keys = italianPathItems.map((i) => `${i.kind}:${i.id}`)
    expect(new Set(keys).size).toBe(keys.length)
    const expected = [...italianGrammar.map((g) => `grammar:${g.id}`), ...italianVocabLessons.map((l) => `vocab:${l.id}`), ...readingsA1.map((t) => `reading:${t.id}`), 'exam:A1']
    expect(new Set(keys)).toEqual(new Set(expected))
    expect(italianPath.at(-1)!.id).toBe('it-examen-a1')
    for (const u of italianPath) for (const s of u.stops) expect(s.items.length).toBeLessThanOrEqual(3)
  })

  it('desbloqueo lineal: cada lección abre la siguiente', () => {
    const p = emptyProgress()
    const [first, second] = italianPathItems
    expect(italianItemStatus(p, false)(first)).toBe('open')
    expect(italianItemStatus(p, false)(second)).toBe('locked')
    p.grammar[first.id] = { correct: 5, total: 5 }
    expect(italianItemStatus(p, false)(second)).toBe('open')
    expect(italianItemStatus(p, true)(italianPathItems.at(-1)!)).toBe('open')
  })

  it('tiene su propia lección del día', () => {
    const t0 = new Date('2026-10-19T12:00:00').getTime()
    const fresh = planDaily({ ...emptyProgress(), course: 'it' }, t0, false)
    expect(fresh.steps).toEqual(['nuevo'])
    expect(dailyPathItem(fresh.lesson)).toEqual({ kind: 'grammar', id: 'it-alfabeto' })
    const lesson = italianVocabLessons[0]
    const p = { ...emptyProgress(), course: 'it', lessons: { [lesson.id]: { correct: 9, total: 10 } } }
    const r = planDaily(p, t0, false)
    expect(r.steps).toContain('practica')
    expect(italianCourse.practiceModes.map((m) => m.mode)).toContain(r.mode)
  })
})

describe('juegos y práctica', () => {
  const words = italianWordPool(emptyProgress(), true)

  it('las preguntas rápidas traen la respuesta entre opciones distintas y su explicación', () => {
    for (let i = 0; i < 200; i++) {
      for (const q of [conjugationQuestion(Math.random, 1), conjugationQuestion(Math.random, 6), numberQuestion(), articleQuestion(words), pluralQuestion(words), doublesQuestion(words), minimalPairQuestion()]) {
        if (!q) continue
        expect(q.options).toContain(q.answer)
        expect(new Set(q.options).size, q.options.join(' / ')).toBe(q.options.length)
        expect(q.explanation).toBeTruthy()
        for (const k of Object.keys(q.whyWrong ?? {})) expect(q.options).toContain(k)
      }
    }
  })

  it('cada modo de práctica arma una sesión y cada juego tiene preguntas', () => {
    expect(words.length).toBeGreaterThanOrEqual(650)
    for (const m of italianCourse.practiceModes) expect(practiceSession(m.mode as PracticeMode, words).length, m.mode).toBe(12)
    for (const g of italianCourse.games) {
      if (g.pairs) expect(g.pairs(words).length, g.id).toBeGreaterThanOrEqual(6)
      if (g.question) expect(g.question(words), g.id).not.toBeNull()
    }
  })
})
