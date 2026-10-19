// Niveles del curso de italiano (Marco Común Europeo de Referencia) y la historia que acompaña
// el recorrido. Ver PLAN_ITALIANO.md.

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export const cefrLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

/** Los nombres italianos de cada nivel: contatto, sopravvivenza, soglia, progresso, efficacia, padronanza. */
export const cefrTitles: Record<CefrLevel, string> = {
  A1: 'Contacto',
  A2: 'Supervivencia',
  B1: 'Umbral',
  B2: 'Progreso',
  C1: 'Eficacia',
  C2: 'Maestría',
}

/** Lo que se espera poder hacer al terminar cada nivel, con foco en vivir en Italia y obtener la nacionalidad. */
export const cefrGoals: Record<CefrLevel, string> = {
  A1: 'Presentarte, sacar el codice fiscale, inscribirte en el municipio, comprar y entender avisos y mensajes simples.',
  A2: 'Arrendar un departamento, ir al médico, hacer trámites en la Questura y hablar de tu trabajo. El nivel que pide la residencia de larga duración.',
  B1: 'Defenderte en el trabajo, entender tus derechos y escribir correos formales. El nivel que pide la nacionalidad italiana (CILS B1 Cittadinanza).',
  B2: 'Trabajar en italiano con soltura, leer prensa, argumentar y escribir textos de opinión.',
  C1: 'Estudiar y trabajar en contextos profesionales y académicos exigentes, y reconocer los italianos regionales.',
  C2: 'Entender y expresar matices como un nativo culto: literatura, registros, dialectos y variedades del italiano.',
}

/** Personajes de «La strada di Lucca», la historia del curso. */
export const characters = {
  lucca: {
    name: 'Lucca Ferrari',
    description: 'Restaurador chileno de Valparaíso, bisnieto de genoveses. Se va a trabajar a Bolonia y quiere la nacionalidad. Aprende italiano desde cero, igual que tú.',
  },
  bruno: {
    name: 'Bruno Esposito',
    description: 'Su amigo napolitano, compañero de departamento y de taller. Le enseña la ciudad, la cocina y el italiano de todos los días.',
  },
} as const
