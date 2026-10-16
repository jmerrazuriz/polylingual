// Escritura en kana desde un teclado normal: el romaji se convierte en hiragana
// mientras se escribe (como un IME). También compara respuestas en kana sin
// importar si están en hiragana o katakana.

import { hiraganaInfo, smallHiragana } from '../courses/ja/hiragana.ts'
import { katakanaInfo, LONG_VOWEL, toHiragana } from '../courses/ja/katakana.ts'
import { toRomaji } from './romaji.ts'

/** romaji → hiragana, con todas las variantes (shi/si, tsu/tu…) y los extendidos (fa → ふぁ). */
const table = new Map<string, string>()
for (const [char, info] of Object.entries(hiraganaInfo)) {
  for (const r of [info.romaji, ...(info.variants ?? [])]) if (!table.has(r)) table.set(r, char)
}
for (const [char, info] of Object.entries(katakanaInfo)) {
  const hira = toHiragana(char)
  // Solo los extendidos (ファ, ティ…): los demás ya están en la tabla de hiragana.
  if (!hiraganaInfo[hira]) for (const r of [info.romaji, ...(info.variants ?? [])]) if (!table.has(r)) table.set(r, hira)
}
// Pequeños escritos a mano: xa/la → ぁ, xtsu → っ, xya → ゃ…
for (const [char, romaji] of Object.entries(smallHiragana)) {
  if (romaji) for (const p of ['x', 'l']) table.set(p + romaji, char)
}
for (const [r, char] of [
  ['xa', 'ぁ'], ['xi', 'ぃ'], ['xu', 'ぅ'], ['xe', 'ぇ'], ['xo', 'ぉ'],
  ['xtu', 'っ'], ['xtsu', 'っ'], ['ltu', 'っ'], ['ltsu', 'っ'],
  ['wo', 'を'], ["n'", 'ん'], ['-', LONG_VOWEL],
] as const) table.set(r, char)
// La «n» sola se resuelve aparte: puede ser ん o el comienzo de な, に, にゃ…
table.delete('n')
table.delete('nn')

const MAX = Math.max(...[...table.keys()].map((k) => k.length))
const VOWELS = 'aeiou'

/**
 * Convierte romaji en hiragana. Lo que todavía no forma una sílaba (una consonante
 * suelta al final) queda en romaji, para seguir escribiendo: «tabe» → «たべ», «tab» → «たb».
 * Lo que no es romaji (kana, números) se deja como está.
 */
export function romajiToKana(input: string): string {
  const text = input.toLowerCase()
  let out = ''
  let i = 0
  while (i < text.length) {
    const ch = text[i]
    const next = text[i + 1]
    // Consonante doble → っ (kk, tt, pp…; también «tch» de matcha).
    if (next && ch === next && /[bcdfghjkmpqrstvwxyz]/.test(ch)) {
      out += 'っ'
      i++
      continue
    }
    if (ch === 't' && next === 'c' && text[i + 2] === 'h') {
      out += 'っ'
      i++
      continue
    }
    // «nn»: ん. Si sigue una vocal (konnichiha), la segunda n empieza la sílaba siguiente.
    if (ch === 'n' && next === 'n') {
      const after = text[i + 2]
      out += 'ん'
      i += after && (VOWELS.includes(after) || after === 'y') ? 1 : 2
      continue
    }
    // «n» antes de otra consonante (salvo y) → ん.
    if (ch === 'n' && next && !VOWELS.includes(next) && next !== 'y' && next !== "'") {
      out += 'ん'
      i++
      continue
    }
    let matched = false
    for (let len = Math.min(MAX, text.length - i); len > 0; len--) {
      const kana = table.get(text.slice(i, i + len))
      if (kana) {
        out += kana
        i += len
        matched = true
        break
      }
    }
    if (!matched) {
      out += input[i]
      i++
    }
  }
  return out
}

/** Al terminar de escribir, una «n» final suelta también es ん. */
export function finishKana(input: string): string {
  const kana = romajiToKana(input)
  return kana.endsWith('n') ? `${kana.slice(0, -1)}ん` : kana
}

/** ー → la vocal que alarga (こーひー → こおひい), para comparar con o sin ー. */
function expandLongVowels(hira: string): string {
  let out = ''
  for (const ch of hira) {
    if (ch === LONG_VOWEL && out) {
      let vowel = ''
      try {
        vowel = toRomaji(out.at(-1)!).slice(-1)
      } catch {
        vowel = ''
      }
      out += { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' }[vowel] ?? ''
    } else {
      out += ch
    }
  }
  return out
}

const normalizeKana = (text: string) => expandLongVowels(toHiragana(finishKana(text.trim())).replace(/[\s　、。・]/g, ''))

/** ¿La respuesta escrita (romaji o kana) coincide con alguna de las aceptadas? Hiragana y katakana dan igual. */
export function matchesKana(input: string, accepted: readonly string[]): boolean {
  const answer = normalizeKana(input)
  return answer.length > 0 && accepted.some((a) => normalizeKana(a) === answer)
}
