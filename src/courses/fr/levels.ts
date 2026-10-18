// Niveles del curso de francés (Marco Común Europeo de Referencia) y la historia que acompaña
// el recorrido. Ver PLAN_FRANCES.md.

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

/** Lo que se espera poder hacer al terminar cada nivel, con foco en vivir, estudiar y trabajar en Francia. */
export const cefrGoals: Record<CefrLevel, string> = {
  A1: 'Presentarte, hacer compras, abrir una cuenta y entender avisos y mensajes simples.',
  A2: 'Arrendar un departamento, ir al médico, hacer trámites en la prefectura y hablar de tu trabajo. El nivel que pide la residencia plurianual.',
  B1: 'Postular a un trabajo, defenderte en una entrevista y en el día a día laboral. El nivel de la tarjeta de residente.',
  B2: 'Trabajar en francés con soltura, leer prensa, escribir correos formales y argumentar. El nivel de la nacionalidad y de muchas universidades.',
  C1: 'Estudiar y trabajar en contextos profesionales y académicos exigentes.',
  C2: 'Entender y expresar matices como un nativo culto: literatura, registro y variedades del francés.',
}

/** Personajes de «Le chemin de Camila», la historia del curso. */
export const characters = {
  camila: {
    name: 'Camila Rojas',
    description: 'Enfermera chilena que se va a trabajar a Lyon. Aprende francés desde cero, igual que tú.',
  },
  julien: {
    name: 'Julien Moreau',
    description: 'Vecino de Camila, profesor de liceo. Le ayuda con los trámites, la ciudad y el idioma.',
  },
} as const
