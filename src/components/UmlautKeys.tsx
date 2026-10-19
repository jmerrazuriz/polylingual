import type { RefObject } from 'react'
import { frenchKeys } from '../lib/frenchInput'
import { germanKeys } from '../lib/germanInput'
import { italianKeys } from '../lib/italianInput'

type KeysProps = { inputRef: RefObject<HTMLInputElement | null>; value: string; onChange: (v: string) => void }

/** Botones con letras especiales para escribir sin teclado del idioma. Insertan en la posición del cursor. */
export function LetterKeys({ inputRef, value, onChange, keys, label }: KeysProps & { keys: readonly string[]; label: string }) {
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
    <div className="flex flex-wrap gap-1.5" aria-label={label}>
      {keys.map((k) => (
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

/** ä ö ü ß. */
export const UmlautKeys = (props: KeysProps) => <LetterKeys {...props} keys={germanKeys} label="Letras alemanas" />

/** é è ê à ç œ… */
export const FrenchKeys = (props: KeysProps) => <LetterKeys {...props} keys={frenchKeys} label="Letras francesas" />

/** à è é ì ò ù */
export const ItalianKeys = (props: KeysProps) => <LetterKeys {...props} keys={italianKeys} label="Letras italianas" />
