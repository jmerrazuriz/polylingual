// Números en letras del italiano. Se escriben en una sola palabra hasta los millones:
// 1984 = millenovecentottantaquattro. Las decenas pierden la vocal ante «uno» y «otto»
// (ventuno, trentotto) y «tre» final lleva tilde en los compuestos (ventitré, centotré).

const UNITS = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove']
const TENS = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta']

function below100(n: number): string {
  if (n < 20) return UNITS[n]
  const t = TENS[Math.floor(n / 10)]
  const u = n % 10
  if (u === 0) return t
  if (u === 1 || u === 8) return `${t.slice(0, -1)}${UNITS[u]}`
  return `${t}${UNITS[u]}`
}

/** 0–999 sin la tilde final (se agrega al cerrar el número). */
function below1000(n: number): string {
  const h = Math.floor(n / 100)
  const r = n % 100
  const hundred = h === 0 ? '' : h === 1 ? 'cento' : `${UNITS[h]}cento`
  const tail = r === 0 ? '' : below100(r)
  // «cento» pierde la o ante «otto» y «ottanta»: centotto, novecentottanta.
  return (tail.startsWith('ott') ? hundred.slice(0, -1) : hundred) + tail
}

/** Escribe un entero de 0 a 999 999 999 en letras. */
export function numberToWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n >= 1e9) throw new Error(`Número fuera de rango: ${n}`)
  if (n === 0) return 'zero'
  const millions = Math.floor(n / 1e6)
  const thousands = Math.floor((n % 1e6) / 1000)
  const rest = n % 1000
  const parts: string[] = []
  if (millions) parts.push(millions === 1 ? 'un milione' : `${below1000(millions).replace(/uno$/, 'un')} milioni`)
  // «mille», pero «duemila», «ventunmila».
  let tail = ''
  if (thousands) tail += thousands === 1 ? 'mille' : `${below1000(thousands).replace(/uno$/, 'un')}mila`
  if (rest) tail += below1000(rest)
  if (tail) parts.push(tail)
  const words = parts.join(' ')
  // «tre» final de un compuesto lleva tilde: ventitré, centotré, milletré; «tre» solo, no.
  return n > 3 && words.endsWith('tre') ? `${words.slice(0, -3)}tré` : words
}

const ORDINALS = ['', 'primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto', 'settimo', 'ottavo', 'nono', 'decimo']

/** Ordinal masculino o femenino, de 1 a 1000: primo, terzo, undicesimo, ventitreesimo, centesimo. */
export function ordinal(n: number, feminine = false): string {
  if (n < 1 || n > 1000 || !Number.isInteger(n)) throw new Error(`Ordinal fuera de rango: ${n}`)
  let w: string
  if (n <= 10) w = ORDINALS[n]
  else {
    const card = numberToWords(n)
    // ventitré → ventitreesimo; ventisei → ventiseiesimo (conservan la vocal); el resto la pierde.
    if (card.endsWith('tré')) w = `${card.slice(0, -1)}eesimo`
    else if (card.endsWith('sei')) w = `${card}esimo`
    else w = `${card.slice(0, -1)}esimo`
  }
  return feminine ? `${w.slice(0, -1)}a` : w
}

/** La regla que explica la forma, para la corrección explicada. */
export function numberReason(n: number): string {
  const r = n % 100
  if (n > 20 && (r % 10 === 1 || r % 10 === 8) && r > 20) return 'Las decenas pierden la vocal final ante «uno» y «otto»: ventuno, trentotto, quarantotto.'
  if (n > 3 && n % 10 === 3 && r !== 13) return '«tre» al final de un número compuesto lleva tilde: ventitré, centotré.'
  if (n >= 2000 && n % 1000 === 0 && n < 1e6) return '«mille» en singular, pero «mila» desde dos mil: duemila, tremila.'
  if (n >= 1e6) return 'Millón va separado y concuerda: un milione, due milioni.'
  if (n >= 100) return 'Se escribe en una sola palabra: centoventi, milleduecento.'
  return 'Decenas y unidades van juntas, sin «y»: trentadue, quarantasei.'
}
