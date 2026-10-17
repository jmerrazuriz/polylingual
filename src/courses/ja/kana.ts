import { hiraganaChart, hiraganaInfo, hiraganaMnemonics } from './hiragana.ts'
import { katakanaChart, katakanaInfo, katakanaMnemonics, toHiragana, toKatakana } from './katakana.ts'
import hiraganaStrokes from './strokes/hiragana.json'
import katakanaStrokes from './strokes/katakana.json'
import type { ChartSection, Kana, KanaInfo, Script, StrokeData } from './types.ts'

// Generados por scripts/build-kanjivg.ts; la forma de los datos la valida content.test.ts.
// Los trazos de kana van en el paquete principal (son pocos). Los de kanji (~300 KB) se
// cargan aparte la primera vez que se necesitan: loadKanjiStrokes().
const kanaStrokes = {
  ...(hiraganaStrokes as unknown as Record<string, StrokeData>),
  ...(katakanaStrokes as unknown as Record<string, StrokeData>),
}
let kanjiStrokes: Record<string, StrokeData> | null = null
let kanjiLoading: Promise<void> | null = null
const strokeListeners = new Set<() => void>()

/** Carga (una sola vez) los trazos de los kanji y avisa a quien esté esperando. */
export function loadKanjiStrokes(): Promise<void> {
  kanjiLoading ??= import('./strokes/kanji.json').then((m) => {
    kanjiStrokes = m.default as unknown as Record<string, StrokeData>
    for (const listener of strokeListeners) listener()
  })
  return kanjiLoading
}

/** Avisa cuando llegan los trazos de kanji (para useSyncExternalStore). */
export function subscribeStrokes(listener: () => void): () => void {
  strokeListeners.add(listener)
  return () => strokeListeners.delete(listener)
}

/** ¿Ya se pueden dibujar estos caracteres? Los kana siempre; los kanji, cuando se cargaron sus trazos. */
export const strokesReady = (chars: readonly string[]) => chars.every((c) => c in kanaStrokes || kanjiStrokes !== null)

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

/** Trazos de un carácter. Los de kanji son undefined hasta que termina loadKanjiStrokes(). */
export function getStrokes(char: string): StrokeData | undefined {
  return kanaStrokes[char] ?? kanjiStrokes?.[char]
}

/** La misma sílaba en el otro silabario (か ↔ カ), si existe. */
export function counterpart(kana: Kana): Kana | undefined {
  return kanaByChar.get(kana.script === 'hiragana' ? toKatakana(kana.char) : toHiragana(kana.char))
}
