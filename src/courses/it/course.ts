import type { EuroCourse, EuroWord } from '../euro.ts'
import type { EuroGame } from '../euro.ts'
import { checkItalian } from '../../lib/italianInput.ts'
import { doublesQuestion } from './doubles.ts'
import { falsoAmicoQuestion } from './falsiAmici.ts'
import { lookupItalian } from './glossary.ts'
import { italianGrammar } from './grammar.ts'
import { italianPath } from './path.ts'
import { articleQuestion, audioPairs, conjugationQuestion, fromB1, italianPoolLevels, italianWordPool, meaningPairs, numberQuestion, practiceSession, type PracticeMode, pluralPairs, pluralQuestion, tenseCountFor } from './practice.ts'
import { prepositionQuestion } from './prepositions.ts'
import { pronounQuestion } from './pronomi.ts'
import { subjunctiveQuestion } from './subjunctive.ts'
import { italianItemDone, italianItemStatus, italianUnlockedIds } from './progress.ts'
import { italianTexts } from './texts.ts'
import { type ItalianWord, italianThemesA1, italianThemesA2, italianThemesB1, italianVocabLessonById, italianVocabLessons, italianWordCard, ITALIAN_WORD_PREFIX, nounLine, speakWord, withArticle } from './vocab.ts'
import { italianLessonExercises, meaningExercise, sayExercise } from './vocabExercises.ts'

// El italiano como curso europeo: lo que las pantallas comunes necesitan de él.

const it = (w: EuroWord) => w as ItalianWord

const genderColor: Record<string, string> = {
  m: 'text-sky-700 dark:text-sky-300',
  f: 'text-rose-700 dark:text-rose-300',
}

const games: EuroGame[] = [
  {
    id: 'it-pairs-meaning',
    glyph: 'casa↔casa',
    title: 'Parejas',
    text: 'Une cada palabra con su significado.',
    instructions: 'Toca una palabra y luego su significado.',
    kind: 'pairs',
    record: (n) => `${n} pts`,
    pairs: (ws) => meaningPairs(ws as ItalianWord[]),
  },
  {
    id: 'it-pairs-audio',
    glyph: 'pan↔🔊',
    title: 'Escucha y une',
    text: 'Une cada significado con la palabra que oyes.',
    instructions: 'Toca un significado y luego el sonido que le corresponde (🔊 lo reproduce).',
    kind: 'audio',
    record: (n) => `${n} pts`,
    pairs: (ws) => audioPairs(ws as ItalianWord[]),
  },
  {
    id: 'it-pairs-plural',
    glyph: 'lo↔gli',
    title: 'Singular y plural',
    text: 'Une cada palabra con su plural, con el artículo: lo zaino ↔ gli zaini.',
    instructions: 'Toca el singular y luego su plural.',
    kind: 'pairs',
    record: (n) => `${n} pts`,
    pairs: (ws) => pluralPairs(ws as ItalianWord[]),
  },
  {
    id: 'it-speed-article',
    glyph: 'il·lo·la',
    title: 'Il, lo o la?',
    text: '60 segundos para acertar el artículo de la mayor cantidad de sustantivos.',
    instructions: 'Elige el artículo (il, lo, l’, la; o un, uno, una, un’ si empieza por vocal). Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => articleQuestion(ws as ItalianWord[]),
  },
  {
    id: 'it-speed-plural',
    glyph: 'i·gli·le',
    title: 'Plurali',
    text: 'El plural con su artículo: i parchi, gli amici, le uova…',
    instructions: 'Elige el plural correcto. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => pluralQuestion(ws as ItalianWord[]),
  },
  {
    id: 'it-speed-doubles',
    glyph: 'pala·palla',
    title: 'Doppia o no?',
    text: 'Las dobles consonantes cambian la palabra: pala, palla; sete, sette.',
    instructions: 'Elige la palabra bien escrita. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => doublesQuestion(ws as ItalianWord[]),
  },
  {
    id: 'it-speed-conjugation',
    glyph: 'io sono',
    title: 'Conjugación rápida',
    text: 'Elige la forma correcta del verbo contra el reloj.',
    instructions: 'Persona, verbo y tiempo: elige la forma correcta. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => conjugationQuestion(Math.random, tenseCountFor(ws as ItalianWord[])),
  },
  {
    id: 'it-speed-numbers',
    glyph: '28 = ventotto',
    title: 'I numeri',
    text: 'Del número a las letras: ventuno, ventotto, trentatré…',
    instructions: 'Elige cómo se escribe el número. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: () => numberQuestion(),
  },
  {
    id: 'it-speed-prepositions',
    glyph: 'dal·nel·sul',
    title: 'Preposizioni',
    text: 'in banca, dal medico, al mare; su + il = sul (desde A2).',
    instructions: 'Elige la preposición que falta o la forma unida al artículo. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => prepositionQuestion(ws as ItalianWord[]),
  },
  {
    id: 'it-speed-falsi-amici',
    glyph: 'burro ≠',
    title: 'Falsi amici',
    text: 'Las palabras que parecen españolas y no lo son: burro, salire, camera… (desde A2).',
    instructions: 'Elige lo que significa de verdad. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => (ws.some((w) => w.level !== 'A1') ? falsoAmicoQuestion() : null),
  },
  {
    id: 'it-speed-pronomi',
    glyph: 'glielo',
    title: 'Pronomi',
    text: 'Los pronombres combinados: me lo, te la, glielo, ce ne (desde B1).',
    instructions: 'Reemplaza el objeto y a quién por los dos pronombres juntos. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => (fromB1(ws as ItalianWord[]) ? pronounQuestion() : null),
  },
  {
    id: 'it-speed-congiuntivo',
    glyph: 'sia · è',
    title: 'Congiuntivo o indicativo?',
    text: 'Penso che sia, so che è: cuándo va el subjuntivo (desde B1).',
    instructions: 'Elige la forma correcta según lo que expresa la frase. Cada error descuenta 3 segundos.',
    kind: 'speed',
    record: (n) => `${n} correctas`,
    question: (ws) => (fromB1(ws as ItalianWord[]) ? subjunctiveQuestion() : null),
  },
]

