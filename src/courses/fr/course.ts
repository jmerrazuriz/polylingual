import type { EuroCourse, EuroGame, EuroWord } from '../euro.ts'
import { checkFrench } from '../../lib/frenchInput.ts'
import { lookupFrench } from './glossary.ts'
import { frenchGrammar } from './grammar.ts'
import { frenchPath } from './path.ts'
import { fauxAmiQuestion, homophoneQuestion } from './homophones.ts'
import { articleQuestion, audioPairs, conjugationQuestion, femininePairs, frenchPoolLevels, frenchWordPool, meaningPairs, numberQuestion, practiceSession, type PracticeMode, tenseCountFor } from './practice.ts'
import { frenchItemDone, frenchItemStatus, frenchUnlockedIds } from './progress.ts'
import { frenchTexts } from './texts.ts'
import { type FrenchWord, frenchThemesA1, frenchThemesA2, frenchVocabLessonById, frenchVocabLessons, frenchWordCard, FRENCH_WORD_PREFIX, nounLine, speakWord, withArticle } from './vocab.ts'
import { frenchLessonExercises, meaningExercise, sayExercise } from './vocabExercises.ts'

// El francés como curso europeo: lo que las pantallas comunes necesitan de él.

const f = (w: EuroWord) => w as FrenchWord

const genderColor: Record<string, string> = {
  m: 'text-sky-700 dark:text-sky-300',
  f: 'text-rose-700 dark:text-rose-300',
  pl: 'text-amber-700 dark:text-amber-300',
}

const games: EuroGame[] = [
  {
    id: 'fr-pairs-meaning',
    glyph: 'école↔colegio',
    title: 'Parejas',
    text: 'Une cada palabra con su significado.',
    instructions: 'Toca una palabra y luego su significado.',
    kind: 'pairs',
    record: (n) => `${n} pts`,
    pairs: (ws) => meaningPairs(ws as FrenchWord[]),
  },
  {
    id: 'fr-pairs-audio',
    glyph: 'pan↔🔊',
    title: 'Escucha y une',
    text: 'Une cada significado con la palabra que oyes.',
    instructions: 'Toca un significado y luego el sonido que le corresponde (🔊 lo reproduce).',
    kind: 'audio',
    record: (n) => `${n} pts`,
    pairs: (ws) => audioPairs(ws as FrenchWord[]),
  },
  {
    id: 'fr-pairs-feminine',
    glyph: 'petit↔petite',
    title: 'Masculino y femenino',
    text: 'Une cada adjetivo o profesión con su femenino.',
    instructions: 'Toca la forma masculina y luego su femenino.',
    kind: 'pairs',
    record: (n) => `${n} pts`,
    pairs: (ws) => femininePairs(ws as FrenchWord[]),
  },
  {
    id: 'fr-speed-article',
    glyph: 'un·une',
    title: 'Un ou une ?',
    text: '60 segundos para acertar el género de la mayor cantidad de sustantivos.',
    instructions: 'Elige un (masculino) o une (femenino). Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => articleQuestion(ws as FrenchWord[]),
  },
  {
    id: 'fr-speed-conjugation',
    glyph: 'je suis',
    title: 'Conjugación rápida',
    text: 'Elige la forma correcta del verbo contra el reloj.',
    instructions: 'Persona, verbo y tiempo: elige la forma correcta. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => conjugationQuestion(Math.random, tenseCountFor(ws as FrenchWord[])),
  },
  {
    id: 'fr-speed-numbers',
    glyph: '80 = 4×20',
    title: 'Les nombres',
    text: 'Del número a las letras: soixante-dix, quatre-vingts…',
    instructions: 'Elige cómo se dice el número. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: () => numberQuestion(),
  },
  {
    id: 'fr-speed-homophones',
    glyph: 'a · à',
    title: 'A ou à ?',
    text: 'Los homófonos: a/à, et/est, son/sont, on/ont… (desde A2).',
    instructions: 'Completa la frase con la palabra correcta. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => (ws.some((w) => w.level !== 'A1') ? homophoneQuestion() : null),
  },
  {
    id: 'fr-speed-faux-amis',
    glyph: 'embarrassé ≠',
    title: 'Faux amis',
    text: 'Las palabras que parecen españolas y no lo son (desde A2).',
    instructions: 'Elige lo que significa de verdad. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => (ws.some((w) => w.level !== 'A1') ? fauxAmiQuestion() : null),
  },
]

