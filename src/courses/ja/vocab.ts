// Vocabulario del curso: las palabras de words.ts más el vocabulario N5 de vocabData.ts,
// con clase gramatical (y grupo, en los verbos) y agrupado en lecciones por tema.

import type { VerbGroup } from '../../lib/conjugation.ts'
import type { WordTheme } from './types.ts'
import { type PosCode, type RawWord, vocabData, type VocabThemeId, vocabThemes } from './vocabData.ts'
import { vocabDataN3 } from './vocabDataN3.ts'
import { vocabDataN3b } from './vocabDataN3b.ts'
import { vocabDataN3c } from './vocabDataN3c.ts'
import { vocabDataN3d } from './vocabDataN3d.ts'
import { vocabDataN3e } from './vocabDataN3e.ts'
import { vocabDataN4 } from './vocabDataN4.ts'
import { allWords } from './words.ts'

export type PartOfSpeech = 'noun' | 'verb' | 'i-adj' | 'na-adj' | 'adverb' | 'question' | 'expression'

export type VocabEntry = {
  /** Identificador estable: el kana (con la clase si hay homónimos: かえる·v1). */
  id: string
  kana: string
  meaning: string
  pos: PartOfSpeech
  group?: VerbGroup
  theme: VocabThemeId
  level: 'N5' | 'N4' | 'N3'
  /** Forma escrita con kanji y lectura (furigana): 練習[れんしゅう]. Solo con kanji que enseña el curso. */
  written?: string
  /** Solo si la lectura no sale directo de los caracteres (こんにちは → konnichiwa). */
  romaji?: string
}

export type VocabLesson = {
  id: string
  title: string
  theme: VocabThemeId
  /** hira: N5 solo en hiragana · kata: N5 con katakana · n4 y n3: vocabulario de esos niveles. */
  track: 'hira' | 'kata' | 'n4' | 'n3'
  words: VocabEntry[]
}

export const posLabel: Record<PartOfSpeech, string> = {
  noun: 'sustantivo',
  verb: 'verbo',
  'i-adj': 'adjetivo い',
  'na-adj': 'adjetivo な',
  adverb: 'adverbio',
  question: 'pregunta / demostrativo',
  expression: 'expresión',
}

export const groupLabel: Record<VerbGroup, string> = { godan: 'grupo 1', ichidan: 'grupo 2', irregular: 'irregular' }

const fromCode: Record<PosCode, [PartOfSpeech, VerbGroup?]> = {
  n: ['noun'],
  v1: ['verb', 'godan'],
  v2: ['verb', 'ichidan'],
  v3: ['verb', 'irregular'],
  ai: ['i-adj'],
  ana: ['na-adj'],
  adv: ['adverb'],
  q: ['question'],
  exp: ['expression'],
}

const fromWordTheme: Record<Exclude<WordTheme, 'verbos' | 'adjetivos'>, [VocabThemeId, PosCode]> = {
  saludos: ['expresiones', 'exp'],
  animales: ['animales', 'n'],
  comida: ['comida', 'n'],
  cuerpo: ['cuerpo', 'n'],
  naturaleza: ['naturaleza', 'n'],
  familia: ['personas', 'n'],
  casa: ['casa', 'n'],
  colores: ['colores', 'n'],
  numeros: ['numeros', 'n'],
  lugares: ['lugares', 'n'],
  tiempo: ['tiempo', 'n'],
  ropa: ['ropa', 'n'],
  ocio: ['ocio', 'n'],
  paises: ['paises', 'n'],
}

/** Orden de los temas en las lecciones (se intercalan: una lección de cada tema por vuelta). */
const themeOrder: VocabThemeId[] = [
  'expresiones',
  'numeros',
  'personas',
  'verbos-1',
  'comida',
  'adjetivos-i',
  'tiempo',
  'verbos-2',
  'lugares',
  'preguntas',
  'casa',
  'verbos-3',
  'adjetivos-na',
  'escuela',
  'adverbios',
  'cuerpo',
  'colores',
  'animales',
  'naturaleza',
  'ropa',
  'ocio',
  'paises',
]

