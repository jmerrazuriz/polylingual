import { condizionale, congiuntivo, futuro, gerundio, imperativo, imperfetto, participle, passatoRemoto, present, type Verb } from './engine/conjugation.ts'
import { pluralOf as plural } from './engine/plurals.ts'
import { stripAccents } from '../../lib/italianInput.ts'
import { verbByInf } from './verbs.ts'
import { type ItalianWord, italianVocab, pluralOf } from './vocab.ts'

// Glosario de las lecturas: al tocar una palabra del texto se busca en el vocabulario del curso.

/** Formas conjugadas → infinitivo, para el glosario («abito» → abitare, «sono» → essere). */
const verbForms = new Map<string, string>()
const addForms = (v: Verb, inf: string) => {
  const forms = [...present(v), ...imperfetto(v), ...futuro(v), ...condizionale(v), ...congiuntivo(v), ...passatoRemoto(v), ...imperativo(v), gerundio(v), participle(v)]
  for (const f of forms) {
    // «mi alzo» → alzo; «va'» → va.
    const last = f.split(' ').at(-1)!.replace(/'$/, '')
    if (!verbForms.has(last)) verbForms.set(last, inf)
  }
  // Participio con concordancia: andato, andata, andati, andate.
  const p = participle(v).slice(0, -1)
  for (const e of ['a', 'i', 'e']) if (!verbForms.has(p + e)) verbForms.set(p + e, inf)
}
for (const w of italianVocab.filter((x) => x.pos === 'verb')) addForms(verbByInf.get(w.word) ?? { inf: w.word, meaning: w.meaning }, w.word)
// Los auxiliares y modales aparecen en todos los textos aunque no sean palabras de una lección.
for (const inf of ['essere', 'avere', 'stare', 'volere', 'potere', 'dovere', 'dare', 'dire']) addForms(verbByInf.get(inf)!, inf)

/** Las formas de un adjetivo: rosso, rossa, rossi, rosse; verde, verdi. */
function adjectiveForms(w: ItalianWord): string[] {
  const fem = w.feminine ?? w.word
  return [w.word, fem, plural({ word: w.word, gender: 'm' }), plural({ word: fem, gender: 'f' })]
}

const norm = (s: string) => stripAccents(s.toLowerCase())

/** Busca una palabra del texto en el vocabulario del curso. */
export function lookupItalian(token: string): { word: ItalianWord; form?: string } | undefined {
  const clean = token.replace(/[.,!?;:«»"“”()…]/g, '').replace(/’/g, "'")
  if (!clean) return undefined
  const lower = clean.toLowerCase()
  const whole = italianVocab.find((w) => w.word.toLowerCase() === lower)
  if (whole) return { word: whole }
  // «l'amico», «un'amica», «dell'acqua», «all'una», «c'è» → amico, amica, acqua, una, è.
  const bare = lower.replace(/^(l|un|dell|all|dall|nell|sull|quell|quest|bell|c|dov|d|anch)'/, '')
  const exact = italianVocab.find((w) => w.word.toLowerCase() === bare)
  if (exact) return { word: exact }
  const pl = italianVocab.find((w) => w.pos === 'noun' && pluralOf(w)?.toLowerCase() === bare)
  if (pl) return { word: pl, form: 'plural' }
  const fem = italianVocab.find((w) => w.pos === 'noun' && w.feminine?.toLowerCase() === bare)
  if (fem) return { word: fem, form: 'femenino' }
  const adj = italianVocab.find((w) => w.pos === 'adj' && adjectiveForms(w).includes(bare))
  if (adj) return { word: adj, form: bare === adj.word ? undefined : 'forma de ' + adj.word }
  const inf = verbForms.get(bare)
  const verb = inf ? italianVocab.find((w) => w.pos === 'verb' && w.word === inf) : undefined
  if (verb) return { word: verb, form: `forma de «${verb.word}»` }
  const loose = italianVocab.find((w) => norm(w.word) === norm(bare))
  return loose ? { word: loose } : undefined
}
