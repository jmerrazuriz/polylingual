import type { SpeedQuestion } from '../euro.ts'
import { participle } from './engine/conjugation.ts'
import { verbByInf } from './verbs.ts'
import type { FrenchWord } from './vocab.ts'

// Juego de concordancias (desde B1): el adjetivo o el participio con être concuerda con el
// sujeto en género y número. Un masculino y un femenino juntos dan masculino plural.

type Subject = { text: string; g: 'm' | 'f'; n: 's' | 'p'; why: string }

const subjects: Subject[] = [
  { text: 'Julien', g: 'm', n: 's', why: 'Julien: masculino singular' },
  { text: 'Camila', g: 'f', n: 's', why: 'Camila: femenino singular' },
  { text: 'Le médecin', g: 'm', n: 's', why: 'le médecin: masculino singular' },
  { text: 'Ma voisine', g: 'f', n: 's', why: 'ma voisine: femenino singular' },
  { text: 'Les infirmières', g: 'f', n: 'p', why: 'les infirmières: femenino plural' },
  { text: 'Sophie et Inès', g: 'f', n: 'p', why: 'dos mujeres: femenino plural' },
  { text: 'Les patients', g: 'm', n: 'p', why: 'les patients: masculino plural' },
  { text: 'Camila et Karim', g: 'm', n: 'p', why: 'un hombre y una mujer: gana el masculino plural' },
  { text: 'Mes collègues (Karim et Julien)', g: 'm', n: 'p', why: 'dos hombres: masculino plural' },
]

const ETRE_VERBS = ['aller', 'partir', 'arriver', 'venir', 'rester', 'tomber', 'sortir', 'entrer', 'rentrer', 'descendre', 'monter', 'revenir', 'devenir']

/** Plural masculino de un adjetivo: -s, sin cambio en -s/-x, -al → -aux, -eau → -eaux. */
const masculinePlural = (m: string) => (/[sx]$/.test(m) ? m : /eau$/.test(m) ? `${m}x` : /al$/.test(m) ? `${m.slice(0, -2)}aux` : `${m}s`)

type Forms = { ms: string; fs: string; mp: string; fp: string }

function adjectiveForms(w: FrenchWord): Forms {
  const fs = w.feminine ?? w.word
  return { ms: w.word, fs, mp: masculinePlural(w.word), fp: `${fs}s` }
}

function participleForms(inf: string): Forms {
  const p = participle(verbByInf.get(inf)!)
  return { ms: p, fs: `${p}e`, mp: `${p}s`, fp: `${p}es` }
}

const pick = <T,>(xs: readonly T[], random: () => number) => xs[Math.floor(random() * xs.length)]

const formName: Record<keyof Forms, string> = { ms: 'masculino singular', fs: 'femenino singular', mp: 'masculino plural', fp: 'femenino plural' }

/** Adjetivos simples (una palabra, con femenino distinto) entre las palabras en juego. */
const usableAdjectives = (words: readonly FrenchWord[]) => words.filter((w) => w.pos === 'adj' && w.feminine && w.feminine !== w.word && !/[\s’'-]/.test(w.word))

/** «Camila et Karim sont ＿ (fatigué)» → fatigués. Null si no hay palabras B1 en juego. */
export function agreementQuestion(words: readonly FrenchWord[], random = Math.random): SpeedQuestion | null {
  if (!words.some((w) => w.level === 'B1' || w.level === 'B2' || w.level === 'C1' || w.level === 'C2')) return null
  const adjectives = usableAdjectives(words)
  const s = pick(subjects, random)
  const useVerb = adjectives.length === 0 || random() < 0.35
  const base = useVerb ? pick(ETRE_VERBS, random) : pick(adjectives, random)
  const forms = typeof base === 'string' ? participleForms(base) : adjectiveForms(base)
  const label = typeof base === 'string' ? base : base.word
  const key = `${s.g}${s.n}` as keyof Forms
  const answer = forms[key]
  const options = [...new Set([forms.ms, forms.fs, forms.mp, forms.fp])]
  if (options.length < 3) return null
  const whyWrong: Record<string, string> = {}
  for (const k of Object.keys(forms) as (keyof Forms)[]) {
    if (forms[k] !== answer && !whyWrong[forms[k]]) whyWrong[forms[k]] = `«${forms[k]}» es el ${formName[k]}.`
  }
  const verb = s.n === 's' ? 'est' : 'sont'
  return {
    prompt: `${s.text} ${verb} ＿`,
    hint: typeof base === 'string' ? `${label} (participio con être)` : `${label} (${base.meaning})`,
    options,
    answer,
    explanation: `${s.why} → ${answer}${typeof base === 'string' ? ': con être, el participio concuerda con el sujeto' : ''}.`,
    whyWrong,
  }
}
