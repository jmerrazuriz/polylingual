import { LONG_VOWEL, toKatakana } from './katakana.ts'
import type { KanaGroup, Script } from './types.ts'

export type Lesson = {
  id: string
  script: Script
  group: KanaGroup
  title: string
  description: string
  /** Sílabas que enseña, en orden. */
  chars: string[]
}

const YOON =
  'Un carácter de la columna i + ゃ, ゅ o ょ pequeños forman una sola sílaba: きゃ se lee «kya» de un solo golpe, no «ki-ya».'

/** Orden de enseñanza del hiragana. */
export const hiraganaLessons: Lesson[] = ([
  {
    id: 'vocales',
    group: 'basic',
    title: 'Vocales',
    description: 'Las cinco vocales. Suenan casi igual que en español, pero el orden japonés es a, i, u, e, o.',
    chars: ['あ', 'い', 'う', 'え', 'お'],
  },
  {
    id: 'k',
    group: 'basic',
    title: 'Fila K',
    description: 'La k con cada vocal. Suena como en «casa», «kilo», «cuna», «queso» y «cosa».',
    chars: ['か', 'き', 'く', 'け', 'こ'],
  },
  {
    id: 's',
    group: 'basic',
    title: 'Fila S',
    description: 'La s con cada vocal. Ojo con し: se lee «shi», no «si».',
    chars: ['さ', 'し', 'す', 'せ', 'そ'],
  },
  {
    id: 't',
    group: 'basic',
    title: 'Fila T',
    description: 'La t con cada vocal, con dos sorpresas: ち es «chi» y つ es «tsu».',
    chars: ['た', 'ち', 'つ', 'て', 'と'],
  },
  {
    id: 'n',
    group: 'basic',
    title: 'Fila N',
    description: 'La n con cada vocal. ぬ y ね terminan con un rulo.',
    chars: ['な', 'に', 'ぬ', 'ね', 'の'],
  },
  {
    id: 'h',
    group: 'basic',
    title: 'Fila H',
    description: 'La h se aspira como una jota suave. ふ es «fu», soplando con los labios.',
    chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  },
  {
    id: 'm',
    group: 'basic',
    title: 'Fila M',
    description: 'La m con cada vocal. Compara め con ぬ: め no tiene rulo.',
    chars: ['ま', 'み', 'む', 'め', 'も'],
  },
  {
    id: 'y',
    group: 'basic',
    title: 'Fila Y',
    description: 'Solo tres: ya, yu, yo. Más adelante sirven para formar los combinados.',
    chars: ['や', 'ゆ', 'よ'],
  },
  {
    id: 'r',
    group: 'basic',
    title: 'Fila R',
    description: 'La r japonesa siempre es suave, entre r y l. Compara る (con rulo) y ろ (sin rulo).',
    chars: ['ら', 'り', 'る', 'れ', 'ろ'],
  },
  {
    id: 'w',
    group: 'basic',
    title: 'W y N',
    description: 'わ, を (que se lee «o») y ん, la única consonante que va sola.',
    chars: ['わ', 'を', 'ん'],
  },
  {
    id: 'g',
    group: 'dakuten',
    title: 'Fila G',
    description: 'Las dos rayitas convierten la k en g. La g siempre es suave: ぎ es «gui» y げ es «gue».',
    chars: ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  },
  {
    id: 'z',
    group: 'dakuten',
    title: 'Fila Z',
    description: 'Las dos rayitas convierten la s en z. じ suena «ji» como en inglés («jeans»).',
    chars: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
  },
  {
    id: 'd',
    group: 'dakuten',
    title: 'Fila D',
    description: 'Las dos rayitas convierten la t en d. ぢ y づ suenan igual que じ y ず, y casi no se usan.',
    chars: ['だ', 'ぢ', 'づ', 'で', 'ど'],
  },
  {
    id: 'b',
    group: 'dakuten',
    title: 'Fila B',
    description: 'Las dos rayitas convierten la h en b.',
    chars: ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
  },
  {
    id: 'p',
    group: 'dakuten',
    title: 'Fila P',
    description: 'El circulito (handakuten) convierte la h en p.',
    chars: ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
  },
  {
    id: 'yoon-1',
    group: 'yoon',
    title: 'Combinados con き, し, ち',
    description: YOON,
    chars: ['きゃ', 'きゅ', 'きょ', 'しゃ', 'しゅ', 'しょ', 'ちゃ', 'ちゅ', 'ちょ'],
  },
  {
    id: 'yoon-2',
    group: 'yoon',
    title: 'Combinados con に, ひ, み',
    description: YOON,
    chars: ['にゃ', 'にゅ', 'にょ', 'ひゃ', 'ひゅ', 'ひょ', 'みゃ', 'みゅ', 'みょ'],
  },
  {
    id: 'yoon-3',
    group: 'yoon',
    title: 'Combinados con り, ぎ, じ',
    description: YOON,
    chars: ['りゃ', 'りゅ', 'りょ', 'ぎゃ', 'ぎゅ', 'ぎょ', 'じゃ', 'じゅ', 'じょ'],
  },
  {
    id: 'yoon-4',
    group: 'yoon',
    title: 'Combinados con び, ぴ',
    description: YOON,
    chars: ['びゃ', 'びゅ', 'びょ', 'ぴゃ', 'ぴゅ', 'ぴょ'],
  },
] as Omit<Lesson, 'script'>[]).map((l) => ({ ...l, script: 'hiragana' }))

