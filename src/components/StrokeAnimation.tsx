import type { CSSProperties } from 'react'
import { getStrokes } from '../courses/ja/kana'

const STROKE_SECONDS = 0.55
const GAP_SECONDS = 0.15

type Props = {
  /** Caracteres a dibujar en orden; los combinados se dibujan uno tras otro (き, ゃ). */
  parts: string[]
  /** Ancho de cada carácter en píxeles. */
  size?: number
  showNumbers?: boolean
}

/**
 * Dibuja el carácter trazo a trazo según KanjiVG. Para repetir la animación,
 * cambia la `key` del componente.
 */
export function StrokeAnimation({ parts, size = 160, showNumbers = true }: Props) {
  let index = 0

  return (
    <div className="flex justify-center gap-1">
      {parts.map((part, p) => {
        const data = getStrokes(part)
        if (!data) return null
        return (
          <svg
            key={p}
            viewBox="0 0 109 109"
            width={size}
            height={size}
            role="img"
            aria-label={`Orden de trazos de ${part}`}
            className="rounded-xl bg-white dark:bg-slate-800"
          >
            <g className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={0.6} strokeDasharray="2 2">
              <line x1="54.5" y1="4" x2="54.5" y2="105" />
              <line x1="4" y1="54.5" x2="105" y2="54.5" />
            </g>
            <g
              fill="none"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-slate-200 dark:stroke-slate-700"
            >
              {data.strokes.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
            <g fill="none" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" className="stroke-ink dark:stroke-white">
              {data.strokes.map((d, i) => {
                const delay = index++ * (STROKE_SECONDS + GAP_SECONDS)
                const style = { '--delay': `${delay}s`, '--dur': `${STROKE_SECONDS}s` } as CSSProperties
                return (
                  <g key={i}>
                    <path d={d} pathLength={1} className="stroke-draw" style={style} />
                    {showNumbers && (
                      <text
                        x={data.numbers[i][0]}
                        y={data.numbers[i][1]}
                        className="stroke-number fill-accent stroke-none text-[9px] font-bold"
                        style={style}
                      >
                        {i + 1}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          </svg>
        )
      })}
    </div>
  )
}