function build(): VocabEntry[] {
  type Raw = { kana: string; meaning: string; code: PosCode; theme: VocabThemeId; romaji?: string }
  const byKey = new Map<string, Raw>()
  const key = (kana: string, code: PosCode) => `${kana}|${code}`
  const dataByKana = new Map<string, { code: PosCode; theme: VocabThemeId }>()
  for (const [theme, list] of Object.entries(vocabData) as [VocabThemeId, RawWord[]][]) {
    for (const [kana, , code] of list) if (code !== 'n' && !dataByKana.has(kana)) dataByKana.set(kana, { code, theme })
  }
  // Primero las palabras de siempre (las conocidas de los juegos), luego las nuevas.
  for (const w of allWords) {
    let theme: VocabThemeId
    let code: PosCode
    if (w.theme === 'verbos' || w.theme === 'adjetivos') {
      const data = dataByKana.get(w.kana)
      if (!data) throw new Error(`Falta la clase de ${w.kana}`)
      ;({ theme, code } = data)
    } else {
      ;[theme, code] = fromWordTheme[w.theme]
    }
    if (!byKey.has(key(w.kana, code))) byKey.set(key(w.kana, code), { kana: w.kana, meaning: w.meaning, code, theme, romaji: w.romaji })
  }
  for (const [theme, list] of Object.entries(vocabData) as [VocabThemeId, RawWord[]][]) {
    for (const [kana, meaning, code] of list) if (!byKey.has(key(kana, code))) byKey.set(key(kana, code), { kana, meaning, code, theme })
  }
  const raws = [...byKey.values()]
  const kanaCount = new Map<string, number>()
  for (const r of raws) kanaCount.set(r.kana, (kanaCount.get(r.kana) ?? 0) + 1)
  return raws.map((r) => {
    const [pos, group] = fromCode[r.code]
    return {
      id: kanaCount.get(r.kana)! > 1 ? `${r.kana}·${r.code}` : r.kana,
      kana: r.kana,
      meaning: r.meaning,
      pos,
      ...(group ? { group } : {}),
      theme: r.theme,
      level: 'N5' as const,
      ...(r.romaji ? { romaji: r.romaji } : {}),
    }
  })
}

/**
 * Cada nivel nuevo se agrega después sin tocar los ids anteriores (de ellos dependen las
 * tarjetas guardadas): una palabra nueva usa su kana como id si está libre y, si no,
 * kana·clase. Las que ya están en un nivel anterior con la misma clase se ignoran.
 */
function buildLevel(previous: VocabEntry[], data: Partial<Record<VocabThemeId, RawWord[]>>, level: 'N4' | 'N3'): VocabEntry[] {
  const codeOf = (v: VocabEntry): PosCode =>
    (Object.entries(fromCode) as [PosCode, [PartOfSpeech, VerbGroup?]][]).find(([, [pos, group]]) => pos === v.pos && group === v.group)![0]
  const seen = new Set(previous.map((v) => `${v.kana}|${codeOf(v)}`))
  const usedIds = new Set([...previous.map((v) => v.id), ...previous.map((v) => v.kana)])
  const out: VocabEntry[] = []
  for (const [theme, list] of Object.entries(data) as [VocabThemeId, RawWord[]][]) {
    for (const [kana, meaning, code, written] of list) {
      if (seen.has(`${kana}|${code}`)) continue
      const id = usedIds.has(kana) ? `${kana}·${code}` : kana
      if (usedIds.has(id)) continue
      seen.add(`${kana}|${code}`)
      usedIds.add(id)
      usedIds.add(kana)
      const [pos, group] = fromCode[code]
      out.push({ id, kana, meaning, pos, ...(group ? { group } : {}), theme, level, ...(written ? { written } : {}) })
    }
  }
  return out
}

