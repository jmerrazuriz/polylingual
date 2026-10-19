import type { ExamTasks } from '../euro.ts'
import type { GrammarExercise } from '../grammar.ts'
import type { CefrLevel } from './levels.ts'

// Tareas del simulacro CILS que no salen de los textos: estructuras de comunicación (gramática y
// léxico en contexto, como la prueba «analisi delle strutture di comunicazione»), escribir y hablar.

export type CilsTasks = ExamTasks & { structures: GrammarExercise[] }

const c = (prompt: string, answer: string, wrong: string[], explanation: string, whyWrong: Record<string, string>): GrammarExercise => ({
  type: 'choice',
  prompt,
  options: [answer, ...wrong],
  answer,
  explanation,
  whyWrong,
})

export const cilsTasks: Partial<Record<CefrLevel, CilsTasks>> = {
  A1: {
    structures: [
      c('Ciao, io ＿ Lucca e sono cileno.', 'mi chiamo', ['ho nome', 'chiamo', 'si chiama'], 'Para presentarse: mi chiamo + nombre.', { 'ho nome': 'Es un calco: el nombre se dice con chiamarsi.', chiamo: 'Falta el reflexivo «mi».', 'si chiama': '«si chiama» es de lui/lei.' }),
      c('Bruno ＿ ventinove anni.', 'ha', ['è', 'a', 'hanno'], 'La edad va con avere: Bruno ha ventinove anni.', { è: 'La edad no va con essere.', a: '«a» sin h es una preposición.', hanno: '«hanno» es plural.' }),
      c('Nel mio appartamento ＿ due camere.', 'ci sono', ['c’è', 'sono', 'ha'], 'Con un plural: ci sono.', { 'c’è': '«c’è» va con singular.', sono: 'Falta «ci»: ci sono.', ha: 'Sería «il mio appartamento ha due camere», sin «nel».' }),
      c('Vorrei ＿ caffè, per favore.', 'un', ['uno', 'una', 'un’'], '«caffè» es masculino y empieza por consonante: un caffè.', { uno: '«uno» va ante s + consonante o z.', una: '«caffè» es masculino.', 'un’': '«un’» es femenino y va ante vocal.' }),
      c('＿ zaino di Lucca è rosso.', 'Lo', ['Il', 'La', 'L’'], '«zaino» empieza por z: lo zaino.', { Il: '«il» no va ante z.', La: '«zaino» es masculino.', 'L’': '«l’» va ante vocal.' }),
      c('La mattina vado ＿ lavoro in bici.', 'al', ['a', 'nel', 'in il'], 'a + il = al: vado al lavoro.', { a: 'Con «lavoro» se usa la articulada: al lavoro.', nel: '«nel» es «en el», no «al».', 'in il': 'Las preposiciones se funden con el artículo.' }),
      c('Noi ＿ a Bologna da un mese.', 'abitiamo', ['abitamo', 'abitate', 'abitano'], 'Con noi: -iamo. Abitiamo.', { abitamo: 'Calco del español: es -iamo.', abitate: '«abitate» es de voi.', abitano: '«abitano» es de loro.' }),
      c('Scusi, ＿ dov’è la Questura?', 'sa', ['conosce', 'sai', 'può'], 'Un dato (dónde está algo): sapere. Con Lei: sa.', { conosce: 'conoscere es para personas y lugares, no para un dato.', sai: '«sai» es de tu; a un desconocido se le trata de Lei.', può: '«può» pediría otro verbo: può dirmi…?' }),
      c('Mi ＿ molto i tortellini.', 'piacciono', ['piace', 'piaccio', 'piacere'], 'Lo que gusta es plural: piacciono.', { piace: '«piace» va con singular.', piaccio: '«piaccio» es «yo gusto».', piacere: 'Es el infinitivo.' }),
      c('Le case di Bologna sono ＿.', 'rosse', ['rossi', 'rossa', 'rosso'], 'Femenino plural: rosse.', { rossi: 'Es masculino plural.', rossa: 'Es singular.', rosso: 'Es masculino singular.' }),
    ],
    form: {
      context: 'Bruno quiere inscribirse en un curso de cerámica en la biblioteca. Lee el mensaje y completa la ficha de inscripción por él.',
      text: 'Bruno Esposito abita in via del Pratello 12, a Bologna. Ha ventinove anni ed è napoletano. Fa il ceramista. È libero il martedì sera. Il suo numero di telefono è il 347 112 2334.',
      fields: [
        { label: 'Cognome', answers: ['Esposito'] },
        { label: 'Età', answers: ['29', 'ventinove', '29 anni', 'ventinove anni'] },
        { label: 'Professione', answers: ['ceramista', 'il ceramista'] },
        { label: 'Città', answers: ['Bologna'] },
        { label: 'Giorno libero', answers: ['martedì', 'il martedì', 'martedì sera', 'il martedì sera'] },
      ],
    },
    message: {
      prompt: 'Escribe un mensaje (40 a 50 palabras) a una amiga italiana, Giulia: estás en Florencia el fin de semana. Cuéntale dónde estás, qué tiempo hace, qué haces y cuándo vuelves.',
      checks: [
        'Saludo y despedida (Ciao Giulia! / Cara Giulia, … Un abbraccio, A presto)',
        'Dices dónde estás (Sono a Firenze…)',
        'Describes el tiempo (Fa caldo, c’è il sole, piove…)',
        'Cuentas al menos dos actividades en presente (Visito…, mangio…)',
        'Dices cuándo vuelves (Torno domenica sera / lunedì)',
        'Revisas artículos, dobles y tildes (il museo, lo zaino; bello, sette; è, città)',
      ],
      model:
        'Ciao Giulia! Sono a Firenze con Bruno per il fine settimana. Fa caldo e c’è il sole. La mattina visitiamo i musei e le chiese, il pomeriggio facciamo una passeggiata vicino all’Arno. La sera mangiamo la bistecca: buonissima! Torno a Bologna domenica sera. Un abbraccio, Lucca',
    },
    speaking: [
      'Parte 1 (conversación con el examinador): me presenté con frases completas: nombre, edad, nacionalidad, ciudad, trabajo y familia',
      'Parte 1: respondí preguntas simples sobre mi día y mi tiempo libre (Cosa fai il fine settimana?)',
      'Parte 2 (monólogo): describí una foto (una piazza, un mercato…) con c’è / ci sono y los colores',
      'Parte 2: dije qué me gusta y qué no con «mi piace / non mi piace»',
      'Usé Lei con el examinador (Lei, scusi, può ripetere?) y los saludos correctos',
      'Pronuncié las dobles consonantes y los sonidos ci/ce, chi/che, gli y gn',
    ],
  },
}
