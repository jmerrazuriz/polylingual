// Niveles del curso de alemán (Marco Común Europeo de Referencia) y la historia que acompaña
// el recorrido. Ver PLAN_ALEMAN.md.

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export const cefrLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export const cefrTitles: Record<CefrLevel, string> = {
  A1: 'Principiante',
  A2: 'Elemental',
  B1: 'Intermedio',
  B2: 'Intermedio alto',
  C1: 'Avanzado',
  C2: 'Maestría',
}

/** Lo que se espera poder hacer al terminar cada nivel, con foco en vivir y trabajar en Alemania. */
export const cefrGoals: Record<CefrLevel, string> = {
  A1: 'Presentarte, hacer compras, inscribirte en la ciudad (Anmeldung) y entender avisos simples.',
  A2: 'Arrendar una vivienda, ir al médico, hablar de tu trabajo y resolver trámites sencillos.',
  B1: 'Postular a un trabajo, defenderte en una entrevista y en el día a día laboral. El nivel que piden para trabajar y residir.',
  B2: 'Trabajar en alemán con soltura, leer prensa, escribir correos formales y argumentar.',
  C1: 'Estudiar en una universidad alemana y manejar textos profesionales y académicos.',
  C2: 'Entender y expresar matices como un nativo culto: literatura, registro y variedades.',
}

/** Personajes de «Ottos Weg», la historia del curso. */
export const characters = {
  otto: {
    name: 'Otto',
    description: 'Llega a Alemania para vivir y trabajar. Aprende alemán desde cero, igual que tú.',
  },
  hans: {
    name: 'Hans Schmidt',
    description: 'Amigo de Otto en Alemania. Le ayuda con los trámites, la vivienda y el trabajo.',
  },
} as const