export const frenchCourse: EuroCourse = {
  id: 'fr',
  lang: 'fr',
  name: 'francés',
  story: 'Le chemin de Camila',
  textsIntro: 'Le chemin de Camila: lecturas y diálogos con audio, como en el examen DELF. Toca una palabra para ver qué significa.',
  vocabIntro: 'Palabras por tema, siempre con su artículo y su género. Lo que aprendes entra a tus repasos.',
  examName: (level) => `${level === 'C1' || level === 'C2' ? 'DALF' : 'DELF'} ${level}`,
  examPath: (level) => `/delf/${level.toLowerCase()}`,
  genders: [
    { gender: 'm', article: 'le / un', className: genderColor.m },
    { gender: 'f', article: 'la / une', className: genderColor.f },
  ],
  lessonIntro: (words) =>
    words.some((w) => w.pos === 'noun')
      ? 'Aprende cada sustantivo con su artículo: con «l’» el género no se ve, por eso va indicado (m. o f.). Toca una palabra para oírla.'
      : words.some((w) => w.pos === 'adj')
        ? 'Aprende cada adjetivo con su femenino. Toca una palabra para oírla.'
        : 'Aprende cada palabra o expresión completa, tal como se usa. Toca una para oírla.',
  themes: [...frenchThemesA1.map((t) => ({ id: t.id, title: t.title, level: 'A1' as const })), ...frenchThemesA2.map((t) => ({ id: t.id, title: t.title, level: 'A2' as const }))],
  vocabLessons: frenchVocabLessons,
  vocabLessonById: frenchVocabLessonById,
  texts: frenchTexts,
  grammar: frenchGrammar,
  path: frenchPath,
  wordCardPrefix: FRENCH_WORD_PREFIX,
  wordCard: (w) => frenchWordCard(f(w)),
  nounLine: (w) => nounLine(f(w)),
  withArticle: (w) => withArticle(f(w)),
  speakWord: (w) => speakWord(f(w)),
  genderClass: (w) => (w.gender ? genderColor[w.gender] : ''),
  lessonExercises: (words) => frenchLessonExercises(words as FrenchWord[]),
  meaningExercise: (w) => meaningExercise(f(w)),
  sayExercise: (w) => sayExercise(f(w)),
  lookup: lookupFrench,
  unlockedIds: frenchUnlockedIds,
  itemDone: frenchItemDone,
  itemStatus: frenchItemStatus,
  wordPool: (p, open, levels) => frenchWordPool(p, open, levels),
  poolLevels: frenchPoolLevels,
  games,
  practiceModes: [
    { mode: 'palabras', glyph: '📖', title: 'Palabras', text: 'Significado y cómo se dice, con las palabras de tus lecciones.' },
    { mode: 'escribir', glyph: '⌨️', title: 'Escribir', text: 'Escribe la palabra en francés, con su artículo. Sin acentos cuenta como «casi».' },
    { mode: 'genero', glyph: 'un·une', title: 'Género', text: 'un o une: el género de cada sustantivo.' },
    { mode: 'femenino', glyph: '-e -ne', title: 'Femenino', text: 'El femenino de adjetivos y profesiones.' },
    { mode: 'conjugacion', glyph: 'je suis', title: 'Conjugación', text: 'Presente y futur proche; desde A2, también passé composé, imparfait y futuro.' },
    { mode: 'numeros', glyph: '70·80·90', title: 'Números', text: 'Del número a las letras, con soixante-dix y quatre-vingts.' },
    { mode: 'homofonos', glyph: 'a · à', title: 'Homófonos', text: 'a/à, et/est, son/sont, on/ont, ce/se… con la prueba de cada uno (desde A2).' },
    { mode: 'falsos-amigos', glyph: '≠', title: 'Falsos amigos', text: 'embarrassé, constipé, quitter… lo que significan de verdad (desde A2).' },
  ],
  practiceSession: (mode, words, count) => practiceSession(mode as PracticeMode, words as FrenchWord[], count),
  check: (input, answers) => {
    const r = checkFrench(input, answers)
    return r === 'accents' ? 'almost' : r
  },
  almostNote: 'Casi: revisa los acentos.',
}
