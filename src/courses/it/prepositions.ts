import type { SpeedQuestion } from '../euro.ts'
import { shuffle } from '../../lib/random.ts'
import { articleReason, articulated, type Definite, definiteArticle, join, type Preposition } from './engine/articles.ts'
import { type ItalianWord, nounOf } from './vocab.ts'
import { hasArticleQuestion } from './vocabExercises.ts'

// «Preposizioni» (desde A2): qué preposición pide cada lugar o expresión (in banca, dal medico,
// al mare, a Roma) y cómo se funden con el artículo (su + il = sul, in + gli = negli).

/** Usos: [frase con ＿, respuesta, { opción incorrecta: por qué no }, explicación]. */
const USES: [string, string, Record<string, string>, string][] = [
  ['Vado ＿ medico.', 'dal', { al: 'A la consulta de una persona se va con da.', in: 'Con personas se usa da.', nel: '«nel medico» sería «dentro del médico».' }, 'Persona → da: dal medico, dal dentista, da Bruno.'],
  ['Lavoro ＿ banca.', 'in', { alla: 'Con banca se usa in, sin artículo.', a: 'Con banca se usa in.', da: '«da» es para personas.' }, 'in banca, in posta, in farmacia, in ufficio.'],
  ['Stasera andiamo ＿ cinema.', 'al', { in: '«cinema» va con a + artículo: al cinema.', nel: '«nel cinema» es «dentro del cine».', da: '«da» es para personas.' }, 'al cinema, al mare, al bar.'],
  ['Abito ＿ Bologna.', 'a', { in: 'Con ciudades se usa a.', nella: 'Con ciudades se usa a, sin artículo.', da: '«da» es para personas.' }, 'Ciudad → a: a Bologna, a Roma.'],
  ['Lucca è nato ＿ Cile.', 'in', { a: 'Con países se usa in.', nel: 'Con países sin adjetivo, in sin artículo.', da: '«da» marca el origen de un movimiento.' }, 'País → in: in Cile, in Italia.'],
  ['Vado ＿ Stati Uniti.', 'negli', { in: 'Los países en plural llevan artículo: negli Stati Uniti.', agli: 'Con países se usa in: negli.', nei: '«Stati» empieza por s + consonante: negli.' }, 'in + gli = negli Stati Uniti.'],
  ['Vivo ＿ Toscana.', 'in', { a: 'Con regiones se usa in.', nella: 'Las regiones van con in, sin artículo.', da: '«da» es para personas.' }, 'Región → in: in Toscana, in Sicilia.'],
  ['Torno ＿ casa alle sei.', 'a', { in: 'Se dice a casa.', alla: 'a casa, sin artículo.', da: '«da casa» es «desde la casa».' }, 'a casa, a scuola, a letto.'],
  ['Vado al lavoro ＿ treno.', 'in', { a: 'Los medios de transporte van con in; a solo en «a piedi».', nel: 'in treno, sin artículo.', per: '«per» no se usa con medios de transporte.' }, 'in treno, in macchina, in bici.'],
  ['Vado al lavoro ＿ piedi.', 'a', { in: 'Se dice a piedi.', con: 'Se dice a piedi.', per: 'Se dice a piedi.' }, 'a piedi: la excepción entre los medios de transporte.'],
  ['Il treno ＿ Roma parte alle otto.', 'per', { a: 'El destino de un tren se marca con per.', da: '«da Roma» sería el tren que viene de Roma.', in: 'El destino de un tren se marca con per.' }, 'Destino de trenes y aviones: per.'],
  ['Parto ＿ due giorni.', 'tra', { fa: '«fa» mira al pasado.', da: '«da due giorni» es «desde hace dos días».', per: '«per due giorni» es «durante dos días».' }, 'tra / fra + tiempo = dentro de.'],
  ['Studio italiano ＿ un anno.', 'da', { fa: '«fa» va con un pasado terminado.', tra: '«tra» mira al futuro.', per: '«per un anno» es una duración cerrada, no «desde hace».' }, 'Presente + da: empezó y sigue.'],
  ['Vengo ＿ Valparaíso.', 'da', { di: 'Con venire, el origen va con da; con essere, di.', a: '«a» marca el destino.', in: '«in» marca dónde estás.' }, 'Vengo da…, sono di…'],
  ['Sono ＿ Valparaíso.', 'di', { da: 'Con essere, el origen va con di.', a: '«sono a Valparaíso» sería «estoy en Valparaíso».', in: '«in» es para países y regiones.' }, 'Sono di + ciudad: el lugar de origen.'],
  ['Questo regalo è ＿ te.', 'per', { a: 'Para alguien: per.', da: '«da te» es «donde ti» o «de tu parte».', di: '«di te» es «tuyo» o «de ti».' }, 'per + persona = para.'],
  ['Ci vediamo ＿ otto.', 'alle', { a: 'Con las horas va el artículo: alle otto.', alla: 'Son las ocho, en plural: alle.', le: 'Falta la preposición: alle.' }, 'A una hora: alle otto, all’una.'],
  ['Domenica andiamo ＿ mare.', 'al', { in: 'Se dice al mare.', nel: '«nel mare» es «dentro del mar».', a: 'Lleva artículo: al mare.' }, 'al mare, pero in montagna.'],
  ['Domenica andiamo ＿ montagna.', 'in', { alla: 'Se dice in montagna.', a: 'Se dice in montagna.', nella: 'in montagna, sin artículo.' }, 'in montagna, in campagna; pero al mare.'],
  ['Ho bisogno ＿ aiuto.', 'di', { da: 'Se dice aver bisogno di.', a: 'Se dice aver bisogno di.', per: 'Se dice aver bisogno di.' }, 'aver bisogno di = necesitar.'],
  ['Stasera ceniamo ＿ Giulia.', 'da', { a: 'A la casa de alguien: da.', in: 'Con personas se usa da.', per: '«per Giulia» es «para Giulia».' }, 'da + persona = en la casa de.'],
  ['Metti il latte ＿ frigo.', 'nel', { in: 'Con frigo va artículo: nel frigo.', al: '«al» es a + il.', sul: '«sul» es «encima de».' }, 'in + il = nel: dentro de.'],
  ['Il libro è ＿ tavolo.', 'sul', { nel: '«nel tavolo» sería «dentro de la mesa».', al: '«al tavolo» es «a la mesa» (sentado a ella), no encima.', dal: '«dal» es da + il.' }, 'su + il = sul: sobre, encima.'],
  ['Lavoro ＿ lunedì al venerdì.', 'dal', { da: 'Con un rango de días va artículo: dal lunedì al venerdì.', del: '«del» es di + il.', al: 'El rango empieza con da: dal… al.' }, 'dal lunedì al venerdì: de lunes a viernes.'],
]

