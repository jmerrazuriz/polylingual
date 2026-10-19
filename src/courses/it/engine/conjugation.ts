import { REFLEXIVE } from './pronouns'

// Motor de conjugación del italiano. Cada verbo declara solo lo irregular (presente, participio,
// auxiliar, raíz del futuro, del imperfetto, del subjuntivo y del passato remoto); el resto sale de
// las reglas de las tres conjugaciones: -are (con cerco/cerchi y mangio/mangi), -ere e -ire
// (con el grupo -isc-: finisco). Los pronominales terminan en -rsi: alzarsi, vestirsi.

export const persons = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'] as const
export type Person = (typeof persons)[number]
/** Seis formas, en el orden de `persons` (sin el pronombre sujeto). */
export type Forms = [string, string, string, string, string, string]

export type Verb = {
  /** Infinitivo; los pronominales con -rsi: «alzarsi». */
  inf: string
  meaning: string
  /** Tercera conjugación con -isc-: finisco, capisco, preferisco. */
  isc?: boolean
  /** La i de la raíz es tónica: invio → invii (no «invi»). */
  stressedI?: boolean
  /** Presente completo de los irregulares (essere, andare, fare, venire…). */
  present?: Forms
  /** Participio pasado si no es el regular (-ato, -uto, -ito). */
  participle?: string
  /** Auxiliar de los tiempos compuestos; por defecto «avere» (los pronominales usan «essere»). */
  aux?: 'avere' | 'essere'
  /** Raíz del futuro y del condicional si es irregular: «sar», «avr», «andr», «verr». */
  future?: string
  /** Raíz del imperfetto si no sale del infinitivo (fare → face: facevo). */
  imperfect?: string
  /** Imperfetto completo (essere: ero, eri…). */
  imperfectForms?: Forms
  /** Subjuntivo presente singular si no sale del «io» del presente: sia, abbia, sappia, dia. */
  subj?: string
  /** Raíz del subjuntivo imperfecto si no sale del imperfetto: essere → fo (fossi). */
  subjImperfect?: string
  /** Passato remoto irregular: la forma de «io» (presi, feci, venni); el resto sigue el patrón. */
  remoto?: string
  /** Passato remoto completo (essere, dare, stare). */
  remotoForms?: Forms
  /** Imperativo irregular: tu, Lei, noi, voi. */
  imperative?: [string, string, string, string]
  /** Gerundio irregular (essere → essendo). */
  gerund?: string
}

export const isPronominal = (v: Verb) => /rsi$/.test(v.inf)
/** Infinitivo sin el pronombre: alzarsi → alzare. */
export const core = (v: Verb) => (isPronominal(v) ? v.inf.replace(/rsi$/, 're') : v.inf)

/** Conjugación: 1 (-are), 2 (-ere, y los contraídos porre, tradurre) o 3 (-ire). */
export function conjugationOf(v: Verb): 1 | 2 | 3 {
  const inf = core(v)
  if (inf.endsWith('are')) return 1
  if (inf.endsWith('ire')) return 3
  return 2
}

/** Raíz del infinitivo: parl-, cred-, dorm-. */
const rootOf = (v: Verb) => core(v).slice(0, -3)

/** -care/-gare conservan el sonido duro ante i/e: cerchi, paghiamo, cercherò. */
const hard = (stem: string, ending: string) => (/[cg]$/.test(stem) && /^[ie]/.test(ending) ? `${stem}h${ending}` : stem + ending)
/** mangi + i → mangi; studi + iamo → studiamo (salvo i tónica: invii). */
const joinI = (v: Verb, stem: string, ending: string) => (stem.endsWith('i') && ending.startsWith('i') && !v.stressedI ? stem + ending.slice(1) : stem + ending)
const areJoin = (v: Verb, stem: string, ending: string) => joinI(v, /[cg]$/.test(stem) && /^[ie]/.test(ending) ? `${stem}h` : stem, ending)

