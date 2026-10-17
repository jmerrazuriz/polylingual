import type { PathItem, PathLevel, PathStop, PathUnit } from '../../lib/path.ts'
import { germanGrammar } from './grammar.ts'
import { type CefrLevel, cefrGoals, cefrLevels, cefrTitles } from './levels.ts'
import { germanTexts } from './texts.ts'
import { germanVocabLessons } from './vocab.ts'

// Recorrido del alemán por nivel. Cada unidad intercala gramática, palabras y textos de
// «Ottos Weg», en paradas de hasta 3 lecciones. Cada nivel termina en su simulacro Goethe.

const grammarTitle = new Map(germanGrammar.map((g) => [g.id, g.title]))
const textTitle = new Map(germanTexts.map((t) => [t.id, t.title]))

const grammarItem = (id: string): PathItem => ({ kind: 'grammar', id, title: grammarTitle.get(id) ?? id, to: `/gramatica/${id}` })
const vocabItems = (theme: string): PathItem[] =>
  germanVocabLessons.filter((l) => l.theme === theme).map((l) => ({ kind: 'vocab', id: l.id, title: `Palabras: ${l.title}`, to: `/palabras/${l.id}` }))
const textItem = (id: string): PathItem => ({ kind: 'reading', id, title: textTitle.get(id) ?? id, to: `/textos/${id}` })

/** Unidad: [gramática, palabras de un tema] intercalados y los textos al final, en paradas de 3. */
function unit(id: string, title: string, icon: string, grammar: string[], themes: string[], texts: string[]): PathUnit {
  const items: PathItem[] = []
  const rounds = Math.max(grammar.length, themes.length)
  for (let i = 0; i < rounds; i++) {
    if (grammar[i]) items.push(grammarItem(grammar[i]))
    if (themes[i]) items.push(...vocabItems(themes[i]))
  }
  items.push(...texts.map(textItem))
  const stops: PathStop[] = []
  for (let i = 0; i < items.length; i += 3) stops.push({ id: `${id}-${stops.length + 1}`, title: items[i].title, items: items.slice(i, i + 3) })
  return { id, title, icon, stops }
}

const examUnit = (level: CefrLevel): PathUnit => ({
  id: `examen-${level.toLowerCase()}`,
  title: `Meta: simulacro Goethe ${level}`,
  icon: '📝',
  stops: [{ id: `examen-${level.toLowerCase()}-1`, title: `Simulacro Goethe-Zertifikat ${level}`, items: [{ kind: 'exam', id: level, title: `Simulacro Goethe-Zertifikat ${level}`, to: `/goethe/${level.toLowerCase()}` }] }],
})

const unitsA1: PathUnit[] = [
  unit('de-a1-1', 'A1 · Hallo! Ich bin Otto', '👋', ['de-aussprache', 'de-sein', 'de-w-fragen'], ['hallo', 'personen'], ['dt-a1-ankunft']),
  unit('de-a1-2', 'A1 · Recién llegado', '🧳', ['de-praesens', 'de-satzbau', 'de-ja-nein'], ['laender', 'familie'], ['lt-a1-steckbrief', 'dt-a1-familie']),
  unit('de-a1-3', 'A1 · Números, horas y días', '🕗', ['de-zahlen', 'de-uhrzeit', 'de-zeitpraep'], ['zahlen-zeit', 'kalender'], ['lt-a1-kurs']),
  unit('de-a1-4', 'A1 · Buscando departamento', '🏠', ['de-genus', 'de-plural', 'de-ein-kein'], ['wohnung', 'moebel'], ['dt-a1-wohnung', 'lt-a1-anzeige']),
  unit('de-a1-5', 'A1 · En el Bürgeramt', '🏛️', ['de-nicht', 'de-muessen-duerfen', 'de-imperativ-sie'], ['amt', 'woerter'], ['dt-a1-buergeramt', 'lt-a1-formular']),
  unit('de-a1-6', 'A1 · De compras', '🛒', ['de-akkusativ', 'de-haben', 'de-moechten'], ['essen', 'trinken', 'einkaufen'], ['dt-a1-baeckerei', 'lt-a1-einkaufszettel']),
  unit('de-a1-7', 'A1 · Mi día y mi tiempo libre', '⚽', ['de-trennbar', 'de-vokalwechsel', 'de-gern'], ['alltag', 'freizeit', 'wetter'], ['dt-a1-wochenende', 'lt-a1-tagesablauf']),
  unit('de-a1-8', 'A1 · Por la ciudad', '🚌', ['de-koennen-wollen', 'de-dativ-praep', 'de-wo-wohin'], ['stadt', 'verkehr'], ['dt-a1-weg']),
  unit('de-a1-9', 'A1 · En el médico', '🩺', ['de-imperativ-du', 'de-possessiv'], ['koerper', 'kleidung', 'farben'], ['lt-a1-arzt']),
  unit('de-a1-10', 'A1 · Mi primer trabajo', '🔧', ['de-perfekt-haben', 'de-perfekt-sein', 'de-war-hatte', 'de-konnektoren'], ['arbeit', 'berufe'], ['dt-a1-vorstellung', 'lt-a1-erster-tag']),
  examUnit('A1'),
]

