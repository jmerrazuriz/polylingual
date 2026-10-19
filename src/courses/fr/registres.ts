import type { SpeedQuestion } from '../euro.ts'
import { shuffle } from '../../lib/random.ts'

// Juego de registros (desde C1): pasar una frase familiar al registro formal (soutenu).
// Cada opción incorrecta dice por qué no sirve: sigue siendo familiar, cambia el sentido o mezcla registros.

type Item = {
  /** La frase en registro familiar. */
  familier: string
  meaning: string
  /** Su equivalente formal. */
  soutenu: string
  /** Qué cambia del familiar al formal. */
  note: string
  wrong: [string, string][]
}

const items: Item[] = [
  {
    familier: 'J’sais pas.',
    meaning: 'No sé.',
    soutenu: 'Je ne saurais vous le dire.',
    note: 'vuelve el ne y «savoir» en condicional con ne solo, típico del registro culto',
    wrong: [['Je sais pas, moi.', 'Sigue sin ne: es familiar.'], ['Je ne veux pas le dire.', 'Cambia el sentido: no querer decir.'], ['Je le sais fort bien.', 'Dice lo contrario: sí lo sabe.']],
  },
  {
    familier: 'T’inquiète, y a pas de souci.',
    meaning: 'Tranquilo, no hay problema.',
    soutenu: 'Soyez sans crainte, il n’y a aucun problème.',
    note: 'tratamiento de vous, negación completa e «il y a»',
    wrong: [['Inquiète-toi, y a un souci.', 'Dice lo contrario y sigue siendo familiar.'], ['T’inquiète pas, c’est cool.', '«cool» y la falta de ne son familiares.'], ['Il y a lieu de s’inquiéter.', 'Formal, pero dice lo contrario: hay motivo para preocuparse.']],
  },
  {
    familier: 'J’bosse demain.',
    meaning: 'Trabajo mañana.',
    soutenu: 'Je travaille demain.',
    note: '«bosser» es familiar; el verbo neutro es «travailler»',
    wrong: [['Je bosse grave demain.', '«bosser» y «grave» son familiares.'], ['Je me repose demain.', 'Cambia el sentido: descansar.'], ['Je boufferai demain.', '«bouffer» es familiar y significa comer.']],
  },
  {
    familier: 'On s’est planté.',
    meaning: 'Nos equivocamos.',
    soutenu: 'Nous nous sommes trompés.',
    note: '«nous» en lugar de «on», y «se tromper» en lugar de «se planter»',
    wrong: [['On s’est gouré, quoi.', '«se gourer» también es familiar.'], ['Nous avons réussi.', 'Dice lo contrario.'], ['Nous nous sommes plantés là.', 'Mezcla registros: «se planter» sigue siendo familiar.']],
  },
  {
    familier: 'Il a pas un rond.',
    meaning: 'No tiene ni un peso.',
    soutenu: 'Il est dépourvu de ressources.',
    note: '«dépourvu de ressources» es la expresión formal de la falta de dinero',
    wrong: [['Il a pas de fric.', '«fric» y la falta de ne son familiares.'], ['Il dispose de ressources.', 'Dice lo contrario: tiene recursos.'], ['Il a un rond.', 'Pierde la negación y sigue siendo familiar.']],
  },
  {
    familier: 'Ça me saoule, ce truc.',
    meaning: 'Esto me tiene chato.',
    soutenu: 'Cette situation m’exaspère.',
    note: '«exaspérer» reemplaza a «saouler», y «truc» se precisa',
    wrong: [['Ce machin me gonfle.', '«machin» y «gonfler» son familiares.'], ['Cette situation me ravit.', 'Dice lo contrario: me encanta.'], ['Ça m’exaspère, ce truc.', 'Mezcla registros: «truc» sigue siendo familiar.']],
  },
  {
    familier: 'Tu viens ?',
    meaning: '¿Vienes?',
    soutenu: 'Viendrez-vous ?',
    note: 'inversión del sujeto y tratamiento de vous',
    wrong: [['Tu viens ou quoi ?', '«ou quoi» es muy familiar.'], ['Partirez-vous ?', 'Formal, pero cambia el sentido: irse.'], ['Vous venez, hein ?', '«hein» es familiar.']],
  },
  {
    familier: 'C’est nickel !',
    meaning: '¡Está impecable!',
    soutenu: 'C’est irréprochable.',
    note: '«irréprochable» es la versión formal de «nickel»',
    wrong: [['C’est trop top !', '«trop top» es familiar.'], ['C’est inacceptable.', 'Dice lo contrario.'], ['C’est nickel chrome.', 'Sigue siendo familiar.']],
  },
  {
    familier: 'J’ai la flemme d’y aller.',
    meaning: 'Me da flojera ir.',
    soutenu: 'Je n’ai guère envie de m’y rendre.',
    note: '«ne… guère» y «se rendre» en lugar de «aller»',
    wrong: [['J’ai pas envie d’y aller.', 'Sin ne: sigue siendo familiar.'], ['J’ai grande hâte de m’y rendre.', 'Formal, pero dice lo contrario: tengo muchas ganas.'], ['J’ai la flemme de m’y rendre.', 'Mezcla registros: «la flemme» es familiar.']],
  },
  {
    familier: 'Il est crevé.',
    meaning: 'Está reventado.',
    soutenu: 'Il est épuisé.',
    note: '«épuisé» es el término neutro o cuidado; «crevé» es familiar',
    wrong: [['Il est naze.', '«naze» también es familiar.'], ['Il est reposé.', 'Dice lo contrario.'], ['Il est mort de fatigue, quoi.', '«quoi» al final es familiar.']],
  },
  {
    familier: 'Elle a pigé tout de suite.',
    meaning: 'Cachó altiro.',
    soutenu: 'Elle a compris immédiatement.',
    note: '«comprendre» en lugar de «piger»',
    wrong: [['Elle a capté direct.', '«capter» y «direct» son familiares.'], ['Elle a oublié aussitôt.', 'Cambia el sentido: olvidó.'], ['Elle a pigé immédiatement.', 'Mezcla registros: «piger» es familiar.']],
  },
  {
    familier: 'On se casse ?',
    meaning: '¿Nos vamos?',
    soutenu: 'Pouvons-nous prendre congé ?',
    note: '«prendre congé» (despedirse) e inversión con nous',
    wrong: [['On se tire ?', '«se tirer» también es familiar.'], ['Pouvons-nous rester ?', 'Formal, pero dice lo contrario.'], ['On y va, ou quoi ?', 'Muy familiar.']],
  },
  {
    familier: 'Y a plein de monde.',
    meaning: 'Hay un montón de gente.',
    soutenu: 'Il y a une foule considérable.',
    note: '«il y a» completo y «une foule considérable» en lugar de «plein de monde»',
    wrong: [['Y a grave du monde.', '«grave» y la falta de «il» son familiares.'], ['Il n’y a personne.', 'Dice lo contrario.'], ['Il y a plein de gens, quoi.', '«plein de» y «quoi» son familiares.']],
  },
  {
    familier: 'Je kiffe ce bouquin.',
    meaning: 'Me encanta este libro.',
    soutenu: 'J’apprécie beaucoup cet ouvrage.',
    note: '«apprécier» y «ouvrage» reemplazan a «kiffer» y «bouquin»',
    wrong: [['Je kiffe grave ce livre.', '«kiffer» y «grave» son familiares.'], ['Je déteste cet ouvrage.', 'Dice lo contrario.'], ['J’apprécie ce bouquin.', 'Mezcla registros: «bouquin» es familiar.']],
  },
  {
    familier: 'Faut qu’on se voie.',
    meaning: 'Tenemos que vernos.',
    soutenu: 'Il serait souhaitable que nous nous rencontrions.',
    note: '«il» en «il faut», «nous» y un condicional de cortesía con subjuntivo',
    wrong: [['Faut se voir, hein.', 'Sin «il» y con «hein»: familiar.'], ['Il vaut mieux ne plus se voir.', 'Cambia el sentido.'], ['Faut que nous nous rencontrions.', 'Mezcla registros: falta «il».']],
  },
  {
    familier: 'C’est pas mon truc.',
    meaning: 'No es lo mío.',
    soutenu: 'Ce n’est guère mon domaine.',
    note: 'negación completa y «domaine» en lugar de «truc»',
    wrong: [['C’est pas mon délire.', '«délire» en este sentido es familiar.'], ['C’est ma spécialité.', 'Dice lo contrario.'], ['Ce n’est pas mon truc.', 'Mezcla registros: «truc» es familiar.']],
  },
  {
    familier: 'Il m’a filé un coup de main.',
    meaning: 'Me echó una mano.',
    soutenu: 'Il m’a apporté son aide.',
    note: '«apporter son aide» en lugar de «filer un coup de main»',
    wrong: [['Il m’a filé un coup de pouce.', '«filer» sigue siendo familiar.'], ['Il m’a refusé son aide.', 'Dice lo contrario.'], ['Il m’a donné un coup de main, quoi.', '«quoi» al final es familiar.']],
  },
  {
    familier: 'Ce mec est un pote.',
    meaning: 'Este tipo es un amigo.',
    soutenu: 'Cet homme est un ami.',
    note: '«homme» y «ami» en lugar de «mec» y «pote»',
    wrong: [['Ce type est un copain, quoi.', '«type» y «quoi» son familiares.'], ['Cet homme est un rival.', 'Cambia el sentido.'], ['Ce mec est un ami.', 'Mezcla registros: «mec» es familiar.']],
  },
  {
    familier: 'Laisse tomber, c’est mort.',
    meaning: 'Olvídalo, no hay caso.',
    soutenu: 'Renoncez-y, il n’y a plus rien à espérer.',
    note: '«renoncer» y una formulación completa en lugar de «c’est mort»',
    wrong: [['Lâche l’affaire, c’est foutu.', '«lâcher l’affaire» y «foutu» son familiares.'], ['Persévérez, tout est encore possible.', 'Formal, pero dice lo contrario.'], ['Laisse tomber, il n’y a plus d’espoir.', 'Mezcla registros: «laisse tomber» es familiar.']],
  },
  {
    familier: 'Elle s’est barrée sans rien dire.',
    meaning: 'Se fue sin decir nada.',
    soutenu: 'Elle est partie sans mot dire.',
    note: '«partir» en lugar de «se barrer»; «sans mot dire» es una fórmula culta',
    wrong: [['Elle s’est tirée sans rien dire.', '«se tirer» también es familiar.'], ['Elle est restée sans mot dire.', 'Cambia el sentido: se quedó.'], ['Elle s’est barrée sans mot dire.', 'Mezcla registros: «se barrer» es familiar.']],
  },
  {
    familier: 'T’as vu l’heure ?',
    meaning: '¿Viste la hora?',
    soutenu: 'Avez-vous remarqué l’heure qu’il est ?',
    note: 'inversión, vous y forma completa de «tu as»',
    wrong: [['T’as capté l’heure ?', '«t’as» y «capter» son familiares.'], ['Avez-vous oublié votre montre ?', 'Cambia el sentido.'], ['Tu as vu l’heure, hein ?', '«hein» es familiar.']],
  },
  {
    familier: 'Ça coûte un bras.',
    meaning: 'Cuesta un ojo de la cara.',
    soutenu: 'Le coût en est exorbitant.',
    note: '«exorbitant» y el pronombre «en» del registro escrito',
    wrong: [['C’est hyper cher, quoi.', '«hyper» y «quoi» son familiares.'], ['Le coût en est dérisoire.', 'Formal, pero dice lo contrario: insignificante.'], ['Ça coûte la peau des fesses.', 'Muy familiar.']],
  },
  {
    familier: 'J’en ai marre.',
    meaning: 'Estoy harto.',
    soutenu: 'Je suis excédé.',
    note: '«être excédé» es la forma cuidada de «en avoir marre»',
    wrong: [['J’en ai ras le bol.', 'También familiar.'], ['Je suis comblé.', 'Dice lo contrario: plenamente satisfecho.'], ['J’en ai vraiment marre, quoi.', 'Sigue siendo familiar.']],
  },
  {
    familier: 'Il pleut des cordes, on bouge pas.',
    meaning: 'Llueve a cántaros, no nos movemos.',
    soutenu: 'Il pleut à verse ; nous ne sortirons pas.',
    note: '«nous» en lugar de «on» y negación completa',
    wrong: [['Il flotte, on bouge pas.', '«flotter» (llover) y la falta de ne son familiares.'], ['Il fait beau ; nous sortirons.', 'Cambia el sentido.'], ['Il pleut à verse, on bouge pas.', 'Mezcla registros: «on bouge pas» es familiar.']],
  },
]

const pick = <T,>(xs: readonly T[], random: () => number) => xs[Math.floor(random() * xs.length)]

/** Pregunta del juego «Registres»: el equivalente formal (soutenu) de una frase familiar. */
export function registerQuestion(random = Math.random): SpeedQuestion {
  const it = pick(items, random)
  return {
    prompt: `«${it.familier}» → en registro formal:`,
    hint: it.meaning,
    options: shuffle([it.soutenu, ...it.wrong.map(([w]) => w)], random),
    answer: it.soutenu,
    explanation: `«${it.soutenu}»: ${it.note}.`,
    whyWrong: Object.fromEntries(it.wrong),
  }
}

export const registerItemCount = items.length
