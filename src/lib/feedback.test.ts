import { describe, expect, it } from 'vitest'
import { germanGrammar } from '../courses/de/grammar'
import { germanVocab } from '../courses/de/vocab'
import { articleExercise, meaningExercise, pluralExercise, sayExercise } from '../courses/de/vocabExercises'
import { conjugationQuestion, declensionQuestion } from '../courses/de/practice'
import type { GrammarExercise } from '../courses/grammar'
import { japaneseGrammar } from '../courses/ja/grammar'
import { vocab } from '../courses/ja/vocab'
import { contextFor } from './exerciseContext'
import { bestLine, buildFeedback, diagnoseTyping, paragraphAbout } from './feedback'
import { wordChoiceExercise, wordMeaningExercise } from './vocabExercises'

const blank: GrammarExercise = { type: 'choice', prompt: 'Ich ＿ müde.', options: ['bin', 'ist', 'bist'], answer: 'bin' }

describe('corrección explicada', () => {
  it('al acertar da una explicación breve; al fallar, qué se eligió, lo correcto y por qué', () => {
    const ctx = { rule: 'ich bin, du bist, er ist', paragraphs: ['Con **ich** se usa **bin**.', 'Con **er** se usa **ist**.'] }
    const ok = buildFeedback(blank, 'bin', true, ctx)
    expect(ok.brief).toBe('«Ich bin müde.» — ich bin, du bist, er ist')
    const bad = buildFeedback(blank, 'ist', false, ctx)
    expect(bad.given).toContain('Elegiste «ist»')
    expect(bad.given).toContain('Con er se usa ist')
    expect(bad.right).toBe('Ich bin müde.')
    expect(bad.why).toBe('Con **ich** se usa **bin**.')
  })

  it('las explicaciones propias del ejercicio tienen prioridad', () => {
    const e: GrammarExercise = { ...blank, explanation: 'Primera persona. Se dice «ich bin».', whyWrong: { ist: '«ist» es para er/sie/es.' } }
    expect(buildFeedback(e, 'bin', true).brief).toBe('Primera persona.')
    const bad = buildFeedback(e, 'ist', false)
    expect(bad.given).toBe('Elegiste «ist». «ist» es para er/sie/es.')
    expect(bad.why).toBe('Primera persona. Se dice «ich bin».')
  })

  it('al escribir, dice qué falló: mayúsculas, acentos, artículo o desde dónde', () => {
    expect(diagnoseTyping('der tisch', ['der Tisch'])).toBe('Solo fallan las mayúsculas.')
    expect(diagnoseTyping('Madchen', ['Mädchen'])).toMatch(/diéresis/)
    expect(diagnoseTyping('die Tisch', ['der Tisch'])).toBe('La palabra está bien, pero el artículo es «der», no «die».')
    expect(diagnoseTyping('Fenstar', ['Fenster'])).toMatch(/Coincide hasta «Fenst»/)
  })

  it('en lecturas cita la línea del texto que da la respuesta', () => {
    const lines = [
      { text: 'Otto arbeitet in Berlin.', meaning: 'Otto trabaja en Berlín.' },
      { text: 'Er hat einen Hund.', meaning: 'Tiene un perro.' },
    ]
    expect(bestLine(lines, 'Tiene un perro')?.text).toBe('Er hat einen Hund.')
    expect(paragraphAbout(['Usa **dessen** con masculinos.', 'Usa **deren** con femeninos.'], 'deren')).toBe('Usa **deren** con femeninos.')
  })

  it('cada ejercicio escrito a mano encuentra su lección o su texto', () => {
    for (const lesson of [...germanGrammar, ...japaneseGrammar]) for (const e of lesson.exercises) expect(contextFor(e)?.rule).toBe(lesson.pattern)
  })

  it('los ejercicios de palabras explican qué es cada opción incorrecta', () => {
    const tisch = germanVocab.find((w) => w.word === 'Tisch')!
    const m = meaningExercise(tisch)
    expect(m.type === 'meaning' && Object.keys(m.whyWrong ?? {}).length).toBe(3)
    const s = sayExercise(tisch)
    expect(s.type === 'choice' && Object.values(s.whyWrong ?? {}).every((t) => t.includes('significa'))).toBe(true)
    const a = articleExercise(germanVocab.find((w) => w.word === 'Zeitung')!)
    expect(a.type === 'choice' && a.explanation).toMatch(/-ung/)
    const p = pluralExercise(tisch)
    expect(p.type === 'choice' && p.explanation).toBe('der Tisch → die Tische: agrega -e.')
    const ja = vocab.find((v) => v.theme === 'numeros')!
    const jm = wordMeaningExercise(ja)
    expect(jm.type === 'meaning' && Object.keys(jm.whyWrong ?? {}).length).toBeGreaterThan(0)
    const jc = wordChoiceExercise(ja)
    expect(jc.type === 'choice' && jc.explanation).toContain(ja.meaning)
  })

  it('conjugación y declinación explican cada opción', () => {
    for (let i = 0; i < 50; i++) {
      const c = conjugationQuestion()
      expect(c.explanation).toContain(c.answer)
      const d = declensionQuestion(germanVocab.filter((w) => w.level === 'A1'))
      if (d) for (const o of d.options) if (o !== d.answer) expect(d.whyWrong?.[o], o).toBeTruthy()
    }
  })
})
