import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from 'react'
import { getStrokes } from '../content/kana'
import { checkStroke, expectedStrokes, type StrokeCheck } from '../lib/strokes/evaluate'
import type { Point } from '../lib/strokes/geometry'

/** calcar: silueta completa · guía: solo el siguiente trazo · memoria: nada · libre: silueta y sin corrección. */
export type WritingHelp = 'trace' | 'guide' | 'memory' | 'free'

type Props = {
  /** Carácter a escribir (uno solo; los combinados se escriben parte por parte). */
  char: string
  help: WritingHelp
  /** Se llama una vez al completar todos los trazos (no en modo libre). */
  onComplete?: (mistakes: number) => void
}

const BOX = 109
/** Errores en el mismo trazo antes de mostrar la pista automáticamente. */
const HINT_AFTER = 2
const FLASH_MS = 700

const messages: Record<Extract<StrokeCheck, { ok: false }>['reason'], string> = {
  direction: 'Ese trazo va en la dirección contraria.',
  order: 'Ese trazo va más adelante: sigue el orden.',
  shape: 'Ese trazo no coincide. Fíjate en la pista.',
}

const toPath = (points: readonly Point[]) =>
  points.length === 1
    ? `M${points[0].x},${points[0].y}l0.01,0`
    : points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('')

export function WritingCanvas({ char, help, onComplete }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const paths = getStrokes(char)?.strokes ?? []
  const strokes = expectedStrokes(char)
  const free = help === 'free'

  const [accepted, setAccepted] = useState(0)
  const drawing = useRef<Point[] | null>(null)
  const [current, setCurrent] = useState<Point[] | null>(null)
  const [freeStrokes, setFreeStrokes] = useState<Point[][]>([])
  const [mistakes, setMistakes] = useState(0)
  const [mistakesHere, setMistakesHere] = useState(0)
  const [flash, setFlash] = useState<Point[] | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [hint, setHint] = useState(0)

  const done = !free && accepted >= strokes.length
  const showHint = !done && !free && (hint > 0 || mistakesHere >= HINT_AFTER)

  const completed = useRef(false)
  useEffect(() => {
    if (done && !completed.current) {
      completed.current = true
      onComplete?.(mistakes)
    }
  }, [done, mistakes, onComplete])

  useEffect(() => {
    if (!flash) return
    const timer = setTimeout(() => setFlash(null), FLASH_MS)
    return () => clearTimeout(timer)
  }, [flash])

  const toBox = (e: PointerEvent): Point => {
    const rect = svgRef.current!.getBoundingClientRect()
    return { x: ((e.clientX - rect.left) / rect.width) * BOX, y: ((e.clientY - rect.top) / rect.height) * BOX }
  }

  const down = (e: PointerEvent<SVGSVGElement>) => {
    if (done) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Sin captura el trazo igual funciona mientras no salga del lienzo.
    }
    drawing.current = [toBox(e)]
    setCurrent(drawing.current)
  }

  const move = (e: PointerEvent<SVGSVGElement>) => {
    if (!drawing.current) return
    // Puntos coalescidos: más precisión cuando el dedo se mueve rápido.
    const events = e.nativeEvent.getCoalescedEvents?.() ?? []
    const points = (events.length ? events : [e.nativeEvent]).map((ev) => toBox(ev as unknown as PointerEvent))
    // Los puntos se acumulan en un ref: varios eventos pueden llegar antes de que React vuelva a renderizar.
    drawing.current = [...drawing.current, ...points]
    setCurrent(drawing.current)
  }

  const up = () => {
    const stroke = drawing.current
    if (!stroke) return
    drawing.current = null
    setCurrent(null)

    if (free) {
      setFreeStrokes([...freeStrokes, stroke])
      return
    }
    const result = checkStroke(stroke, strokes, accepted)
    if (result.ok) {
      setAccepted(accepted + result.consumed)
      setMistakesHere(0)
      setHint(0)
      setMessage(null)
    } else {
      setMistakes(mistakes + 1)
      setMistakesHere(mistakesHere + 1)
      setFlash(stroke)
      setMessage(messages[result.reason])
    }
  }

  const ghost = (d: string, i: number) => <path key={i} d={d} className="stroke-slate-200 dark:stroke-slate-700" />

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${BOX} ${BOX}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        role="img"
        aria-label={`Lienzo para escribir ${help === 'memory' ? 'el carácter' : char}`}
        className={`aspect-square w-full max-w-80 touch-none rounded-3xl border-2 bg-white select-none dark:bg-slate-900 ${
          done ? 'border-emerald-500' : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <g className="stroke-slate-200 dark:stroke-slate-800" strokeWidth={0.5} strokeDasharray="2 2">
          <line x1="54.5" y1="0" x2="54.5" y2="109" />
          <line x1="0" y1="54.5" x2="109" y2="54.5" />
        </g>

        <g fill="none" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
          {(help === 'trace' || free) && paths.map(ghost)}
          {help === 'guide' && !done && paths[accepted] && ghost(paths[accepted], accepted)}
        </g>

        {showHint && paths[accepted] && (
          <g key={`${accepted}-${hint}-${mistakesHere}`} fill="none" strokeWidth={5} strokeLinecap="round">
            <path
              d={paths[accepted]}
              pathLength={1}
              className="stroke-draw stroke-accent/60"
              style={{ '--delay': '0s', '--dur': '0.8s' } as CSSProperties}
            />
            <circle cx={strokes[accepted][0].x} cy={strokes[accepted][0].y} r={2.5} className="fill-accent stroke-none" />
          </g>
        )}

        <g fill="none" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
          {paths.slice(0, accepted).map((d, i) => (
            <path key={i} d={d} className={done ? 'stroke-emerald-600' : 'stroke-ink dark:stroke-white'} />
          ))}
          {freeStrokes.map((s, i) => (
            <path key={`f${i}`} d={toPath(s)} className="stroke-ink dark:stroke-white" />
          ))}
          {flash && <path d={toPath(flash)} className="stroke-red-500 opacity-70" />}
          {current && <path d={toPath(current)} className="stroke-ink dark:stroke-white" />}
        </g>
      </svg>

      <p role="status" className="h-5 text-center text-sm font-semibold text-red-600 dark:text-red-400">
        {message}
      </p>

      <div className="flex gap-2">
        {free ? (
          <>
            <button
              onClick={() => setFreeStrokes(freeStrokes.slice(0, -1))}
              disabled={freeStrokes.length === 0}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold disabled:opacity-40 dark:border-slate-700"
            >
              ↶ Deshacer
            </button>
            <button
              onClick={() => setFreeStrokes([])}
              disabled={freeStrokes.length === 0}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold disabled:opacity-40 dark:border-slate-700"
            >
              Borrar
            </button>
          </>
        ) : (
          !done && (
            <button
              // Pedir pista cuenta como un error, igual que en la tabla durante una evaluación.
              onClick={() => {
                setHint(hint + 1)
                setMistakes(mistakes + 1)
              }}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold dark:border-slate-700"
            >
              💡 Pista
            </button>
          )
        )}
        {!free && (
          <span className="self-center text-sm text-slate-500">
            Trazo {Math.min(accepted + 1, strokes.length)} de {strokes.length}
          </span>
        )}
      </div>
    </div>
  )
}
