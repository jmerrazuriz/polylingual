export type Script = 'hiragana' | 'katakana'

export type KanaGroup = 'basic' | 'dakuten' | 'yoon'

/** Datos escritos a mano de cada carácter (los trazos vienen de KanjiVG). */
export type KanaInfo = {
  romaji: string
  /** Otras romanizaciones aceptadas al responder (p. ej. "si" para し). */
  variants?: string[]
  /** Nota de pronunciación para hispanohablantes. */
  note?: string
}

/** Fila de la tabla: etiqueta a la izquierda y celdas (null = celda vacía). */
export type ChartRow = {
  label: string
  cells: (string | null)[]
}

export type ChartSection = {
  group: KanaGroup
  title: string
  description: string
  columns: string[]
  rows: ChartRow[]
}

export type Kana = KanaInfo & {
  id: string
  /** Ayuda visual para recordar la forma (solo en los básicos). */
  mnemonic?: string
  char: string
  script: Script
  group: KanaGroup
  /** Caracteres que se dibujan, en orden (きゃ → ['き', 'ゃ']). */
  parts: string[]
}

export type StrokeData = {
  /** Trazos en orden, como atributo `d` de un path SVG (viewBox 0 0 109 109). */
  strokes: string[]
  /** Posición de cada número de trazo. */
  numbers: [number, number][]
}

export type WordTheme =
  | 'saludos'
  | 'animales'
  | 'comida'
  | 'cuerpo'
  | 'naturaleza'
  | 'familia'
  | 'casa'
  | 'colores'
  | 'numeros'
  | 'lugares'
  | 'tiempo'
  | 'verbos'
  | 'adjetivos'

export type Word = {
  kana: string
  meaning: string
  theme: WordTheme
  /** Solo si la lectura no sale directo de los caracteres (partícula は → "wa"). */
  romaji?: string
}