const unitsA2: PathUnit[] = [
  unit('de-a2-1', 'A2 · De vuelta al taller', '🔧', ['de-dativ-artikel', 'de-dativ-verben', 'de-dativ-pronomen'], ['arbeitsalltag'], ['dt-a2-werkstatt']),
  unit('de-a2-2', 'A2 · La casa nueva', '📦', ['de-wechselpraep', 'de-stellen-stehen'], ['umzug'], ['lt-a2-hausordnung', 'dt-a2-umzug']),
  unit('de-a2-3', 'A2 · Lo que pasó', '📨', ['de-perfekt-plus', 'de-praeteritum-modal'], ['kommunikation'], ['lt-a2-mail-vermieter']),
  unit('de-a2-4', 'A2 · La salud', '🩹', ['de-weil', 'de-dass'], ['gesundheit'], ['dt-a2-arzt', 'lt-a2-krankmeldung']),
  unit('de-a2-5', 'A2 · Banco y trámites', '🏦', ['de-wenn', 'de-ob-indirekt'], ['bank', 'behoerde'], ['dt-a2-bank']),
  unit('de-a2-6', 'A2 · Un trabajo mejor', '📄', ['de-komparativ', 'de-superlativ'], ['bewerbung'], ['lt-a2-stellenanzeige']),
  unit('de-a2-7', 'A2 · Compras y cocina', '🛍️', ['de-adjektiv-der', 'de-adjektiv-ein'], ['kaufen2', 'kochen'], ['dt-a2-reklamation', 'lt-a2-rezept']),
  unit('de-a2-8', 'A2 · Amigos y fiestas', '🎉', ['de-reflexiv', 'de-verben-praep', 'de-konjunktiv-hoeflich'], ['feste', 'gefuehle', 'beziehungen'], ['dt-a2-geburtstag']),
  unit('de-a2-9', 'A2 · Viajes y tiempo libre', '🚆', ['de-sollte', 'de-deshalb-trotzdem', 'de-futur'], ['reisen', 'hobbys', 'natur'], ['lt-a2-hamburg', 'dt-a2-weiterbildung']),
  unit('de-a2-10', 'A2 · Papeles y planes', '🗂️', ['de-indefinit', 'de-genitiv-von', 'de-zu-infinitiv'], ['medien', 'autoverkehr'], ['lt-a2-brief-behoerde']),
  unit('de-a2-11', 'A2 · Fechas y lugares', '📅', ['de-ordinal', 'de-temporal', 'de-zum-beim-vom'], ['bildung', 'verben2'], ['dt-a2-weihnachten']),
  unit('de-a2-12', 'A2 · Un año en Alemania', '🌱', ['de-welcher-dieser', 'de-praeteritum-text', 'de-noch-schon'], ['adjektive2', 'woerter2'], ['lt-a2-ein-jahr']),
  examUnit('A2'),
]

