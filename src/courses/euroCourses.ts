import { germanCourse } from './de/course.ts'
import type { EuroCourse } from './euro.ts'
import { frenchCourse } from './fr/course.ts'
import { italianCourse } from './it/course.ts'

/** Los cursos europeos (con niveles MCER, palabras con género, textos y simulacros). */
export const euroCourses: Record<string, EuroCourse> = { de: germanCourse, fr: frenchCourse, it: italianCourse }

export const isEuroCourse = (id: string) => id in euroCourses