export const italianCourse: EuroCourse = {
  id: 'it',
  lang: 'it',
  name: 'italiano',
  story: 'La strada di Lucca',
  textsIntro: 'La strada di Lucca: lecturas y diálogos con audio, como en el examen CILS. Toca una palabra para ver qué significa.',
  vocabIntro: 'Palabras por tema, siempre con su artículo y su plural. Lo que aprendes entra a tus repasos.',
  examName: (level) => ({ A1: 'CILS A1', A2: 'CILS A2', B1: 'CILS UNO-B1', B2: 'CILS DUE-B2', C1: 'CILS TRE-C1', C2: 'CILS QUATTRO-C2' })[level],
  examPath: (level) => `/cils/${level.toLowerCase()}`,
  genders: [
    { gender: 'm', article: 'il / lo / l’', className: genderColor.m },
    { gender: 'f', article: 'la / l’', className: genderColor.f },
  ],
  lessonIntro: (words) =>
    words.some((w) => w.pos === 'noun')
      ? 'Aprende cada sustantivo con su artículo y su plural: il libro, i libri; lo zaino, gli zaini. Con «l’» el género no se ve: fíjate en el color. Toca una palabra para oírla.'
      : words.some((w) => w.pos === 'adj')
        ? 'Aprende cada adjetivo con su femenino. Toca una palabra para oírla.'
        : 'Aprende cada palabra o expresión completa, tal como se usa. Toca una para oírla.',
  themes: [...italianThemesA1.map((t) => ({ id: t.id, title: t.title, level: 'A1' as const })), ...italianThemesA2.map((t) => ({ id: t.id, title: t.title, level: 'A2' as const })), ...italianThemesB1.map((t) => ({ id: t.id, title: t.title, level: 'B1' as const }))],
  vocabLessons: italianVocabLessons,
  vocabLessonById: italianVocabLessonById,
  texts: italianTexts,
  grammar: italianGrammar,
  path: italianPath,
  wordCardPrefix: ITALIAN_WORD_PREFIX,
  wordCard: (w) => italianWordCard(it(w)),
  nounLine: (w) => nounLine(it(w)),
  withArticle: (w) => withArticle(it(w)),
  speakWord: (w) => speakWord(it(w)),
  genderClass: (w) => (w.gender ? genderColor[w.gender] : ''),
  lessonExercises: (words) => italianLessonExercises(words as ItalianWord[]),
  meaningExercise: (w) => meaningExercise(it(w)),
  sayExercise: (w) => sayExercise(it(w)),
  lookup: lookupItalian,
  unlockedIds: italianUnlockedIds,
  itemDone: italianItemDone,
  itemStatus: italianItemStatus,
  wordPool: (p, open, levels) => italianWordPool(p, open, levels),
  poolLevels: italianPoolLevels,
  games,
  practiceModes: [
    { mode: 'palabras', glyph: '📖', title: 'Palabras', text: 'Significado y cómo se dice, con las palabras de tus lecciones.' },
    { mode: 'escribir', glyph: '⌨️', title: 'Escribir', text: 'Escribe la palabra en italiano, con su artículo. Sin tilde cuenta como «casi»; una doble que falta, no.' },
    { mode: 'articulos', glyph: 'il·lo·la', title: 'Artículos', text: 'il, lo, l’, la; un, uno, una, un’: el artículo según el género y la primera letra.' },
    { mode: 'plurales', glyph: 'i·gli·le', title: 'Plurales', text: 'El plural con su artículo: i parchi, gli zaini, le uova.' },
    { mode: 'dobles', glyph: 'pala·palla', title: 'Dobles consonantes', text: 'pala o palla, sete o sette: la doble cambia la palabra.' },
    { mode: 'conjugacion', glyph: 'io sono', title: 'Conjugación', text: 'El presente en el A1; desde el A2 también el passato prossimo, el imperfetto y el futuro.' },
    { mode: 'numeros', glyph: '21·28·33', title: 'Números', text: 'Del número a las letras: ventuno, ventotto, trentatré.' },
    { mode: 'preposiciones', glyph: 'dal·nel·sul', title: 'Preposiciones', text: 'in banca, dal medico, al mare; su + il = sul (desde A2).' },
    { mode: 'falsos-amigos', glyph: '≠', title: 'Falsos amigos', text: 'burro, salire, camera… lo que significan de verdad (desde A2).' },
    { mode: 'pronombres', glyph: 'glielo', title: 'Pronombres combinados', text: 'me lo, te la, glielo, ce ne (desde B1).' },
    { mode: 'subjuntivo', glyph: 'sia · è', title: 'Subjuntivo o indicativo', text: 'penso che sia, so che è, benché, anche se (desde B1).' },
  ],
  practiceSession: (mode, words, count) => practiceSession(mode as PracticeMode, words as ItalianWord[], count),
  check: (input, answers) => {
    const r = checkItalian(input, answers)
    return r === 'accents' ? 'almost' : r === 'ok' ? 'ok' : 'wrong'
  },
  almostNote: 'Casi: revisa las tildes.',
}