const vocabN5 = build()
export const vocabN4 = buildLevel(vocabN5, vocabDataN4, 'N4')
const vocabN3a = buildLevel([...vocabN5, ...vocabN4], vocabDataN3, 'N3')
const vocabN3b = buildLevel([...vocabN5, ...vocabN4, ...vocabN3a], vocabDataN3b, 'N3')
const vocabN3c = buildLevel([...vocabN5, ...vocabN4, ...vocabN3a, ...vocabN3b], vocabDataN3c, 'N3')
const vocabN3d = buildLevel([...vocabN5, ...vocabN4, ...vocabN3a, ...vocabN3b, ...vocabN3c], vocabDataN3d, 'N3')
const vocabN3e = buildLevel([...vocabN5, ...vocabN4, ...vocabN3a, ...vocabN3b, ...vocabN3c, ...vocabN3d], vocabDataN3e, 'N3')
export const vocabN3 = [...vocabN3a, ...vocabN3b, ...vocabN3c, ...vocabN3d, ...vocabN3e]
export const vocab: VocabEntry[] = [...vocabN5, ...vocabN4, ...vocabN3]
export const vocabById = new Map(vocab.map((v) => [v.id, v]))
export const verbs = vocab.filter((v) => v.pos === 'verb')
export const iAdjectives = vocab.filter((v) => v.pos === 'i-adj')
export const naAdjectives = vocab.filter((v) => v.pos === 'na-adj')

const hasKatakana = (kana: string) => /[゠-ヿ]/.test(kana)

/** Parte una lista en trozos de ~`size`, de tamaños parejos (23 → 8, 8, 7). */
function chunk<T>(list: T[], size: number): T[][] {
  const n = Math.max(1, Math.ceil(list.length / size))
  const out: T[][] = []
  let start = 0
  for (let i = 0; i < n; i++) {
    const len = Math.floor(list.length / n) + (i < list.length % n ? 1 : 0)
    out.push(list.slice(start, start + len))
    start += len
  }
  return out.filter((c) => c.length)
}

/** Lecciones de palabras en hiragana: por tema, intercalando los temas en cada vuelta. */
function hiraganaLessons(): VocabLesson[] {
  const perTheme = themeOrder.map((theme) => {
    const parts = chunk(
      vocabN5.filter((v) => v.theme === theme && !hasKatakana(v.kana)),
      10,
    )
    return parts.map(
      (words, i): VocabLesson => ({
        id: `voc-${theme}-${i + 1}`,
        title: `${vocabThemes[theme]}${parts.length > 1 ? ` · ${i + 1}` : ''}`,
        theme,
        track: 'hira',
        words,
      }),
    )
  })
  const rounds = Math.max(...perTheme.map((p) => p.length))
  const out: VocabLesson[] = []
  for (let r = 0; r < rounds; r++) for (const p of perTheme) if (p[r]) out.push(p[r])
  return out
}

/** Lecciones de palabras con katakana (casi todas préstamos), en orden de tema. */
function katakanaLessons(): VocabLesson[] {
  const words = themeOrder.flatMap((theme) => vocabN5.filter((v) => v.theme === theme && hasKatakana(v.kana)))
  return chunk(words, 12).map((part, i) => ({
    id: `voc-kata-${i + 1}`,
    title: `Palabras en katakana ${i + 1}`,
    theme: part[0].theme,
    track: 'kata',
    words: part,
  }))
}

/** Temas del N4 en el orden en que se intercalan (con los nuevos: trabajo y sociedad). */
const themeOrderN4: VocabThemeId[] = [
  'expresiones',
  'verbos-1',
  'personas',
  'adjetivos-i',
  'trabajo',
  'verbos-2',
  'tiempo',
  'adjetivos-na',
  'lugares',
  'verbos-3',
  'escuela',
  'adverbios',
  'casa',
  'comida',
  'cuerpo',
  'sociedad',
  'ocio',
  'naturaleza',
  'preguntas',
]

/** Temas del N3 (con sentimientos), en el orden en que se intercalan. */
const themeOrderN3: VocabThemeId[] = [
  'sentimientos',
  'verbos-1',
  'personas',
  'adjetivos-na',
  'trabajo',
  'verbos-2',
  'sociedad',
  'adjetivos-i',
  'tiempo',
  'verbos-3',
  'escuela',
  'adverbios',
  'lugares',
  'cuerpo',
  'casa',
  'expresiones',
]