/** Una pregunta de uso: «Vado ＿ medico» → dal. */
function usageQuestion(random: () => number): SpeedQuestion {
  const [prompt, answer, whyWrong, explanation] = USES[Math.floor(random() * USES.length)]
  return { prompt, options: [answer, ...Object.keys(whyWrong)], answer, explanation, whyWrong }
}

const PREPOSITIONS: Preposition[] = ['di', 'a', 'da', 'in', 'su']
const SINGULAR: Definite[] = ['il', 'lo', "l'", 'la']
const shown = (s: string) => s.replace(/'/g, '’')

/** Fusión con el artículo: «su + il tavolo» → sul tavolo, entre las otras formas de la misma preposición (en singular). */
function fusionQuestion(words: readonly ItalianWord[], random: () => number): SpeedQuestion | null {
  const list = words.filter(hasArticleQuestion)
  if (!list.length) return null
  const w = list[Math.floor(random() * list.length)]
  const noun = nounOf(w)
  const article = definiteArticle(noun)
  const word = w.word
  const prep = PREPOSITIONS[Math.floor(random() * PREPOSITIONS.length)]
  const answer = shown(join(articulated(prep, article), word))
  const others = shuffle(SINGULAR.filter((a) => a !== article), random)
    .slice(0, 3)
    .map((a) => shown(join(articulated(prep, a), word)))
  const options = [...new Set([answer, ...others])]
  if (options.length < 3) return null
  return {
    prompt: `${prep} + ${shown(join(article, word))}`,
    hint: w.meaning,
    options,
    answer,
    explanation: `${prep} + ${shown(article)} = ${shown(articulated(prep, article))}. ${articleReason(noun, article)}`,
    whyWrong: Object.fromEntries(options.filter((o) => o !== answer).map((o) => [o, `Esa forma va con otro artículo; ${shown(w.word)} lleva «${shown(article)}».`])),
  }
}

/** «Preposizioni»: la mitad, el uso (in banca, dal medico); la otra, la fusión con el artículo. */
export function prepositionQuestion(words: readonly ItalianWord[], random = Math.random): SpeedQuestion | null {
  if (!words.some((w) => w.level !== 'A1')) return null
  return random() < 0.5 ? usageQuestion(random) : (fusionQuestion(words, random) ?? usageQuestion(random))
}

export const prepositionUseCount = USES.length
