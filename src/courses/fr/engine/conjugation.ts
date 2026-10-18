import { elides } from './phonetics'
// Motor de conjugación del francés. Cada verbo declara solo lo irregular (raíces, participio,
// auxiliar, raíz del futuro y del subjuntivo); el resto sale de las reglas de los tres grupos:
// -er (con sus cambios ortográficos), -ir tipo «finir» y los del tercer grupo con sus raíces.

export const persons = ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles'] as const
export type Person = (typeof persons)[number]
/** Seis formas, en el orden de `persons` (sin el pronombre sujeto). */
export type Forms = [string, string, string, string, string, string]

export type Verb = {
  /** Infinitivo, con «se»/«s'» si es pronominal: «se lever», «s'appeler». */
  inf: string
  meaning: string
  /** Presente completo de los verbos muy irregulares (être, avoir, aller, faire, dire, pouvoir…). */
  present?: Forms
  /** Raíces del presente del tercer grupo: [je/tu/il, nous/vous, ils]. «venir» → vien, ven, vienn. */
  stems?: [string, string, string]
  /** 3.ª persona singular si no se deduce: «connaît». */
  present3?: string
  /** Se conjuga en presente con las terminaciones de -er (ouvrir → j'ouvre). */
  erEndings?: boolean
  /** Participio pasado si no es el regular (é, i, u). */
  participle?: string
  /** Auxiliar del passé composé; por defecto «avoir» (los pronominales usan «être»). */
  aux?: 'avoir' | 'être'
  /** Raíz del futuro y del condicional si es irregular: «ser», «aur», «ir», «viendr». */
  future?: string
  /** Raíces del subjuntivo si son irregulares: [je/tu/il/ils, nous/vous]. */
  subj?: [string, string]
  /** Subjuntivo completo (être, avoir). */
  subjForms?: Forms
  /** Raíz del imparfait si no sale del «nous» del presente (être → ét). */
  imperfect?: string
  /** Imperativo irregular (tu, nous, vous). */
  imperative?: [string, string, string]
  /** Participio presente irregular (étant, ayant, sachant). */
  presentParticiple?: string
}

