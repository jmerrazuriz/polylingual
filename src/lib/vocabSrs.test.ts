import { beforeEach, describe, expect, it } from 'vitest'
import { japaneseGrammar } from '../courses/ja/grammar'
import { verbs, vocabById, vocabLessons } from '../courses/ja/vocab'
import { conjugateVerb } from './conjugation'
import { buildDrill, N4_VERB_FORMS, N5_VERB_FORMS } from './conjugationDrill'
import { matchesKana } from './kanaInput'
import { emptyProgress } from './progress/model'
import { cardId, newCard } from './progress/srs'
import { progressSnapshot, useProgress } from './progress/store'
import { unlockedVocab } from './progress/unlock'
import { buildReview, dueNowCount, isReviewable } from './review'
import { vocabLessonExercises, wordCardChar } from './vocabExercises'

const t0 = Date.now()
const done = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, { correct: 1, total: 1 }]))

describe('vocabulario con repasos', () => {
  beforeEach(() => useProgress.getState().reset())

  it('completar una lección de vocabulario crea las tarjetas de sus palabras', () => {
    const lesson = vocabLessons[0]
    useProgress.getState().completeLesson(lesson.id, 5, 5, lesson.words.map(wordCardChar))
    const cards = progressSnapshot().cards
    for (const w of lesson.words) {
      expect(cards[cardId(wordCardChar(w), 'read')], w.kana).toBeDefined()
      expect(cards[cardId(wordCardChar(w), 'write')], w.kana).toBeDefined()
    }
  })

  it('las palabras vencidas se repasan: leer = significado, escribir = en kana', () => {
    const char = wordCardChar(vocabById.get('たべる')!)
    expect(isReviewable(char)).toBe(true)
    expect(isReviewable('w-noexiste')).toBe(false)
    const cards = { [cardId(char, 'read')]: newCard(t0), [cardId(char, 'write')]: newCard(t0) }
    const plan = buildReview(cards, t0 + 1000)
    expect(plan.reading).toHaveLength(0)
    expect(plan.writing).toHaveLength(0)
    expect(plan.exercises).toHaveLength(2)
    const write = plan.exercises.find((e) => e.skill === 'write')!
    expect(write.exercise.type).toBe('type')
    if (write.exercise.type === 'type') expect(matchesKana('taberu', write.exercise.answers)).toBe(true)
    expect(dueNowCount(cards, t0 + 1000)).toBe(2)
  })

  it('una lección tiene un ejercicio de significado por palabra y 4 para escribir', () => {
    const lesson = vocabLessons[0]
    const exercises = vocabLessonExercises(lesson)
    expect(exercises.filter((e) => e.exercise.type === 'meaning')).toHaveLength(lesson.words.length)
    expect(exercises.filter((e) => e.skill === 'write')).toHaveLength(4)
    for (const { exercise } of exercises) {
      if (exercise.type === 'meaning' || exercise.type === 'choice') {
        expect(exercise.options).toContain(exercise.answer)
        expect(new Set(exercise.options).size).toBe(exercise.options.length)
      }
    }
  })

  it('las de hiragana se abren tras los combinados y las de katakana tras los extendidos', () => {
    expect(unlockedVocab({}, false).size).toBe(0)
    const afterHira = unlockedVocab(done(['yoon-4']), false)
    expect([...afterHira]).toEqual([vocabLessons[0].id])
    const afterKata = unlockedVocab(done(['yoon-4', 'kata-ext-3']), false)
    expect(afterKata.size).toBe(2)
    expect(unlockedVocab(emptyProgress().lessons, true).size).toBe(vocabLessons.length)
  })
})

describe('práctica de conjugación', () => {
  it('todos los verbos se conjugan en todas las formas', () => {
    for (const v of verbs) for (const f of [...N5_VERB_FORMS, ...N4_VERB_FORMS]) expect(conjugateVerb(v.kana, v.group!, f), `${v.kana} ${f}`).toMatch(/^[ぁ-んァ-ンー]+$/)
  })

  it('arma rondas con las formas pedidas y solo con lo aprendido si alcanza', () => {
    const known = new Set(['たべる', 'のむ', 'いく', 'する', 'みる'])
    const drill = buildDrill({ verbForms: ['te'], adjForms: [], known, count: 10 })
    expect(drill).toHaveLength(10)
    for (const ex of drill) {
      if (ex.type !== 'type') throw new Error('tipo inesperado')
      expect(known.has(ex.prompt), ex.prompt).toBe(true)
      expect(ex.kana).toBe(true)
    }
  })

  it('las respuestas escritas de la gramática coinciden con el motor de conjugación', () => {
    // «のむ → forma て» y similares: la respuesta debe ser la que da conjugateVerb.
    const forms: Record<string, Parameters<typeof conjugateVerb>[2]> = {
      'forma て': 'te',
      'forma ない': 'nai',
      'forma た': 'ta',
      'forma ます': 'masu',
      'forma potencial': 'potential',
      'forma volitiva': 'volitional',
      'forma ば': 'ba',
      'forma たら': 'tara',
      pasiva: 'passive',
      causativa: 'causative',
    }
    let checked = 0
    for (const l of japaneseGrammar) {
      for (const ex of l.exercises) {
        if (ex.type !== 'type') continue
        const m = ex.prompt.match(/^(\S+) → (.+)$/)
        const verb = m && verbs.find((v) => v.kana === m[1])
        if (!m || !verb || !forms[m[2]]) continue
        expect(ex.answers[0], ex.prompt).toBe(conjugateVerb(verb.kana, verb.group!, forms[m[2]]))
        checked++
      }
    }
    expect(checked).toBeGreaterThanOrEqual(20)
  })
})
