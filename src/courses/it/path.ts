import type { PathItem, PathLevel, PathStop, PathUnit } from '../../lib/path.ts'
import { italianGrammar } from './grammar.ts'
import { type CefrLevel, cefrGoals, cefrLevels, cefrTitles } from './levels.ts'
import { italianTexts } from './texts.ts'
import { italianVocabLessons } from './vocab.ts'

// Recorrido del italiano por nivel. Cada unidad intercala gramática, palabras y textos de
// «La strada di Lucca», en paradas de hasta 3 lecciones. Cada nivel termina en su simulacro CILS.

const grammarTitle = new Map(italianGrammar.map((g) => [g.id, g.title]))
const textTitle = new Map(italianTexts.map((t) => [t.id, t.title]))

const grammarItem = (id: string): PathItem => ({ kind: 'grammar', id, title: grammarTitle.get(id) ?? id, to: `/gramatica/${id}` })
const vocabItems = (theme: string): PathItem[] =>
  italianVocabLessons.filter((l) => l.theme === theme).map((l) => ({ kind: 'vocab', id: l.id, title: `Palabras: ${l.title}`, to: `/palabras/${l.id}` }))
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

const CILS_NAMES: Record<CefrLevel, string> = { A1: 'CILS A1', A2: 'CILS A2', B1: 'CILS UNO-B1', B2: 'CILS DUE-B2', C1: 'CILS TRE-C1', C2: 'CILS QUATTRO-C2' }
const examTitle = (level: CefrLevel) => `Simulacro ${CILS_NAMES[level]}`

const examUnit = (level: CefrLevel): PathUnit => ({
  id: `it-examen-${level.toLowerCase()}`,
  title: `Meta: simulacro ${CILS_NAMES[level]}`,
  icon: '📝',
  stops: [{ id: `it-examen-${level.toLowerCase()}-1`, title: examTitle(level), items: [{ kind: 'exam', id: level, title: examTitle(level), to: `/cils/${level.toLowerCase()}` }] }],
})

const unitsA1: PathUnit[] = [
  unit('it-a1-1', 'A1 · Ciao! Sono Lucca', '👋', ['it-alfabeto', 'it-suoni', 'it-essere'], ['saluti', 'persone'], ['itx-a1-arrivo']),
  unit('it-a1-2', 'A1 · Recién llegado a Bolonia', '🧳', ['it-gli-gn', 'it-pronomi-soggetto', 'it-presente-are'], ['paesi', 'famiglia'], ['itx-a1-presentazione', 'itx-a1-coinquilino']),
  unit('it-a1-3', 'A1 · Números, horas y días', '🕗', ['it-doppie', 'it-numeri', 'it-ora', 'it-data'], ['numeri-tempo', 'calendario'], ['itx-a1-orari']),
  unit('it-a1-4', 'A1 · La casa nueva', '🏠', ['it-articoli', 'it-indeterminativi', 'it-plurale', 'it-c-e'], ['casa', 'mobili'], ['itx-a1-casa', 'itx-a1-annuncio']),
  unit('it-a1-5', 'A1 · En el Comune', '🏛️', ['it-avere', 'it-negazione', 'it-domande'], ['pratiche', 'parole-utili'], ['itx-a1-comune', 'itx-a1-modulo']),
  unit('it-a1-6', 'A1 · En el bar y en la feria', '🛒', ['it-presente-ere-ire', 'it-modali', 'it-partitivo'], ['cibo', 'bevande', 'spesa'], ['itx-a1-bar', 'itx-a1-lista']),
  unit('it-a1-7', 'A1 · Mi día y mi tiempo libre', '⚽', ['it-fare-stare', 'it-riflessivi', 'it-piacere'], ['giornata', 'tempo-libero', 'meteo'], ['itx-a1-weekend', 'itx-a1-giornata']),
  unit('it-a1-8', 'A1 · Por la ciudad', '🚌', ['it-andare-venire', 'it-preposizioni', 'it-preposizioni-articolate', 'it-luoghi'], ['citta', 'trasporti'], ['itx-a1-strada']),
  unit('it-a1-9', 'A1 · Donde el médico', '🩺', ['it-aggettivi', 'it-possessivi', 'it-imperativo'], ['corpo', 'vestiti', 'colori'], ['itx-a1-medico']),
  unit('it-a1-10', 'A1 · El primer día en el taller', '🛠️', ['it-questo-quello', 'it-sapere-conoscere', 'it-stare-gerundio'], ['lavoro', 'mestieri'], ['itx-a1-colloquio', 'itx-a1-primo-giorno']),
  examUnit('A1'),
]

const unitsByLevel: Record<CefrLevel, PathUnit[]> = { A1: unitsA1, A2: [], B1: [], B2: [], C1: [], C2: [] }

export const italianPath: PathUnit[] = cefrLevels.flatMap((l) => unitsByLevel[l])

export const italianPathLevels: PathLevel[] = (() => {
  let firstIndex = 0
  return cefrLevels.map((level) => {
    const units = unitsByLevel[level]
    const out = { level, title: cefrTitles[level], goal: cefrGoals[level], units, firstIndex }
    firstIndex += units.length
    return out
  })
})()

/** Todas las lecciones del recorrido, en orden. */
export const italianPathItems: PathItem[] = italianPath.flatMap((u) => u.stops.flatMap((s) => s.items))
