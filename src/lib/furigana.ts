// Furigana en el texto: cada kanji (o grupo de kanji) lleva su lectura entre corchetes,
// justo después: 「駅[えき]まで 歩[ある]いて 行[い]けます。」. Así el contenido se escribe
// como texto normal y la app lo muestra con la lectura arriba (<ruby>) o sin ella.

export type FuriganaSegment = { text: string; ruby?: string }

const KANJI = '\\u3400-\\u9fff々〆'
const RUBY = new RegExp(`([${KANJI}]+)\\[([^\\]]+)\\]`, 'g')
export const KANJI_CHAR = new RegExp(`[${KANJI}]`)

/** Separa el texto en partes con y sin lectura. */
export function parseFurigana(text: string): FuriganaSegment[] {
  const out: FuriganaSegment[] = []
  let last = 0
  for (const m of text.matchAll(RUBY)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) })
    out.push({ text: m[1], ruby: m[2] })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ text: text.slice(last) })
  return out
}

/** Solo en kana (para leer en voz alta, el glosario y la corrección): 駅[えき] → えき. */
export const furiganaToKana = (text: string) => text.replace(RUBY, '$2')

/** Como se escribe normalmente, sin lecturas: 駅[えき] → 駅. */
export const furiganaToPlain = (text: string) => text.replace(RUBY, '$1')

/** ¿El texto trae kanji con lectura? */
export const hasFurigana = (text: string) => parseFurigana(text).some((s) => s.ruby)
