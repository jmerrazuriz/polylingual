import { Furigana } from '../../components/Furigana'
import { BOLD, ITALIC } from '../../lib/richText'

const KANA = /[぀-ヿ]/

/** Texto con **negritas** y furigana (漢字[かんじ]); las partes en japonés usan la fuente japonesa. */
function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split(BOLD).map((part, i) => {
        const bold = part.startsWith('**') && part.endsWith('**')
        const content = bold ? part.slice(2, -2) : part
        if (!bold) {
          return (
            <span key={i}>
              <Furigana text={content} />
            </span>
          )
        }
        return (
          <strong key={i} lang={KANA.test(content) ? 'ja' : undefined} className={KANA.test(content) ? 'font-jp' : undefined}>
            <Furigana text={content} />
          </strong>
        )
      })}
    </>
  )
}

/** Texto con **negritas**, *cursivas* (los ejemplos en el idioma) y furigana. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(ITALIC).map((part, i) =>
        i % 2 === 1 ? (
          <em key={i}>
            <Bold text={part.slice(1, -1)} />
          </em>
        ) : (
          <Bold key={i} text={part} />
        ),
      )}
    </>
  )
}
