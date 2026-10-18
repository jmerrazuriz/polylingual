import type { SpeedQuestion } from '../euro.ts'
import { shuffle } from '../../lib/random.ts'

// Homófonos y falsos amigos: los dos errores más típicos de un hispanohablante en francés.
// Alimentan los juegos «A ou à ?» y «Faux amis» y la práctica (desde A2).

type Pair = { options: string[]; rule: Record<string, string> }

/** La prueba de cada homófono, para explicar por qué va uno u otro. */
const pairs: Record<string, Pair> = {
  a: { options: ['a', 'à'], rule: { a: '«a» es el verbo avoir: se puede cambiar por «avait».', à: '«à» es la preposición: no se puede cambiar por «avait».' } },
  et: { options: ['et', 'est'], rule: { et: '«et» es «y»: se puede cambiar por «et puis».', est: '«est» es el verbo être: se puede cambiar por «était».' } },
  son: { options: ['son', 'sont'], rule: { son: '«son» es el posesivo (su): va con un sustantivo.', sont: '«sont» es el verbo être: se puede cambiar por «étaient».' } },
  on: { options: ['on', 'ont'], rule: { on: '«on» es el sujeto (nosotros): se puede cambiar por «il».', ont: '«ont» es el verbo avoir: se puede cambiar por «avaient».' } },
  ce: { options: ['ce', 'se'], rule: { ce: '«ce» acompaña a un sustantivo o va con être (c’est).', se: '«se» es el pronombre de un verbo pronominal.' } },
  ces: { options: ['ces', 'ses'], rule: { ces: '«ces» es «estos/esos»: se puede decir «ces… -là».', ses: '«ses» es «sus»: se puede cambiar por «mes».' } },
  ou: { options: ['ou', 'où'], rule: { ou: '«ou» es «o»: se puede cambiar por «ou bien».', où: '«où» con acento es «dónde» o el relativo de lugar y tiempo.' } },
  leur: { options: ['leur', 'leurs'], rule: { leur: '«leur» pronombre (a ellos) o posesivo con una sola cosa: sin -s.', leurs: '«leurs» es el posesivo con varias cosas.' } },
}

/** Frases con un hueco: [frase, tipo de par, respuesta, traducción]. */
const items: [string, keyof typeof pairs, string, string][] = [
  ['Camila ＿ un rendez-vous à dix heures.', 'a', 'a', 'Camila tiene una cita a las diez.'],
  ['Elle va ＿ la préfecture.', 'a', 'à', 'Ella va a la prefectura.'],
  ['Julien ＿ deux sœurs.', 'a', 'a', 'Julien tiene dos hermanas.'],
  ['Le train arrive ＿ Paris à midi.', 'a', 'à', 'El tren llega a París a mediodía.'],
  ['Il ＿ fini son travail.', 'a', 'a', 'Terminó su trabajo.'],
  ['C’est ＿ toi de jouer !', 'a', 'à', '¡Te toca jugar!'],
  ['Julien ＿ professeur.', 'et', 'est', 'Julien es profesor.'],
  ['Du pain ＿ du fromage, s’il vous plaît.', 'et', 'et', 'Pan y queso, por favor.'],
  ['La pharmacie ＿ fermée le dimanche.', 'et', 'est', 'La farmacia está cerrada los domingos.'],
  ['Elle aime lire ＿ nager.', 'et', 'et', 'Le gusta leer y nadar.'],
  ['Ses parents ＿ chiliens.', 'son', 'sont', 'Sus padres son chilenos.'],
  ['Julien a perdu ＿ portable.', 'son', 'son', 'Julien perdió su celular.'],
  ['Les patients ＿ dans la salle d’attente.', 'son', 'sont', 'Los pacientes están en la sala de espera.'],
  ['Elle habite avec ＿ frère.', 'son', 'son', 'Vive con su hermano.'],
  ['Ils ＿ arrivés hier.', 'son', 'sont', 'Llegaron ayer.'],
  ['＿ va au cinéma ce soir ?', 'on', 'on', '¿Vamos al cine esta noche?'],
  ['Les voisins ＿ un chien.', 'on', 'ont', 'Los vecinos tienen un perro.'],
  ['Ils ＿ pris le tram.', 'on', 'ont', 'Tomaron el tranvía.'],
  ['Ici, ＿ parle français.', 'on', 'on', 'Aquí se habla francés.'],
  ['Elles ＿ trente ans.', 'on', 'ont', 'Tienen treinta años.'],
  ['Il ＿ lève à six heures.', 'ce', 'se', 'Se levanta a las seis.'],
  ['＿ matin, il fait froid.', 'ce', 'ce', 'Esta mañana hace frío.'],
  ['Elle ＿ promène au parc.', 'ce', 'se', 'Ella pasea por el parque.'],
  ['＿ n’est pas grave.', 'ce', 'ce', 'No es grave. (C’est…)'],
  ['Ils ＿ couchent tard.', 'ce', 'se', 'Se acuestan tarde.'],
  ['Camila range ＿ affaires dans son armoire.', 'ces', 'ses', 'Camila guarda sus cosas en su clóset.'],
  ['Regarde ＿ fleurs-là, elles sont belles !', 'ces', 'ces', '¡Mira esas flores, son lindas!'],
  ['Julien téléphone à ＿ parents.', 'ces', 'ses', 'Julien llama a sus padres.'],
  ['＿ médicaments sont pour la chambre 12.', 'ces', 'ces', 'Estos remedios son para la pieza 12.'],
  ['Tu veux du thé ＿ du café ?', 'ou', 'ou', '¿Quieres té o café?'],
  ['＿ est la gare ?', 'ou', 'où', '¿Dónde está la estación?'],
  ['La ville ＿ j’habite est calme.', 'ou', 'où', 'La ciudad donde vivo es tranquila.'],
  ['Lundi ＿ mardi, c’est pareil.', 'ou', 'ou', 'Lunes o martes, da lo mismo.'],
  ['Je ＿ téléphone ce soir. (a ellos)', 'leur', 'leur', 'Los llamo esta noche.'],
  ['Les voisins promènent ＿ chiens.', 'leur', 'leurs', 'Los vecinos pasean a sus perros.'],
  ['Ils ont vendu ＿ voiture.', 'leur', 'leur', 'Vendieron su auto (uno).'],
  ['Je ＿ ai donné les clés.', 'leur', 'leur', 'Les di las llaves.'],
]

