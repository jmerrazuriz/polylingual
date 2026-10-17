// Recorrido del curso de japonés: unidades en orden recomendado, cada una con
// paradas de 1 a 3 lecciones y, cuando corresponde, el repaso de la unidad.

import { grammarByCourse } from '../courses/content.ts'
import { counterLessons } from '../courses/ja/counters.ts'
import { kanjiLessons } from '../courses/ja/kanji.ts'
import { lessons as kanaLessons } from '../courses/ja/lessons.ts'
import { vocabLessons, vocabLessonsHira, vocabLessonsKata, vocabLessonsN3, vocabLessonsN4 } from '../courses/ja/vocab.ts'
import { examInfo, type ExamLevel, passedKey } from './mockExam.ts'
import { readingById, readingTexts, unlockedReadings } from './readings.ts'
import type { ProgressData } from './progress/model.ts'
import {
  COUNTERS_UNLOCKED_BY,
  KANJI_UNLOCKED_BY,
  unlockedGrammar,
  unlockedLessons,
  unlockedSequence,
  unlockedVocab,
} from './progress/unlock.ts'
import { units } from './units.ts'

export type PathItemKind = 'kana' | 'grammar' | 'counters' | 'kanji' | 'vocab' | 'reading' | 'exam' | 'unit'
export type PathItem = { kind: PathItemKind; id: string; title: string; to: string }
export type PathStop = { id: string; title: string; items: PathItem[] }
export type PathUnit = { id: string; title: string; icon: string; stops: PathStop[] }

const grammar = grammarByCourse.ja

const item = (kind: PathItemKind, id: string): PathItem => {
  switch (kind) {
    case 'kana':
      return { kind, id, title: kanaLessons.find((l) => l.id === id)!.title, to: `/aprender/${id}` }
    case 'grammar':
      return { kind, id, title: grammar.find((g) => g.id === id)!.title, to: `/gramatica/${id}` }
    case 'counters':
      return { kind, id, title: counterLessons.find((l) => l.id === id)!.title, to: `/contadores/${id}` }
    case 'kanji':
      return { kind, id, title: kanjiLessons.find((l) => l.id === id)!.title, to: `/kanji/${id}` }
    case 'vocab':
      return { kind, id, title: vocabLessons.find((l) => l.id === id)!.title, to: `/vocabulario/${id}` }
    case 'reading':
      return { kind, id, title: readingById.get(id)!.title, to: `/lectura/${id}` }
    case 'exam':
      return { kind, id, title: `Simulacro del JLPT ${id}`, to: examInfo[id as ExamLevel].path }
    case 'unit':
      return { kind, id, title: `Repaso: ${units.find((u) => u.id === id)!.title}`, to: `/repaso/unidad/${id}` }
  }
}

/** Parada con varias lecciones del mismo tipo. */
const stop = (kind: PathItemKind, ids: string[], title?: string): PathStop => {
  const items = ids.map((id) => item(kind, id))
  return { id: `${kind}:${ids.join('+')}`, title: title ?? items.map((i) => i.title).join(' · '), items }
}

const review = (unitId: string) => stop('unit', [unitId], 'Repaso de la unidad')
const kata = (...ids: string[]) => ids.map((id) => `kata-${id}`)
const kanji = (...ids: string[]) => ids.map((id) => `kanji-${id}`)

/** Unidad de vocabulario: las lecciones dadas, de a 3 por parada. */
function vocabUnit(n: number, title: string, lessons: { id: string }[]): PathUnit {
  const stops: PathStop[] = []
  for (let i = 0; i < lessons.length; i += 3) stops.push(stop('vocab', lessons.slice(i, i + 3).map((l) => l.id)))
  return { id: `vocab-${n}`, title, icon: '語', stops }
}
const hiraVocab = (from: number, to?: number) => vocabLessonsHira.slice(from, to)
/** Kanji N4 y N3: una unidad por grupo de lecciones (kanjiLessons agrupa por `unit`), de a 2 por parada. */
function kanjiUnitN4(id: string, units: string[], title: string, icon: string): PathUnit {
  const ids = kanjiLessons.filter((l) => units.includes(l.unit)).map((l) => l.id)
  const stops: PathStop[] = []
  for (let i = 0; i < ids.length; i += 2) stops.push(stop('kanji', ids.slice(i, i + 2)))
  return { id, title, icon, stops }
}