const unitsB1: PathUnit[] = [
  unit('de-b1-1', 'B1 · Contar el pasado', '📜', ['de-praeteritum', 'de-plusquamperfekt', 'de-nachdem-bevor'], ['werkstatt', 'karriere'], ['lt-b1-lebenslauf', 'dt-b1-pruefung']),
  unit('de-b1-2', 'B1 · Cuando y mientras', '⏳', ['de-als-wenn', 'de-sobald-solange'], ['wohnen3', 'haushalt'], ['lt-b1-forum-miete']),
  unit('de-b1-3', 'B1 · Lo que se hace', '⚙️', ['de-passiv-praesens', 'de-passiv-vergangenheit', 'de-passiv-modal'], ['technik', 'wetter2'], ['dt-b1-werkstatt-passiv', 'lt-b1-zeitung']),
  unit('de-b1-4', 'B1 · Personas y cosas', '👥', ['de-relativ-1', 'de-relativ-2', 'de-relativ-wo-was'], ['charakter', 'gefuehle2'], ['dt-b1-kollegen']),
  unit('de-b1-5', 'B1 · Correos formales', '✉️', ['de-brief-formal', 'de-n-deklination'], ['anfragen', 'finanzen'], ['lt-b1-beschwerde']),
  unit('de-b1-6', 'B1 · Para qué', '🎯', ['de-um-zu-damit', 'de-ohne-statt', 'de-lassen'], ['gesellschaft', 'recht'], ['dt-b1-integration']),
  unit('de-b1-7', 'B1 · Si yo fuera…', '💭', ['de-konj2-irreal', 'de-konj2-wunsch'], ['gesundheit2', 'notfall'], ['lt-b1-blog-heimweh', 'dt-b1-arzt-praevention']),
  unit('de-b1-8', 'B1 · A pesar de todo', '🌧️', ['de-obwohl', 'de-sodass', 'de-kausal'], ['kultur', 'gastro'], ['lt-b1-ehrenamt']),
  unit('de-b1-9', 'B1 · De quién y por qué', '🔎', ['de-genitiv', 'de-genitiv-praep', 'de-praep-akk'], ['umwelt2', 'unterwegs'], []),
  unit('de-b1-10', 'B1 · Decisiones', '⚖️', ['de-doppelkonnektoren', 'de-je-desto', 'de-brauchen-zu'], ['bildung2', 'medien2'], ['dt-b1-umzug-entscheidung', 'lt-b1-umfrage']),
  unit('de-b1-11', 'B1 · Verbos con preposición', '🔗', ['de-verben-praep-2', 'de-wo-da', 'de-reflexiv-dativ'], ['rektion'], ['dt-b1-radio']),
  unit('de-b1-12', 'B1 · Mi opinión', '🗣️', ['de-meinung', 'de-wortbildung', 'de-futur-vermutung', 'de-adjektiv-stark', 'de-indefinitpronomen'], ['diskussion', 'abstrakt', 'verben3', 'adjektive3', 'konnektoren-b1'], ['lt-b1-bewerbung', 'dt-b1-entscheidung']),
  examUnit('B1'),
]

const unitsByLevel: Record<CefrLevel, PathUnit[]> = {
  A1: unitsA1,
  A2: unitsA2,
  B1: unitsB1,
  B2: [],
  C1: [],
  C2: [],
}

export const germanPath: PathUnit[] = cefrLevels.flatMap((l) => unitsByLevel[l])

export const germanPathLevels: PathLevel[] = (() => {
  let firstIndex = 0
  return cefrLevels.map((level) => {
    const units = unitsByLevel[level]
    const out = { level, title: cefrTitles[level], goal: cefrGoals[level], units, firstIndex }
    firstIndex += units.length
    return out
  })
})()

/** Todas las lecciones del recorrido, en orden. */
export const germanPathItems: PathItem[] = germanPath.flatMap((u) => u.stops.flatMap((s) => s.items))
