import { romajiToKana } from '../lib/kanaInput'

type Props = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  state?: 'idle' | 'right' | 'wrong'
  placeholder?: string
}

const border = { idle: 'border-slate-200 focus:border-accent dark:border-slate-800', right: 'border-emerald-500', wrong: 'border-red-500' }

/**
 * Campo para escribir en kana con un teclado normal: el romaji se convierte en
 * hiragana al escribir (taberu → たべる; «nn» o «n'» para ん, «-» para ー).
 * Con un teclado japonés se puede escribir directo en kana.
 */
export function KanaInput({ value, onChange, disabled, state = 'idle', placeholder = 'Escribe en romaji: taberu → たべる' }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <input
        lang="ja"
        value={value}
        onChange={(e) => {
          const composing = (e.nativeEvent as InputEvent).isComposing
          onChange(composing ? e.target.value : romajiToKana(e.target.value))
        }}
        disabled={disabled}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        placeholder={placeholder}
        aria-label="Respuesta en kana"
        className={`rounded-2xl border-2 bg-white px-4 py-3 font-jp text-2xl outline-none placeholder:font-sans placeholder:text-base dark:bg-slate-900 ${border[state]}`}
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        «nn» = ん · doble consonante = っ (kitte) · «-» = ー · también sirve el teclado japonés
      </p>
    </div>
  )
}
