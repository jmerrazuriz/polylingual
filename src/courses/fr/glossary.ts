import { conditionnel, futur, imparfait, passeCompose, passeSimple, present, subjonctif } from './engine/conjugation.ts'
import { stripAccents } from '../../lib/frenchInput.ts'
import { verbs } from './verbs.ts'
import { type FrenchWord, frenchVocab, pluralOf } from './vocab.ts'

// Glosario de las lecturas: al tocar una palabra del texto se busca en el vocabulario del curso.

/** Formas conjugadas → infinitivo, para el glosario («habite» → habiter, «suis» → être). */
const verbForms = new Map<string, string>()
for (const v of verbs) {
  for (const f of [...present(v), ...imparfait(v), ...futur(v), ...passeCompose(v), ...conditionnel(v), ...subjonctif(v), ...passeSimple(v)]) {
    // «me lève» → lève; «suis allé(e)» → allé.
    const last = f.split(' ').at(-1)!.replace(/\(e\)s?$/, '').replace(/^[mts]'/, '')
    if (!verbForms.has(last)) verbForms.set(last, v.inf)
  }
}

const norm = (s: string) => stripAccents(s.toLowerCase())

/** Busca una palabra del texto en el vocabulario del curso. */
export function lookupFrench(token: string): { word: FrenchWord; form?: string } | undefined {
  // «l’école» → école; «d’accord» se busca entero.
  const clean = token.replace(/[.,!?;:«»"“”()]/g, '').replace(/’/g, "'")
  if (!clean) return undefined
  const whole = frenchVocab.find((w) => w.word.toLowerCase() === clean.toLowerCase())
  if (whole) return { word: whole }
  const bare = clean.replace(/^(l|d|j|m|t|s|n|qu|c)'/i, '')
  const lower = bare.toLowerCase()
  const exact = frenchVocab.find((w) => w.word.toLowerCase() === lower)
  if (exact) return { word: exact }
  const plural = frenchVocab.find((w) => w.pos === 'noun' && pluralOf(w)?.toLowerCase() === lower)
  if (plural) return { word: plural, form: 'plural' }
  const fem = frenchVocab.find((w) => w.feminine?.toLowerCase() === lower || (w.feminine && `${w.feminine}s`.toLowerCase() === lower))
  if (fem) return { word: fem, form: 'femenino' }
  const inf = verbForms.get(lower)
  const verb = inf ? frenchVocab.find((w) => w.pos === 'verb' && w.word === inf) : undefined
  if (verb) return { word: verb, form: `forma de «${verb.word}»` }
  const loose = frenchVocab.find((w) => norm(w.word) === norm(bare))
  return loose ? { word: loose } : undefined
}
