import { hiraganaChart, hiraganaInfo } from './hiragana.ts'
import type { ChartSection, KanaInfo } from './types.ts'

/** あ → ア: el katakana está 0x60 posiciones después del hiragana en Unicode. */
export function toKatakana(text: string): string {
  return [...text]
    .map((c) => {
      const code = c.codePointAt(0)!
      return code >= 0x3041 && code <= 0x3096 ? String.fromCodePoint(code + 0x60) : c
    })
    .join('')
}

/** ア → あ (los caracteres sin pareja, como ヴ extendidos o ー, quedan igual). */
export function toHiragana(text: string): string {
  return [...text]
    .map((c) => {
      const code = c.codePointAt(0)!
      return code >= 0x30a1 && code <= 0x30f6 ? String.fromCodePoint(code - 0x60) : c
    })
    .join('')
}

const F_NOTE = 'Sonido que no existe en japonés tradicional: se usa para palabras extranjeras.'

/** Combinaciones extra del katakana para sonidos extranjeros. */
const extendedInfo: Record<string, KanaInfo> = {
  ファ: { romaji: 'fa', note: 'Una f suave, soplando con los labios como en ふ.' },
  フィ: { romaji: 'fi', note: F_NOTE },
  フェ: { romaji: 'fe', note: F_NOTE },
  フォ: { romaji: 'fo', note: F_NOTE },
  ティ: { romaji: 'ti', note: 'Una «ti» de verdad (チ es «chi»). Como en パーティー, fiesta.' },
  ディ: { romaji: 'di', note: 'Una «di» de verdad (ヂ suena «ji»).' },
  トゥ: { romaji: 'tu', note: 'Una «tu» de verdad (ツ es «tsu»).' },
  ドゥ: { romaji: 'du', note: F_NOTE },
  ウィ: { romaji: 'wi', note: 'Suena «ui», como en «huida».' },
  ウェ: { romaji: 'we', note: 'Suena «ue», como en «huevo».' },
  ウォ: { romaji: 'wo', variants: ['who'], note: 'Suena «uo». No confundir con ヲ, que se lee «o».' },
  シェ: { romaji: 'she', note: 'Como «she» en inglés: la «sh» de シ con e.' },
  ジェ: { romaji: 'je', note: 'Como «je» en inglés (jet), no la jota española.' },
  チェ: { romaji: 'che', note: 'Como «che» en «cheque».' },
  ヴァ: { romaji: 'va', note: 'ヴ representa la «v», aunque casi siempre se pronuncia como b.' },
  ヴィ: { romaji: 'vi', note: 'ヴ representa la «v», aunque casi siempre se pronuncia como b.' },
  ヴ: { romaji: 'vu', note: 'ウ con dakuten: representa la «v». Se pronuncia casi como «bu».' },
  ヴェ: { romaji: 've', note: 'ヴ representa la «v», aunque casi siempre se pronuncia como b.' },
  ヴォ: { romaji: 'vo', note: 'ヴ representa la «v», aunque casi siempre se pronuncia como b.' },
}

/** Mismas lecturas y notas que el hiragana (suenan igual), más los extendidos. */
export const katakanaInfo: Record<string, KanaInfo> = {
  ...Object.fromEntries(
    Object.entries(hiraganaInfo).map(([char, info]) => [
      toKatakana(char),
      { ...info, note: info.note && toKatakana(info.note) },
    ]),
  ),
  ...extendedInfo,
}

export const katakanaMnemonics: Record<string, string> = {
  ア: 'Un hacha vista de lado: «¡a!».',
  イ: 'Una «i» que se apoya en un poste.',
  ウ: 'Es う en versión cuadrada, con su palito arriba.',
  エ: 'Una viga de construcción, como las de un «e»dificio.',
  オ: 'Una persona con los brazos abiertos que exclama «¡oh!».',
  カ: 'Igual que か, pero sin la rayita de la derecha: «ka».',
  キ: 'Una llave con dos dientes, como き pero recta. Llave en inglés es «key».',
  ク: 'El pico de un pájaro que canta «cu-cú», como く.',
  ケ: 'Una «K» torcida, como け: «ke».',
  コ: 'Una caja abierta hacia la izquierda: un «co»fre sin tapa.',
  サ: 'Como さ pero recta: dos palitos cruzando una raya, «sa».',
  シ: 'Una cara que mira hacia arriba con los ojos a la izquierda: «shi». El trazo largo sube.',
  ス: 'Una persona de perfil que corre «su»dando.',
  セ: 'Como せ: una boca con un colmillo, «se».',
  ソ: 'Una lágrima que cae desde arriba: «so»llozo. El trazo largo baja.',
  タ: 'ク con una rayita adentro: «ta».',
  チ: 'Como ち sin la curva final: «chi».',
  ツ: 'Una cara que mira hacia abajo con los ojos arriba: un «tsu»nami que cae.',
  テ: 'Una antena de «te»levisión.',
  ト: 'Un poste con una rama: un «to»tem.',
  ナ: 'Una cruz torcida, como la mitad de な: «na».',
  ニ: 'Dos rayas, como に sin el palito: «ni».',
  ヌ: 'Palillos cruzando fideos: «nu»dles. La rayita extra la distingue de ス.',
  ネ: 'Una persona con sombrero ladeado: «ne».',
  ノ: 'Un solo trazo inclinado, como decir «no» con la mano.',
  ハ: 'Dos rayitas que se separan, como una risa «ja, ja» (ha).',
  ヒ: 'Alguien sentado que se ríe «ji, ji» (hi), parecida a ひ.',
  フ: 'Como ふ simplificada en un solo trazo: «fu».',
  ヘ: 'Igual que へ: una colina chiquita.',
  ホ: 'Una cruz con dos patitas, como ほ: «ho».',
  マ: 'Una cara de perfil con su nariz: «ma».',
  ミ: 'Tres rayitas, como tres «mi»nutos.',
  ム: 'Un brazo flexionado mostrando el «mú»sculo.',
  メ: 'Una «X» de marca: «me» equivoqué.',
  モ: 'Como も: un anzuelo con dos carnadas.',
  ヤ: 'Como や: la cabeza de un yak con sus cuernos.',
  ユ: 'Una «U» cuadrada de lado: «yu».',
  ヨ: 'Una «E» al revés: «yo» escribo al revés.',
  ラ: 'Como ら recta: una raya y un gancho.',
  リ: 'Como り: dos cintas colgando.',
  ル: 'Dos patas abiertas; la derecha termina en un ganchito: «ru».',
  レ: 'Una «L» ladeada de un solo trazo: «re».',
  ロ: 'Una caja cerrada: «ro».',
  ワ: 'Una boca abierta que dice «¡wa!».',
  ヲ: 'Como ワ con una rayita más. Se lee «o» y casi no se usa.',
  ン: 'Un puntito y un trazo que sube desde abajo: «n».',
}

