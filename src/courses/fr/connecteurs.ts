import type { SpeedQuestion } from '../euro.ts'
import { shuffle } from '../../lib/random.ts'

// Juego de conectores (desde B2): elegir el conector lógico que corresponde a la relación
// entre dos ideas. Cada conector trae su función para explicar la corrección.

const role: Record<string, string> = {
  'pourtant': 'oposición (sin embargo)',
  'en revanche': 'contraste (en cambio)',
  'néanmoins': 'oposición formal (no obstante)',
  'or': 'introduce un dato que cambia el razonamiento (ahora bien)',
  'donc': 'consecuencia (así que)',
  'par conséquent': 'consecuencia formal (por consiguiente)',
  "c'est pourquoi": 'consecuencia (es por eso que)',
  'car': 'causa, va en medio de la frase (porque)',
  'puisque': 'causa conocida (ya que)',
  'en effet': 'confirma y explica lo anterior (en efecto)',
  'de plus': 'añade un argumento (además)',
  'par ailleurs': 'añade otro aspecto (por otra parte)',
  'notamment': 'introduce un ejemplo (en particular)',
  'autrement dit': 'reformula (dicho de otro modo)',
  'en somme': 'resume y concluye (en suma)',
  'certes': 'concede antes de oponer (es cierto que)',
  'ainsi': 'consecuencia o ejemplo (así)',
  'bien que': 'concesión, con subjuntivo (aunque)',
  'malgré': 'concesión, con sustantivo (a pesar de)',
  'grâce à': 'causa positiva, con sustantivo (gracias a)',
  'à cause de': 'causa negativa, con sustantivo (por culpa de)',
  'afin de': 'finalidad, con infinitivo (a fin de)',
}

/** [frase con hueco, respuesta, distractores, traducción] */
const items: [string, string, string[], string][] = [
  ['Il pleuvait ; ＿, nous sommes sortis.', 'pourtant', ['donc', 'car', 'de plus'], 'Llovía; sin embargo, salimos.'],
  ['Le service manque de personnel ; ＿, les heures supplémentaires augmentent.', 'par conséquent', ['pourtant', 'notamment', 'car'], 'Falta personal; por consiguiente, aumentan las horas extra.'],
  ['Il faut recruter. ＿, le budget a été réduit.', 'or', ['donc', 'ainsi', 'de plus'], 'Hay que contratar. Ahora bien, se redujo el presupuesto.'],
  ['Le télétravail réduit les trajets ; ＿, il isole les salariés.', 'en revanche', ['donc', 'en effet', 'notamment'], 'El teletrabajo reduce los trayectos; en cambio, aísla.'],
  ['Elle est fatiguée ＿ elle a travaillé toute la nuit.', 'car', ['donc', 'pourtant', 'or'], 'Está cansada porque trabajó toda la noche.'],
  ['＿ tu es là, aide-moi à finir.', 'puisque', ['car', 'donc', 'pourtant'], 'Ya que estás aquí, ayúdame a terminar.'],
  ['Le projet est risqué. ＿, il pourrait coûter très cher.', 'en effet', ['pourtant', 'en revanche', 'malgré'], 'El proyecto es arriesgado. En efecto, podría costar muy caro.'],
  ['Ce logement est bien situé ; ＿, il est lumineux.', 'de plus', ['pourtant', 'or', 'car'], 'Esta vivienda está bien ubicada; además, es luminosa.'],
  ['Plusieurs pays ont adopté cette loi, ＿ le Canada.', 'notamment', ['pourtant', 'donc', 'car'], 'Varios países adoptaron esta ley, en particular Canadá.'],
  ['Il faut faire plus avec moins ; ＿, il faut s’organiser.', 'autrement dit', ['pourtant', 'malgré', 'car'], 'Hay que hacer más con menos; dicho de otro modo, hay que organizarse.'],
  ['＿, le projet coûte cher, mais il est nécessaire.', 'certes', ['donc', 'car', 'ainsi'], 'Es cierto que el proyecto es caro, pero es necesario.'],
  ['＿ la fatigue, elle a terminé sa garde.', 'malgré', ['bien que', 'grâce à', 'car'], 'A pesar del cansancio, terminó su turno.'],
  ['＿ elle soit fatiguée, elle a terminé sa garde.', 'bien que', ['malgré', 'car', 'donc'], 'Aunque está cansada, terminó su turno.'],
  ['＿ son diplôme, elle a trouvé un poste.', 'grâce à', ['à cause de', 'malgré', 'bien que'], 'Gracias a su título, encontró un puesto.'],
  ['＿ la grève, le train est en retard.', 'à cause de', ['grâce à', 'bien que', 'afin de'], 'Por culpa del paro, el tren va atrasado.'],
  ['Elle suit une formation ＿ obtenir une promotion.', 'afin de', ['malgré', 'car', 'à cause de'], 'Sigue una formación a fin de obtener un ascenso.'],
  ['Les salaires ont baissé ; ＿, la consommation a chuté.', 'ainsi', ['pourtant', 'car', 'malgré'], 'Los sueldos bajaron; así, el consumo cayó.'],
  ['Il n’est pas venu ; ＿, il n’avait pas prévenu.', 'par ailleurs', ['car', 'donc', 'malgré'], 'No vino; por otra parte, no había avisado.'],
  ['Les arguments sont nombreux. ＿, la réforme est nécessaire.', 'en somme', ['pourtant', 'car', 'malgré'], 'Los argumentos son numerosos. En suma, la reforma es necesaria.'],
  ['Le budget est limité ; ＿, nous continuerons le projet.', 'néanmoins', ['donc', 'car', 'de plus'], 'El presupuesto es limitado; no obstante, continuaremos el proyecto.'],
  ['Il a beaucoup neigé, ＿ les routes sont fermées.', 'donc', ['pourtant', 'or', 'certes'], 'Nevó mucho, así que los caminos están cerrados.'],
  ['Les patients attendent trop ; ＿ nous demandons du renfort.', "c'est pourquoi", ['pourtant', 'car', 'notamment'], 'Los pacientes esperan demasiado; es por eso que pedimos refuerzos.'],
]

const pick = <T,>(xs: readonly T[], random: () => number) => xs[Math.floor(random() * xs.length)]

/** Pregunta del juego «Connecteurs»: el conector que corresponde a la relación entre las ideas. */
export function connectorQuestion(random = Math.random): SpeedQuestion {
  const [sentence, answer, wrong, meaning] = pick(items, random)
  const show = (c: string) => c.replace(/'/g, '’')
  return {
    prompt: sentence,
    hint: meaning,
    options: shuffle([answer, ...wrong], random).map(show),
    answer: show(answer),
    explanation: `«${show(answer)}»: ${role[answer]}.`,
    whyWrong: Object.fromEntries(wrong.map((w) => [show(w), `«${show(w)}» expresa ${role[w]}.`])),
  }
}

export const connectorItemCount = items.length