/** Vocabulario N4 en unidades de 12 lecciones (la última se lleva el resto). */
const n4Vocab = (n: number, last = false): PathUnit => ({
  ...vocabUnit(0, `N4 · Vocabulario ${['I', 'II', 'III', 'IV', 'V'][n - 1]}`, vocabLessonsN4.slice((n - 1) * 12, last ? undefined : n * 12)),
  id: `vocab-n4-${n}`,
})
/** Vocabulario N3 (con kanji) en unidades de 11 lecciones; la última se lleva el resto. */
const n3Vocab = (n: number, last = false): PathUnit => ({
  ...vocabUnit(0, `N3 · Vocabulario ${['I', 'II', 'III', 'IV', 'V'][n - 1]} (con kanji)`, vocabLessonsN3.slice((n - 1) * 11, last ? undefined : n * 11)),
  id: `vocab-n3-${n}`,
  icon: '語',
})

/** Meta de cada nivel: el simulacro del JLPT (se completa al aprobarlo). */
const examUnit = (level: ExamLevel): PathUnit => ({
  id: `examen-${level.toLowerCase()}`,
  title: `Meta: simulacro del JLPT ${level}`,
  icon: '📝',
  stops: [stop('exam', [level], `Simulacro del JLPT ${level}`)],
})

/** Unidad de lectura y audición: 10 textos (lecturas y diálogos) del nivel, de a 3 por parada. */
function readingUnit(n: number, title: string, level: 'N5' | 'N4' | 'N3' = 'N5'): PathUnit {
  const texts = readingTexts.filter((t) => t.level === level).slice((n - 1) * 10, n * 10)
  const stops: PathStop[] = []
  for (let i = 0; i < texts.length; i += 3) stops.push(stop('reading', texts.slice(i, i + 3).map((t) => t.id)))
  return { id: level === 'N5' ? `lectura-${n}` : `lectura-${level.toLowerCase()}-${n}`, title, icon: '読', stops }
}

