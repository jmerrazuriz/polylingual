import type { SpeedQuestion } from '../euro.ts'
import { collapseDoubles } from '../../lib/italianInput.ts'
import { shuffle } from '../../lib/random.ts'
import type { ItalianWord } from './vocab.ts'

// «Doppia o no?»: las dobles consonantes cambian la palabra (pala ≠ palla). Pares mínimos con su
// significado, y palabras del vocabulario escritas con una doble de más o de menos.

/** Pares mínimos: [simple, su significado, doble, su significado]. */
export const MINIMAL_PAIRS: [string, string, string, string][] = [
  ['pala', 'pala (para cavar)', 'palla', 'pelota'],
  ['caro', 'caro; querido', 'carro', 'carreta'],
  ['sete', 'sed', 'sette', 'siete'],
  ['nono', 'noveno', 'nonno', 'abuelo'],
  ['papa', 'el Papa', 'pappa', 'papilla'],
  ['sono', 'soy; son', 'sonno', 'sueño (ganas de dormir)'],
  ['casa', 'casa', 'cassa', 'caja'],
  ['capello', 'pelo (un cabello)', 'cappello', 'sombrero'],
  ['note', 'notas', 'notte', 'noche'],
  ['copia', 'copia', 'coppia', 'pareja'],
  ['pena', 'pena, lástima', 'penna', 'lápiz pasta'],
  ['camino', 'chimenea', 'cammino', 'camino, caminata'],
  ['rosa', 'rosa', 'rossa', 'roja'],
  ['dita', 'dedos', 'ditta', 'empresa'],
  ['tuta', 'buzo (ropa deportiva)', 'tutta', 'toda'],
  ['polo', 'polo', 'pollo', 'pollo'],
  ['bruto', 'bruto', 'brutto', 'feo'],
  ['eco', 'eco', 'ecco', 'aquí está, he aquí'],
  ['fato', 'destino', 'fatto', 'hecho'],
  ['ala', 'ala', 'alla', 'a la'],
  ['sera', 'tarde, noche', 'serra', 'invernadero'],
  ['cola', 'cuela (colar)', 'colla', 'pegamento'],
  ['tufo', 'olor fuerte', 'tuffo', 'zambullida'],
  ['speso', 'gastado', 'spesso', 'seguido, a menudo'],
]

const why = (word: string, meaning: string, other: string, otherMeaning: string) =>
  `«${word}» (${meaning}) ${word.length > other.length ? 'lleva doble consonante' : 'va con una sola consonante'}; «${other}» es «${otherMeaning}».`

/** Una pregunta de pares mínimos: «sueño» → sonno (no sono). */
export function minimalPairQuestion(random = Math.random): SpeedQuestion {
  const [a, am, b, bm] = MINIMAL_PAIRS[Math.floor(random() * MINIMAL_PAIRS.length)]
  const [word, meaning, other, otherMeaning] = random() < 0.5 ? [a, am, b, bm] : [b, bm, a, am]
  return {
    prompt: meaning,
    hint: '¿Con doble consonante o sin ella?',
    options: shuffle([word, other], random),
    answer: word,
    speak: word,
    explanation: why(word, meaning, other, otherMeaning),
    whyWrong: { [other]: `«${other}» significa «${otherMeaning}».` },
  }
}

/** La palabra con una doble de más o de menos: «appartamento» frente a «apartamento». */
function misspell(word: string, random: () => number): string | null {
  const doubles = [...word.matchAll(/([b-df-hj-np-tv-z])\1/g)].map((m) => m.index!)
  const singles = [...word.matchAll(/[aeiouàèéìòù]([bcdfglmnprstvz])[aeiouàèéìòù]/g)].map((m) => m.index! + 1)
  if (doubles.length && (random() < 0.6 || !singles.length)) {
    const i = doubles[Math.floor(random() * doubles.length)]
    return word.slice(0, i) + word.slice(i + 1)
  }
  if (singles.length) {
    const i = singles[Math.floor(random() * singles.length)]
    return word.slice(0, i) + word[i] + word.slice(i)
  }
  return null
}

/** ¿Cuál está bien escrita? Con las palabras del pool (sustantivos, verbos y adjetivos de una palabra). */
export function doublesQuestion(words: readonly ItalianWord[], random = Math.random): SpeedQuestion | null {
  if (random() < 0.5) return minimalPairQuestion(random)
  const list = words.filter((w) => ['noun', 'verb', 'adj'].includes(w.pos) && /^[a-zàèéìòù]+$/.test(w.word) && w.word.length >= 4)
  if (!list.length) return minimalPairQuestion(random)
  for (let tries = 0; tries < 10; tries++) {
    const w = list[Math.floor(random() * list.length)]
    const wrong = misspell(w.word, random)
    if (!wrong || wrong === w.word || collapseDoubles(wrong) !== collapseDoubles(w.word)) continue
    const hasDouble = /([b-df-hj-np-tv-z])\1/.test(w.word)
    return {
      prompt: w.meaning,
      hint: '¿Cuál está bien escrita?',
      options: shuffle([w.word, wrong], random),
      answer: w.word,
      speak: w.word,
      explanation: `Se escribe «${w.word}»${hasDouble ? ', con la doble consonante' : ''}.`,
      whyWrong: { [wrong]: wrong.length > w.word.length ? `«${wrong}» tiene una doble de más.` : `A «${wrong}» le falta una doble.` },
    }
  }
  return minimalPairQuestion(random)
}
