// Descarga los trazos de KanjiVG para cada kana y genera src/courses/ja/strokes/<script>.json.
// Uso: npm run data:strokes  (genera src/courses/ja/strokes/*.json)
//
// KanjiVG (https://kanjivg.tagaini.net) © Ulrich Apel, CC BY-SA 3.0.
// Los archivos descargados quedan en scripts/.cache (ignorado por git).

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { hiraganaInfo, smallHiragana } from '../src/courses/ja/hiragana.ts'
import { katakanaInfo, LONG_VOWEL, smallKatakana } from '../src/courses/ja/katakana.ts'
import { kanjiN5 } from '../src/courses/ja/kanji.ts'
import { kanjiN3 } from '../src/courses/ja/kanjiN3.ts'
import { kanjiN4 } from '../src/courses/ja/kanjiN4.ts'
import type { StrokeData } from '../src/courses/ja/types.ts'

const KANJIVG_TAG = 'r20260714'
const BASE_URL = `https://raw.githubusercontent.com/KanjiVG/kanjivg/${KANJIVG_TAG}/kanji`

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cacheDir = join(root, 'scripts', '.cache', 'kanjivg', KANJIVG_TAG)
const outDir = join(root, 'src', 'courses', 'ja', 'strokes')

const fileName = (char: string) => char.codePointAt(0)!.toString(16).padStart(5, '0') + '.svg'

async function loadSvg(char: string): Promise<string> {
  const path = join(cacheDir, fileName(char))
  try {
    return await readFile(path, 'utf8')
  } catch {
    const res = await fetch(`${BASE_URL}/${fileName(char)}`)
    if (!res.ok) throw new Error(`No se pudo descargar ${char} (${fileName(char)}): HTTP ${res.status}`)
    const svg = await res.text()
    await writeFile(path, svg)
    return svg
  }
}

function parseSvg(char: string, svg: string): StrokeData {
  const strokes: { n: number; d: string }[] = []
  for (const m of svg.matchAll(/<path\b[^>]*>/g)) {
    const id = m[0].match(/\bid="kvg:[0-9a-f]+-s(\d+)"/)
    const d = m[0].match(/\bd="([^"]+)"/)
    if (id && d) strokes.push({ n: Number(id[1]), d: d[1] })
  }
  strokes.sort((a, b) => a.n - b.n)

  const numbers: { n: number; x: number; y: number }[] = []
  for (const m of svg.matchAll(/<text transform="matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)">(\d+)<\/text>/g)) {
    numbers.push({ n: Number(m[3]), x: Number(m[1]), y: Number(m[2]) })
  }
  numbers.sort((a, b) => a.n - b.n)

  if (strokes.length === 0) throw new Error(`${char}: no se encontraron trazos`)
  if (numbers.length !== strokes.length) {
    throw new Error(`${char}: ${strokes.length} trazos pero ${numbers.length} números`)
  }
  return {
    strokes: strokes.map((s) => s.d),
    numbers: numbers.map((n) => [n.x, n.y]),
  }
}

async function build(name: string, chars: string[]) {
  const data: Record<string, StrokeData> = {}
  for (const char of chars) {
    data[char] = parseSvg(char, await loadSvg(char))
  }
  const out = join(outDir, `${name}.json`)
  await writeFile(out, JSON.stringify(data, null, 1) + '\n')
  console.log(`${name}: ${chars.length} caracteres → ${out}`)
}

await mkdir(cacheDir, { recursive: true })
await mkdir(outDir, { recursive: true })

const hiraganaChars = [
  ...Object.keys(hiraganaInfo).filter((c) => [...c].length === 1),
  ...Object.keys(smallHiragana),
]
await build('hiragana', hiraganaChars)

const katakanaChars = [
  ...new Set([...Object.keys(katakanaInfo), ...Object.keys(smallKatakana), LONG_VOWEL].flatMap((c) => [...c])),
]
await build('katakana', katakanaChars)

// Kanji por nivel: la app carga cada archivo la primera vez que hace falta uno de sus kanji.
await build('kanji-n5', kanjiN5.map((k) => k.char))
await build('kanji-n4', kanjiN4.map((k) => k.char))
await build('kanji-n3', kanjiN3.map((k) => k.char))