const ARE = ['o', 'i', 'a', 'iamo', 'ate', 'ano']
const ERE = ['o', 'i', 'e', 'iamo', 'ete', 'ono']
const IRE = ['o', 'i', 'e', 'iamo', 'ite', 'ono']
const ISC = ['isco', 'isci', 'isce', 'iamo', 'ite', 'iscono']

const withPronouns = (v: Verb, forms: Forms): Forms => (isPronominal(v) ? (forms.map((f, i) => `${REFLEXIVE[i]} ${f}`) as Forms) : forms)

/** Presente de indicativo sin pronombres. */
function rawPresent(v: Verb): Forms {
  if (v.present) return v.present
  const r = rootOf(v)
  const c = conjugationOf(v)
  if (c === 1) return ARE.map((e) => areJoin(v, r, e)) as Forms
  const endings = c === 2 ? ERE : v.isc ? ISC : IRE
  return endings.map((e) => r + e) as Forms
}

export const present = (v: Verb): Forms => withPronouns(v, rawPresent(v))

/** Raíz del imperfetto: el infinitivo sin -re (parla-, crede-, dormi-; fare → face-). */
const imperfectStem = (v: Verb) => v.imperfect ?? core(v).slice(0, -2)

function rawImperfetto(v: Verb): Forms {
  if (v.imperfectForms) return v.imperfectForms
  const s = imperfectStem(v)
  return [`${s}vo`, `${s}vi`, `${s}va`, `${s}vamo`, `${s}vate`, `${s}vano`]
}
export const imperfetto = (v: Verb): Forms => withPronouns(v, rawImperfetto(v))

/** Raíz del futuro y del condicional: parler-, cercher-, manger-, creder-, dormir-. */
export function futureStem(v: Verb): string {
  if (v.future) return v.future
  const inf = core(v)
  if (conjugationOf(v) === 1) {
    const r = rootOf(v)
    // mangiare → manger-, cominciare → comincer-: la i solo servía para el sonido suave.
    if (/[cg]i$/.test(r)) return `${r.slice(0, -1)}er`
    return hard(r, 'er')
  }
  return inf.slice(0, -1)
}

const FUT = ['ò', 'ai', 'à', 'emo', 'ete', 'anno']
const COND = ['ei', 'esti', 'ebbe', 'emmo', 'este', 'ebbero']

export const futuro = (v: Verb): Forms => withPronouns(v, FUT.map((e) => futureStem(v) + e) as Forms)
export const condizionale = (v: Verb): Forms => withPronouns(v, COND.map((e) => futureStem(v) + e) as Forms)

/** Subjuntivo presente: -are → -i; el resto, el «io» del presente con -a (vengo → venga). */
function rawCongiuntivo(v: Verb): Forms {
  const p = rawPresent(v)
  let sg: string
  if (v.subj) sg = v.subj
  else if (conjugationOf(v) === 1 && !v.present) sg = areJoin(v, rootOf(v), 'i')
  else sg = p[0].replace(/o$/, 'a')
  const noi = p[3]
  return [sg, sg, sg, noi, noi.replace(/mo$/, 'te'), `${sg}no`]
}
export const congiuntivo = (v: Verb): Forms => withPronouns(v, rawCongiuntivo(v))

/** Subjuntivo imperfecto: parlassi, credessi, dormissi; fossi, dessi, stessi. */
function rawCongiuntivoImperfetto(v: Verb): Forms {
  const s = v.subjImperfect ?? imperfectStem(v)
  return [`${s}ssi`, `${s}ssi`, `${s}sse`, `${s}ssimo`, `${s}ste`, `${s}ssero`]
}
export const congiuntivoImperfetto = (v: Verb): Forms => withPronouns(v, rawCongiuntivoImperfetto(v))

const LAST_ACCENT: Record<string, string> = { a: 'ò', e: 'é', i: 'ì' }

/**
 * Passato remoto. Regular: parlai, parlasti, parlò; credei, credesti, credé; dormii, dormisti, dormì.
 * Irregular «1-3-6»: io, lui y loro salen de la raíz irregular (presi, prese, presero) y tu, noi y
 * voi de la regular (prendesti, prendemmo, prendeste).
 */
