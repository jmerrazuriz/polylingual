import { vowelGroups } from './phonetics'

// Plural de los sustantivos y adjetivos italianos. Las palabras declaran su plural solo si es
// irregular (l'uomo → gli uomini, l'uovo → le uova) o si la regla general no acierta
// (lo zio → gli zii, il medico → i medici ya sale solo).

export type Gender = 'm' | 'f'
export type PluralNoun = {
  word: string
  gender: Gender
  /** Plural irregular, o el que la regla no deduce. */
  plural?: string
  /** No cambia en plural aunque la regla diga otra cosa (la foto, il cinema, la radio). */
  invariable?: boolean
}

/** Palabras en -ico que hacen -ichi (la regla general de -ico es -ici). */
const ICO_CHI = ['antico', 'carico', 'scarico', 'incarico', 'fico', 'buco', 'strascico']
/** Palabras en -co (no -ico) que hacen -ci. */
const CO_CI = ['greco', 'porco']
/** Palabras en -ologo que no son personas: hacen -ologhi. */
const OLOGO_GHI = ['monologo', 'prologo']

/** Una sola sílaba (il re, la gru); «via», «zia» o «zio» tienen dos aunque sus vocales vayan juntas. */
const monosyllable = (w: string) => vowelGroups(w) === 1 && !/[iu][aeo]$/.test(w)

export type PluralRule = 'irregular' | 'invariable' | 'co-chi' | 'ico-ici' | 'go-ghi' | 'ologo-ologi' | 'ca-che' | 'cia-cie' | 'cia-ce' | 'io-i' | 'o-i' | 'a-e' | 'a-i' | 'e-i'

/** La regla que aplica a la palabra (sin mirar el plural declarado). */
export function pluralRule(n: PluralNoun): PluralRule {
  const w = n.word.toLowerCase()
  if (n.plural) return 'irregular'
  if (n.invariable || /[àèéìòóù]$/.test(w) || /[^aeiou]$/.test(w) || w.endsWith('i') || monosyllable(w) || (n.gender === 'f' && w.endsWith('ie'))) return 'invariable'
  if (w.endsWith('ico')) return ICO_CHI.includes(w) || vowelGroups(w) < 3 ? 'co-chi' : 'ico-ici'
  if (w.endsWith('co')) return CO_CI.includes(w) ? 'ico-ici' : 'co-chi'
  if (w.endsWith('ologo') && !OLOGO_GHI.includes(w)) return 'ologo-ologi'
  if (w.endsWith('go')) return 'go-ghi'
  if (/[cg]a$/.test(w)) return 'ca-che'
  // Con vocal antes (camicia) o con la i tónica de -rgia/-lgia (allergia, nostalgia): -cie/-gie.
  if (/[cg]ia$/.test(w)) return /([aeiou][cg]|[rl]g)ia$/.test(w) ? 'cia-cie' : 'cia-ce'
  if (w.endsWith('io')) return 'io-i'
  if (w.endsWith('o')) return 'o-i'
  if (w.endsWith('a')) return n.gender === 'f' ? 'a-e' : 'a-i'
  return 'e-i'
}

export function pluralOf(n: PluralNoun): string {
  if (n.plural) return n.plural
  const w = n.word
  const stem = (k: number) => w.slice(0, w.length - k)
  switch (pluralRule(n)) {
    case 'invariable':
      return w
    case 'co-chi':
    case 'go-ghi':
      return `${stem(1)}hi`
    case 'ico-ici':
      return `${stem(1)}i`
    case 'ologo-ologi':
      return `${stem(1)}i`
    case 'ca-che':
      // la amica → le amiche; il collega → i colleghi.
      return n.gender === 'f' ? `${stem(1)}he` : `${stem(1)}hi`
    case 'cia-cie':
      return `${stem(1)}e`
    case 'cia-ce':
      return `${stem(2)}e`
    case 'io-i':
      return stem(1)
    case 'o-i':
    case 'a-i':
    case 'e-i':
      return `${stem(1)}i`
    case 'a-e':
      return `${stem(1)}e`
    default:
      return w
  }
}

/** Por qué el plural es ese, para la corrección explicada. */
export function pluralReason(n: PluralNoun): string {
  const w = n.word.toLowerCase()
  const p = pluralOf(n)
  switch (pluralRule(n)) {
    case 'irregular':
      return `Plural irregular: ${n.word} → ${p}.`
    case 'invariable':
      if (/[àèéìòóù]$/.test(w)) return `No cambia: termina en vocal acentuada (la città → le città).`
      if (/[^aeiou]$/.test(w)) return `No cambia: termina en consonante, como casi todos los préstamos (il film → i film).`
      if (monosyllable(w)) return `No cambia: es una palabra de una sílaba (il re → i re).`
      if (w.endsWith('i')) return `No cambia: termina en -i (la crisi → le crisi).`
      if (w.endsWith('ie')) return `No cambia: los femeninos en -ie son invariables (la serie → le serie).`
      return `No cambia: es una forma abreviada (la foto → le foto, de «fotografia»).`
    case 'co-chi':
      return `-co → -chi: la h mantiene el sonido duro /k/ (il parco → i parchi).`
    case 'ico-ici':
      return CO_CI.includes(w) ? `Excepción: ${n.word} → ${p}, con sonido suave.` : `Casi todas las palabras de tres o más sílabas en -ico hacen -ici, con sonido suave (il medico → i medici, l'amico → gli amici).`
    case 'go-ghi':
      return `-go → -ghi: la h mantiene el sonido duro /g/ (il lago → i laghi).`
    case 'ologo-ologi':
      return `Las personas en -ologo hacen -ologi (lo psicologo → gli psicologi).`
    case 'ca-che':
      return n.gender === 'f' ? `-ca/-ga → -che/-ghe: la h mantiene el sonido duro (l'amica → le amiche).` : `Masculino en -ca/-ga → -chi/-ghi (il collega → i colleghi).`
    case 'cia-cie':
      return `-cia/-gia con vocal antes: -cie/-gie (la camicia → le camicie).`
    case 'cia-ce':
      return `-cia/-gia con consonante antes: -ce/-ge (l'arancia → le arance).`
    case 'io-i':
      return `-io pierde la o: il figlio → i figli.`
    case 'o-i':
      return `-o → -i (il libro → i libri).`
    case 'a-e':
      return `Femenino en -a → -e (la casa → le case).`
    case 'a-i':
      return `Masculino en -a → -i (il problema → i problemi).`
    case 'e-i':
      return `-e → -i, en masculino y en femenino (il fiore → i fiori, la chiave → le chiavi).`
  }
}
