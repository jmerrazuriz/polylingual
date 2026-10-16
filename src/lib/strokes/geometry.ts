// Geometría de trazos en el sistema de coordenadas de KanjiVG (cuadro de 109 × 109).

export type Point = { x: number; y: number }

const TOKEN = /[MmCcSsLlHhVvZz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g
const CURVE_STEPS = 12

const cubic = (p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point => {
  const u = 1 - t
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  }
}

/** Convierte el atributo `d` de un path (M, L, H, V, C, S y sus formas relativas) en una polilínea. */
export function pathToPoints(d: string): Point[] {
  const tokens = d.match(TOKEN) ?? []
  const points: Point[] = []
  let i = 0
  let command = ''
  let cur: Point = { x: 0, y: 0 }
  let lastControl: Point | null = null

  const num = () => Number(tokens[i++])
  const isCommand = (t: string | undefined) => t !== undefined && /[a-z]/i.test(t)

  while (i < tokens.length) {
    if (isCommand(tokens[i])) command = tokens[i++]
    const rel = command === command.toLowerCase()
    const at = (x: number, y: number): Point => (rel ? { x: cur.x + x, y: cur.y + y } : { x, y })

    switch (command.toUpperCase()) {
      case 'M':
        cur = at(num(), num())
        points.push(cur)
        lastControl = null
        // Coordenadas extra después de M se tratan como L.
        command = rel ? 'l' : 'L'
        break
      case 'L':
        cur = at(num(), num())
        points.push(cur)
        lastControl = null
        break
      case 'H': {
        const x = num()
        cur = { x: rel ? cur.x + x : x, y: cur.y }
        points.push(cur)
        lastControl = null
        break
      }
      case 'V': {
        const y = num()
        cur = { x: cur.x, y: rel ? cur.y + y : y }
        points.push(cur)
        lastControl = null
        break
      }
      case 'C':
      case 'S': {
        const smooth = command.toUpperCase() === 'S'
        const c1: Point = smooth
          ? lastControl
            ? { x: 2 * cur.x - lastControl.x, y: 2 * cur.y - lastControl.y }
            : cur
          : at(num(), num())
        const c2 = at(num(), num())
        const end = at(num(), num())
        for (let s = 1; s <= CURVE_STEPS; s++) points.push(cubic(cur, c1, c2, end, s / CURVE_STEPS))
        lastControl = c2
        cur = end
        break
      }
      case 'Z':
        lastControl = null
        break
      default:
        // Comando no soportado: se salta el token para no quedar en un bucle.
        i++
    }
  }
  return points
}

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

export function length(points: readonly Point[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) total += dist(points[i - 1], points[i])
  return total
}

/** Remuestrea la polilínea a `n` puntos igualmente espaciados a lo largo del trazo. */
export function resample(points: readonly Point[], n = 32): Point[] {
  if (points.length === 0) return []
  const total = length(points)
  if (total === 0) return Array.from({ length: n }, () => ({ ...points[0] }))

  const step = total / (n - 1)
  const out: Point[] = [{ ...points[0] }]
  let carried = 0
  for (let i = 1; i < points.length && out.length < n; i++) {
    let a = points[i - 1]
    const b = points[i]
    let segment = dist(a, b)
    while (carried + segment >= step && out.length < n) {
      const t = (step - carried) / segment
      const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
      out.push(p)
      a = p
      segment = dist(a, b)
      carried = 0
    }
    carried += segment
  }
  while (out.length < n) out.push({ ...points[points.length - 1] })
  return out
}

/** Distancia media entre puntos correspondientes (ambas listas del mismo largo). */
export function meanDistance(a: readonly Point[], b: readonly Point[]): number {
  let total = 0
  for (let i = 0; i < a.length; i++) total += dist(a[i], b[i])
  return total / a.length
}

export { dist as distance }