/** Pequeños: forman combinados (キャ), extendidos (ファ) y la consonante doble (ッ). */
export const smallKatakana: Record<string, string> = {
  ャ: 'ya',
  ュ: 'yu',
  ョ: 'yo',
  ッ: '',
  ァ: 'a',
  ィ: 'i',
  ゥ: 'u',
  ェ: 'e',
  ォ: 'o',
}

/** La rayita ー alarga la vocal anterior (ケーキ → keeki). */
export const LONG_VOWEL = 'ー'

const katakanaDescriptions: Record<string, string> = {
  basic: 'Los 46 caracteres base, con las mismas lecturas que el hiragana pero trazos más rectos.',
  dakuten:
    'Dos rayitas (dakuten) vuelven sonora la consonante: カ→ガ (k→g), サ→ザ (s→z), タ→ダ (t→d), ハ→バ (h→b). Un circulito (handakuten) cambia h→p: ハ→パ.',
  yoon: 'Un carácter de la columna i más un ャ, ュ o ョ pequeño forman una sola sílaba: キ + ャ = キャ (kya).',
}

export const katakanaChart: ChartSection[] = [
  ...hiraganaChart.map((section) => ({
    ...section,
    description: katakanaDescriptions[section.group],
    rows: section.rows.map((row) => ({ ...row, cells: row.cells.map((c) => (c ? toKatakana(c) : null)) })),
  })),
  {
    group: 'extended',
    title: 'Extendidos',
    description: 'Combinaciones para sonidos de palabras extranjeras: un carácter más una vocal pequeña (フ + ァ = ファ).',
    columns: ['a', 'i', 'u', 'e', 'o'],
    rows: [
      { label: 'f', cells: ['ファ', 'フィ', null, 'フェ', 'フォ'] },
      { label: 't', cells: [null, 'ティ', 'トゥ', null, null] },
      { label: 'd', cells: [null, 'ディ', 'ドゥ', null, null] },
      { label: 'w', cells: [null, 'ウィ', null, 'ウェ', 'ウォ'] },
      { label: 'sh', cells: [null, null, null, 'シェ', null] },
      { label: 'j', cells: [null, null, null, 'ジェ', null] },
      { label: 'ch', cells: [null, null, null, 'チェ', null] },
      { label: 'v', cells: ['ヴァ', 'ヴィ', 'ヴ', 'ヴェ', 'ヴォ'] },
    ],
  },
]

export const katakanaConfusables: { chars: string[]; tip: string }[] = [
  { chars: ['シ', 'ツ'], tip: 'シ: los puntitos van a la izquierda y el trazo largo sube. ツ: los puntitos van arriba y el trazo largo baja.' },
  { chars: ['ソ', 'ン'], tip: 'ソ: el trazo largo baja desde arriba. ン: el puntito está a la izquierda y el trazo largo sube.' },
  { chars: ['ク', 'タ', 'ケ'], tip: 'タ es ク con una rayita adentro. ケ tiene la raya horizontal hacia la derecha y una pata larga.' },
  { chars: ['ウ', 'ワ', 'フ'], tip: 'ウ tiene un palito arriba; ワ tiene un palito a la izquierda; フ es un solo trazo sin palitos.' },
  { chars: ['コ', 'ユ', 'ロ'], tip: 'コ está abierta a la izquierda, ユ tiene la raya de abajo larga y ロ está cerrada.' },
  { chars: ['ス', 'ヌ'], tip: 'ヌ tiene una rayita extra que cruza el trazo diagonal; ス no.' },
  { chars: ['チ', 'テ'], tip: 'En チ el trazo vertical cruza la raya horizontal; テ tiene dos rayas y el trazo baja desde la de abajo.' },
  { chars: ['ア', 'マ'], tip: 'ア tiene una pata que baja curvada; マ termina con un puntito en el medio.' },
  { chars: ['ル', 'レ'], tip: 'ル tiene dos trazos (un palito a la izquierda); レ es uno solo.' },
  { chars: ['ノ', 'メ'], tip: 'メ es ノ cruzada por un trazo corto.' },
]
