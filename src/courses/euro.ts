import type { PairItem } from '../lib/pairs.ts'
import type { ItemStatus, PathItem, PathUnit } from '../lib/path.ts'
import type { ProgressData } from '../lib/progress/model.ts'
import type { GrammarExercise, GrammarLesson } from './grammar.ts'
import type { ReadingText } from './reading.ts'

// Lo común a los cursos de idiomas europeos (alemán, francés e italiano): niveles MCER, palabras con
// género, textos de una historia, simulacro por nivel, juegos y práctica. Cada curso llena un
// `EuroCourse` y las pantallas compartidas (features/euro) lo usan.

export type EuroLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export const euroLevels: EuroLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export type EuroWord = {
  id: string
  word: string
  pos: 'noun' | 'verb' | 'adj' | 'adv' | 'phrase'
  gender?: string
  meaning: string
  theme: string
  level: EuroLevel
}

export type EuroVocabLesson = { id: string; title: string; theme: string; level: EuroLevel; words: EuroWord[] }

export type Progress = Pick<ProgressData, 'lessons' | 'grammar' | 'records'> & { unlockAll?: boolean }

/** Una pregunta de juego rápido: enunciado, opciones y respuesta. */
export type SpeedQuestion = {
  prompt: string
  hint?: string
  options: string[]
  answer: string
  speak?: string
  /** Mantener el orden de las opciones (der/die/das, un/une). */
  keepOrder?: boolean
  /** Por qué la respuesta es esa (se muestra al fallar y, breve, al acertar). */
  explanation?: string
  /** Qué es cada opción incorrecta. */
  whyWrong?: Record<string, string>
}

export type EuroGame = {
  id: string
  glyph: string
  title: string
  text: string
  instructions: string
  kind: 'pairs' | 'audio' | 'speed'
  record: (n: number) => string
  pairs?: (words: EuroWord[]) => PairItem[]
  /** Juego rápido: devuelve una pregunta nueva (null si con estas palabras no se puede). */
  question?: (words: EuroWord[]) => SpeedQuestion | null
}

export type PracticeModeInfo = { mode: string; glyph: string; title: string; text: string }

/** Escribir y hablar de un simulacro: lo de leer y escuchar sale de los textos del nivel. */
export type FormTask = { context: string; text: string; fields: { label: string; answers: string[] }[] }
export type MessageTask = { prompt: string; checks: string[]; model: string }
export type ExamTasks = { form: FormTask; message: MessageTask; speaking: string[] }

/** Los idiomas europeos de la app. Sumar uno nuevo empieza aquí. */
export type EuroLang = 'de' | 'fr' | 'it'

export type EuroCourse = {
  id: EuroLang
  /** Código del idioma para `lang` y las letras especiales. */
  lang: EuroLang
  /** «alemán», «francés», «italiano». */
  name: string
  /** «Ottos Weg», «Le chemin de Camila», «La strada di Lucca». */
  story: string
  /** Una línea para la página de textos. */
  textsIntro: string
  /** Una línea para la página de palabras. */
  vocabIntro: string
  /** «Goethe-Zertifikat», «DELF», «CILS». */
  examName(level: EuroLevel): string
  examPath(level: EuroLevel): string
  /** El color de cada género y su artículo, para la leyenda de las lecciones. */
  genders: { gender: string; article: string; className: string }[]
  /** Explicación al abrir una lección de palabras. */
  lessonIntro(words: EuroWord[]): string
  themes: { id: string; title: string; level: EuroLevel }[]
  vocabLessons: EuroVocabLesson[]
  vocabLessonById: Map<string, EuroVocabLesson>
  texts: ReadingText[]
  grammar: GrammarLesson[]
  path: PathUnit[]
  wordCard(w: EuroWord): string
  /** Prefijo de las tarjetas de repaso de palabras («dw-», «fw-»). */
  wordCardPrefix: string
  /** Ficha de la palabra: «der Tisch, die Tische», «l’école (f.)». */
  nounLine(w: EuroWord): string
  withArticle(w: EuroWord): string
  speakWord(w: EuroWord): string
  genderClass(w: EuroWord): string
  lessonExercises(words: EuroWord[]): GrammarExercise[]
  meaningExercise(w: EuroWord): GrammarExercise
  sayExercise(w: EuroWord): GrammarExercise
  /** Glosario de las lecturas. */
  lookup(token: string): { word: EuroWord; form?: string } | undefined
  unlockedIds(p: Progress, everythingOpen: boolean, kind: PathItem['kind']): Set<string>
  itemDone(p: Progress, i: PathItem): boolean
  itemStatus(p: Progress, everythingOpen: boolean): (i: PathItem) => ItemStatus
  wordPool(p: Progress, everythingOpen: boolean, levels?: readonly EuroLevel[]): EuroWord[]
  poolLevels(p: Progress, everythingOpen: boolean): EuroLevel[]
  games: EuroGame[]
  practiceModes: PracticeModeInfo[]
  practiceSession(mode: string, words: readonly EuroWord[], count?: number): GrammarExercise[]
  /** Letras especiales y comparación de respuestas escritas. */
  check(input: string, answers: string[]): 'ok' | 'almost' | 'wrong'
  almostNote: string
}
