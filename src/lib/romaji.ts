import { hiraganaInfo, smallHiragana } from '../content/hiragana.ts'

/** Romanizaciones de cada sílaba; la primera es la principal (Hepburn). */
const table = new Map<string, string[]>([
  ...Object.entries(hiraganaInfo).map(([char, info]): [string, string[]] => [char, [info.romaji, ...(info.variants ?? [])]]),
  ...Object.entries(smallHiragana).map(([char, romaji]): [string, string[]] => [char, [romaji]]),
])

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
 * están en kana (おとうさん → otousan). Lanza un error con caracteres desconocidos.
 */
export function romajiReadings(kana: string): string[] {
  let readings = ['']
  let doubleNext = false
  let prevWasN = false

  for (const key of syllables(kana)) {
    if (key === 'っ') {
      doubleNext = true
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
    prevWasN = key === 'ん'
  }
  return readings
}

/** Romaji principal (Hepburn): ねこ → neko. */
export function toRomaji(kana: string): string {
  return romajiReadings(kana)[0]
}

const normalize = (text: string) => text.trim().toLowerCase().replace(/[\s'’-]/g, '')

/** Compara lo que escribió el usuario con las lecturas aceptadas (sin importar mayúsculas, espacios ni apóstrofos). */
export function matchesReading(input: string, accepted: readonly string[]): boolean {
  const answer = normalize(input)
  return answer.length > 0 && accepted.some((r) => normalize(r) === answer)
}