const isPronominal = (v: Verb) => /^(se |s')/.test(v.inf)
/** Infinitivo sin el pronombre reflexivo. */
export const core = (v: Verb) => v.inf.replace(/^(se |s')/, '')

/** Grupo del verbo: 1 (-er), 2 (-ir tipo finir) o 3 (el resto). */
export function group(v: Verb): 1 | 2 | 3 {
  const inf = core(v)
  if (v.present || v.stems || v.erEndings) return inf.endsWith('er') && !v.present && !v.stems ? 1 : 3
  if (inf.endsWith('er') && inf !== 'aller') return 1
  if (inf.endsWith('ir')) return 2
  return 3
}

/** Cambios ortográficos de -er en las formas «fuertes» (je, tu, il, ils y futuro): achète, appelle, paie. */
function strongStem(inf: string): string {
  const s = inf.slice(0, -2)
  if (/(appel|rappel|jet|rejet)$/.test(s)) return s + s.slice(-1)
  if (/[ey]$/.test(s) && /(ay|oy|uy)$/.test(s)) return `${s.slice(0, -1)}i`
  // e o é + una sola consonante (o consonante + r/l) antes de -er: acheter → achète, préférer → préfère,
  // célébrer → célèbre. Con dos consonantes no cambia: fermer → ferme.
  const m = s.match(/^(.*)[eé]([^aeiouyéè][rl]?)$/)
  if (m) return `${m[1]}è${m[2]}`
  return s
}

/** Raíz del futuro de un -er: «achèter», «appeller», «paier»; «préférer» conserva la é. */
function erFutureStem(inf: string): string {
  const s = inf.slice(0, -2)
  if (/(appel|rappel|jet|rejet)$/.test(s)) return `${s}${s.slice(-1)}er`
  if (/(ay|oy|uy)$/.test(s)) return `${s.slice(0, -1)}ier`
  // Solo la e muda cambia en el futuro (achèterai, lèverai); la é se conserva (préférerai).
  const m = s.match(/^(.*)e([^aeiouyéè][rl]?)$/)
  if (m) return `${m[1]}è${m[2]}er`
  return inf
}

/** -ger y -cer delante de a/o: mangeons, commençons. */
const softStem = (s: string, nextVowel: string) => {
  if (!/^[ao]/.test(nextVowel)) return s
  if (s.endsWith('g')) return `${s}e`
  if (s.endsWith('c')) return `${s.slice(0, -1)}ç`
  return s
}

function erPresent(inf: string): Forms {
  const s = inf.slice(0, -2)
  const strong = strongStem(inf)
  return [`${strong}e`, `${strong}es`, `${strong}e`, `${softStem(s, 'o')}ons`, `${s}ez`, `${strong}ent`]
}

function thirdPresent([sg, pl, ils]: [string, string, string], present3?: string): Forms {
  // il met, il prend, il vainc: sin -t si la raíz ya termina en t, d o c.
  const third = present3 ?? (/[tdc]$/.test(sg) ? sg : `${sg}t`)
  return [`${sg}s`, `${sg}s`, third, `${pl}ons`, `${pl}ez`, `${ils}ent`]
}

/** Presente de indicativo (sin pronombre sujeto ni reflexivo). */
function rawPresent(v: Verb): Forms {
  const inf = core(v)
  if (v.present) return v.present
  if (v.erEndings) {
    const s = inf.slice(0, -2)
    return [`${s}e`, `${s}es`, `${s}e`, `${s}ons`, `${s}ez`, `${s}ent`]
  }
  if (v.stems) return thirdPresent(v.stems, v.present3)
  if (inf.endsWith('er')) return erPresent(inf)
  if (inf.endsWith('ir')) {
    const s = inf.slice(0, -2)
    return [`${s}is`, `${s}is`, `${s}it`, `${s}issons`, `${s}issez`, `${s}issent`]
  }
  // -re regulares: vendre, attendre, répondre, perdre.
  const s = inf.slice(0, -2)
  return thirdPresent([s, s, s])
}

const REFLEXIVE = ['me', 'te', 'se', 'nous', 'vous', 'se']
/** Agrega el pronombre reflexivo con elisión: «me lève», «m'appelle». */
const reflexive = (i: number, form: string) => (i < 3 || i === 5) && elides(form) ? `${REFLEXIVE[i][0]}'${form}` : `${REFLEXIVE[i]} ${form}`
const withReflexive = (v: Verb, forms: Forms): Forms => (isPronominal(v) ? (forms.map((f, i) => reflexive(i, f)) as Forms) : forms)

export const present = (v: Verb): Forms => withReflexive(v, rawPresent(v))

/** Raíz del imparfait: el «nous» del presente sin -ons (être → ét). */
function imperfectStem(v: Verb): string {
  if (v.imperfect) return v.imperfect
  return rawPresent(v)[3].replace(/ons$/, '')
}

export function imparfait(v: Verb): Forms {
  const stem = imperfectStem(v)
  // mangeons → mangeais pero mangions; commençons → commençais pero commencions.
  const beforeI = stem.endsWith('ge') ? stem.slice(0, -1) : stem.endsWith('ç') ? `${stem.slice(0, -1)}c` : stem
  return withReflexive(v, [`${stem}ais`, `${stem}ais`, `${stem}ait`, `${beforeI}ions`, `${beforeI}iez`, `${stem}aient`])
}

/** Raíz del futuro y del condicional. */
export function futureStem(v: Verb): string {
  if (v.future) return v.future
  const inf = core(v)
  if (group(v) === 1) return erFutureStem(inf)
  return inf.endsWith('re') ? inf.slice(0, -1) : inf
}

export function futur(v: Verb): Forms {
  const s = futureStem(v)
  return withReflexive(v, [`${s}ai`, `${s}as`, `${s}a`, `${s}ons`, `${s}ez`, `${s}ont`])
}

export function conditionnel(v: Verb): Forms {
  const s = futureStem(v)
  return withReflexive(v, [`${s}ais`, `${s}ais`, `${s}ait`, `${s}ions`, `${s}iez`, `${s}aient`])
}

/** Subjuntivo presente: raíz del «ils» del presente; nous/vous como en el imparfait. */
export function subjonctif(v: Verb): Forms {
  if (v.subjForms) return withReflexive(v, v.subjForms)
  const ils = rawPresent(v)[5].replace(/ent$/, '')
  const [one, two] = v.subj ?? [ils, imperfectStem(v)]
  const twoI = two.endsWith('ge') ? two.slice(0, -1) : two.endsWith('ç') ? `${two.slice(0, -1)}c` : two
  return withReflexive(v, [`${one}e`, `${one}es`, `${one}e`, `${twoI}ions`, `${twoI}iez`, `${one}ent`])
}

/** Participio pasado: é (-er), i (-ir), u (-re), o el declarado. */
export function participle(v: Verb): string {
  if (v.participle) return v.participle
  const inf = core(v)
  if (inf.endsWith('er')) return `${inf.slice(0, -2)}é`
  if (inf.endsWith('ir')) return `${inf.slice(0, -2)}i`
  return `${inf.slice(0, -2)}u`
}

export const auxOf = (v: Verb): 'avoir' | 'être' => (isPronominal(v) ? 'être' : (v.aux ?? 'avoir'))

const AVOIR: Forms = ['ai', 'as', 'a', 'avons', 'avez', 'ont']
const ETRE: Forms = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont']
const AVOIR_IMP: Forms = ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient']
const ETRE_IMP: Forms = ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient']
const ALLER: Forms = ['vais', 'vas', 'va', 'allons', 'allez', 'vont']

/** Con «être» el participio concuerda: allé(e), allé(e)s. */
const agreed = (p: string, i: number) => (i < 3 ? `${p}(e)` : `${p}(e)s`)

function compound(v: Verb, auxForms: [Forms, Forms]): Forms {
  const etre = auxOf(v) === 'être'
  const aux = etre ? auxForms[1] : auxForms[0]
  const p = participle(v)
  const forms = aux.map((a, i) => `${a} ${etre ? agreed(p, i) : p}`) as Forms
  return withReflexive(v, forms)
}

export const passeCompose = (v: Verb) => compound(v, [AVOIR, ETRE])
export const plusQueParfait = (v: Verb) => compound(v, [AVOIR_IMP, ETRE_IMP])
export const futurProche = (v: Verb): Forms => ALLER.map((a, i) => `${a} ${isPronominal(v) ? reflexive(i, core(v)) : v.inf}`) as Forms

/** Imperativo (tu, nous, vous). En -er y similares, el «tu» pierde la -s: parle, ouvre, va. */
export function imperatif(v: Verb): [string, string, string] {
  if (v.imperative) return v.imperative
  const p = rawPresent(v)
  const tu = /es$/.test(p[1]) || p[1] === 'vas' ? p[1].slice(0, -1) : p[1]
  if (!isPronominal(v)) return [tu, p[3], p[4]]
  return [`${tu}-toi`, `${p[3]}-nous`, `${p[4]}-vous`]
}

/** Participio presente / gerundio: «en parlant». */
export const participePresent = (v: Verb) => v.presentParticiple ?? `${imperfectStem(v)}ant`

/** «je parle», «j'aime», «tu parles», «il parle»: la forma con su pronombre sujeto. */
export function withSubject(i: number, form: string): string {
  const subject = persons[i].split('/')[0]
  return i === 0 && elides(form) ? `j'${form}` : `${subject} ${form}`
}

export const tenses = {
  present: { name: 'presente', forms: present },
  passeCompose: { name: 'passé composé', forms: passeCompose },
  imparfait: { name: 'imparfait', forms: imparfait },
  futurProche: { name: 'futur proche', forms: futurProche },
  futur: { name: 'futuro simple', forms: futur },
  conditionnel: { name: 'condicional', forms: conditionnel },
  subjonctif: { name: 'subjuntivo', forms: subjonctif },
  plusQueParfait: { name: 'plus-que-parfait', forms: plusQueParfait },
} as const
export type TenseId = keyof typeof tenses

export const auxiliaries = { avoir: AVOIR, être: ETRE }
