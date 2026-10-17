// Motor de declinación del alemán: artículos, posesivos, pronombres, terminaciones del
// adjetivo y frases nominales completas («mit einem neuen Kollegen»).

export type Gender = 'm' | 'f' | 'n'
export type Case = 'nom' | 'akk' | 'dat' | 'gen'
export type NumberKind = 'sg' | 'pl'
/** Género en singular o plural (en plural el género no cuenta). */
export type Slot = Gender | 'pl'

export const cases: Case[] = ['nom', 'akk', 'dat', 'gen']
export const caseNames: Record<Case, string> = { nom: 'Nominativo', akk: 'Acusativo', dat: 'Dativo', gen: 'Genitivo' }
export const slots: Slot[] = ['m', 'f', 'n', 'pl']
export const slotNames: Record<Slot, string> = { m: 'Masculino', f: 'Femenino', n: 'Neutro', pl: 'Plural' }

type Table = Record<Case, Record<Slot, string>>

/** Artículo definido. */
export const definite: Table = {
  nom: { m: 'der', f: 'die', n: 'das', pl: 'die' },
  akk: { m: 'den', f: 'die', n: 'das', pl: 'die' },
  dat: { m: 'dem', f: 'der', n: 'dem', pl: 'den' },
  gen: { m: 'des', f: 'der', n: 'des', pl: 'der' },
}

/** Terminaciones de «ein/kein/mein…» (sin terminación = ''). */
const einEndings: Table = {
  nom: { m: '', f: 'e', n: '', pl: 'e' },
  akk: { m: 'en', f: 'e', n: '', pl: 'e' },
  dat: { m: 'em', f: 'er', n: 'em', pl: 'en' },
  gen: { m: 'es', f: 'er', n: 'es', pl: 'er' },
}

/** Terminaciones de «dieser/jeder/welcher» (como el artículo definido). */
const derEndings: Table = {
  nom: { m: 'er', f: 'e', n: 'es', pl: 'e' },
  akk: { m: 'en', f: 'e', n: 'es', pl: 'e' },
  dat: { m: 'em', f: 'er', n: 'em', pl: 'en' },
  gen: { m: 'es', f: 'er', n: 'es', pl: 'er' },
}

export type Determiner =
  | { kind: 'def' }
  | { kind: 'indef' }
  | { kind: 'none' }
  /** «kein», o un posesivo: «mein», «dein», «sein», «ihr», «unser», «euer», «Ihr». */
  | { kind: 'ein-word'; stem: string }
  /** «dies», «jed», «welch», «jen». */
  | { kind: 'der-word'; stem: string }

/** Forma del determinante; `null` si no hay (sin artículo, o «ein» en plural). */
export function determiner(d: Determiner, c: Case, slot: Slot): string | null {
  switch (d.kind) {
    case 'def':
      return definite[c][slot]
    case 'none':
      return null
    case 'indef':
      return slot === 'pl' ? null : `ein${einEndings[c][slot]}`
    case 'ein-word': {
      const ending = einEndings[c][slot]
      // «euer» pierde la e cuando lleva terminación: eure, eurem.
      const stem = d.stem === 'euer' && ending ? 'eur' : d.stem
      return `${stem}${ending}`
    }
    case 'der-word':
      return `${d.stem}${derEndings[c][slot]}`
  }
}

/** Declinación del adjetivo: débil (tras der/dieser), mixta (tras ein/kein/mein) o fuerte (sin artículo). */
export type AdjectiveKind = 'weak' | 'mixed' | 'strong'

export const adjectiveEndings: Record<AdjectiveKind, Table> = {
  weak: {
    nom: { m: 'e', f: 'e', n: 'e', pl: 'en' },
    akk: { m: 'en', f: 'e', n: 'e', pl: 'en' },
    dat: { m: 'en', f: 'en', n: 'en', pl: 'en' },
    gen: { m: 'en', f: 'en', n: 'en', pl: 'en' },
  },
  mixed: {
    nom: { m: 'er', f: 'e', n: 'es', pl: 'en' },
    akk: { m: 'en', f: 'e', n: 'es', pl: 'en' },
    dat: { m: 'en', f: 'en', n: 'en', pl: 'en' },
    gen: { m: 'en', f: 'en', n: 'en', pl: 'en' },
  },
  strong: {
    nom: { m: 'er', f: 'e', n: 'es', pl: 'e' },
    akk: { m: 'en', f: 'e', n: 'es', pl: 'e' },
    dat: { m: 'em', f: 'er', n: 'em', pl: 'en' },
    gen: { m: 'en', f: 'er', n: 'en', pl: 'er' },
  },
}

