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
  A2: {
    structures: [
      c('Ieri mattina Lucca ＿ in Questura.', 'è andato', ['ha andato', 'è andata', 'va'], 'andare usa essere y concuerda: Lucca è andato.', { 'ha andato': 'andare va con essere.', 'è andata': 'Lucca es hombre: andato.', va: 'Con «ieri mattina» va el pasado.' }),
      c('Quando ero piccolo, ＿ sempre al mare con i nonni.', 'andavo', ['sono andato', 'vado', 'andrò'], 'Una costumbre en el pasado: imperfetto.', { 'sono andato': 'Una costumbre (sempre, da piccolo) va en imperfetto.', vado: 'Es presente.', andrò: 'Es futuro.' }),
      c('Hai visto Giulia? — Sì, ＿ vista ieri.', 'l’ho', ['le ho', 'la ho', 'gli ho'], 'la + ho = l’ho, y el participio concuerda: vista.', { 'le ho': '«le» es plural o indirecto; Giulia es objeto directo: la.', 'la ho': 'la se apostrofa ante ho: l’ho.', 'gli ho': '«gli» es indirecto (a él).' }),
      c('Quanti figli hai? — ＿ ho due.', 'Ne', ['Li', 'Ci', 'Gli'], 'Con una cantidad: ne.', { Li: 'Con una cantidad se usa ne.', Ci: '«ci» es para lugares.', Gli: '«gli» es indirecto.' }),
      c('Vivo a Bologna ＿ due anni.', 'da', ['fa', 'per', 'tra'], 'Presente + da: algo que empezó y sigue.', { fa: '«fa» va detrás del tiempo y con un pasado.', per: '«per» marca una duración cerrada.', tra: '«tra» es «dentro de», hacia el futuro.' }),
      c('Scusi, ＿ dirmi dov’è la farmacia?', 'potrebbe', ['potrà', 'potresti', 'può essere'], 'Petición cortés con Lei: condicional.', { potrà: 'Es futuro; para pedir con cortesía, condicional.', potresti: '«potresti» es de tu; a un desconocido, Lei.', 'può essere': '«può essere» es «puede ser».' }),
      c('Domani, se non piove, ＿ al mare.', 'andremo', ['siamo andati', 'andavamo', 'andassimo'], 'Un plan para mañana: futuro.', { 'siamo andati': 'Es pasado.', andavamo: 'Es imperfetto: pasado.', andassimo: 'Es subjuntivo imperfecto: no va aquí.' }),
      c('Questo è il ristorante ＿ ti ho parlato.', 'di cui', ['che', 'cui', 'dove'], 'parlare di qualcosa → di cui.', { che: 'Con preposición (parlare di) se usa cui.', cui: 'Falta la preposición: di cui.', dove: 'No se habla «dove»: se habla «di» algo.' }),
      c('Napoli è più grande ＿ Bologna.', 'di', ['che', 'come', 'quanto'], 'Entre dos nombres: più… di.', { che: '«che» compara adjetivos o verbos, o va ante una preposición.', come: '«come» es para la igualdad.', quanto: '«quanto» es para la igualdad.' }),
      c('Signora, non ＿! È tutto in regola.', 'si preoccupi', ['preoccuparti', 'ti preoccupi', 'si preoccupa'], 'Imperativo negativo de Lei: non si preoccupi.', { preoccuparti: 'Es de tu.', 'ti preoccupi': 'Es el presente de tu.', 'si preoccupa': 'Es el presente de lei.' }),
      c('In questo negozio ＿ prodotti biologici.', 'si vendono', ['si vende', 'se vendono', 'vendesi'], 'si impersonal con un plural: si vendono.', { 'si vende': '«prodotti» es plural: si vendono.', 'se vendono': 'Se escribe si.', vendesi: '«vendesi» se usa solo en avisos y con singular.' }),
      c('Telefono a Giulia e ＿ dico tutto.', 'le', ['la', 'gli', 'lo'], 'dire a qualcuno: indirecto. A ella: le.', { la: 'dire a qualcuno lleva indirecto: le.', gli: '«gli» es a él.', lo: '«lo» es directo.' }),
    ],
    form: {
      context: 'Giulia, una amiga de Lucca, quiere inscribirse en un gimnasio. Lee lo que cuenta y completa la ficha por ella.',
      text: 'Mi chiamo Giulia Romano. Sono nata a Firenze il 14 maggio 1996 e abito a Bologna, in via Saragozza 40. Lavoro come infermiera all’ospedale Sant’Orsola, quindi posso venire in palestra solo la sera, dopo le sette. Vorrei fare il corso di nuoto.',
      fields: [
        { label: 'Luogo di nascita', answers: ['Firenze'] },
        { label: 'Data di nascita', answers: ['14/05/1996', '14 maggio 1996', '14.05.1996', '14-05-1996', '14/5/1996'] },
        { label: 'Professione', answers: ['infermiera', 'l’infermiera'] },
        { label: 'Corso', answers: ['nuoto', 'il nuoto', 'corso di nuoto', 'il corso di nuoto'] },
        { label: 'Orario preferito', answers: ['sera', 'la sera', 'di sera', 'dopo le sette', 'dopo le 19', 'la sera dopo le sette'] },
      ],
    },
    message: {
      prompt:
        'Escribe un correo (50 a 70 palabras) a la señora Conti, tu jefa en el taller: ayer te enfermaste y hoy no puedes ir a trabajar. Cuéntale qué te pasó, qué te dijo el médico y cuándo vuelves, y discúlpate.',
      checks: [
        'Saludo y despedida formales (Gentile signora Conti, … Cordiali saluti)',
        'Usas Lei (Le scrivo, Le mando, La ringrazio)',
        'Cuentas qué pasó con el passato prossimo (Ieri sono stato male, sono andato dal medico…)',
        'Describes cómo estabas con el imperfetto (Avevo la febbre, ero molto stanco…)',
        'Dices qué te dijo el médico y cuándo vuelves (Il medico mi ha detto di… Tornerò lunedì)',
        'Te disculpas con cortesía (Mi dispiace per il disagio)',
        'Revisas los auxiliares y la concordancia (sono andato/a, ho preso)',
      ],
      model:
        'Gentile signora Conti, Le scrivo perché oggi non posso venire in laboratorio. Ieri sera sono stato male: avevo la febbre alta e mal di gola. Stamattina sono andato dal medico, che mi ha detto di restare a casa tre giorni. Le mando il certificato via email. Tornerò lunedì mattina. Mi dispiace per il disagio. Cordiali saluti, Lucca Ferrari',
    },
    speaking: [
      'Parte 1 (conversación con el examinador): hablé de mi trabajo, mi casa y mi tiempo libre con frases completas',
      'Parte 1: conté qué hice el fin de semana pasado, con el passato prossimo y el auxiliar correcto',
      'Parte 2 (monólogo): conté cómo era mi vida cuando era chico, con el imperfetto (abitavo, andavo, mi piaceva…)',
      'Parte 2: hablé de un plan para el futuro (L’anno prossimo andrò…, Mi piacerebbe…)',
      'Juego de roles: pedí algo con cortesía en una tienda, un banco o la Questura (Vorrei…, Potrebbe…?)',
      'Usé bien los pronombres (lo, la, gli, le, ne, ci) y las preposiciones articuladas (dal medico, in banca, al mare)',
      'Pronuncié las dobles consonantes y los grupos gli, gn, sc',
    ],
  },
}
