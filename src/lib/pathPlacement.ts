// Test de nivelación del recorrido: bloques de preguntas de lo más fácil a lo más
// difícil. Cada bloque aprobado da por completadas sus unidades del recorrido; el
// test termina en el primer bloque que no se aprueba.

import { grammarByCourse } from '../courses/content.ts'
import type { GrammarExercise } from '../courses/grammar.ts'
import { counterLessons } from '../courses/ja/counters.ts'
import { allKana, kanaByChar } from '../courses/ja/kana.ts'
import { kanjiLessons } from '../courses/ja/kanji.ts'
import { lessons as kanaLessons } from '../courses/ja/lessons.ts'
import { vocabLessons } from '../courses/ja/vocab.ts'
import { japanesePath, type PathItem } from './path.ts'
import { romajiOptions } from './quiz.ts'
import { shuffle } from './random.ts'
import { lineMeaningExercise, readingById } from './readings.ts'
import { counterLessonExercises, kanjiLessonExercises } from './studyExercises.ts'
import { wordCardChar, wordMeaningExercise } from './vocabExercises.ts'

export type PlacementBlock = {
  id: string
  title: string
  /** Unidades del recorrido que se dan por completadas al aprobar el bloque. */
  unitIds: string[]
}

/** Bloques en orden; cada uno cubre unidades seguidas del recorrido. */
export const placementBlocks: PlacementBlock[] = [
  { id: 'hira-basico', title: 'Hiragana básico', unitIds: ['hiragana-basic'] },
  { id: 'hira-completo', title: 'Hiragana completo y primeras frases', unitIds: ['grammar-1', 'hiragana-dakuten', 'hiragana-yoon'] },
  { id: 'vocab-1', title: 'Primeras palabras y números', unitIds: ['vocab-1', 'counters-1'] },
  { id: 'katakana', title: 'Katakana y partículas', unitIds: ['katakana-basic', 'grammar-2', 'vocab-2'] },
  { id: 'kanji-1', title: 'Primeros kanji y contadores', unitIds: ['kanji-1', 'katakana-more', 'counters-2', 'grammar-3', 'vocab-3'] },
  { id: 'verbos', title: 'Kanji, verbos y katakana extendido', unitIds: ['kanji-2', 'grammar-4', 'lectura-1', 'katakana-extended', 'vocab-kata', 'vocab-4'] },
  { id: 'forma-te', title: 'Formas て, ない y た', unitIds: ['kanji-3', 'grammar-5', 'lectura-2', 'vocab-5'] },
  { id: 'n5', title: 'Cierre del N5', unitIds: ['kanji-4', 'grammar-6', 'lectura-3', 'vocab-6', 'grammar-7', 'vocab-7', 'lectura-4'] },
  { id: 'n4-gramatica', title: 'N4: formas, condicionales, vocabulario y kanji', unitIds: ['grammar-n4-1', 'vocab-n4-1', 'kanji-n4-1', 'grammar-n4-2', 'vocab-n4-2', 'kanji-n4-2', 'lectura-n4-1'] },
  { id: 'n4-gramatica-2', title: 'N4: propósito, keigo, vocabulario y kanji', unitIds: ['grammar-n4-3', 'vocab-n4-3', 'kanji-n4-3', 'grammar-n4-4', 'vocab-n4-4', 'kanji-n4-4', 'vocab-n4-5', 'kanji-n4-5', 'lectura-n4-2'] },
  { id: 'n3-gramatica-1', title: 'N3: gramática I y II, kanji y vocabulario', unitIds: ['grammar-n3-1', 'grammar-n3-2', 'kanji-n3-1', 'vocab-n3-1', 'lectura-n3-1'] },
  { id: 'n3-gramatica-2', title: 'N3: gramática III y IV, kanji y vocabulario', unitIds: ['grammar-n3-3', 'grammar-n3-4', 'kanji-n3-2', 'vocab-n3-2', 'lectura-n3-2'] },
  { id: 'n3-kanji-2', title: 'N3: más kanji y vocabulario', unitIds: ['kanji-n3-3', 'kanji-n3-4', 'kanji-n3-5', 'vocab-n3-3', 'vocab-n3-4'] },
  { id: 'n3-gramatica-3', title: 'N3: gramática V y VI', unitIds: ['grammar-n3-5', 'grammar-n3-6'] },
  {
    id: 'n3-kanji-3',
    title: 'N3: tercera tanda de kanji y vocabulario',
    unitIds: ['kanji-n3-6', 'kanji-n3-7', 'kanji-n3-8', 'vocab-n3-5', 'vocab-n3-6', 'vocab-n3-7', 'vocab-n3-8'],
  },
  { id: 'n3-kanji-4', title: 'N3: cuarta tanda de kanji', unitIds: ['kanji-n3-9', 'kanji-n3-10', 'kanji-n3-11'] },
  { id: 'n3-gramatica-4', title: 'N3: gramática VII y VIII', unitIds: ['grammar-n3-7', 'grammar-n3-8'] },
]

