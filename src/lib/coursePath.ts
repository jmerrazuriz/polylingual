import { germanPath, germanPathLevels } from '../courses/de/path.ts'
import { germanItemStatus } from '../courses/de/progress.ts'
import { type ItemStatus, japanesePath, japanesePathLevels, type PathItem, pathItemStatus, type PathLevel, type PathUnit } from './path.ts'
import type { ProgressData } from './progress/model.ts'

/** Lo que el recorrido necesita saber de cada curso. */
export type CoursePath = {
  units: PathUnit[]
  levels: PathLevel[]
  /** Estado de cada elemento del recorrido según el progreso del curso. */
  itemStatus: (p: ProgressData, everythingOpen: boolean) => (i: PathItem) => ItemStatus
  /** ¿Tiene test de nivelación? */
  hasPlacement: boolean
  /** Primera lección, para «empezar de cero». */
  firstLessonTo: string | null
  intro: string
  /** ¿Tiene lección del día y lección extra? */
  dailyLessons: boolean
}

const japanese: CoursePath = {
  units: japanesePath,
  levels: japanesePathLevels,
  itemStatus: pathItemStatus,
  hasPlacement: true,
  firstLessonTo: '/aprender/vocales',
  intro: 'Tu recorrido por el japonés, unidad por unidad. Cada parada agrupa unas pocas lecciones.',
  dailyLessons: true,
}

const german: CoursePath = {
  units: germanPath,
  levels: germanPathLevels,
  itemStatus: germanItemStatus,
  hasPlacement: true,
  firstLessonTo: '/gramatica/de-aussprache',
  intro: 'Ottos Weg: acompaña a Otto y a su amigo Hans Schmidt, del A1 al C2, con alemán para vivir y trabajar en Alemania.',
  dailyLessons: false,
}

export const coursePath = (courseId: string): CoursePath => (courseId === 'de' ? german : japanese)
