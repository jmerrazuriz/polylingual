// Distractores parecidos a la respuesta. Se eligen por niveles: primero los candidatos más
// parecidos (mismo tema y clase de palabra), y solo si faltan se pasa al nivel siguiente.
// Así una pregunta por un número ofrece otros números, y una por un familiar, otros familiares.

import { shuffle } from './random.ts'

type Options<T> = {
  /** Grupos de candidatos, del más parecido al menos parecido. */
  tiers: readonly (readonly T[])[]
  /** Texto que se muestra como opción. */
  pick: (x: T) => string
  /** Dentro de un nivel, menor = más parecido (por ejemplo, diferencia de largo). */
  closeness?: (x: T) => number
  count?: number
  random?: () => number
}

/** La respuesta más `count - 1` distractores distintos, tomados de los niveles más parecidos. */
export function similarOptions<T>(answer: string, { tiers, pick, closeness, count = 4, random = Math.random }: Options<T>): string[] {
  const out = new Set<string>([answer])
  for (const tier of tiers) {
    if (out.size >= count) break
    let list = shuffle(tier, random)
    // Orden estable por cercanía (en 3 grupos), así se mantiene el azar entre los igual de cercanos.
    if (closeness) list = list.map((x, i) => ({ x, i, c: Math.min(2, closeness(x)) })).sort((a, b) => a.c - b.c || a.i - b.i).map((e) => e.x)
    for (const x of list) {
      if (out.size >= count) break
      const text = pick(x)
      if (text) out.add(text)
    }
  }
  return [...out]
}

/** ¿Es un número (en cifras o en palabras en español)? Para no mezclar números con otras cosas. */
const NUMBER_WORDS = /^(cero|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien|ciento|mil|millón|diez mil|cien mil)\b/i
export const looksNumeric = (text: string) => /^\d/.test(text.trim()) || NUMBER_WORDS.test(text.trim())
