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
  /** Escribir la respuesta. Con `kana`, el romaji se convierte en kana al escribir (japonés). */
  | { type: 'type'; prompt: string; hint?: string; answers: string[]; kana?: boolean; explanation?: string }

export type GrammarLesson = {
  id: string
  /** Nivel (JLPT en japonés); sin indicar es el básico. */
  level?: 'N5' | 'N4' | 'N3'
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
