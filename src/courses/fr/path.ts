import type { PathItem, PathLevel, PathStop, PathUnit } from '../../lib/path.ts'
import { frenchGrammar } from './grammar.ts'
import { type CefrLevel, cefrGoals, cefrLevels, cefrTitles } from './levels.ts'
import { frenchTexts } from './texts.ts'
import { frenchVocabLessons } from './vocab.ts'

// Recorrido del francés por nivel. Cada unidad intercala gramática, palabras y textos de
// «Le chemin de Camila», en paradas de hasta 3 lecciones. Cada nivel termina en su simulacro DELF.

const grammarTitle = new Map(frenchGrammar.map((g) => [g.id, g.title]))
const textTitle = new Map(frenchTexts.map((t) => [t.id, t.title]))

const grammarItem = (id: string): PathItem => ({ kind: 'grammar', id, title: grammarTitle.get(id) ?? id, to: `/gramatica/${id}` })
const vocabItems = (theme: string): PathItem[] =>
  frenchVocabLessons.filter((l) => l.theme === theme).map((l) => ({ kind: 'vocab', id: l.id, title: `Palabras: ${l.title}`, to: `/palabras/${l.id}` }))
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

const examTitle = (level: CefrLevel) => `Simulacro ${level === 'C1' || level === 'C2' ? 'DALF' : 'DELF'} ${level}`

const examUnit = (level: CefrLevel): PathUnit => ({
  id: `fr-examen-${level.toLowerCase()}`,
  title: `Meta: ${examTitle(level).replace('Simulacro', 'simulacro')}`,
  icon: '📝',
  stops: [{ id: `fr-examen-${level.toLowerCase()}-1`, title: examTitle(level), items: [{ kind: 'exam', id: level, title: examTitle(level), to: `/delf/${level.toLowerCase()}` }] }],
})

const unitsA1: PathUnit[] = [
  unit('fr-a1-1', 'A1 · Bonjour ! Je suis Camila', '👋', ['fr-alphabet', 'fr-sons', 'fr-etre'], ['salutations', 'personnes'], ['ft-a1-arrivee']),
  unit('fr-a1-2', 'A1 · Recién llegada a Lyon', '🧳', ['fr-nasales', 'fr-pronoms-sujets', 'fr-present-er'], ['pays', 'famille'], ['ft-a1-fiche', 'ft-a1-voisin']),
  unit('fr-a1-3', 'A1 · Números, horas y días', '🕗', ['fr-nombres', 'fr-nombres-70', 'fr-heure', 'fr-date'], ['nombres-temps', 'calendrier'], ['ft-a1-cours']),
  unit('fr-a1-4', 'A1 · Buscando departamento', '🏠', ['fr-articles', 'fr-pluriel', 'fr-il-y-a'], ['logement', 'meubles'], ['ft-a1-appartement', 'ft-a1-annonce']),
  unit('fr-a1-5', 'A1 · En la prefectura', '🏛️', ['fr-avoir', 'fr-negation', 'fr-questions'], ['demarches', 'mots-utiles'], ['ft-a1-prefecture', 'ft-a1-formulaire']),
  unit('fr-a1-6', 'A1 · De compras', '🛒', ['fr-partitif', 'fr-quantites', 'fr-vouloir-pouvoir'], ['nourriture', 'boissons', 'courses'], ['ft-a1-boulangerie', 'ft-a1-liste']),
  unit('fr-a1-7', 'A1 · Mi día y mi tiempo libre', '⚽', ['fr-pronominaux', 'fr-aimer-infinitif', 'fr-faire'], ['quotidien', 'loisirs', 'meteo'], ['ft-a1-weekend', 'ft-a1-journee']),
  unit('fr-a1-8', 'A1 · Por la ciudad', '🚌', ['fr-aller-venir', 'fr-contractions', 'fr-villes-pays'], ['ville', 'transports'], ['ft-a1-chemin']),
  unit('fr-a1-9', 'A1 · En el médico', '🩺', ['fr-adjectifs', 'fr-possessifs', 'fr-imperatif'], ['corps', 'vetements', 'couleurs'], ['ft-a1-medecin']),
  unit('fr-a1-10', 'A1 · Mi primer día en el hospital', '🏥', ['fr-c-est-il-est', 'fr-demonstratifs', 'fr-prendre', 'fr-futur-proche', 'fr-toniques'], ['travail', 'metiers'], ['ft-a1-entretien', 'ft-a1-premier-jour']),
  examUnit('A1'),
]

