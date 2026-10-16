const KANA = /[぀-ヿ]/

/** Texto con **negritas**; las partes en japonés usan la fuente japonesa. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
        const bold = part.startsWith('**') && part.endsWith('**')
        const content = bold ? part.slice(2, -2) : part
        if (!bold) return <span key={i}>{content}</span>
        return (
          <strong key={i} lang={KANA.test(content) ? 'ja' : undefined} className={KANA.test(content) ? 'font-jp' : undefined}>
            {content}
          </strong>
        )
      })}
    </>
  )
}
