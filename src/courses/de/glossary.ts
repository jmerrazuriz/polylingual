import { present, praeteritum } from './engine/conjugation.ts'
import { verbs } from './verbs.ts'
import { type GermanWord, germanVocab } from './vocab.ts'

// Glosario de las lecturas: al tocar una palabra del texto se busca en el vocabulario del curso.

/** Formas conjugadas → infinitivo, para el glosario («wohnt» → wohnen). */
const verbForms = new Map<string, string>()
for (const v of verbs) for (const f of [...present(v), ...praeteritum(v)]) verbForms.set(f.split(' ')[0].toLowerCase(), v.inf)

/** Busca una palabra del texto en el vocabulario del curso. */
export function lookupGerman(token: string): { word: GermanWord; form?: string } | undefined {
  const clean = token.replace(/[.,!?;:«»"“”()]/g, '')
  if (!clean) return undefined
  const exact = germanVocab.find((w) => w.word === clean || w.plural === clean)
  if (exact) return { word: exact, form: exact.word === clean ? undefined : 'plural' }
  const lower = clean.toLowerCase()
  const ci = germanVocab.find((w) => w.word.toLowerCase() === lower)
  if (ci) return { word: ci }
  const inf = verbForms.get(lower)
  const verb = inf ? germanVocab.find((w) => w.pos === 'verb' && w.word === inf) : undefined
  return verb ? { word: verb, form: `forma de «${verb.word}»` } : undefined
}
