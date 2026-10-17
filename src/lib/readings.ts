// Lecturas y diálogos: desbloqueo, glosario de palabras y preguntas sueltas.

import type { GrammarExercise } from '../courses/grammar.ts'
import { readingsN3 } from '../courses/ja/readingsN3.ts'
import { readingsN4 } from '../courses/ja/readingsN4.ts'
import { readingsN5 } from '../courses/ja/readingsN5.ts'
import { furiganaToKana } from './furigana.ts'
import { type VocabEntry, vocab } from '../courses/ja/vocab.ts'
import { conjugateAdjective, conjugateVerb, type VerbForm, verbFormInfo } from './conjugation.ts'
import { adjFormInfo, DRILL_ADJ_FORMS, N5_VERB_FORMS } from './conjugationDrill.ts'
import type { ReadingText } from '../courses/reading.ts'
import type { LessonResult } from './progress/model.ts'
import { shuffle } from './random.ts'

export const readingTexts: ReadingText[] = [...readingsN5, ...readingsN4, ...readingsN3]
export const readingById = new Map(readingTexts.map((t) => [t.id, t]))

/** Cada texto se abre al completar su lección de gramática. */
export function unlockedReadings(grammar: Record<string, LessonResult>, unlockAll: boolean): Set<string> {
  return new Set(readingTexts.filter((t) => unlockAll || grammar[t.requires]).map((t) => t.id))
}

export type GlossaryEntry = { entry: VocabEntry; form?: string }

/** Cada palabra del vocabulario y sus formas conjugadas (たべました → たべる, «ました»). */
const glossaryMap = new Map<string, GlossaryEntry>()
for (const v of vocab) if (!glossaryMap.has(v.kana)) glossaryMap.set(v.kana, { entry: v })
for (const v of vocab) {
  const forms: [string, string][] =
    v.pos === 'verb'
      ? ([...N5_VERB_FORMS, 'potential', 'volitional', 'ba', 'tara'] as VerbForm[]).map((f) => [conjugateVerb(v.kana, v.group!, f), verbFormInfo[f].label])
      : v.pos === 'i-adj'
        ? DRILL_ADJ_FORMS.map((f) => [conjugateAdjective(v.kana, 'i', f), adjFormInfo[f]!])
        : []
  for (const [form, label] of forms) if (!glossaryMap.has(form)) glossaryMap.set(form, { entry: v, form: label })
}

/** Palabras gramaticales frecuentes en los textos que no son vocabulario propiamente tal. */
const grammarWords: [string, string][] = [
  ['です', 'es, soy, son (educado)'],
  ['でした', 'era, fue (educado)'],
  ['だ', 'es (informal)'],
  ['でしょう', 'probablemente'],
  ['ください', 'por favor (deme / haga…)'],
  ['ありません', 'no hay; no es (con じゃ)'],
  ['ません', 'no (negativo educado)'],
  ['いらっしゃいませ', 'bienvenido (en tiendas)'],
  ['じゃ', 'no es (con ありません); entonces'],
  ['ことが', 'el hecho de (たことがある: haber hecho)'],
  ['ことは', 'el hecho de (con énfasis)'],
  ['まえに', 'antes de'],
  ['あとで', 'después de'],
  ['ほう', 'lado (の ほう が: más…)'],
  ['とき', 'cuando'],
  ['ん', 'es que… (explicación)'],
  ['うん', 'sí (informal)'],
  ['ううん', 'no (informal)'],
]
for (const [kana, meaning] of grammarWords) {
  if (!glossaryMap.has(kana)) glossaryMap.set(kana, { entry: { id: kana, kana, meaning, pos: 'expression', theme: 'expresiones', level: 'N5' } })
}

const PUNCTUATION = /[、。？！?!「」]/g

/** Palabras de una frase (separadas por espacios), en kana y sin puntuación. */
export const lineTokens = (text: string) =>
  furiganaToKana(text)
    .split(/\s+/)
    .map((t) => t.replace(PUNCTUATION, ''))
    .filter(Boolean)

/** Partículas que en los textos N4 van pegadas a la palabra (銀行[ぎんこう]も), de la más larga a la más corta. */
const TRAILING = ['から', 'まで', 'より', 'には', 'では', 'とは', 'へは', 'も', 'は', 'が', 'を', 'に', 'へ', 'で', 'と', 'の', 'や', 'ね', 'よ', 'か']

/**
 * Qué significa una palabra de la frase (también conjugada), si está en el vocabulario.
 * Prueba también sin tratamientos (さん…) y sin la partícula del final.
 */
export function glossary(token: string): GlossaryEntry | undefined {
  const candidates = [token, token.replace(/(さん|さま|ちゃん|じん|ご)$/, '')]
  for (const p of TRAILING) if (token.endsWith(p) && token.length > p.length) candidates.push(token.slice(0, -p.length))
  for (const c of candidates) {
    const found = glossaryMap.get(c)
    if (found) return found
  }
  return undefined
}

/** Una pregunta de comprensión sobre una frase del texto (para la nivelación). */
export function lineMeaningExercise(text: ReadingText, random = Math.random): GrammarExercise {
  const line = text.lines[Math.floor(random() * text.lines.length)]
  const others = shuffle(
    readingTexts.flatMap((t) => t.lines.map((l) => l.meaning)).filter((mng) => mng !== line.meaning),
    random,
  )
  return { type: 'meaning', text: line.text, options: [line.meaning, ...others.slice(0, 3)], answer: line.meaning }
}
