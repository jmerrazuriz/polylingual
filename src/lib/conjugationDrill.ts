// Práctica de conjugación: ejercicios de escribir la forma pedida de un verbo o adjetivo,
// con la regla que se aplica como explicación.

import type { GrammarExercise } from '../courses/grammar.ts'
import { iAdjectives, naAdjectives, verbs, type VocabEntry } from '../courses/ja/vocab.ts'
import { type AdjForm, conjugateAdjective, conjugateVerb, type VerbForm, verbFormInfo } from './conjugation.ts'
import { shuffle } from './random.ts'

export const N5_VERB_FORMS: VerbForm[] = ['masu', 'masen', 'mashita', 'masendeshita', 'mashou', 'nai', 'ta', 'nakatta', 'te', 'tai']
export const N4_VERB_FORMS: VerbForm[] = ['potential', 'volitional', 'imperative', 'ba', 'tara', 'passive', 'causative']

export const adjFormInfo: Partial<Record<AdjForm, string>> = {
  negative: 'negativo (no es…)',
  past: 'pasado (era…)',
  pastNegative: 'pasado negativo (no era…)',
  te: 'forma て (y…)',
  adverb: 'adverbio (…mente)',
}
export const DRILL_ADJ_FORMS = Object.keys(adjFormInfo) as AdjForm[]

const teRule: Record<string, string> = {
  う: 'う, つ, る → って',
  つ: 'う, つ, る → って',
  る: 'う, つ, る → って',
  む: 'む, ぶ, ぬ → んで',
  ぶ: 'む, ぶ, ぬ → んで',
  ぬ: 'む, ぶ, ぬ → んで',
  く: 'く → いて',
  ぐ: 'ぐ → いで',
  す: 'す → して',
}

/** La regla que explica la forma (para mostrar tras responder). */
export function explainVerb(entry: VocabEntry, form: VerbForm): string {
  const verb = entry.kana
  if (entry.group === 'irregular') return 'する y くる son irregulares: hay que aprender sus formas.'
  if (entry.group === 'ichidan') return `Grupo 2: se quita る (${verb.slice(0, -1)}) y se agrega la terminación.`
  if (form === 'te' || form === 'ta' || form === 'tara') {
    if (verb.endsWith('いく')) return 'いく es la excepción: いって, いった.'
    return `Grupo 1, forma て/た según la última sílaba: ${teRule[verb.slice(-1)]}${form === 'te' ? '' : ' (た en vez de て)'}.`
  }
  if (verb === 'ある' && (form === 'nai' || form === 'nakatta')) return 'ある es especial: su negativo es ない.'
  const row = { masu: 'い', masen: 'い', mashita: 'い', masendeshita: 'い', mashou: 'い', tai: 'い', nai: 'あ', nakatta: 'あ', passive: 'あ', causative: 'あ', potential: 'え', imperative: 'え', ba: 'え', volitional: 'お' }[form as string]
  const extra = verb.endsWith('う') && row === 'あ' ? ' (う → わ)' : ''
  return row ? `Grupo 1: la última sílaba pasa a la columna ${row}${extra}.` : 'Es la forma de diccionario.'
}

export function verbExercise(entry: VocabEntry, form: VerbForm): GrammarExercise {
  return {
    type: 'type',
    prompt: entry.kana,
    hint: `${entry.meaning} → ${verbFormInfo[form].label}`,
    answers: [conjugateVerb(entry.kana, entry.group!, form)],
    kana: true,
    explanation: explainVerb(entry, form),
  }
}

export function adjectiveExercise(entry: VocabEntry, form: AdjForm): GrammarExercise {
  const kind = entry.pos === 'i-adj' ? 'i' : 'na'
  const explanation =
    kind === 'na'
      ? 'Adjetivo な: no cambia; se conjuga だ (じゃない, だった, じゃなかった, で, に).'
      : entry.kana === 'いい'
        ? 'いい se conjuga desde よい: よくない, よかった…'
        : 'Adjetivo い: se quita la い final y se agrega くない, かった, くなかった, くて o く.'
  return {
    type: 'type',
    prompt: kind === 'na' ? `${entry.kana}（な）` : entry.kana,
    hint: `${entry.meaning} → ${adjFormInfo[form]}`,
    answers: [conjugateAdjective(entry.kana, kind, form)],
    kana: true,
    explanation,
  }
}

export type DrillOptions = {
  verbForms: VerbForm[]
  adjForms: AdjForm[]
  /** Solo palabras de lecciones ya completadas (si hay suficientes). */
  known?: Set<string>
  count?: number
}

/** Arma una ronda de práctica mezclando verbos y adjetivos con las formas elegidas. */
export function buildDrill({ verbForms, adjForms, known, count = 10 }: DrillOptions, random = Math.random): GrammarExercise[] {
  const pick = (list: VocabEntry[]) => {
    const learned = known ? list.filter((v) => known.has(v.id)) : list
    return learned.length >= 4 ? learned : list
  }
  const verbPool = verbForms.length ? pick(verbs) : []
  const adjPool = adjForms.length ? pick([...iAdjectives, ...naAdjectives]) : []
  const out: GrammarExercise[] = []
  const vs = shuffle(verbPool, random)
  const as = shuffle(adjPool, random)
  for (let i = 0; i < count; i++) {
    // 70 % verbos si se eligieron ambos.
    const useVerb = adjPool.length === 0 || (verbPool.length > 0 && random() < 0.7)
    if (useVerb) {
      const entry = vs[i % vs.length]
      out.push(verbExercise(entry, verbForms[Math.floor(random() * verbForms.length)]))
    } else {
      const entry = as[i % as.length]
      out.push(adjectiveExercise(entry, adjForms[Math.floor(random() * adjForms.length)]))
    }
  }
  return out
}
