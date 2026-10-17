import { hiraganaChart, hiraganaInfo, hiraganaMnemonics } from './hiragana.ts'
import { katakanaChart, katakanaInfo, katakanaMnemonics, toHiragana, toKatakana } from './katakana.ts'
import hiraganaStrokes from './strokes/hiragana.json'
import katakanaStrokes from './strokes/katakana.json'
import { kanjiN3 } from './kanjiN3.ts'
import { kanjiN4 } from './kanjiN4.ts'
import type { ChartSection, Kana, KanaInfo, Script, StrokeData } from './types.ts'

// Generados por scripts/build-kanjivg.ts; la forma de los datos la valida content.test.ts.
// Los trazos de kana van en el paquete principal (son pocos). Los de kanji van en un
// archivo por nivel (N5, N4, N3) que se carga la primera vez que hace falta: loadKanjiStrokes().
const kanaStrokes = {
  ...(hiraganaStrokes as unknown as Record<string, StrokeData>),
  ...(katakanaStrokes as unknown as Record<string, StrokeData>),
}
type KanjiLevel = 'n5' | 'n4' | 'n3'
const kanjiFiles: Record<KanjiLevel, () => Promise<{ default: unknown }>> = {
  n5: () => import('./strokes/kanji-n5.json'),
  n4: () => import('./strokes/kanji-n4.json'),
  n3: () => import('./strokes/kanji-n3.json'),
}
const n4Chars = new Set(kanjiN4.map((k) => k.char))
const n3Chars = new Set(kanjiN3.map((k) => k.char))
const levelOf = (char: string): KanjiLevel => (n3Chars.has(char) ? 'n3' : n4Chars.has(char) ? 'n4' : 'n5')

const kanjiStrokes: Partial<Record<KanjiLevel, Record<string, StrokeData>>> = {}
const kanjiLoading: Partial<Record<KanjiLevel, Promise<void>>> = {}
const strokeListeners = new Set<() => void>()

function loadLevel(level: KanjiLevel): Promise<void> {
  kanjiLoading[level] ??= kanjiFiles[level]().then((m) => {
    kanjiStrokes[level] = m.default as Record<string, StrokeData>
    for (const listener of strokeListeners) listener()
  })
  return kanjiLoading[level]
}

/**
 * Carga (una sola vez por nivel) los trazos de los kanji pedidos; sin argumentos, los de
 * todos los niveles. Avisa a quien esté esperando cuando llegan.
 */
export function loadKanjiStrokes(chars?: readonly string[]): Promise<void> {
  const levels = chars ? new Set(chars.filter((c) => !(c in kanaStrokes)).map(levelOf)) : (Object.keys(kanjiFiles) as KanjiLevel[])
  return Promise.all([...levels].map(loadLevel)).then(() => undefined)
}

/** Avisa cuando llegan trazos de kanji (para useSyncExternalStore). */
export function subscribeStrokes(listener: () => void): () => void {
  strokeListeners.add(listener)
  return () => strokeListeners.delete(listener)
}

/** ¿Ya se pueden dibujar estos caracteres? Los kana siempre; los kanji, cuando se cargó su nivel. */
export const strokesReady = (chars: readonly string[]) => chars.every((c) => c in kanaStrokes || kanjiStrokes[levelOf(c)] !== undefined)

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

/** Trazos de un carácter. Los de kanji son undefined hasta que se carga su nivel. */
export function getStrokes(char: string): StrokeData | undefined {
  return kanaStrokes[char] ?? kanjiStrokes[levelOf(char)]?.[char]
}

/** La misma sílaba en el otro silabario (か ↔ カ), si existe. */
export function counterpart(kana: Kana): Kana | undefined {
  return kanaByChar.get(kana.script === 'hiragana' ? toKatakana(kana.char) : toHiragana(kana.char))
}
