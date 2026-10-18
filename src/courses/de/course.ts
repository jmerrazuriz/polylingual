import type { EuroCourse, EuroGame, EuroLevel, EuroWord } from '../euro.ts'
import { checkGerman } from '../../lib/germanInput.ts'
import { lookupGerman } from './glossary.ts'
import { germanGrammar } from './grammar.ts'
import { germanPath } from './path.ts'
import { articleQuestion, audioPairs, conjugationQuestion, declensionQuestion, germanPoolLevels, germanWordPool, meaningPairs, pluralPairs, practiceSession, type PracticeMode } from './practice.ts'
import { germanItemDone, germanItemStatus, germanUnlockedIds } from './progress.ts'
import { germanTexts } from './texts.ts'
import {
  type GermanWord,
  germanThemesA1,
  germanThemesA2,
  germanThemesB1,
  germanThemesB2,
  germanThemesC1,
  germanThemesC2,
  germanVocabLessonById,
  germanVocabLessons,
  germanWordCard, GERMAN_WORD_PREFIX,
  nounLine,
  withArticle,
} from './vocab.ts'
import { germanLessonExercises, meaningExercise, sayExercise } from './vocabExercises.ts'

// El alemán como curso europeo: lo que las pantallas comunes necesitan de él.

const g = (w: EuroWord) => w as GermanWord

const genderColor: Record<string, string> = {
  m: 'text-sky-700 dark:text-sky-300',
  f: 'text-rose-700 dark:text-rose-300',
  n: 'text-emerald-700 dark:text-emerald-300',
  pl: 'text-amber-700 dark:text-amber-300',
}

const games: EuroGame[] = [
  {
    id: 'de-pairs-meaning',
    glyph: 'Tisch↔mesa',
    title: 'Parejas',
    text: 'Une cada palabra con su significado.',
    instructions: 'Toca una palabra y luego su significado.',
    kind: 'pairs',
    record: (n) => `${n} pts`,
    pairs: (ws) => meaningPairs(ws as GermanWord[]),
  },
  {
    id: 'de-pairs-audio',
    glyph: 'mesa↔🔊',
    title: 'Escucha y une',
    text: 'Une cada significado con la palabra que oyes.',
    instructions: 'Toca un significado y luego el sonido que le corresponde (🔊 lo reproduce).',
    kind: 'audio',
    record: (n) => `${n} pts`,
    pairs: (ws) => audioPairs(ws as GermanWord[]),
  },
  {
    id: 'de-pairs-plural',
    glyph: 'Tisch↔Tische',
    title: 'Singular y plural',
    text: 'Une cada sustantivo con su plural.',
    instructions: 'Toca un sustantivo y luego su plural.',
    kind: 'pairs',
    record: (n) => `${n} pts`,
    pairs: (ws) => pluralPairs(ws as GermanWord[]),
  },
  {
    id: 'de-speed-article',
    glyph: 'der·die·das',
    title: 'Der, die, das',
    text: '60 segundos para acertar la mayor cantidad de artículos.',
    instructions: 'Elige el artículo correcto. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => articleQuestion(ws as GermanWord[]),
  },
  {
    id: 'de-speed-conjugation',
    glyph: 'ich gehe',
    title: 'Conjugación rápida',
    text: 'Elige la forma correcta del verbo contra el reloj.',
    instructions: 'Persona, verbo y tiempo: elige la forma correcta. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: () => conjugationQuestion(),
  },
  {
    id: 'de-speed-declension',
    glyph: 'dem neuen',
    title: 'Terminaciones',
    text: 'Artículo, adjetivo y sustantivo en el caso correcto.',
    instructions: 'Elige la frase bien declinada. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => declensionQuestion(ws as GermanWord[]),
  },
]

const themesOf = (level: EuroLevel, themes: { id: string; title: string }[]) => themes.map((t) => ({ id: t.id, title: t.title, level }))

