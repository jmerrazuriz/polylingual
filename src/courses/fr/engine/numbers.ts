// Números en letras según la ortografía tradicional de Francia:
// 70 = soixante-dix, 80 = quatre-vingts, 90 = quatre-vingt-dix; «et un» en 21, 31… 71;
// «vingts» y «cents» llevan -s solo si cierran el número; «mille» no varía.
// Variante belga/suiza opcional: septante, (huitante en Suiza), nonante.

const UNITS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize']
const TENS = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante']

export type NumberVariant = 'france' | 'belgique' | 'suisse'

function below100(n: number, variant: NumberVariant): string {
  if (n <= 16) return UNITS[n]
  if (n < 20) return `dix-${UNITS[n - 10]}`
  const t = Math.floor(n / 10)
  const u = n % 10
  if (variant !== 'france' && t >= 7) {
    const name = t === 7 ? 'septante' : t === 9 ? 'nonante' : variant === 'suisse' ? 'huitante' : null
    if (name) return u === 0 ? name : u === 1 ? `${name} et un` : `${name}-${UNITS[u]}`
  }
  if (t === 7) return u === 1 ? 'soixante et onze' : `soixante-${below100(10 + u, variant)}`
  if (t === 8) return u === 0 ? 'quatre-vingts' : `quatre-vingt-${UNITS[u]}`
  if (t === 9) return `quatre-vingt-${below100(10 + u, variant)}`
  if (u === 0) return TENS[t]
  return u === 1 ? `${TENS[t]} et un` : `${TENS[t]}-${UNITS[u]}`
}

function below1000(n: number, variant: NumberVariant, last: boolean): string {
  const h = Math.floor(n / 100)
  const r = n % 100
  // «quatre-vingts» pierde la -s si sigue algo (quatre-vingt mille).
  const rest = r === 0 ? '' : below100(r, variant).replace(/^quatre-vingts$/, last ? 'quatre-vingts' : 'quatre-vingt')
  if (h === 0) return rest
  const hundred = h === 1 ? 'cent' : `${UNITS[h]} cent${r === 0 && last ? 's' : ''}`
  return rest ? `${hundred} ${rest}` : hundred
}

/** Escribe un entero de 0 a 999 999 999 en letras. */
export function numberToWords(n: number, variant: NumberVariant = 'france'): string {
  if (!Number.isInteger(n) || n < 0 || n >= 1e9) throw new Error(`Número fuera de rango: ${n}`)
  if (n === 0) return 'zéro'
  const millions = Math.floor(n / 1e6)
  const thousands = Math.floor((n % 1e6) / 1000)
  const rest = n % 1000
  const parts: string[] = []
  if (millions) parts.push(`${below1000(millions, variant, true)} million${millions > 1 ? 's' : ''}`)
  if (thousands) parts.push(thousands === 1 ? 'mille' : `${below1000(thousands, variant, false)} mille`)
  if (rest) parts.push(below1000(rest, variant, true))
  return parts.join(' ')
}

/** Ordinal: premier/première, deuxième, cinquième, neuvième, vingt et unième. */
export function ordinal(n: number, feminine = false): string {
  if (n === 1) return feminine ? 'première' : 'premier'
  const w = numberToWords(n)
  if (w.endsWith('cinq')) return `${w}uième`
  if (w.endsWith('neuf')) return `${w.slice(0, -1)}vième`
  if (/(quatre-vingts|cents)$/.test(w)) return `${w.slice(0, -1)}ième`
  return `${w.replace(/e$/, '')}ième`
}

/** La regla que explica la forma, para la corrección explicada. */
export function numberReason(n: number): string {
  const r = n % 100
  if (r >= 70 && r < 80) return '70–79 se forman con soixante + 10–19: soixante-dix, soixante et onze, soixante-douze…'
  if (r === 80) return '80 es «cuatro veintes»: quatre-vingts, con -s porque cierra el número.'
  if (r > 80 && r < 90) return '81–89: quatre-vingt + unidad, sin -s y sin «et»: quatre-vingt-un.'
  if (r >= 90) return '90–99 se forman con quatre-vingt + 10–19: quatre-vingt-dix, quatre-vingt-onze…'
  if (r % 10 === 1 && r > 20) return 'En 21, 31, 41, 51 y 61 se usa «et un»: vingt et un.'
  if (n >= 200 && n % 100 === 0) return '«cents» lleva -s cuando se multiplica y cierra el número: deux cents, pero deux cent un.'
  return 'Decenas y unidades se unen con guion: trente-quatre.'
}
