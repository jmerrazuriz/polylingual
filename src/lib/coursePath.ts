import { germanPath, germanPathLevels } from '../courses/de/path.ts'
import { germanItemStatus } from '../courses/de/progress.ts'
import { frenchPath, frenchPathLevels } from '../courses/fr/path.ts'
import { frenchItemStatus } from '../courses/fr/progress.ts'
import { italianPath, italianPathLevels } from '../courses/it/path.ts'
import { italianItemStatus } from '../courses/it/progress.ts'
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
  /** ¿Tiene lección extra (sin límite)? La lección del día la tienen todos los cursos. */
  extraLessons: boolean
}

const japanese: CoursePath = {
  units: japanesePath,
  levels: japanesePathLevels,
  itemStatus: pathItemStatus,
  hasPlacement: true,
  firstLessonTo: '/aprender/vocales',
  intro: 'Tu recorrido por el japonés, unidad por unidad. Cada parada agrupa unas pocas lecciones.',
  extraLessons: true,
}

const german: CoursePath = {
  units: germanPath,
  levels: germanPathLevels,
  itemStatus: germanItemStatus,
  hasPlacement: true,
  firstLessonTo: '/gramatica/de-aussprache',
  intro: 'Ottos Weg: acompaña a Otto y a su amigo Hans Schmidt, del A1 al C2, con alemán para vivir y trabajar en Alemania.',
  extraLessons: false,
}

const french: CoursePath = {
  units: frenchPath,
  levels: frenchPathLevels,
  itemStatus: frenchItemStatus,
  hasPlacement: true,
  firstLessonTo: '/gramatica/fr-alphabet',
  intro: 'Le chemin de Camila: acompaña a Camila, enfermera chilena en Lyon, y a su vecino Julien Moreau, del A1 al C2.',
  extraLessons: false,
}

const italian: CoursePath = {
  units: italianPath,
  levels: italianPathLevels,
  itemStatus: italianItemStatus,
  hasPlacement: true,
  firstLessonTo: '/gramatica/it-alfabeto',
  intro: 'La strada di Lucca: acompaña a Lucca, restaurador chileno en Bolonia, y a su amigo Bruno Esposito, del A1 al C2.',
  extraLessons: false,
}

const paths: Record<string, CoursePath> = { ja: japanese, de: german, fr: french, it: italian }

export const coursePath = (courseId: string): CoursePath => paths[courseId] ?? japanese
