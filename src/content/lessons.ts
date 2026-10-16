import type { KanaGroup } from './types.ts'

export type Lesson = {
  id: string
  group: KanaGroup
  title: string
  description: string
  /** Sílabas que enseña, en orden. */
  chars: string[]
}

const YOON =
  'Un carácter de la columna i + ゃ, ゅ o ょ pequeños forman una sola sílaba: きゃ se lee «kya» de un solo golpe, no «ki-ya».'

/** Orden de enseñanza del hiragana. */
export const hiraganaLessons: Lesson[] = [
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
]

/**
 * Sílabas aprendidas al terminar la lección (incluida). La っ pequeña cuenta
 * como aprendida junto con つ.
 */
export function learnedThrough(lessonId: string): Set<string> {
  const index = hiraganaLessons.findIndex((l) => l.id === lessonId)
  const learned = new Set(hiraganaLessons.slice(0, index + 1).flatMap((l) => l.chars))
  if (learned.has('つ')) learned.add('っ')
  return learned
}
