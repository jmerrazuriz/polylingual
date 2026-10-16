import { hiraganaChart, hiraganaInfo, hiraganaMnemonics } from './hiragana.ts'
import hiraganaStrokes from './strokes/hiragana.json'
import type { Kana, StrokeData } from './types.ts'

// Generado por scripts/build-kanjivg.ts; la forma de los datos la valida content.test.ts.
const strokes = hiraganaStrokes as unknown as Record<string, StrokeData>

export const hiragana: Kana[] = hiraganaChart.flatMap((section) =>
  section.rows.flatMap((row) =>
    row.cells
      .filter((char): char is string => char !== null)
      .map((char) => ({
        ...hiraganaInfo[char],
        mnemonic: hiraganaMnemonics[char],
        id: `hira_${hiraganaInfo[char].romaji}${char === 'ぢ' || char === 'づ' ? '_d' : ''}`,
        char,
        script: 'hiragana' as const,
        group: section.group,
        parts: [...char],
      })),
  ),
)

export const kanaByChar = new Map(hiragana.map((k) => [k.char, k]))

export function getStrokes(char: string): StrokeData | undefined {
  return strokes[char]
}