const KATA_YOON =
  'Un carácter de la columna i + ャ, ュ o ョ pequeños forman una sola sílaba: キャ se lee «kya» de un solo golpe.'

/** Lecciones de katakana: mismas filas que el hiragana, con sus propias claves, más los extendidos. */
export const katakanaLessons: Lesson[] = (
  [
    ['vocales', 'Las vocales en katakana, el silabario de las palabras extranjeras. La rayita ー alarga la vocal anterior: ケーキ (keeki), «pastel».'],
    ['k', 'Igual que en hiragana, pero con trazos rectos. カ se parece mucho a か.'],
    ['s', 'Ojo con シ (shi): se confunde mucho con ツ (tsu). En シ el trazo largo sube.'],
    ['t', 'チ es «chi» y ツ es «tsu». En ツ los puntitos van arriba y el trazo largo baja.'],
    ['n', 'ニ es に sin el palito. ヌ tiene una rayita que cruza; ス (fila S) no.'],
    ['h', 'ヘ es casi idéntica a へ. フ es «fu», de un solo trazo.'],
    ['m', 'メ es una cruz inclinada; ム parece un brazo flexionado.'],
    ['y', 'ヤ, ユ y ヨ: también forman los combinados.'],
    ['r', 'La r suave, entre r y l. Compara ル (dos trazos) con レ (uno solo).'],
    ['w', 'ワ, ヲ (se lee «o» y casi no se usa) y ン. Compara ン con ソ: en ン el trazo largo sube.'],
    ['g', 'Las dos rayitas convierten la k en g: カ → ガ. ギ es «gui» y ゲ es «gue».'],
    ['z', 'Las dos rayitas convierten la s en z: サ → ザ. ジ suena «ji» como en inglés.'],
    ['d', 'Las dos rayitas convierten la t en d: タ → ダ. ヂ y ヅ casi no se usan.'],
    ['b', 'Las dos rayitas convierten la h en b: ハ → バ.'],
    ['p', 'El circulito convierte la h en p: ハ → パ.'],
  ] as const
)
  .map(([id, description]): Lesson => {
    const base = hiraganaLessons.find((l) => l.id === id)!
    return { ...base, id: `kata-${id}`, script: 'katakana', description, chars: base.chars.map(toKatakana) }
  })
  .concat(
    hiraganaLessons
      .filter((l) => l.group === 'yoon')
      .map((l) => ({
        ...l,
        id: `kata-${l.id}`,
        script: 'katakana' as const,
        title: toKatakana(l.title),
        description: KATA_YOON,
        chars: l.chars.map(toKatakana),
      })),
    [
      {
        id: 'kata-ext-1',
        script: 'katakana',
        group: 'extended',
        title: 'Extendidos: F, T y D',
        description: 'Sonidos que no existen en japonés tradicional: un carácter más una vocal pequeña. フ + ァ = ファ (fa); テ + ィ = ティ (ti).',
        chars: ['ファ', 'フィ', 'フェ', 'フォ', 'ティ', 'ディ', 'トゥ', 'ドゥ'],
      },
      {
        id: 'kata-ext-2',
        script: 'katakana',
        group: 'extended',
        title: 'Extendidos: W, SH, J y CH',
        description: 'Más sonidos extranjeros con vocales pequeñas: ウィ (wi), シェ (she), ジェ (je), チェ (che).',
        chars: ['ウィ', 'ウェ', 'ウォ', 'シェ', 'ジェ', 'チェ'],
      },
      {
        id: 'kata-ext-3',
        script: 'katakana',
        group: 'extended',
        title: 'Extendidos: V',
        description: 'ヴ (ウ con dakuten) representa la «v», aunque casi siempre se pronuncia como b.',
        chars: ['ヴァ', 'ヴィ', 'ヴ', 'ヴェ', 'ヴォ'],
      },
    ],
  )

/** Todas las lecciones: primero hiragana, después katakana. */
export const lessons: Lesson[] = [...hiraganaLessons, ...katakanaLessons]

export const lessonsByScript: Record<Script, Lesson[]> = { hiragana: hiraganaLessons, katakana: katakanaLessons }

/**
 * Sílabas aprendidas al terminar la lección (incluida), dentro de su silabario.
 * La っ/ッ pequeña cuenta como aprendida junto con つ/ツ, y la ー desde la primera lección de katakana.
 */
export function learnedThrough(lessonId: string): Set<string> {
  const lesson = lessons.find((l) => l.id === lessonId)
  if (!lesson) return new Set()
  const list = lessonsByScript[lesson.script]
  const learned = new Set(list.slice(0, list.indexOf(lesson) + 1).flatMap((l) => l.chars))
  if (learned.has('つ')) learned.add('っ')
  if (learned.has('ツ')) learned.add('ッ')
  if (lesson.script === 'katakana') learned.add(LONG_VOWEL)
  return learned
}