export const japanesePath: PathUnit[] = [
  {
    id: 'hiragana-basic',
    title: 'Hiragana · Básicos',
    icon: 'あ',
    stops: [stop('kana', ['vocales', 'k']), stop('kana', ['s', 't']), stop('kana', ['n', 'h']), stop('kana', ['m', 'y']), stop('kana', ['r', 'w']), review('hiragana-basic')],
  },
  { id: 'grammar-1', title: 'Gramática I', icon: '文', stops: [stop('grammar', ['desu', 'wa']), stop('grammar', ['ka', 'no'])] },
  {
    id: 'hiragana-dakuten',
    title: 'Hiragana · Dakuten',
    icon: 'が',
    stops: [stop('kana', ['g', 'z']), stop('kana', ['d', 'b', 'p']), review('hiragana-dakuten')],
  },
  {
    id: 'hiragana-yoon',
    title: 'Hiragana · Combinados',
    icon: 'きゃ',
    stops: [stop('kana', ['yoon-1', 'yoon-2']), stop('kana', ['yoon-3', 'yoon-4']), review('hiragana-yoon')],
  },
  vocabUnit(1, 'Vocabulario I', hiraVocab(0, 12)),
  {
    id: 'counters-1',
    title: 'Números y contadores I',
    icon: '一',
    stops: [stop('counters', ['cont-numeros', 'cont-grandes']), stop('counters', ['cont-tsu-nin', 'cont-hon-mai'])],
  },
  {
    id: 'katakana-basic',
    title: 'Katakana · Básicos',
    icon: 'ア',
    stops: [
      stop('kana', kata('vocales', 'k')),
      stop('kana', kata('s', 't')),
      stop('kana', kata('n', 'h')),
      stop('kana', kata('m', 'y')),
      stop('kana', kata('r', 'w')),
      review('katakana-basic'),
    ],
  },
  { id: 'grammar-2', title: 'Gramática II', icon: '文', stops: [stop('grammar', ['kore', 'mo']), stop('grammar', ['o', 'ni-e'])] },
  vocabUnit(2, 'Vocabulario II', hiraVocab(12, 24)),
  {
    id: 'kanji-1',
    title: 'Kanji · Números y tiempo',
    icon: '日',
    stops: [
      stop('kanji', kanji('num-1', 'num-2')),
      stop('kanji', kanji('num-3', 'tiempo-1')),
      stop('kanji', kanji('tiempo-2', 'tiempo-3')),
    ],
  },
  {
    id: 'katakana-more',
    title: 'Katakana · Dakuten y combinados',
    icon: 'ガ',
    stops: [
      stop('kana', kata('g', 'z')),
      stop('kana', kata('d', 'b', 'p')),
      review('katakana-dakuten'),
      stop('kana', kata('yoon-1', 'yoon-2')),
      stop('kana', kata('yoon-3', 'yoon-4')),
      review('katakana-yoon'),
    ],
  },
  {
    id: 'counters-2',
    title: 'Números y contadores II',
    icon: '本',
    stops: [
      stop('counters', ['cont-hiki-ko', 'cont-satsu-dai-hai']),
      stop('counters', ['cont-hora', 'cont-fechas']),
      stop('counters', ['cont-edad-veces']),
    ],
  },
  { id: 'grammar-3', title: 'Gramática III', icon: '文', stops: [stop('grammar', ['de', 'adjetivos']), stop('grammar', ['aru-iru'])] },
  vocabUnit(3, 'Vocabulario III', hiraVocab(24, 36)),
  {
    id: 'kanji-2',
    title: 'Kanji · Personas y lugares',
    icon: '人',
    stops: [
      stop('kanji', kanji('personas-1', 'personas-2')),
      stop('kanji', kanji('naturaleza', 'posicion')),
      stop('kanji', kanji('puntos', 'naturaleza-2')),
    ],
  },
  {
    id: 'grammar-4',
    title: 'Gramática IV · Verbos y partículas',
    icon: '文',
    stops: [
      stop('grammar', ['koko-soko', 'ne-yo']),
      stop('grammar', ['grupos-verbos', 'ga']),
      stop('grammar', ['to-ya', 'ni-tiempo']),
      stop('grammar', ['kara-made', 'mashou']),
    ],
  },
  readingUnit(1, 'Lectura y audición I'),
  {
    id: 'katakana-extended',
    title: 'Katakana · Extendidos',
    icon: 'ファ',
    stops: [stop('kana', kata('ext-1', 'ext-2')), stop('kana', kata('ext-3')), review('katakana-extended')],
  },
  { ...vocabUnit(0, 'Vocabulario en katakana', vocabLessonsKata), id: 'vocab-kata', icon: 'カ' },
  vocabUnit(4, 'Vocabulario IV', hiraVocab(36, 48)),
  {
    id: 'kanji-3',
    title: 'Kanji · Adjetivos y verbos',
    icon: '見',
    stops: [stop('kanji', kanji('adjetivos', 'adjetivos-2')), stop('kanji', kanji('verbos-1', 'verbos-2'))],
  },
  {
    id: 'grammar-5',
    title: 'Gramática V · Forma て, ない y た',
    icon: '文',
    stops: [
      stop('grammar', ['tai', 'te-forma']),
      stop('grammar', ['te-kudasai', 'te-imasu']),
      stop('grammar', ['te-mo-ii', 'forma-nai']),
      stop('grammar', ['forma-ta', 'informal']),
    ],
  },
  readingUnit(2, 'Lectura y audición II'),
  vocabUnit(5, 'Vocabulario V', hiraVocab(48, 60)),
  {
    id: 'kanji-4',
    title: 'Kanji · Cuerpo, ciudad y trabajo',
    icon: '手',
    stops: [stop('kanji', kanji('cuerpo', 'cosas')), stop('kanji', kanji('ciudad', 'trabajo'))],
  },
  {
    id: 'grammar-6',
    title: 'Gramática VI · Adjetivos y comparaciones',
    icon: '文',
    stops: [
      stop('grammar', ['adj-pasado', 'adj-te']),
      stop('grammar', ['naru', 'comparar']),
      stop('grammar', ['kara-porque', 'preguntas-ka-mo']),
    ],
  },
  readingUnit(3, 'Lectura y audición III'),
  vocabUnit(6, 'Vocabulario VI', hiraVocab(60, 72)),
  {
    id: 'grammar-7',
    title: 'Gramática VII · Cerrando el N5',
    icon: '文',
    stops: [stop('grammar', ['ni-iku', 'antes-despues']), stop('grammar', ['mou-mada', 'deshou']), stop('grammar', ['no-ga-suki'])],
  },
  vocabUnit(7, 'Vocabulario VII', hiraVocab(72)),
  readingUnit(4, 'Lectura y audición IV'),
  examUnit('N5'),
  // ── Etapa B: N4 ──
  {
    id: 'grammar-n4-1',
    title: 'N4 · Gramática I: formas y condicionales',
    icon: '文',
    stops: [
      stop('grammar', ['potencial', 'volitiva']),
      stop('grammar', ['condicional-ba', 'condicional-tara']),
      stop('grammar', ['condicional-to-nara', 'dar-recibir']),
      stop('grammar', ['te-ageru', 'pasiva']),
    ],
  },
  n4Vocab(1),
  kanjiUnitN4('kanji-n4-1', ['N4 · Personas', 'N4 · Tiempo'], 'N4 · Kanji: personas y tiempo', '家'),
  {
    id: 'grammar-n4-2',
    title: 'N4 · Gramática II: matices',
    icon: '文',
    stops: [
      stop('grammar', ['causativa', 'te-shimau']),
      stop('grammar', ['te-oku-miru', 'obligacion']),
      stop('grammar', ['hou-ga-ii', 'sou-da']),
      stop('grammar', ['kamoshirenai', 'node-noni']),
    ],
  },
  n4Vocab(2),
  kanjiUnitN4('kanji-n4-2', ['N4 · Adjetivos'], 'N4 · Kanji: colores y adjetivos', '赤'),
  readingUnit(1, 'N4 · Lectura y audición I (con kanji)', 'N4'),
  {
    id: 'grammar-n4-3',
    title: 'N4 · Gramática III: opinar, comparar y propósito',
    icon: '文',
    stops: [stop('grammar', ['to-omou', 'you-da']), stop('grammar', ['nagara', 'sugiru']), stop('grammar', ['shi-tari', 'tame-ni'])],
  },
  n4Vocab(3),
  kanjiUnitN4('kanji-n4-3', ['N4 · Lugares y naturaleza', 'N4 · Comida y compras'], 'N4 · Kanji: lugares, comida y compras', '海'),
  {
    id: 'grammar-n4-4',
    title: 'N4 · Gramática IV: decisiones y keigo',
    icon: '敬',
    stops: [
      stop('grammar', ['koto-ni-suru', 'tokoro']),
      stop('grammar', ['te-aru', 'ka-dou-ka']),
      stop('grammar', ['keigo-respeto', 'keigo-humildad']),
    ],
  },
  n4Vocab(4),
  kanjiUnitN4('kanji-n4-4', ['N4 · Escuela', 'N4 · Verbos'], 'N4 · Kanji: escuela y verbos', '教'),
  n4Vocab(5, true),
  kanjiUnitN4('kanji-n4-5', ['N4 · Trabajo y sociedad'], 'N4 · Kanji: trabajo y sociedad', '仕'),
  readingUnit(2, 'N4 · Lectura y audición II (con kanji)', 'N4'),
  examUnit('N4'),
  // ── Etapa C: N3 ──
  {
    id: 'grammar-n3-1',
    title: 'N3 · Gramática I: intención, énfasis y puntos de vista',
    icon: '文',
    stops: [
      stop('grammar', ['you-to-suru', 'you-ni-suru']),
      stop('grammar', ['bakari', 'sae']),
      stop('grammar', ['koso', 'toshite']),
      stop('grammar', ['ni-totte', 'ni-tsuite']),
    ],
  },
  {
    id: 'grammar-n3-2',
    title: 'N3 · Gramática II: causas, deducciones y tiempo',
    icon: '文',
    stops: [
      stop('grammar', ['ni-yotte', 'wake']),
      stop('grammar', ['hazu-ga-nai', 'rashii']),
      stop('grammar', ['uchi-ni', 'tabi-ni']),
      stop('grammar', ['okage-sei', 'kawari-ni']),
    ],
  },
  kanjiUnitN4('kanji-n3-1', ['N3 · Personas y vida diaria'], 'N3 · Kanji: personas y vida diaria', '夢'),
  n3Vocab(1),
  readingUnit(1, 'N3 · Lectura y audición I', 'N3'),
  {
    id: 'grammar-n3-3',
    title: 'N3 · Gramática III: consejos, deber y grado',
    icon: '文',
    stops: [
      stop('grammar', ['mono-da', 'koto-da']),
      stop('grammar', ['beki', 'shika-nai']),
      stop('grammar', ['dake-de-naku', 'ba-hodo']),
      stop('grammar', ['hodo', 'to-shitara']),
    ],
  },
  {
    id: 'grammar-n3-4',
    title: 'N3 · Gramática IV: matices de la conversación',
    icon: '文',
    stops: [
      stop('grammar', ['kuse-ni', 'tsuide-ni']),
      stop('grammar', ['te-hoshii', 'tte']),
      stop('grammar', ['wari-ni', 'you-ni-iu']),
      stop('grammar', ['sasete-morau', 'conectores']),
    ],
  },
  kanjiUnitN4('kanji-n3-2', ['N3 · Trabajo y sociedad'], 'N3 · Kanji: trabajo y sociedad', '働'),
  n3Vocab(2),
  readingUnit(2, 'N3 · Lectura y audición II', 'N3'),
  kanjiUnitN4('kanji-n3-3', ['N3 · Sentimientos y cuerpo'], 'N3 · Kanji: sentimientos y cuerpo', '愛'),
  kanjiUnitN4('kanji-n3-4', ['N3 · Naturaleza y sociedad'], 'N3 · Kanji: naturaleza y sociedad', '島'),
  kanjiUnitN4('kanji-n3-5', ['N3 · Movimiento y cambio'], 'N3 · Kanji: movimiento y cambio', '進'),
  n3Vocab(3),
  n3Vocab(4, true),
  examUnit('N3'),
]