/** Preguntas por bloque y aciertos para aprobarlo (80 %). */
export const QUESTIONS_PER_BLOCK = 8
export const passMark = (total: number) => Math.ceil(total * 0.8)

export const blockItems = (block: PlacementBlock): PathItem[] =>
  block.unitIds.flatMap((id) => japanesePath.find((u) => u.id === id)!.stops.flatMap((s) => s.items))

/** Una pregunta sobre un elemento del recorrido (los repasos de unidad no tienen). */
export function itemQuestion(item: PathItem, random = Math.random): GrammarExercise | null {
  const pick = <T>(list: readonly T[]) => list[Math.floor(random() * list.length)]
  switch (item.kind) {
    case 'kana': {
      const kana = kanaByChar.get(pick(kanaLessons.find((l) => l.id === item.id)!.chars))!
      const pool = allKana.filter((k) => k.script === kana.script && k.group === kana.group)
      return { type: 'choice', prompt: `¿Cómo se lee «${kana.char}»?`, options: romajiOptions(kana, pool, 4, random), answer: kana.romaji }
    }
    case 'grammar': {
      // Sin ejercicios para escribir: el test es de elegir, para que sea rápido.
      const exercises = grammarByCourse.ja.find((g) => g.id === item.id)!.exercises.filter((e) => e.type !== 'type')
      return pick(exercises)
    }
    case 'counters':
      return counterLessonExercises(counterLessons.find((l) => l.id === item.id)!, random)[0]
    case 'kanji':
      return kanjiLessonExercises(kanjiLessons.find((l) => l.id === item.id)!, random)[0]
    case 'vocab':
      return wordMeaningExercise(pick(vocabLessons.find((l) => l.id === item.id)!.words), random)
    case 'reading':
      return lineMeaningExercise(readingById.get(item.id)!, random)
    case 'unit':
    case 'exam':
      return null
  }
}

/**
 * Preguntas de un bloque: elementos al azar de sus unidades, repartidos entre los
 * distintos tipos (kana, gramática, kanji…) para que el bloque los pruebe todos.
 */
export function buildBlock(block: PlacementBlock, random = Math.random): GrammarExercise[] {
  const items = blockItems(block).filter((i) => i.kind !== 'unit')
  const byKind = [...new Set(items.map((i) => i.kind))].map((kind) => shuffle(items.filter((i) => i.kind === kind), random))
  const picked: PathItem[] = []
  for (let round = 0; picked.length < QUESTIONS_PER_BLOCK && round < items.length; round++) {
    for (const list of byKind) if (list[round] && picked.length < QUESTIONS_PER_BLOCK) picked.push(list[round])
  }
  return shuffle(
    picked.map((i) => itemQuestion(i, random)).filter((q): q is GrammarExercise => q !== null),
    random,
  )
}

/** Lo que hay que marcar como hecho al aprobar unos bloques. */
export type PlacementResult = {
  lessons: { id: string; chars: string[] }[]
  grammar: string[]
  units: string[]
}

export function placementResult(blocks: PlacementBlock[]): PlacementResult {
  const result: PlacementResult = { lessons: [], grammar: [], units: [] }
  for (const item of blocks.flatMap(blockItems)) {
    switch (item.kind) {
      case 'kana':
        result.lessons.push({ id: item.id, chars: kanaLessons.find((l) => l.id === item.id)!.chars })
        break
      case 'kanji':
        result.lessons.push({ id: item.id, chars: kanjiLessons.find((l) => l.id === item.id)!.chars })
        break
      case 'vocab':
        result.lessons.push({ id: item.id, chars: vocabLessons.find((l) => l.id === item.id)!.words.map(wordCardChar) })
        break
      case 'counters':
      case 'reading':
        result.lessons.push({ id: item.id, chars: [] })
        break
      case 'grammar':
        result.grammar.push(item.id)
        break
      case 'unit':
        result.units.push(item.id)
        break
    }
  }
  return result
}

/** ¿Todavía no empezó el recorrido? (ninguna lección, gramática ni repaso hecho) */
export const hasNotStarted = (p: { lessons: object; grammar: object; units: object }) =>
  Object.keys(p.lessons).length === 0 && Object.keys(p.grammar).length === 0 && Object.keys(p.units).length === 0

type Done = { lessons: object; grammar: object; units: object }

const itemDone = (p: Done, item: PathItem) =>
  item.kind === 'grammar' ? item.id in p.grammar : item.kind === 'unit' ? item.id in p.units : item.id in p.lessons

/**
 * Primer bloque con algo sin hacer: el test empieza ahí (lo anterior ya está completo).
 * Devuelve placementBlocks.length si ya está todo hecho.
 */
export function firstPendingBlock(p: Done): number {
  const i = placementBlocks.findIndex((b) => !blockItems(b).every((item) => itemDone(p, item)))
  return i === -1 ? placementBlocks.length : i
}
