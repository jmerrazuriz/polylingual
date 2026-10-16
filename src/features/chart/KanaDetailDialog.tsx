import { useEffect, useRef, useState } from 'react'
import { KanaCard } from '../../components/KanaCard'
import type { Kana } from '../../courses/ja/types'
import { wordsContaining } from '../../lib/words'

type Props = {
  kana: Kana | null
  /** Caracteres de la sección actual, para ir al anterior / siguiente. */
  list: Kana[]
  hideRomaji: boolean
  onSelect: (kana: Kana) => void
  onClose: () => void
}

export function KanaDetailDialog({ kana, list, hideRomaji, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (kana && !dialog.open) dialog.showModal()
    if (!kana && dialog.open) dialog.close()
    setRevealed(false)
  }, [kana])

  if (!kana) return <dialog ref={ref} onClose={onClose} />

  const index = list.indexOf(kana)
  const prev = list[index - 1]
  const next = list[index + 1]

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      className="m-auto mb-0 w-full max-w-md rounded-t-3xl bg-white p-0 text-slate-800 backdrop:bg-slate-950/50 sm:mb-auto sm:rounded-3xl dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="flex max-h-[90dvh] flex-col gap-4 overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => prev && onSelect(prev)}
            disabled={!prev}
            className="rounded-full px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:invisible dark:hover:bg-slate-800"
          >
            ← {prev?.char}
          </button>
          <button
            onClick={() => ref.current?.close()}
            aria-label="Cerrar"
            className="h-9 w-9 rounded-full text-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ×
          </button>
          <button
            onClick={() => next && onSelect(next)}
            disabled={!next}
            className="rounded-full px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:invisible dark:hover:bg-slate-800"
          >
            {next?.char} →
          </button>
        </div>

        <KanaCard
          kana={kana}
          words={wordsContaining(kana.char)}
          showAnswer={!hideRomaji || revealed}
          onReveal={() => setRevealed(true)}
        />
      </div>
    </dialog>
  )
}
