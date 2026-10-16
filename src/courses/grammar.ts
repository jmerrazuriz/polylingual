// Tipos de las lecciones de gramática, comunes a todos los cursos (idiomas).

export type GrammarExample = {
  /** Frase en el idioma del curso. */
  text: string
  /** Transcripción para leerla (romaji en japonés). */
  reading?: string
  meaning: string
}

export type GrammarExercise =
  /** Completar el hueco «＿» eligiendo una opción. */
  | { type: 'choice'; prompt: string; hint?: string; options: string[]; answer: string; explanation?: string }
  /** Elegir qué significa la frase. */
  | { type: 'meaning'; text: string; options: string[]; answer: string }
  /** Ordenar las palabras para formar la frase. */
  | { type: 'order'; meaning: string; answer: string[] }

export type GrammarLesson = {
  id: string
  title: string
  /** Una línea para la lista de lecciones. */
  summary: string
  /** Estructura en una línea, p. ej. «A は B です». */
  pattern: string
  /** Párrafos de explicación (se admite **negrita**). */
  explanation: string[]
  examples: GrammarExample[]
  exercises: GrammarExercise[]
}
