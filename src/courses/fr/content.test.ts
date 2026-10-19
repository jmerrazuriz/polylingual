import { describe, expect, it } from 'vitest'
import { contextFor } from '../../lib/exerciseContext'
import { emptyProgress } from '../../lib/progress/model'
import { withoutMarks } from '../../lib/richText'
import { grammarByCourse } from '../content'
import { buildReview, cardsOfCourse, isReviewable } from '../../lib/review'
import { frenchCourse } from './course'
import { lookupFrench } from './glossary'
import { frenchGrammar } from './grammar'
import { frenchPath, frenchPathItems } from './path'
import { articleQuestion, conjugationQuestion, frenchWordPool, numberQuestion, practiceSession, type PracticeMode } from './practice'
import { frenchItemStatus } from './progress'
import { readingsA1 } from './readingsA1'
import { readingsA2 } from './readingsA2'
import { readingsB1 } from './readingsB1'
import { readingsB2 } from './readingsB2'
import { connectorQuestion } from './connecteurs'
import { agreementQuestion } from './accords'
import { fauxAmiQuestion, homophoneQuestion } from './homophones'
import { frenchVocab, frenchVocabLessons, frenchWordCard, frenchWordFromCard, nounLine, withArticle } from './vocab'
import { frenchLessonExercises, frenchWordReviewExercise } from './vocabExercises'

const word = (w: string) => frenchVocab.find((x) => x.word === w)!

describe('gramática', () => {
  it('33 lecciones A1, 30 A2, 35 B1 y 35 B2 con ejemplos y ejercicios bien armados, todos con su explicación', () => {
    expect(frenchGrammar.filter((g) => g.level === 'A1')).toHaveLength(33)
    expect(frenchGrammar.filter((g) => g.level === 'A2')).toHaveLength(30)
    expect(frenchGrammar.filter((g) => g.level === 'B1')).toHaveLength(35)
    expect(frenchGrammar.filter((g) => g.level === 'B2')).toHaveLength(35)
    expect(new Set(frenchGrammar.map((g) => g.id)).size).toBe(frenchGrammar.length)
    for (const g of frenchGrammar) {
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
        }
        if (e.type === 'order') for (const w of e.answer) expect(w, g.id).not.toMatch(/^[.?,!]$/)
        if (e.type === 'type') expect(e.french, g.id).toBe(true)
        expect(contextFor(e)?.rule, g.id).toBe(g.pattern)
      }
    }
  })
})

describe('formato de las explicaciones', () => {
  it('ninguna explicación deja asteriscos sueltos en pantalla (en ningún curso)', () => {
    for (const lessons of Object.values(grammarByCourse)) {
      for (const g of lessons) {
        for (const t of [...g.explanation, ...g.exercises.map((e) => e.explanation ?? '')]) expect(withoutMarks(t), g.id).not.toContain('*')
      }
    }
    expect(withoutMarks('*Je vais **au** marché* y **bien**')).toBe('Je vais au marché y bien')
    expect(withoutMarks('***Il faut** venir* y *b → **c***')).toBe('Il faut venir y b → c')
  })
})

describe('vocabulario', () => {
  it('al menos 650 palabras A1, 1.300 hasta A2, 2.350 hasta B1 y 3.900 hasta B2, sin ids repetidos; los sustantivos con género', () => {
    expect(frenchVocab.filter((w) => w.level === 'A1').length).toBeGreaterThanOrEqual(650)
    expect(frenchVocab.filter((w) => w.level === 'A1' || w.level === 'A2').length).toBeGreaterThanOrEqual(1300)
    expect(frenchVocab.filter((w) => w.level !== 'B2').length).toBeGreaterThanOrEqual(2350)
    expect(frenchVocab.length).toBeGreaterThanOrEqual(3900)
    expect(new Set(frenchVocab.map((w) => w.id)).size).toBe(frenchVocab.length)
    for (const w of frenchVocab) {
      if (w.pos === 'noun') expect(w.gender, w.word).toBeTruthy()
      else expect(w.gender, w.word).toBeUndefined()
      if (w.feminine) expect(['noun', 'adj'], w.word).toContain(w.pos)
    }
  })

  it('la ficha muestra el artículo, el género que el l’ esconde y los femeninos', () => {
    expect(nounLine(word('école'))).toBe('l’école (f.)')
    expect(nounLine(word('livre'))).toBe('le livre')
    expect(nounLine(word('gâteau'))).toBe('le gâteau, les gâteaux')
    expect(nounLine(word('ami'))).toBe('l’ami, l’amie')
    expect(nounLine(word('petit'))).toBe('petit, petite')
    expect(nounLine(word('gens'))).toBe('les gens (solo plural)')
    expect(withArticle(word('hôpital'))).toBe('l’hôpital')
    expect(withArticle(word('Chili'))).toBe('le Chili')
  })

  it('lecciones de 6 a 14 palabras', () => {
    for (const l of frenchVocabLessons) {
      expect(l.words.length, l.id).toBeGreaterThanOrEqual(6)
      expect(l.words.length, l.id).toBeLessThanOrEqual(14)
    }
  })

  it('los ejercicios tienen la respuesta entre opciones distintas y su explicación', () => {
    for (const l of frenchVocabLessons) {
      for (const e of frenchLessonExercises(l.words)) {
        expect(e.explanation, l.id).toBeTruthy()
        if (e.type === 'choice' || e.type === 'meaning') {
          expect(e.options, l.id).toContain(e.answer)
          expect(new Set(e.options).size, l.id).toBe(e.options.length)
        }
      }
    }
  })

  it('las tarjetas «fw-…» se repasan solo en francés', () => {
    const w = word('appartement')
    const card = frenchWordCard(w)
    expect(frenchWordFromCard(card)).toBe(w)
    expect(isReviewable(card)).toBe(true)
    expect(frenchWordReviewExercise(card, 'write').exercise.type).toBe('type')
    const srs = { due: 0, stability: 1, difficulty: 5, reps: 1, lapses: 0, state: 2, last: 0 } as never
    const cards = { [`${card}:read`]: srs, 'dw-Tisch:read': srs, 'あ:read': srs }
    expect(Object.keys(cardsOfCourse(cards, 'fr'))).toEqual([`${card}:read`])
    expect(buildReview(cardsOfCourse(cards, 'fr'), 1).exercises).toHaveLength(1)
  })

  it('el glosario reconoce elisiones, plurales, femeninos y verbos conjugados', () => {
    expect(lookupFrench('l’école,')?.word.word).toBe('école')
    expect(lookupFrench('gâteaux')?.word.word).toBe('gâteau')
    expect(lookupFrench('petite')?.word.word).toBe('petit')
    expect(lookupFrench('habite')?.word.word).toBe('habiter')
    expect(lookupFrench('suis')?.word.word).toBe('être')
    expect(lookupFrench('naquit')?.word.word).toBe('naître')
    expect(lookupFrench('d’accord')?.word.word).toBe('d\'accord')
  })

  it('al escribir, sin acentos cuenta como «casi»', () => {
    expect(frenchCourse.check('eleve', ['élève'])).toBe('almost')
    expect(frenchCourse.check('l\'école', ['l’école'])).toBe('ok')
  })
})

