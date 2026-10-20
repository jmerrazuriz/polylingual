import type { SpeedQuestion } from '../euro.ts'

// «Congiuntivo o indicativo?» (desde B1): certeza o hecho → indicativo; opinión, deseo, emoción,
// duda, necesidad y algunas conjunciones → congiuntivo.

/** [frase con ＿, respuesta, { opción incorrecta: por qué no }, explicación]. */
const ITEMS: [string, string, Record<string, string>, string][] = [
  ['Penso che Bruno ＿ a casa.', 'sia', { è: 'Para opinar con «penso che» va el congiuntivo.', sarebbe: 'Es condicional: no es lo que pide «penso che» aquí.' }, 'Opinión: penso che + congiuntivo.'],
  ['So che Bruno ＿ a casa.', 'è', { sia: '«so che» expresa certeza: indicativo.', fosse: '«so che» expresa certeza: indicativo.' }, 'Certeza: so che + indicativo.'],
  ['Spero che tu ＿ bene.', 'stia', { stai: 'Tras «spero che», congiuntivo.', staresti: 'Es condicional.' }, 'Esperanza: spero che + congiuntivo.'],
  ['È vero che il corso ＿ gratuito.', 'è', { sia: '«è vero che» afirma un hecho: indicativo.', fosse: '«è vero che» afirma un hecho: indicativo.' }, 'Hecho: è vero che + indicativo.'],
  ['Non è vero che il corso ＿ gratuito.', 'sia', { è: 'Al negar una certeza se usa el congiuntivo.', siano: 'Es plural; il corso es singular.' }, 'Negación de una certeza: congiuntivo.'],
  ['Voglio che voi ＿ puntuali.', 'siate', { siete: 'Tras «voglio che», congiuntivo.', sareste: 'Es condicional.' }, 'Voluntad: voglio che + congiuntivo.'],
  ['Sono sicuro che Giulia ＿ ragione.', 'ha', { abbia: '«sono sicuro che» es certeza: indicativo.', avesse: '«sono sicuro che» es certeza: indicativo.' }, 'Certeza: indicativo.'],
  ['Mi sembra che Lucca ＿ stanco.', 'sia', { è: 'Tras «mi sembra che», congiuntivo.', siano: 'Lucca es singular.' }, 'Impresión u opinión: congiuntivo.'],
  ['Ho sentito che domani ＿ sciopero.', 'c’è', { 'ci sia': '«ho sentito che» informa un hecho: indicativo.', 'ci fosse': '«ho sentito che» informa un hecho: indicativo.' }, 'Informar un hecho: indicativo.'],
  ['Bisogna che voi ＿ il modulo.', 'compiliate', { compilate: 'Tras «bisogna che», congiuntivo.', compilereste: 'Es condicional.' }, 'Necesidad: bisogna che + congiuntivo.'],
  ['Vedo che ＿ già finito.', 'hai', { abbia: '«vedo che» constata un hecho: indicativo.', avessi: '«vedo che» constata un hecho: indicativo.' }, 'Constatar: indicativo.'],
  ['Dubito che loro ＿ la risposta.', 'sappiano', { sanno: 'La duda pide congiuntivo.', saprebbero: 'Es condicional.' }, 'Duda: dubito che + congiuntivo.'],
  ['Benché ＿ tardi, continuiamo.', 'sia', { è: 'benché siempre pide congiuntivo.', sarebbe: 'Es condicional.' }, 'benché + congiuntivo.'],
  ['Anche se ＿ tardi, continuiamo.', 'è', { sia: '«anche se» va con indicativo.', fosse: '«anche se» va con indicativo en este caso.' }, 'anche se + indicativo.'],
  ['È importante che tutti ＿ le regole.', 'rispettino', { rispettano: 'Tras «è importante che», congiuntivo.', rispetterebbero: 'Es condicional.' }, 'Expresión impersonal: congiuntivo.'],
  ['Credo che il treno ＿ alle otto.', 'parta', { parte: 'Tras «credo che», congiuntivo.', partisse: 'Con un verbo en presente, congiuntivo presente.' }, 'Opinión: credo che + congiuntivo.'],
  ['Ti dico che il treno ＿ alle otto.', 'parte', { parta: '«dico che» informa: indicativo.', partisse: '«dico che» informa: indicativo.' }, 'Informar: dire che + indicativo.'],
  ['Sono contento che tu ＿ qui.', 'sia', { sei: 'Tras una emoción, congiuntivo.', fossi: 'Con un presente, congiuntivo presente.' }, 'Emoción: congiuntivo.'],
  ['Finiamo prima che ＿ il capo.', 'arrivi', { arriva: '«prima che» pide congiuntivo.', arriverebbe: 'Es condicional.' }, 'prima che + congiuntivo.'],
  ['Dopo che Bruno ＿ arrivato, abbiamo cenato.', 'è', { sia: '«dopo che» va con indicativo.', fosse: '«dopo che» va con indicativo.' }, 'dopo che + indicativo.'],
  ['Pensavo che il museo ＿ aperto.', 'fosse', { sia: 'Con un verbo principal en pasado, congiuntivo imperfetto.', è: 'Tras «pensavo che», congiuntivo.' }, 'Pasado: congiuntivo imperfetto.'],
  ['Volevo che tu ＿ con me.', 'venissi', { venga: 'Con «volevo» (pasado), congiuntivo imperfetto.', vieni: 'Tras «volevo che», congiuntivo.' }, 'volevo che + congiuntivo imperfetto.'],
  ['Secondo me il film ＿ bellissimo.', 'è', { sia: 'Con «secondo me» va el indicativo.', fosse: 'Con «secondo me» va el indicativo.' }, 'secondo me + indicativo.'],
  ['Va bene, purché ＿ in tempo.', 'arriviate', { arrivate: '«purché» pide congiuntivo.', arrivereste: 'Es condicional.' }, 'purché + congiuntivo.'],
  ['Mi dispiace che Giulia non ＿ venire.', 'possa', { può: 'Tras «mi dispiace che», congiuntivo.', potrebbe: 'Es condicional.' }, 'Emoción: congiuntivo.'],
  ['È chiaro che Lucca ＿ bene l’italiano.', 'parla', { parli: '«è chiaro che» es certeza: indicativo.', parlasse: '«è chiaro che» es certeza: indicativo.' }, 'Certeza: indicativo.'],
  ['Se ＿ tempo, verrei.', 'avessi', { avrei: 'Tras se no va el condicional.', ho: 'Con verrei (condicional), la hipótesis va en congiuntivo imperfetto.' }, 'Periodo posible: se + congiuntivo imperfetto.'],
  ['Se ho tempo, ＿.', 'vengo', { venga: 'Condición real: indicativo.', venissi: 'Condición real: indicativo.' }, 'Periodo real: indicativo.'],
  ['Ho paura che ＿ piovere.', 'possa', { può: 'Tras «ho paura che», congiuntivo.', potrebbe: 'Es condicional.' }, 'Temor: congiuntivo.'],
  ['Spero ＿ presto.', 'di tornare', { 'che torni': 'Mismo sujeto (yo): di + infinitivo.', torno: 'Tras sperare va di + infinitivo o che + congiuntivo.' }, 'Mismo sujeto: di + infinitivo.'],
]

/** Una frase al azar: ¿congiuntivo o indicativo? */
export function subjunctiveQuestion(random = Math.random): SpeedQuestion {
  const [prompt, answer, whyWrong, explanation] = ITEMS[Math.floor(random() * ITEMS.length)]
  return { prompt, options: [answer, ...Object.keys(whyWrong)], answer, explanation, whyWrong }
}

export const subjunctiveCount = ITEMS.length