/** Temas de la segunda y tercera tanda N3 (con naturaleza y ocio). */
const themeOrderN3b: VocabThemeId[] = [
  'sentimientos',
  'verbos-1',
  'personas',
  'adjetivos-na',
  'trabajo',
  'verbos-2',
  'sociedad',
  'adjetivos-i',
  'tiempo',
  'verbos-3',
  'escuela',
  'naturaleza',
  'adverbios',
  'lugares',
  'cuerpo',
  'ocio',
  'casa',
  'expresiones',
]

/** Temas de la cuarta y quinta tanda N3 (se suman comida, ropa, animales, colores e idiomas). */
const themeOrderN3d: VocabThemeId[] = [...themeOrderN3b, 'comida', 'ropa', 'animales', 'colores', 'paises']

/**
 * Lecciones de un nivel (N4, N3): por tema, intercalando los temas en cada vuelta, como las del N5.
 * Una tanda nueva (`after`: las lecciones de las tandas anteriores) sigue la numeración de cada tema
 * sin cambiar las lecciones que ya existen.
 */
function levelLessons(entries: VocabEntry[], order: VocabThemeId[], level: 'N4' | 'N3', after: VocabLesson[] = []): VocabLesson[] {
  const prefix = level === 'N4' ? 'voc4' : 'voc3'
  const track = level === 'N4' ? 'n4' : 'n3'
  const perTheme = order.map((theme) => {
    const parts = chunk(
      entries.filter((v) => v.theme === theme),
      10,
    )
    const offset = after.filter((l) => l.theme === theme).length
    return parts.map(
      (words, i): VocabLesson => ({
        id: `${prefix}-${theme}-${offset + i + 1}`,
        title: `${level} · ${vocabThemes[theme]}${parts.length + offset > 1 ? ` · ${offset + i + 1}` : ''}`,
        theme,
        track,
        words,
      }),
    )
  })
  const rounds = Math.max(...perTheme.map((p) => p.length))
  const out: VocabLesson[] = []
  for (let r = 0; r < rounds; r++) for (const p of perTheme) if (p[r]) out.push(p[r])
  return out
}

export const vocabLessonsHira = hiraganaLessons()
export const vocabLessonsKata = katakanaLessons()
export const vocabLessonsN4 = levelLessons(vocabN4, themeOrderN4, 'N4')
const vocabLessonsN3a = levelLessons(vocabN3a, themeOrderN3, 'N3')
/** Lecciones N3 por tanda (en el recorrido cada tanda tiene sus unidades). */
const vocabLessonsN3b = levelLessons(vocabN3b, themeOrderN3b, 'N3', vocabLessonsN3a)
export const vocabLessonsN3Batches: VocabLesson[][] = [
  vocabLessonsN3a,
  vocabLessonsN3b,
  levelLessons(vocabN3c, themeOrderN3b, 'N3', [...vocabLessonsN3a, ...vocabLessonsN3b]),
]
vocabLessonsN3Batches.push(levelLessons(vocabN3d, themeOrderN3d, 'N3', vocabLessonsN3Batches.flat()))
vocabLessonsN3Batches.push(levelLessons(vocabN3e, themeOrderN3d, 'N3', vocabLessonsN3Batches.flat()))
export const vocabLessonsN3 = vocabLessonsN3Batches.flat()
export const vocabLessons: VocabLesson[] = [...vocabLessonsHira, ...vocabLessonsKata, ...vocabLessonsN4, ...vocabLessonsN3]

/** Las palabras solo en hiragana se abren al terminar el hiragana; las de katakana, al terminar el katakana. */
export const VOCAB_UNLOCKED_BY = 'yoon-4'
export const VOCAB_KATA_UNLOCKED_BY = 'kata-ext-3'
/** El vocabulario N4 se abre con la primera lección de gramática N4, y el N3 con la primera N3. */
export const VOCAB_N4_UNLOCKED_BY_GRAMMAR = 'potencial'
export const VOCAB_N3_UNLOCKED_BY_GRAMMAR = 'you-to-suru'
