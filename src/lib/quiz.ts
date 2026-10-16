import { hiraganaConfusables } from '../content/hiragana.ts'
import { allKana, kanaByChar } from '../content/kana.ts'
import { katakanaConfusables, LONG_VOWEL } from '../content/katakana.ts'
import type { Kana, Word } from '../content/types.ts'
import { shuffle } from './random.ts'
import { wordRomaji, wordsReadableWith } from './words.ts'

/**
 * Elige `count` caracteres con romaji distinto: primero la respuesta, luego los
 * obligatorios y después relleno del pool. Se descartan los que se escriben
 * igual que otro elegido (じ y ぢ son ambos «ji»).
 */
function pickKana(answer: Kana, required: readonly Kana[], pool: readonly Kana[], count: number, random: () => number): Kana[] {
  const picked = new Map<string, Kana>([[answer.romaji, answer]])
  for (const kana of [...required, ...shuffle(pool, random)]) {
    if (picked.size >= count) break
    if (!picked.has(kana.romaji)) picked.set(kana.romaji, kana)
  }
  return shuffle([...picked.values()], random)
}

/** Opciones de romaji para una pregunta: la correcta más distractores del pool. */
export function romajiOptions(answer: Kana, pool: readonly Kana[], count = 4, random = Math.random): string[] {
  return pickKana(answer, [], pool, count, random).map((k) => k.romaji)
}

export type ReadingType = 'kana-to-romaji' | 'romaji-to-kana' | 'type-romaji' | 'type-word'

export type Question =
  | { type: 'kana-to-romaji'; kana: Kana; options: string[]; tip?: string }
  | { type: 'romaji-to-kana'; kana: Kana; options: Kana[]; tip?: string }
  | { type: 'type-romaji'; kana: Kana }
  | { type: 'type-word'; word: Word }

/** Lo que se muestra/lee en voz alta y la respuesta correcta de cada pregunta. */
export function questionPrompt(q: Question): { kana: string; answer: string } {
  if (q.type === 'type-word') return { kana: q.word.kana, answer: wordRomaji(q.word) }
  return { kana: q.kana.char, answer: q.kana.romaji }
}

export const readingTypes: { type: ReadingType; label: string }[] = [
  { type: 'kana-to-romaji', label: 'Kana → romaji' },
  { type: 'romaji-to-kana', label: 'Romaji → kana' },
  { type: 'type-romaji', label: 'Escribir romaji' },
  { type: 'type-word', label: 'Leer palabras' },
]

/** Palabras que se pueden leer con los caracteres del pool. */
export function wordsForPool(pool: readonly Kana[]): Word[] {
  const learned = new Set(pool.map((k) => k.char))
  if (learned.has('つ')) learned.add('っ')
  if (learned.has('ツ')) learned.add('ッ')
  if (pool.some((k) => k.script === 'katakana')) learned.add(LONG_VOWEL)
  return wordsReadableWith(learned)
}

type SessionOptions = { pool: readonly Kana[]; types: readonly ReadingType[]; count?: number; random?: () => number }

/** Sesión de lectura: `count` preguntas de los tipos elegidos sobre los caracteres del pool. */
export function buildReadingSession({ pool, types, count = 10, random = Math.random }: SessionOptions): Question[] {
  const words = shuffle(wordsForPool(pool), random)
  const available = types.filter((t) => t !== 'type-word' || words.length > 0)
  if (available.length === 0) available.push('kana-to-romaji')

  // Se recorren los caracteres desordenados; si hacen falta más preguntas, se repite.
  const order: Kana[] = []
  while (order.length < count) order.push(...shuffle(pool, random))

  return order.slice(0, count).map((kana, i): Question => {
    const type = available[Math.floor(random() * available.length)]
    switch (type) {
      case 'kana-to-romaji':
        return { type, kana, options: romajiOptions(kana, pool, 4, random) }
      case 'romaji-to-kana':
        return { type, kana, options: pickKana(kana, [], pool, 4, random) }
      case 'type-romaji':
        return { type, kana }
      case 'type-word':
        return { type, word: words[i % words.length] }
    }
  })
}

const confusables = [...hiraganaConfusables, ...katakanaConfusables]

/** Grupos de pares confusos cuyos caracteres están todos en el pool (o los del hiragana, si no hay ninguno). */
export function confusablesFor(pool: readonly Kana[]) {
  const chars = new Set(pool.map((k) => k.char))
  const inPool = confusables.filter((g) => g.chars.every((c) => chars.has(c)))
  return inPool.length > 0 ? inPool : hiraganaConfusables
}

/** Sesión de pares confusos: siempre aparecen juntos como opciones, con la clave para distinguirlos. */
export function buildConfusableSession({ pool, count = 10, random = Math.random }: Omit<SessionOptions, 'types'>): Question[] {
  const groups = confusablesFor(pool)

  return Array.from({ length: count }, (): Question => {
    const group = groups[Math.floor(random() * groups.length)]
    const members = group.chars.map((c) => kanaByChar.get(c)!)
    const kana = members[Math.floor(random() * members.length)]
    // Relleno del mismo silabario, para que la respuesta no se adivine por el estilo de trazo.
    const filler = allKana.filter((k) => k.group === 'basic' && k.script === kana.script)
    const options = pickKana(kana, members, filler, Math.max(members.length, 3), random)
    return random() < 0.5
      ? { type: 'kana-to-romaji', kana, options: options.map((k) => k.romaji), tip: group.tip }
      : { type: 'romaji-to-kana', kana, options, tip: group.tip }
  })
}
