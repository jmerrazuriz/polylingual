import type { RefObject } from 'react'
import { germanKeys } from '../lib/germanInput'

/** Botones ä ö ü ß para escribir en alemán sin teclado alemán. Insertan en la posición del cursor. */
export function UmlautKeys({ inputRef, value, onChange }: { inputRef: RefObject<HTMLInputElement | null>; value: string; onChange: (v: string) => void }) {
  const insert = (ch: string) => {
    const el = inputRef.current
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    onChange(value.slice(0, start) + ch + value.slice(end))
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(start + ch.length, start + ch.length)
    })
  }
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Letras alemanas">
      {germanKeys.map((k) => (
        <button
          key={k}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => insert(k)}
          className="h-9 min-w-9 rounded-lg border border-slate-300 bg-white px-2 font-bold hover:border-accent dark:border-slate-700 dark:bg-slate-900"
        >
          {k}
        </button>
      ))}
    </div>
  )
}
