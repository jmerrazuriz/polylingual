import { hiraganaChart, hiraganaInfo, hiraganaMnemonics } from './hiragana.ts'
import { katakanaChart, katakanaInfo, katakanaMnemonics, toHiragana, toKatakana } from './katakana.ts'
import hiraganaStrokes from './strokes/hiragana.json'
import katakanaStrokes from './strokes/katakana.json'
import type { ChartSection, Kana, KanaInfo, Script, StrokeData } from './types.ts'

// Generados por scripts/build-kanjivg.ts; la forma de los datos la valida content.test.ts.
const strokes = {
  ...(hiraganaStrokes as unknown as Record<string, StrokeData>),
  ...(katakanaStrokes as unknown as Record<string, StrokeData>),
}

export const charts: Record<Script, ChartSection[]> = { hiragana: hiraganaChart, katakana: katakanaChart }

function buildKana(script: Script, info: Record<string, KanaInfo>, mnemonics: Record<string, string>): Kana[] {
  return charts[script].flatMap((section) =>
    section.rows.flatMap((row) =>
      row.cells
        .filter((char): char is string => char !== null)
        .map((char) => ({
          ...info[char],
          mnemonic: mnemonics[char],
          id: `${script}_${char}`,
          char,
          script,
          group: section.group,
          parts: [...char],
        })),
    ),
  )
}

export const hiragana = buildKana('hiragana', hiraganaInfo, hiraganaMnemonics)
export const katakana = buildKana('katakana', katakanaInfo, katakanaMnemonics)
export const allKana = [...hiragana, ...katakana]

export const kanaByChar = new Map(allKana.map((k) => [k.char, k]))

export function getStrokes(char: string): StrokeData | undefined {
  return strokes[char]
}

/** La misma sílaba en el otro silabario (か ↔ カ), si existe. */
export function counterpart(kana: Kana): Kana | undefined {
  return kanaByChar.get(kana.script === 'hiragana' ? toKatakana(kana.char) : toHiragana(kana.char))
}
