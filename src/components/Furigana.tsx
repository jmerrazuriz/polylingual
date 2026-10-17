import { parseFurigana } from '../lib/furigana'

/** Texto con furigana (lectura sobre los kanji); con `show` en false se ven solo los kanji. */
export function Furigana({ text, show = true }: { text: string; show?: boolean }) {
  return (
    <>
      {parseFurigana(text).map((s, i) =>
        s.ruby ? (
          show ? (
            <ruby key={i}>
              {s.text}
              <rt className="text-[0.5em] font-normal text-slate-500 dark:text-slate-400">{s.ruby}</rt>
            </ruby>
          ) : (
            <span key={i}>{s.text}</span>
          )
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  )
}