export const germanCourse: EuroCourse = {
  id: 'de',
  lang: 'de',
  name: 'alemán',
  story: 'Ottos Weg',
  textsIntro: 'Ottos Weg: lecturas y diálogos con audio, como en el examen Goethe. Toca una palabra para ver qué significa.',
  vocabIntro: 'Palabras por tema, siempre con su artículo y su plural. Lo que aprendes entra a tus repasos.',
  examName: (level) => `Goethe-Zertifikat ${level}`,
  examPath: (level) => `/goethe/${level.toLowerCase()}`,
  genders: [
    { gender: 'm', article: 'der', className: genderColor.m },
    { gender: 'f', article: 'die', className: genderColor.f },
    { gender: 'n', article: 'das', className: genderColor.n },
  ],
  lessonIntro: (words) =>
    words.some((w) => w.pos === 'noun')
      ? 'Aprende cada sustantivo con su artículo y su plural. Toca una palabra para oírla.'
      : words.some((w) => /\+ (Akk|Dat)\./.test(w.word))
        ? 'Aprende cada expresión completa (con su preposición y su caso). Toca una para oírla.'
        : 'Aprende cada palabra o expresión completa, tal como se usa. Toca una para oírla.',
  themes: [
    ...themesOf('A1', germanThemesA1),
    ...themesOf('A2', germanThemesA2),
    ...themesOf('B1', germanThemesB1),
    ...themesOf('B2', germanThemesB2),
    ...themesOf('C1', germanThemesC1),
    ...themesOf('C2', germanThemesC2),
  ],
  vocabLessons: germanVocabLessons,
  vocabLessonById: germanVocabLessonById,
  texts: germanTexts,
  grammar: germanGrammar,
  path: germanPath,
  wordCardPrefix: GERMAN_WORD_PREFIX,
  wordCard: (w) => germanWordCard(g(w)),
  nounLine: (w) => nounLine(g(w)),
  withArticle: (w) => withArticle(g(w)),
  speakWord: (w) => {
    const x = g(w)
    return x.pos === 'noun' && x.plural && x.gender !== 'pl' ? `${withArticle(x)}. die ${x.plural}` : withArticle(x)
  },
  genderClass: (w) => (w.gender ? genderColor[w.gender] : ''),
  lessonExercises: (words) => germanLessonExercises(words as GermanWord[]),
  meaningExercise: (w) => meaningExercise(g(w)),
  sayExercise: (w) => sayExercise(g(w)),
  lookup: lookupGerman,
  unlockedIds: germanUnlockedIds,
  itemDone: germanItemDone,
  itemStatus: germanItemStatus,
  wordPool: (p, open, levels) => germanWordPool(p, open, levels),
  poolLevels: germanPoolLevels,
  games,
  practiceModes: [
    { mode: 'palabras', glyph: '📖', title: 'Palabras', text: 'Significado y cómo se dice, con las palabras de tus lecciones.' },
    { mode: 'escribir', glyph: '⌨️', title: 'Escribir', text: 'Escribe la palabra en alemán, con su artículo.' },
    { mode: 'articulos', glyph: 'der', title: 'Artículos', text: 'der, die o das: el género de cada sustantivo.' },
    { mode: 'plurales', glyph: '-e -en', title: 'Plurales', text: 'Elige el plural correcto de cada sustantivo.' },
    { mode: 'conjugacion', glyph: 'ich bin', title: 'Conjugación', text: 'Presente, Präteritum y Perfekt de los verbos del curso.' },
    { mode: 'declinacion', glyph: 'dem', title: 'Declinación', text: 'Artículo, adjetivo y sustantivo en nominativo, acusativo y dativo.' },
  ],
  practiceSession: (mode, words, count) => practiceSession(mode as PracticeMode, words as GermanWord[], count),
  check: (input, answers) => {
    const r = checkGerman(input, answers)
    return r === 'case' ? 'almost' : r
  },
  almostNote: 'Casi: revisa las mayúsculas.',
}