describe('lecturas', () => {
  it('8 lecturas y 8 diálogos por nivel; cada uno pide una lección que existe y que va antes en el recorrido', () => {
    for (const texts of [readingsA1, readingsA2, readingsB1, readingsB2]) {
      expect(texts.filter((t) => t.kind === 'reading')).toHaveLength(8)
      expect(texts.filter((t) => t.kind === 'dialogue')).toHaveLength(8)
    }
    const order = frenchPathItems.map((i) => `${i.kind}:${i.id}`)
    for (const t of [...readingsA1, ...readingsA2, ...readingsB1, ...readingsB2]) {
      expect(frenchGrammar.some((g) => g.id === t.requires), t.id).toBe(true)
      expect(order.indexOf(`grammar:${t.requires}`), t.id).toBeLessThan(order.indexOf(`reading:${t.id}`))
      expect(t.questions.length, t.id).toBeGreaterThanOrEqual(3)
      for (const q of t.questions) if (q.type === 'choice') expect(q.options).toContain(q.answer)
    }
  })
})

describe('recorrido', () => {
  it('incluye cada lección una sola vez y cada nivel termina en su simulacro DELF', () => {
    const keys = frenchPathItems.map((i) => `${i.kind}:${i.id}`)
    expect(new Set(keys).size).toBe(keys.length)
    const expected = [
      ...frenchGrammar.map((g) => `grammar:${g.id}`),
      ...frenchVocabLessons.map((l) => `vocab:${l.id}`),
      ...[...readingsA1, ...readingsA2, ...readingsB1, ...readingsB2].map((t) => `reading:${t.id}`),
      'exam:A1',
      'exam:A2',
      'exam:B1',
      'exam:B2',
    ]
    expect(new Set(keys)).toEqual(new Set(expected))
    expect(frenchPath.at(-1)!.id).toBe('fr-examen-b2')
    expect(frenchPath.map((u) => u.id)).toContain('fr-examen-a1')
    for (const u of frenchPath) for (const s of u.stops) expect(s.items.length).toBeLessThanOrEqual(3)
  })

  it('desbloqueo lineal: cada lección abre la siguiente', () => {
    const p = emptyProgress()
    const [first, second] = frenchPathItems
    expect(frenchItemStatus(p, false)(first)).toBe('open')
    expect(frenchItemStatus(p, false)(second)).toBe('locked')
    p.grammar[first.id] = { correct: 5, total: 5 }
    expect(frenchItemStatus(p, false)(second)).toBe('open')
    expect(frenchItemStatus(p, true)(frenchPathItems.at(-1)!)).toBe('open')
  })
})

describe('juegos y práctica', () => {
  const words = frenchWordPool(emptyProgress(), true)

  it('las preguntas rápidas traen la respuesta entre opciones distintas y su explicación', () => {
    for (let i = 0; i < 200; i++) {
      for (const q of [conjugationQuestion(Math.random, 10), numberQuestion(), articleQuestion(words)!, homophoneQuestion(), fauxAmiQuestion(), agreementQuestion(words), connectorQuestion()]) {
        if (!q) continue
        expect(q.options).toContain(q.answer)
        expect(new Set(q.options).size).toBe(q.options.length)
        expect(q.explanation).toBeTruthy()
      }
    }
  })

  it('cada modo de práctica arma una sesión con las palabras de A1 a B2', () => {
    expect(words.length).toBeGreaterThanOrEqual(3900)
    for (const m of frenchCourse.practiceModes) expect(practiceSession(m.mode as PracticeMode, words).length, m.mode).toBe(12)
    for (const g of frenchCourse.games) {
      if (g.pairs) expect(g.pairs(words).length, g.id).toBeGreaterThanOrEqual(6)
      if (g.question) expect(g.question(words), g.id).not.toBeNull()
    }
  })
})