const pick = <T,>(xs: readonly T[], random: () => number) => xs[Math.floor(random() * xs.length)]

/** Pregunta del juego «A ou à ?»: completar la frase con el homófono correcto. */
export function homophoneQuestion(random = Math.random): SpeedQuestion {
  const [sentence, kind, answer, meaning] = pick(items, random)
  const { options, rule } = pairs[kind]
  return {
    prompt: sentence,
    hint: meaning,
    options,
    answer,
    keepOrder: true,
    explanation: rule[answer],
    whyWrong: Object.fromEntries(options.filter((o) => o !== answer).map((o) => [o, rule[o]])),
  }
}

export const homophoneItemCount = items.length

/** Falsos amigos: [palabra, lo que significa, la trampa (lo que parece), cómo se dice la trampa]. */
const fauxAmis: [string, string, string, string][] = [
  ['embarrassé', 'incómodo, en un aprieto', 'embarazada', '«embarazada» se dice enceinte'],
  ['constipé', 'estreñido', 'resfriado', '«resfriado» se dice enrhumé'],
  ['quitter', 'dejar, irse de', 'quitar', '«quitar» se dice enlever'],
  ['subir', 'sufrir, padecer', 'subir', '«subir» se dice monter'],
  ['rester', 'quedarse', 'restar', '«restar» se dice soustraire'],
  ['la carte', 'la carta (del restaurante); la tarjeta', 'una carta (correo)', '«una carta» se dice une lettre'],
  ['la vente', 'la venta', 'el viento', '«el viento» se dice le vent'],
  ['attendre', 'esperar', 'atender', '«atender» se dice s’occuper de'],
  ['large', 'ancho', 'largo', '«largo» se dice long'],
  ['la répétition', 'el ensayo; la repetición', 'solo la repetición', 'en el teatro, «répétition» es el ensayo'],
  ['le régime', 'la dieta', 'el régimen político', 'también existe, pero «être au régime» es estar a dieta'],
  ['la chance', 'la suerte', 'la oportunidad', '«oportunidad» se dice occasion'],
  ['le comédien', 'el actor', 'el humorista', '«humorista» se dice humoriste'],
  ['la nouvelle', 'la noticia', 'la novela', '«novela» se dice roman'],
  ['la glace', 'el helado; el hielo; el espejo', 'la glasa', 'piensa en «helado» o «hielo»'],
  ['le parfum', 'el perfume; el sabor (de un helado)', 'solo el perfume', '«Quel parfum ?» en una heladería es «¿qué sabor?»'],
  ['la carrière', 'la carrera profesional', 'la carrera universitaria', '«estudiar una carrera» es faire des études'],
  ['le crayon', 'el lápiz (de mina)', 'el crayón (lápiz de cera)', '«crayón» se dice crayon de cire'],
  ['la bourse', 'la beca; la bolsa de valores', 'la bolsa (de compras)', '«bolsa» se dice sac'],
  ['la cave', 'la bodega (del edificio)', 'la cueva', '«cueva» se dice grotte'],
  ['la location', 'el arriendo', 'la locación (de una película)', '«locación» se dice lieu de tournage'],
  ['le stage', 'la práctica laboral', 'el estadio', '«estadio» se dice stade'],
  ['le bureau', 'la oficina; el escritorio', 'el buró (mueble)', 'en francés es sobre todo la oficina'],
  ['propre', 'limpio; propio', 'solo propio', '«Ma chambre est propre» = mi pieza está limpia'],
  ['la tasse', 'la taza', 'la tasa', '«tasa» se dice taux'],
]

/** Pregunta del juego «Faux amis»: qué significa de verdad la palabra. */
export function fauxAmiQuestion(random = Math.random): SpeedQuestion {
  const [word, real, trap, note] = pick(fauxAmis, random)
  const others = shuffle(fauxAmis.filter((f) => f[0] !== word), random)
    .slice(0, 2)
    .map((f) => f[1])
  const options = [real, trap, ...others]
  return {
    prompt: word,
    hint: '¿Qué significa?',
    options,
    answer: real,
    explanation: `«${word}» significa ${real}.`,
    whyWrong: { [trap]: `Es la trampa: ${note}.`, ...Object.fromEntries(others.map((o) => [o, `«${o}» es el significado de otra palabra.`])) },
  }
}

export const fauxAmiCount = fauxAmis.length
