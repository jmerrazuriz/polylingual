import { getStrokes } from '../../content/kana.ts'
import { distance, length, meanDistance, pathToPoints, type Point, resample } from './geometry.ts'

const SAMPLES = 32

/**
 * Tolerancia (distancia media, en unidades del cuadro de 109) según el largo del
 * trazo esperado: los trazos cortos, como las rayitas del dakuten, piden más precisión.
 */
const tolerance = (expectedLength: number) => Math.min(16, Math.max(8, expectedLength * 0.35))

export type StrokeMatch = 'ok' | 'reversed' | 'no'

/**
 * 0 si el trazo termina donde empezó (círculo), ~1 si es una línea. Se mide contra
 * la diagonal del rectángulo que lo contiene, que casi no cambia con el temblor de la mano.
 */
function closure(points: readonly Point[]): number {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const diagonal = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys))
  return diagonal === 0 ? 1 : distance(points[0], points[points.length - 1]) / diagonal
}

/** Compara un trazo dibujado con el esperado: forma, posición, extremos y dirección. */
export function matchStroke(user: readonly Point[], expected: readonly Point[]): StrokeMatch {
  const expectedLength = length(expected)
  const tol = tolerance(expectedLength)
  const u = resample(user, SAMPLES)
  const e = resample(expected, SAMPLES)

  // Un trazo demasiado corto no cuenta (salvo que el esperado también sea un toque corto).
  const userLength = length(user)
  if (expectedLength > 15 && userLength < expectedLength * 0.4) return 'no'
  // Un trazo cerrado (el círculo de ぱ) no vale por uno abierto (las rayitas de ば), ni al revés.
  if (expectedLength > 3 && userLength > 3 && Math.abs(closure(u) - closure(e)) > 0.5) {
    return 'no'
  }

  const endpointsOk = distance(u[0], e[0]) < tol * 1.6 && distance(u[SAMPLES - 1], e[SAMPLES - 1]) < tol * 1.6
  if (endpointsOk && meanDistance(u, e) < tol) return 'ok'
  if (meanDistance(u, [...e].reverse()) < tol) return 'reversed'
  return 'no'
}

export type StrokeCheck =
  | { ok: true; /** Trazos esperados que cubre (2 si unió dos trazos seguidos). */ consumed: number }
  | { ok: false; reason: 'direction' | 'order' | 'shape' }

/** Evalúa el trazo dibujado contra el siguiente trazo esperado (`next`). */
export function checkStroke(user: readonly Point[], strokes: readonly Point[][], next: number): StrokeCheck {
  const match = matchStroke(user, strokes[next])
  if (match === 'ok') return { ok: true, consumed: 1 }

  // Mucha gente une dos trazos seguidos (き, さ, ふ, や…): se acepta como ambos.
  if (next + 1 < strokes.length && matchStroke(user, [...strokes[next], ...strokes[next + 1]]) === 'ok') {
    return { ok: true, consumed: 2 }
  }
  if (match === 'reversed') return { ok: false, reason: 'direction' }
  for (let j = next + 1; j < strokes.length; j++) {
    if (matchStroke(user, strokes[j]) === 'ok') return { ok: false, reason: 'order' }
  }
  return { ok: false, reason: 'shape' }
}

/** Puntuación de 1 a 5 según los errores cometidos al escribir un carácter. */
export function scoreFromMistakes(mistakes: number): number {
  if (mistakes === 0) return 5
  if (mistakes === 1) return 4
  if (mistakes <= 3) return 3
  if (mistakes <= 5) return 2
  return 1
}

const cache = new Map<string, Point[][]>()

/** Trazos esperados de un carácter como polilíneas. */
export function expectedStrokes(char: string): Point[][] {
  let strokes = cache.get(char)
  if (!strokes) {
    strokes = (getStrokes(char)?.strokes ?? []).map(pathToPoints)
    cache.set(char, strokes)
  }
  return strokes
}