function rawRemoto(v: Verb): Forms {
  if (v.remotoForms) return v.remotoForms
  const L = imperfectStem(v)
  const tu = `${L}sti`
  const noi = `${L}mmo`
  const voi = `${L}ste`
  if (v.remoto) {
    const r = v.remoto.slice(0, -1)
    return [v.remoto, tu, `${r}e`, noi, voi, `${r}ero`]
  }
  return [`${L}i`, tu, L.slice(0, -1) + LAST_ACCENT[L.slice(-1)], noi, voi, `${L}rono`]
}
export const passatoRemoto = (v: Verb): Forms => withPronouns(v, rawRemoto(v))

/** Participio pasado: -ato, -uto, -ito, o el declarado. */
export function participle(v: Verb): string {
  if (v.participle) return v.participle
  const r = rootOf(v)
  const c = conjugationOf(v)
  return c === 1 ? `${r}ato` : c === 2 ? `${r}uto` : `${r}ito`
}

export const auxOf = (v: Verb): 'avere' | 'essere' => (isPronominal(v) ? 'essere' : (v.aux ?? 'avere'))

export const AVERE = {
  present: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'] as Forms,
  imperfetto: ['avevo', 'avevi', 'aveva', 'avevamo', 'avevate', 'avevano'] as Forms,
  futuro: ['avrò', 'avrai', 'avrà', 'avremo', 'avrete', 'avranno'] as Forms,
  condizionale: ['avrei', 'avresti', 'avrebbe', 'avremmo', 'avreste', 'avrebbero'] as Forms,
  congiuntivo: ['abbia', 'abbia', 'abbia', 'abbiamo', 'abbiate', 'abbiano'] as Forms,
  congiuntivoImperfetto: ['avessi', 'avessi', 'avesse', 'avessimo', 'aveste', 'avessero'] as Forms,
  remoto: ['ebbi', 'avesti', 'ebbe', 'avemmo', 'aveste', 'ebbero'] as Forms,
}
export const ESSERE = {
  present: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'] as Forms,
  imperfetto: ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano'] as Forms,
  futuro: ['sarò', 'sarai', 'sarà', 'saremo', 'sarete', 'saranno'] as Forms,
  condizionale: ['sarei', 'saresti', 'sarebbe', 'saremmo', 'sareste', 'sarebbero'] as Forms,
  congiuntivo: ['sia', 'sia', 'sia', 'siamo', 'siate', 'siano'] as Forms,
  congiuntivoImperfetto: ['fossi', 'fossi', 'fosse', 'fossimo', 'foste', 'fossero'] as Forms,
  remoto: ['fui', 'fosti', 'fu', 'fummo', 'foste', 'furono'] as Forms,
}
type AuxTense = keyof typeof AVERE

/** Con «essere» el participio concuerda: andato/a, andati/e. */
const agreed = (p: string, i: number) => (i < 3 ? `${p}/a` : `${p.slice(0, -1)}i/e`)

/** Las formas que se aceptan al escribir: «sono andato/a» → «sono andato» o «sono andata». */
export const agreementVariants = (form: string): string[] => {
  const m = form.match(/^(.*)([oi])\/([ae])$/)
  return m ? [`${m[1]}${m[2]}`, `${m[1]}${m[3]}`] : [form]
}

function compound(v: Verb, tense: AuxTense): Forms {
  const essere = auxOf(v) === 'essere'
  const aux = (essere ? ESSERE : AVERE)[tense]
  const p = participle(v)
  return withPronouns(v, aux.map((a, i) => `${a} ${essere ? agreed(p, i) : p}`) as Forms)
}