export type ItemStatus = 'done' | 'open' | 'locked'
export type StopStatus = 'done' | 'current' | 'open' | 'locked'

/** Estado de cada elemento del recorrido según el progreso. `open` = todo abierto (invitado o «desbloquear todo»). */
export function pathItemStatus(p: ProgressData, everythingOpen: boolean): (i: PathItem) => ItemStatus {
  const all = everythingOpen || p.unlockAll
  const kana = unlockedLessons(p.lessons, all)
  const gram = unlockedGrammar(
    grammar.map((g) => g.id),
    p.grammar,
    p.lessons,
    all,
  )
  const cont = unlockedSequence(
    counterLessons.map((l) => l.id),
    p.lessons,
    COUNTERS_UNLOCKED_BY,
    all,
  )
  const voc = unlockedVocab(p.lessons, all, p.grammar)
  const read = unlockedReadings(p.grammar, all)
  const kanj = unlockedSequence(
    kanjiLessons.map((l) => l.id),
    p.lessons,
    KANJI_UNLOCKED_BY,
    all,
  )
  return (i) => {
    switch (i.kind) {
      case 'kana':
        return p.lessons[i.id] ? 'done' : kana.has(i.id) ? 'open' : 'locked'
      case 'grammar':
        return p.grammar[i.id] ? 'done' : gram.has(i.id) ? 'open' : 'locked'
      case 'counters':
        return p.lessons[i.id] ? 'done' : cont.has(i.id) ? 'open' : 'locked'
      case 'kanji':
        return p.lessons[i.id] ? 'done' : kanj.has(i.id) ? 'open' : 'locked'
      case 'vocab':
        return p.lessons[i.id] ? 'done' : voc.has(i.id) ? 'open' : 'locked'
      case 'reading':
        return p.lessons[i.id] ? 'done' : read.has(i.id) ? 'open' : 'locked'
      case 'exam': {
        const level = i.id as ExamLevel
        if (p.records[passedKey(level)]) return 'done'
        return all || p.grammar[examInfo[level].lastGrammar] ? 'open' : 'locked'
      }
      case 'unit': {
        if (p.units[i.id]) return 'done'
        const unit = units.find((u) => u.id === i.id)!
        return all || unit.lessonIds.every((id) => p.lessons[id]) ? 'open' : 'locked'
      }
    }
  }
}

/** Estado de cada parada; la primera parada abierta sin terminar es la actual. */
export function pathStatus(p: ProgressData, everythingOpen: boolean) {
  const itemStatus = pathItemStatus(p, everythingOpen)
  const stops = new Map<string, StopStatus>()
  let current: PathStop | null = null
  for (const unit of japanesePath) {
    for (const s of unit.stops) {
      const statuses = s.items.map(itemStatus)
      let status: StopStatus = statuses.every((x) => x === 'done') ? 'done' : statuses.some((x) => x === 'open') ? 'open' : 'locked'
      if (status === 'open' && !current) {
        current = s
        status = 'current'
      }
      stops.set(s.id, status)
    }
  }
  return { stops, current, itemStatus }
}

/** Siguiente lección del recorrido (sin contar gramática ni repasos), para la lección del día. */
export function nextPathLesson(p: ProgressData, everythingOpen: boolean): PathItem | undefined {
  const itemStatus = pathItemStatus(p, everythingOpen)
  return japanesePath
    .flatMap((u) => u.stops.flatMap((s) => s.items))
    .find((i) => i.kind !== 'grammar' && i.kind !== 'unit' && i.kind !== 'exam' && itemStatus(i) === 'open')
}
