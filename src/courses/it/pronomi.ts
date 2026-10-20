import type { SpeedQuestion } from '../euro.ts'
import { shuffle } from '../../lib/random.ts'
import { combined, type Direct, type Indirect } from './engine/pronouns.ts'

// «Pronomi» (desde B1): reemplazar el objeto y el destinatario por los pronombres combinados
// (Bruno porta il libro a Giulia → glielo porta). Las formas salen del motor.

/** Objetos: [lo que se da, su pronombre, cantidad que queda tras «ne»]. */
const OBJECTS: [string, Direct, string?][] = [
  ['il libro', 'lo'],
  ['il caffè', 'lo'],
  ['il passaporto', 'lo'],
  ['la lettera', 'la'],
  ['la ricevuta', 'la'],
  ['la chiave', 'la'],
  ['i documenti', 'li'],
  ['i biglietti', 'li'],
  ['le chiavi', 'le'],
  ['le foto', 'le'],
  ['due mele', 'ne', 'due'],
  ['tre fotocopie', 'ne', 'tre'],
]

/** Destinatarios: [a quién, su pronombre indirecto, cómo se llama esa persona]. */
const RECIPIENTS: [string, Indirect, string][] = [
  ['a me', 'mi', 'a mí'],
  ['a te', 'ti', 'a ti'],
  ['a Marco', 'gli', 'a él'],
  ['a Giulia', 'le', 'a ella'],
  ['a noi', 'ci', 'a nosotros'],
  ['a voi', 'vi', 'a ustedes'],
]

const VERBS: [string, string][] = [
  ['porta', 'lleva'],
  ['dà', 'da'],
  ['manda', 'manda'],
  ['presta', 'presta'],
]

const DIRECT_NAME: Record<Direct, string> = { lo: 'masculino singular', la: 'femenino singular', li: 'masculino plural', le: 'femenino plural', ne: 'una cantidad (ne)' }

const pick = <T,>(list: readonly T[], random: () => number) => list[Math.floor(random() * list.length)]

/** Bruno porta il libro a Giulia. → ＿ porta. (glielo) */
export function pronounQuestion(random = Math.random): SpeedQuestion {
  const [object, direct, rest] = pick(OBJECTS, random)
  const [to, indirect, toName] = pick(RECIPIENTS, random)
  const [verb] = pick(VERBS, random)
  const answer = combined(indirect, direct)
  const otherDirect = pick((['lo', 'la', 'li', 'le', 'ne'] as Direct[]).filter((d) => d !== direct), random)
  const otherIndirect = pick(RECIPIENTS.filter((r) => combined(r[1], direct) !== answer), random)
  const candidates: [string, string][] = [
    [`${indirect} ${direct}`, `Sin fundir: cuando van juntos, ${indirect} ${indirect === 'gli' || indirect === 'le' ? 'se une al directo: glie-' : 'cambia la -i por -e'}.`],
    [combined(indirect, otherDirect), `«${combined(indirect, otherDirect)}» lleva ${otherDirect}, que es ${DIRECT_NAME[otherDirect]}; «${object}» pide ${direct}.`],
    [combined(otherIndirect[1], direct), `«${combined(otherIndirect[1], direct)}» es ${otherIndirect[2]}, no ${toName}.`],
    [`${direct} ${indirect}`, 'El orden es indirecto + directo.'],
  ]
  const wrong = shuffle(
    candidates.filter(([o], i, all) => o !== answer && all.findIndex(([x]) => x === o) === i),
    random,
  ).slice(0, 3)
  const tail = rest ? ` ${verb} ${rest}.` : ` ${verb}.`
  return {
    prompt: `Bruno ${verb} ${object} ${to}. → ＿${tail}`,
    hint: 'el objeto y a quién, en dos pronombres juntos',
    options: [answer, ...wrong.map(([o]) => o)],
    answer,
    explanation: `${object} → ${direct}; ${to} → ${indirect}. ${indirect} + ${direct} = ${answer}: Bruno ${answer}${tail}`,
    whyWrong: Object.fromEntries(wrong),
  }
}
