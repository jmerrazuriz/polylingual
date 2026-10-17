// Motor de conjugación del alemán. Cada verbo declara solo lo irregular (formas principales);
// el resto se deduce con las reglas de los verbos débiles. Los separables se escriben con su
// prefijo aparte en la oración principal: «ich stehe auf».

export const persons = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'] as const
export type Person = (typeof persons)[number]
/** Seis formas, en el orden de `persons`. */
export type Forms = [string, string, string, string, string, string]

export type Verb = {
  /** Infinitivo completo (con el prefijo separable si lo tiene): «aufstehen». */
  inf: string
  meaning: string
  /** Prefijo separable: «auf» en «aufstehen». */
  sep?: string
  /** 3.ª persona singular del presente cuando cambia la vocal: «fährt», «liest». */
  present3?: string
  /** 2.ª persona singular cuando no se deduce: «wirst». */
  present2?: string
  /** Presente completo de los verbos muy irregulares (sein, haben, werden, wissen, modales). */
  present?: Forms
  /** Präteritum (1.ª/3.ª persona) de los verbos fuertes y mixtos: «fuhr», «brachte». */
  praet?: string
  /** Participio II si no es el regular «ge…t» (incluye el prefijo separable). */
  partizip?: string
  /** Auxiliar del Perfekt; por defecto «haben». */
  aux?: 'haben' | 'sein'
  /** Base del Konjunktiv II propio: «wäre», «hätte», «käme». Si falta, se usa «würde» + infinitivo. */
  konj2?: string
  /** Imperativo irregular (du, ihr, Sie). */
  imperative?: [string, string, string]
  /** Los modales no tienen imperativo. */
  noImperative?: boolean
}

const INSEPARABLE = ['be', 'emp', 'ent', 'er', 'ge', 'miss', 'ver', 'zer']

/** Infinitivo sin el prefijo separable. */
const core = (v: Verb) => (v.sep ? v.inf.slice(v.sep.length) : v.inf)

/** Raíz: «arbeiten» → «arbeit», «sammeln» → «sammel», «wandern» → «wander». */
export function stem(inf: string): string {
  if (/(el|er)n$/.test(inf)) return inf.slice(0, -1)
  if (inf.endsWith('en')) return inf.slice(0, -2)
  return inf.slice(0, -1)
}

/** ¿Lleva «e» antes de -st/-t? (arbeitest, findet, atmet, rechnet) */
function needsE(s: string): boolean {
  if (/[dt]$/.test(s) || /chn$/.test(s)) return true
  return /[^aeiouäöülrhmn][mn]$/.test(s)
}

/** ¿La raíz termina en sonido s? (du reist, du heißt, du tanzt) */
const sStem = (s: string) => /(s|ß|z|x)$/.test(s)

/** Agrega el prefijo separable al final, en oración principal. */
const withSep = (v: Verb, f: string) => (v.sep ? `${f} ${v.sep}` : f)

export function present(v: Verb): Forms {
  if (v.present) return v.present.map((f) => withSep(v, f)) as Forms
  const inf = core(v)
  const s = stem(inf)
  const e = needsE(s)
  const ich = inf.endsWith('eln') ? `${s.slice(0, -2)}le` : `${s}e`
  const er = v.present3 ?? `${s}${e ? 'et' : 't'}`
  let du: string
  if (v.present2) du = v.present2
  else if (v.present3) {
    const base = v.present3.slice(0, -1)
    if (sStem(base)) du = v.present3
    else if (/t$/.test(s) && !v.present3.endsWith('et')) du = `${v.present3}st`
    else du = `${base}st`
  } else du = `${s}${e ? 'est' : sStem(s) ? 't' : 'st'}`
  const ihr = `${s}${e ? 'et' : 't'}`
  return [ich, du, er, inf, ihr, inf].map((f) => withSep(v, f)) as Forms
}

export function praeteritum(v: Verb): Forms {
  const s = stem(core(v))
  const p = v.praet ?? `${s}${needsE(s) ? 'ete' : 'te'}`
  let forms: string[]
  // Débiles, mixtos y «wurde»: terminan en -e.
  if (p.endsWith('e')) forms = [p, `${p}st`, p, `${p}n`, `${p}t`, `${p}n`]
  else {
    const eSt = sStem(p) || /[dt]$/.test(p)
    forms = [p, `${p}${eSt ? 'est' : 'st'}`, p, `${p}en`, `${p}${/[dt]$/.test(p) ? 'et' : 't'}`, `${p}en`]
  }
  return forms.map((f) => withSep(v, f)) as Forms
}

export function partizip2(v: Verb): string {
  if (v.partizip) return v.partizip
  const inf = core(v)
  const s = stem(inf)
  const end = needsE(s) ? 'et' : 't'
  const noGe = inf.endsWith('ieren') || INSEPARABLE.some((p) => inf.startsWith(p) && inf.length > p.length + 3)
  return `${v.sep ?? ''}${noGe ? '' : 'ge'}${s}${end}`
}

export const auxOf = (v: Verb) => v.aux ?? 'haben'

const HABEN: Verb = { inf: 'haben', meaning: 'tener', present: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'], praet: 'hatte', partizip: 'gehabt', konj2: 'hätte' }
const SEIN: Verb = {
  inf: 'sein',
  meaning: 'ser, estar',
  present: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'],
  praet: 'war',
  partizip: 'gewesen',
  aux: 'sein',
  konj2: 'wäre',
  imperative: ['sei', 'seid', 'seien Sie'],
}
const WERDEN: Verb = { inf: 'werden', meaning: 'volverse; (futuro)', present: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'], praet: 'wurde', partizip: 'geworden', aux: 'sein', konj2: 'würde' }

/** Forma del auxiliar + participio (o infinitivo) para los tiempos compuestos. */
const compound = (auxForms: Forms, tail: string) => auxForms.map((a) => `${a} ${tail}`) as Forms

export const perfekt = (v: Verb) => compound(present(auxOf(v) === 'sein' ? SEIN : HABEN), partizip2(v))
export const plusquamperfekt = (v: Verb) => compound(praeteritum(auxOf(v) === 'sein' ? SEIN : HABEN), partizip2(v))
export const futur1 = (v: Verb) => compound(present(WERDEN), v.inf)

export function konjunktiv2(v: Verb): Forms {
  if (!v.konj2) return compound(konjunktiv2(WERDEN), v.inf)
  const k = v.konj2
  return [k, `${k}st`, k, `${k}n`, `${k}t`, `${k}n`].map((f) => withSep(v, f)) as Forms
}

/** Imperativo: du, ihr, Sie. `null` para los modales. */
export function imperativ(v: Verb): [string, string, string] | null {
  if (v.noImperative) return null
  if (v.imperative) return v.imperative.map((f) => withSep(v, f)) as [string, string, string]
  const inf = core(v)
  const s = stem(inf)
  const forms = present({ ...v, sep: undefined, inf })
  let du = needsE(s) ? `${s}e` : s
  // Cambio e → i/ie se mantiene (nimm, lies, gib); a → ä no (fahr).
  if (v.present3) {
    const base = v.present3.slice(0, -1)
    if (/i/.test(base) && !/i/.test(s) && /e/.test(s)) du = base
  }
  if (inf.endsWith('eln')) du = `${s.slice(0, -2)}le`
  return [withSep(v, du), withSep(v, forms[4]), v.sep ? `${inf} Sie ${v.sep}` : `${inf} Sie`]
}

export const auxiliaries = { haben: HABEN, sein: SEIN, werden: WERDEN }
