import type { SpeedQuestion } from '../euro.ts'
import { shuffle } from '../../lib/random.ts'

// «Falsi amici» (desde A2): palabras italianas que parecen españolas y significan otra cosa.

/** [palabra, lo que significa, la trampa (lo que parece), cómo se dice la trampa]. */
const FALSI_AMICI: [string, string, string, string][] = [
  ['il burro', 'la mantequilla', 'el burro', '«burro» (el animal) se dice asino'],
  ['caldo', 'caliente; el calor', 'el caldo', '«caldo» (la sopa) se dice brodo'],
  ['salire', 'subir', 'salir', '«salir» se dice uscire'],
  ['la camera', 'la pieza, la habitación', 'la cámara', '«cámara» de fotos se dice macchina fotografica'],
  ['la gamba', 'la pierna', 'la gamba (camarón)', '«camarón» se dice gambero'],
  ['l’aceto', 'el vinagre', 'el aceite', '«aceite» se dice olio'],
  ['guardare', 'mirar', 'guardar', '«guardar» se dice mettere via o conservare'],
  ['imbarazzata', 'avergonzada, incómoda', 'embarazada', '«embarazada» se dice incinta'],
  ['largo', 'ancho', 'largo', '«largo» se dice lungo'],
  ['subire', 'sufrir, padecer', 'subir', '«subir» se dice salire'],
  ['il topo', 'el ratón', 'el topo', '«topo» se dice talpa'],
  ['la sposa', 'la novia (en la boda)', 'la esposa', '«esposa» se dice moglie'],
  ['l’autista', 'el chofer', 'el autista', '«autista» (persona con autismo) se dice persona autistica'],
  ['il negozio', 'la tienda', 'el negocio', '«negocio» se dice affare'],
  ['nudo', 'desnudo', 'el nudo', '«nudo» se dice nodo'],
  ['il rumore', 'el ruido', 'el rumor', '«rumor» se dice voce o pettegolezzo'],
  ['la tenda', 'la cortina; la carpa', 'la tienda', '«tienda» se dice negozio'],
  ['il primo', 'el primero; el primer plato', 'el primo', '«primo» se dice cugino'],
  ['la carta', 'el papel; la tarjeta', 'la carta (correo)', '«carta» (correo) se dice lettera'],
  ['il lampo', 'el relámpago', 'la lámpara', '«lámpara» se dice lampada'],
  ['morbido', 'suave, blando', 'mórbido, enfermizo', '«mórbido» se dice morboso'],
  ['pronto', '¿aló? (al teléfono); listo', 'pronto, dentro de poco', '«pronto» (dentro de poco) se dice presto'],
  ['presto', 'pronto; temprano', 'prestado', '«prestado» se dice prestato'],
  ['l’officina', 'el taller (mecánico)', 'la oficina', '«oficina» se dice ufficio'],
  ['il vaso', 'el florero, el macetero', 'el vaso', '«vaso» se dice bicchiere'],
  ['domandare', 'preguntar', 'demandar', '«demandar» (ante un juez) se dice fare causa'],
  ['affettare', 'cortar en tajadas', 'afectar', '«afectar» se dice influire su'],
  ['il genero', 'el yerno', 'el género', '«género» se dice genere'],
  ['la salita', 'la subida', 'la salida', '«salida» se dice uscita'],
  ['la cantina', 'la bodega (de una casa)', 'la cantina (bar)', 'en italiano es el sótano o la bodega'],
]

const pick = <T,>(list: readonly T[], random: () => number) => list[Math.floor(random() * list.length)]

/** Qué significa de verdad: la respuesta, la trampa y dos significados de otras palabras. */
export function falsoAmicoQuestion(random = Math.random): SpeedQuestion {
  const [word, real, trap, note] = pick(FALSI_AMICI, random)
  const others = shuffle(
    FALSI_AMICI.filter((f) => f[0] !== word && f[1] !== real && f[1] !== trap),
    random,
  )
    .slice(0, 2)
    .map((f) => f[1])
  return {
    prompt: word,
    hint: '¿Qué significa?',
    options: [real, trap, ...others],
    answer: real,
    explanation: `«${word}» significa ${real}.`,
    whyWrong: { [trap]: `Es la trampa: ${note}.`, ...Object.fromEntries(others.map((o) => [o, `«${o}» es lo que significa otra palabra.`])) },
  }
}

export const falsiAmiciCount = FALSI_AMICI.length
