import { hiraganaInfo, smallHiragana } from '../courses/ja/hiragana.ts'
import { katakanaInfo, LONG_VOWEL, smallKatakana } from '../courses/ja/katakana.ts'
import type { KanaInfo } from '../courses/ja/types.ts'

const infoEntries = (info: Record<string, KanaInfo>) =>
  Object.entries(info).map(([char, i]): [string, string[]] => [char, [i.romaji, ...(i.variants ?? [])]])
const smallEntries = (small: Record<string, string>) =>
  Object.entries(small).map(([char, romaji]): [string, string[]] => [char, [romaji]])

/** Romanizaciones de cada sílaba (hiragana y katakana); la primera es la principal (Hepburn). */
const table = new Map<string, string[]>([
  ...infoEntries(hiraganaInfo),
  ...smallEntries(smallHiragana),
  ...infoEntries(katakanaInfo),
  ...smallEntries(smallKatakana),
])

const SMALL_TSU = new Set(['っ', 'ッ'])
const N = new Set(['ん', 'ン'])

/** Separa en sílabas, uniendo los combinados: でんしゃ → ['で', 'ん', 'しゃ']. */
export function syllables(kana: string): string[] {
  const chars = [...kana]
  const out: string[] = []
  for (let i = 0; i < chars.length; ) {
    const pair = chars[i] + (chars[i + 1] ?? '')
    const key = chars[i + 1] && table.has(pair) ? pair : chars[i]
    out.push(key)
    i += [...key].length
  }
  return out
}

/**
 * Todas las formas válidas de escribir el kana en romaji, la principal primero
 * (でんしゃ → densha, densya, nnsha…). Las vocales largas se escriben tal como
 * están en kana (おとうさん → otousan) y ー repite la vocal (コーヒー → koohii;
 * también se acepta sin repetir: kohi). Lanza un error con caracteres desconocidos.
 */
export function romajiReadings(kana: string): string[] {
  let readings = ['']
  let doubleNext = false
  let prevWasN = false

  for (const key of syllables(kana)) {
    if (SMALL_TSU.has(key)) {
      doubleNext = true
      continue
    }
    if (key === LONG_VOWEL) {
      readings = readings.flatMap((r) => {
        const vowel = r.match(/[aeiou]$/)?.[0]
        return vowel ? [r + vowel, r] : [r]
      })
      prevWasN = false
      continue
    }
    const options = table.get(key)
    if (!options) throw new Error(`Carácter sin romaji: ${key}`)

    const forms = options.map((syllable) => {
      // っ duplica la consonante siguiente: がっこう → gakkou, まっちゃ → matcha
      if (doubleNext) syllable = (syllable.startsWith('ch') ? 't' : syllable[0]) + syllable
      // ん antes de vocal o y se separa con apóstrofo: きんえん → kin'en
      return prevWasN && /^[aeiouy]/.test(syllable) ? `'${syllable}` : syllable
    })
    readings = readings.flatMap((prefix) => forms.map((form) => prefix + form))
    doubleNext = false
    prevWasN = N.has(key)
  }
  return readings
}

/** Romaji principal (Hepburn): ねこ → neko. */
export function toRomaji(kana: string): string {
  return romajiReadings(kana)[0]
}

const MACRONS: Record<string, string> = { ā: 'aa', ī: 'ii', ū: 'uu', ē: 'ee', ō: 'oo', â: 'aa', î: 'ii', û: 'uu', ê: 'ee', ô: 'oo' }

const normalize = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[āīūēōâîûêô]/g, (c) => MACRONS[c])
    .replace(/[\s'’-]/g, '')
    // «ō» puede ser おう u おお: se comparan igual (otōsan = otousan = otoosan).
    .replace(/ou/g, 'oo')

/** Compara lo que escribió el usuario con las lecturas aceptadas (sin importar mayúsculas, espacios ni apóstrofos). */
export function matchesReading(input: string, accepted: readonly string[]): boolean {
  const answer = normalize(input)
  return answer.length > 0 && accepted.some((r) => normalize(r) === answer)
}