export const passatoProssimo = (v: Verb) => compound(v, 'present')
export const trapassatoProssimo = (v: Verb) => compound(v, 'imperfetto')
export const futuroAnteriore = (v: Verb) => compound(v, 'futuro')
export const condizionalePassato = (v: Verb) => compound(v, 'condizionale')
export const congiuntivoPassato = (v: Verb) => compound(v, 'congiuntivo')
export const congiuntivoTrapassato = (v: Verb) => compound(v, 'congiuntivoImperfetto')
/** Trapassato remoto (literario): «dopo che ebbe finito». */
export const trapassatoRemoto = (v: Verb) => compound(v, 'remoto')

/** Gerundio: parlando, credendo, dormendo, facendo. Los pronominales llevan «si» pegado: alzandosi. */
export function gerundio(v: Verb): string {
  const s = imperfectStem(v)
  const g = v.gerund ?? (s.endsWith('a') ? `${s.slice(0, -1)}ando` : `${s.slice(0, -1)}endo`)
  return isPronominal(v) ? `${g}si` : g
}

const STARE: Forms = ['sto', 'stai', 'sta', 'stiamo', 'state', 'stanno']
/** Stare + gerundio: «sto parlando», «mi sto alzando». */
export function progressivo(v: Verb): Forms {
  const g = isPronominal(v) ? gerundio(v).slice(0, -2) : gerundio(v)
  return withPronouns(v, STARE.map((s) => `${s} ${g}`) as Forms)
}

/** Imperativo: tu, Lei, noi, voi. «parla, parli, parliamo, parlate»; «alzati, si alzi, alziamoci, alzatevi». */
export function imperativo(v: Verb): [string, string, string, string] {
  const p = rawPresent(v)
  const lei = rawCongiuntivo(v)[0]
  const base: [string, string, string, string] = v.imperative ?? [conjugationOf(v) === 1 && !v.present ? p[2] : p[1], lei, p[3], p[4]]
  if (!isPronominal(v)) return base
  const [tu, l, noi, voi] = base
  return [`${tu}ti`, `si ${l}`, `${noi}ci`, `${voi}vi`]
}

/** Imperativo negativo de «tu»: non + infinitivo (non parlare, non alzarti). */
export const imperativoNegativo = (v: Verb) => `non ${isPronominal(v) ? v.inf.replace(/rsi$/, 'rti') : v.inf}`

/** «io parlo», «lui parla»: la forma con su pronombre sujeto. */
export const withSubject = (i: number, form: string) => `${persons[i].split('/')[0]} ${form}`
/** «che io parli»: el subjuntivo se muestra con «che». */
export const withChe = (i: number, form: string) => `che ${withSubject(i, form)}`

export const tenses = {
  present: { name: 'presente', forms: present },
  passatoProssimo: { name: 'passato prossimo', forms: passatoProssimo },
  imperfetto: { name: 'imperfetto', forms: imperfetto },
  progressivo: { name: 'stare + gerundio', forms: progressivo },
  futuro: { name: 'futuro simple', forms: futuro },
  condizionale: { name: 'condicional', forms: condizionale },
  congiuntivo: { name: 'subjuntivo presente', forms: congiuntivo },
  trapassatoProssimo: { name: 'trapassato prossimo', forms: trapassatoProssimo },
  futuroAnteriore: { name: 'futuro anteriore', forms: futuroAnteriore },
  condizionalePassato: { name: 'condicional pasado', forms: condizionalePassato },
  congiuntivoPassato: { name: 'subjuntivo pasado', forms: congiuntivoPassato },
  congiuntivoImperfetto: { name: 'subjuntivo imperfecto', forms: congiuntivoImperfetto },
  congiuntivoTrapassato: { name: 'subjuntivo pluscuamperfecto', forms: congiuntivoTrapassato },
  passatoRemoto: { name: 'passato remoto', forms: passatoRemoto },
  trapassatoRemoto: { name: 'trapassato remoto (literario)', forms: trapassatoRemoto },
} as const
export type TenseId = keyof typeof tenses

/** Tiempos que se muestran con «che». */
export const subjunctiveTenses: TenseId[] = ['congiuntivo', 'congiuntivoPassato', 'congiuntivoImperfetto', 'congiuntivoTrapassato']