/** Qué declinación lleva el adjetivo según el determinante (las formas de «ein» sin terminación piden la fuerte). */
export function adjectiveKind(d: Determiner, slot: Slot): AdjectiveKind {
  if (d.kind === 'def' || d.kind === 'der-word') return 'weak'
  if (d.kind === 'none') return 'strong'
  if (d.kind === 'indef' && slot === 'pl') return 'strong'
  return 'mixed'
}

/** Raíz del adjetivo antes de la terminación: «teuer» → «teur», «dunkel» → «dunkl», «hoch» → «hoh». */
export function adjectiveStem(adj: string): string {
  if (adj === 'hoch') return 'hoh'
  if (/(au|eu)er$/.test(adj) || /el$/.test(adj)) return `${adj.slice(0, -2)}${adj.slice(-1)}`
  return adj
}

export const declineAdjective = (adj: string, kind: AdjectiveKind, c: Case, slot: Slot) =>
  `${adjectiveStem(adj)}${adjectiveEndings[kind][c][slot]}`

export type Noun = {
  word: string
  gender: Gender
  /** Plural completo («Tische»); `null` si no tiene. */
  plural: string | null
  /** n-Deklination (der Kollege → den Kollegen). */
  weak?: boolean
  /** Genitivo singular si no es el regular («des Namens», «des Herzens»). */
  genitive?: string
}

/** El sustantivo en un caso y número (dativo plural con -n, genitivo con -(e)s, n-Deklination). */
export function nounForm(n: Noun, c: Case, num: NumberKind): string {
  if (num === 'pl') {
    const pl = n.plural ?? n.word
    return c === 'dat' && !/[ns]$/.test(pl) ? `${pl}n` : pl
  }
  if (n.weak && c !== 'nom') return n.genitive && c === 'gen' ? n.genitive : n.word.endsWith('e') ? `${n.word}n` : `${n.word}en`
  if (c === 'gen' && n.gender !== 'f') {
    if (n.genitive) return n.genitive
    return /(s|ß|x|z|tz)$/.test(n.word) ? `${n.word}es` : `${n.word}s`
  }
  return n.word
}

/** Frase nominal completa: «einem netten Kollegen», «die neuen Wohnungen». */
export function nounPhrase(n: Noun, d: Determiner, c: Case, num: NumberKind = 'sg', adjective?: string): string {
  const slot: Slot = num === 'pl' ? 'pl' : n.gender
  const parts = [determiner(d, c, slot)]
  if (adjective) parts.push(declineAdjective(adjective, adjectiveKind(d, slot), c, slot))
  parts.push(nounForm(n, c, num))
  return parts.filter(Boolean).join(' ')
}

/** Pronombres personales: nominativo, acusativo y dativo. */
export const personalPronouns: { person: string; nom: string; akk: string; dat: string }[] = [
  { person: '1.ª sg', nom: 'ich', akk: 'mich', dat: 'mir' },
  { person: '2.ª sg', nom: 'du', akk: 'dich', dat: 'dir' },
  { person: '3.ª sg m', nom: 'er', akk: 'ihn', dat: 'ihm' },
  { person: '3.ª sg f', nom: 'sie', akk: 'sie', dat: 'ihr' },
  { person: '3.ª sg n', nom: 'es', akk: 'es', dat: 'ihm' },
  { person: '1.ª pl', nom: 'wir', akk: 'uns', dat: 'uns' },
  { person: '2.ª pl', nom: 'ihr', akk: 'euch', dat: 'euch' },
  { person: '3.ª pl', nom: 'sie', akk: 'sie', dat: 'ihnen' },
  { person: 'formal', nom: 'Sie', akk: 'Sie', dat: 'Ihnen' },
]

/** Raíces de los posesivos por persona. */
export const possessiveStems = ['mein', 'dein', 'sein', 'ihr', 'sein', 'unser', 'euer', 'ihr', 'Ihr'] as const
