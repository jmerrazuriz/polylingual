import { describe, expect, it } from 'vitest'
import { grammarByCourse } from '../courses/content'
import { buildMockExam, scoreExam } from './mockExam'
import { glossary, lineMeaningExercise, lineTokens, readingTexts, unlockedReadings } from './readings'
import { romajiReadings } from './romaji'

const JP = /[぀-ヿ]/
const kanaOnly = (text: string) => text.replace(/[\s、。？！＿]/g, '')

describe('lecturas y diálogos N5', () => {
  it('hay 20 lecturas y 20 diálogos con ids únicos', () => {
    expect(readingTexts.filter((t) => t.kind === 'reading')).toHaveLength(20)
    expect(readingTexts.filter((t) => t.kind === 'dialogue')).toHaveLength(20)
    expect(new Set(readingTexts.map((t) => t.id)).size).toBe(readingTexts.length)
  })

  it('cada texto pide una lección de gramática que existe y tiene preguntas válidas', () => {
    const grammarIds = new Set(grammarByCourse.ja.map((g) => g.id))
    for (const t of readingTexts) {
      expect(grammarIds.has(t.requires), `${t.id}: ${t.requires}`).toBe(true)
      expect(t.lines.length, t.id).toBeGreaterThanOrEqual(4)
      expect(t.questions.length, t.id).toBeGreaterThanOrEqual(3)
      if (t.kind === 'dialogue') for (const l of t.lines) expect(l.speaker, t.id).toBeTruthy()
      for (const q of t.questions) {
        if (q.type !== 'choice' && q.type !== 'meaning') throw new Error(`tipo inesperado en ${t.id}`)
        expect(q.options, t.id).toContain(q.answer)
        expect(new Set(q.options).size, t.id).toBe(q.options.length)
      }
    }
  })

  it('todo el japonés usa kana que la app conoce (sin números ni kanji)', () => {
    for (const t of readingTexts) {
      for (const l of t.lines) {
        expect(l.text, t.id).not.toMatch(/[0-9０-９]/)
        expect(() => romajiReadings(kanaOnly(l.text)), `${t.id}: ${l.text}`).not.toThrow()
      }
      for (const q of t.questions) if (q.type === 'meaning') expect(q.text).toMatch(JP)
    }
  })

  it('cada texto se abre con su gramática', () => {
    expect(unlockedReadings({}, false).size).toBe(0)
    expect([...unlockedReadings({ no: { correct: 1, total: 1 } }, false)]).toEqual(['lec-presentacion'])
    expect(unlockedReadings({}, true).size).toBe(readingTexts.length)
  })

  it('el glosario reconoce palabras y formas conjugadas', () => {
    expect(lineTokens('わたし は がくせい です。')).toEqual(['わたし', 'は', 'がくせい', 'です'])
    expect(glossary('がくせい')?.entry.meaning).toBe('estudiante')
    expect(glossary('たべました')?.entry.kana).toBe('たべる')
    expect(glossary('のんで')?.entry.kana).toBe('のむ')
    expect(glossary('たのしかった')?.entry.kana).toBe('たのしい')
    expect(glossary('マリアさん')).toBeUndefined()
  })

  it('la mayoría de las palabras de los textos están en el glosario', () => {
    const particles = new Set(['は', 'が', 'を', 'に', 'へ', 'で', 'と', 'も', 'の', 'か', 'ね', 'よ', 'から', 'まで', 'や', 'より'])
    const tokens = readingTexts.flatMap((t) => t.lines.flatMap((l) => lineTokens(l.text))).filter((w) => !particles.has(w))
    const known = tokens.filter((w) => glossary(w)).length
    expect(known / tokens.length).toBeGreaterThan(0.6)
  })

  it('pregunta suelta de comprensión con la traducción correcta', () => {
    const ex = lineMeaningExercise(readingTexts[0])
    if (ex.type !== 'meaning') throw new Error('tipo inesperado')
    expect(ex.options).toContain(ex.answer)
    expect(new Set(ex.options).size).toBe(4)
  })
})

describe('simulacro N5', () => {
  it('tiene las cuatro secciones en orden', () => {
    const exam = buildMockExam()
    const sections = exam.map((i) => i.section)
    expect(sections.filter((s) => s === 'vocab')).toHaveLength(10)
    expect(sections.filter((s) => s === 'grammar')).toHaveLength(10)
    expect(sections.filter((s) => s === 'reading').length).toBeGreaterThanOrEqual(6)
    expect(sections.filter((s) => s === 'listening').length).toBeGreaterThanOrEqual(6)
    expect(sections.indexOf('listening')).toBeGreaterThan(sections.lastIndexOf('reading'))
    for (const i of exam) if (i.section === 'listening') expect(i.text?.kind).toBe('dialogue')
  })

  it('puntúa como el JLPT: total y mínimos por sección', () => {
    const exam = buildMockExam()
    const all = scoreExam(exam, exam.map(() => true))
    expect(all).toMatchObject({ language: 120, listening: 60, total: 180, passed: true })
    const none = scoreExam(exam, [])
    expect(none).toMatchObject({ total: 0, passed: false })
    // Todo bien menos la audición: suma más de 80, pero no llega al mínimo de audición.
    const noListening = scoreExam(exam, exam.map((i) => i.section !== 'listening'))
    expect(noListening.total).toBeGreaterThanOrEqual(80)
    expect(noListening.passed).toBe(false)
  })
})