const unitsA2: PathUnit[] = [
  unit('fr-a2-1', 'A2 · Lo que pasó ayer', '📜', ['fr-pc-avoir', 'fr-participes', 'fr-pc-etre'], ['recit', 'urgences'], ['ft-a2-urgences']),
  unit('fr-a2-2', 'A2 · Un turno en el hospital', '🏥', ['fr-pc-pronominaux', 'fr-pc-negation'], ['hopital'], ['ft-a2-garde']),
  unit('fr-a2-3', 'A2 · Recuerdos de Chile', '🌊', ['fr-imparfait', 'fr-pc-imparfait'], ['sentiments'], ['ft-a2-enfance', 'ft-a2-souvenir']),
  unit('fr-a2-4', 'A2 · Un departamento propio', '🔑', ['fr-cod', 'fr-coi', 'fr-pronoms-infinitif'], ['location', 'taches'], ['ft-a2-visite', 'ft-a2-bail']),
  unit('fr-a2-5', 'A2 · Banco y prefectura', '🏦', ['fr-devoir-falloir', 'fr-subjonctif-intro'], ['banque-poste', 'sejour'], ['ft-a2-banque', 'ft-a2-renouvellement']),
  unit('fr-a2-6', 'A2 · Un trabajo mejor', '📄', ['fr-comparatif', 'fr-superlatif', 'fr-conditionnel-politesse'], ['postuler', 'travail-a2'], ['ft-a2-annonce', 'ft-a2-entretien']),
  unit('fr-a2-7', 'A2 · Teléfono y reclamos', '📱', ['fr-y', 'fr-en'], ['telephone', 'reclamations'], ['ft-a2-operateur']),
  unit('fr-a2-8', 'A2 · Planes y viajes', '🚆', ['fr-futur-simple', 'fr-si-present', 'fr-en-dans'], ['voyages', 'nature'], ['ft-a2-marseille']),
  unit('fr-a2-9', 'A2 · Fiestas y amigos', '🎉', ['fr-relatifs', 'fr-venir-de', 'fr-tout'], ['fetes', 'caractere'], ['ft-a2-anniversaire']),
  unit('fr-a2-10', 'A2 · En la cocina', '🍲', ['fr-adverbes-ment', 'fr-negations-a2', 'fr-lequel'], ['cuisine-a2', 'sport'], ['ft-a2-recette']),
  unit('fr-a2-11', 'A2 · Estudiar y aprender', '🎓', ['fr-depuis', 'fr-savoir-connaitre'], ['formation', 'medias'], ['ft-a2-formation']),
  unit('fr-a2-12', 'A2 · Un año en Lyon', '🌱', ['fr-homophones', 'fr-faux-amis'], ['verbes-a2', 'mots-a2', 'faux-amis'], ['ft-a2-un-an']),
  examUnit('A2'),
]

const unitsByLevel: Record<CefrLevel, PathUnit[]> = { A1: unitsA1, A2: unitsA2, B1: [], B2: [], C1: [], C2: [] }

export const frenchPath: PathUnit[] = cefrLevels.flatMap((l) => unitsByLevel[l])

export const frenchPathLevels: PathLevel[] = (() => {
  let firstIndex = 0
  return cefrLevels.map((level) => {
    const units = unitsByLevel[level]
    const out = { level, title: cefrTitles[level], goal: cefrGoals[level], units, firstIndex }
    firstIndex += units.length
    return out
  })
})()

/** Todas las lecciones del recorrido, en orden. */
export const frenchPathItems: PathItem[] = frenchPath.flatMap((u) => u.stops.flatMap((s) => s.items))
