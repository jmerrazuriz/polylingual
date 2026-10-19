import { useRef, useState } from 'react'
import { FrenchKeys, ItalianKeys, UmlautKeys } from '../../components/UmlautKeys'
import type { FormTask, MessageTask } from '../../courses/euro'
import type { GrammarExercise } from '../../courses/grammar'
import type { ReadingText } from '../../courses/reading'
import { useSpeech } from '../../lib/audio/useSpeech'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'

// Módulos comunes de los simulacros (Goethe, DELF y CILS): leer o escuchar textos con preguntas,
// escribir (formulario corregido + mensaje autoevaluado) y hablar (autoevaluación guiada).

export type Result = { correct: number; total: number }

/** Comparar una respuesta escrita: 'almost' cuenta, pero se avisa (mayúsculas o acentos). */
export type Check = (input: string, answers: string[]) => 'ok' | 'almost' | 'wrong'

/** Las letras especiales de cada idioma europeo. */
const keysByLang: Record<string, typeof UmlautKeys> = { de: UmlautKeys, fr: FrenchKeys, it: ItalianKeys }

const Keys = ({ lang, ...props }: { lang: string } & Parameters<typeof UmlautKeys>[0]) => {
  const LangKeys = keysByLang[lang] ?? UmlautKeys
  return <LangKeys {...props} />
}

/** Leer o escuchar: cada texto y sus preguntas. Al escuchar, el audio se puede oír dos veces y no se muestra el texto. */
export function QuestionsModule({ title, texts, listen, lang, onDone }: { title: string; texts: ReadingText[]; listen: boolean; lang: string; onDone: (r: Result) => void }) {
  const [t, setT] = useState(0)
  const [q, setQ] = useState(-1)
  const [correct, setCorrect] = useState(0)
  const [plays, setPlays] = useState(0)
  const { available, speakLines } = useSpeech()
  const text = texts[t]
  const total = texts.reduce((n, x) => n + x.questions.length, 0)

  const answer = (ok: boolean) => {
    const score = correct + (ok ? 1 : 0)
    setCorrect(score)
    if (q + 1 < text.questions.length) setQ(q + 1)
    else if (t + 1 < texts.length) {
      setT(t + 1)
      setQ(-1)
      setPlays(0)
    } else onDone({ correct: score, total })
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <p className="text-sm font-bold text-slate-500 uppercase">
        {title} · Parte {t + 1} de {texts.length}
      </p>
      {q === -1 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold">{text.context ?? text.title}</h2>
          {listen && available ? (
            <button
              disabled={plays >= 2}
              onClick={() => {
                setPlays(plays + 1)
                speakLines(text.lines)
              }}
              className="self-start rounded-full border-2 border-accent px-5 py-2.5 font-bold disabled:opacity-40"
            >
              ▶ Escuchar ({2 - plays} {2 - plays === 1 ? 'vez' : 'veces'})
            </button>
          ) : (
            <ul lang={lang} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-lg dark:border-slate-800 dark:bg-slate-900">
              {text.lines.map((line, i) => (
                <li key={i}>
                  {line.speaker && <span className="mr-2 text-sm font-bold text-accent">{line.speaker}:</span>}
                  {line.text}
                </li>
              ))}
            </ul>
          )}
          {listen && !available && <p className="text-sm text-amber-700">Tu navegador no tiene voz para este idioma: se muestra el texto.</p>}
          <button onClick={() => setQ(0)} className="self-end rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
            Responder →
          </button>
        </section>
      ) : (
        <GrammarExerciseView key={`${t}-${q}`} exercise={text.questions[q] as GrammarExercise} onDone={answer} />
      )}
    </div>
  )
}

/** Escribir: formulario corregido solo + mensaje autoevaluado con lista de control. */
export function WritingModule({ title, formTask, messageTask, lang, check, onDone }: { title: string; formTask: FormTask; messageTask: MessageTask; lang: string; check: Check; onDone: (r: Result) => void }) {
  const [values, setValues] = useState<string[]>(formTask.fields.map(() => ''))
  const [checked, setChecked] = useState<boolean[] | null>(null)
  const [message, setMessage] = useState('')
  const [formScore, setFormScore] = useState<number | null>(null)
  const [focus, setFocus] = useState(0)
  // El campo activo, para que los botones de letras especiales escriban en él.
  const active = useRef<HTMLInputElement | null>(null)

  if (formScore === null) {
    return (
      <section className="mx-auto flex max-w-md flex-col gap-4">
        <p className="text-sm font-bold text-slate-500 uppercase">{title} · Parte 1 (se corrige sola)</p>
        <p className="text-slate-600 dark:text-slate-400">{formTask.context}</p>
        <p lang={lang} className="rounded-2xl border border-slate-200 bg-white p-4 text-lg dark:border-slate-800 dark:bg-slate-900">
          {formTask.text}
        </p>
        {formTask.fields.map((f, i) => (
          <label key={f.label} className="flex flex-col gap-1 text-sm font-bold">
            <span lang={lang}>{f.label}</span>
            <input
              lang={lang}
              value={values[i]}
              onFocus={(e) => {
                active.current = e.currentTarget
                setFocus(i)
              }}
              onChange={(e) => setValues(values.map((v, k) => (k === i ? e.target.value : v)))}
              autoCapitalize="off"
              spellCheck={false}
              className="rounded-xl border border-slate-300 bg-white p-2.5 text-base font-normal dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        ))}
        <Keys
          lang={lang}
          inputRef={active}
          value={values[focus]}
          onChange={(v) => setValues(values.map((x, k) => (k === focus ? v : x)))}
        />
        <button
          onClick={() => setFormScore(formTask.fields.filter((f, i) => check(values[i], f.answers) !== 'wrong').length)}
          className="self-end rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90"
        >
          Corregir →
        </button>
      </section>
    )
  }

  if (checked === null) {
    return (
      <section className="mx-auto flex max-w-md flex-col gap-4">
        <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          Parte 1: {formScore} de {formTask.fields.length} correctas.
        </p>
        <p className="text-sm font-bold text-slate-500 uppercase">{title} · Parte 2: mensaje (autoevaluado)</p>
        <p>{messageTask.prompt}</p>
        <textarea
          lang={lang}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          spellCheck={false}
          className="rounded-xl border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"
        />
        <button
          disabled={message.trim().split(/\s+/).length < 10}
          onClick={() => setChecked(messageTask.checks.map(() => false))}
          className="self-end rounded-full bg-ink px-6 py-3 font-bold text-white disabled:opacity-40"
        >
          Revisar mi texto →
        </button>
      </section>
    )
  }

  return (
    <section className="mx-auto flex max-w-md flex-col gap-4">
      <p className="text-sm font-bold text-slate-500 uppercase">Compara con el modelo y marca lo que cumple tu texto</p>
      <p lang={lang} className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
        {message}
      </p>
      <p className="text-sm">
        <span className="font-bold">Modelo:</span> <span lang={lang}>{messageTask.model}</span>
      </p>
      <Checklist checks={messageTask.checks} checked={checked} onChange={setChecked} />
      <button
        onClick={() =>
          onDone({
            correct: formScore + checked.filter(Boolean).length,
            total: formTask.fields.length + messageTask.checks.length,
          })
        }
        className="self-end rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90"
      >
        Siguiente módulo →
      </button>
    </section>
  )
}

function Checklist({ checks, checked, onChange }: { checks: string[]; checked: boolean[]; onChange: (c: boolean[]) => void }) {
  return (
    <ul className="flex flex-col gap-2">
      {checks.map((c, i) => (
        <li key={c}>
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <input type="checkbox" checked={checked[i]} onChange={(e) => onChange(checked.map((x, k) => (k === i ? e.target.checked : x)))} className="mt-1 h-4 w-4" />
            <span className="text-sm">{c}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

/** Hablar: tareas del examen y autoevaluación honesta. */
export function ChecklistModule({ title, checks, onDone }: { title: string; checks: string[]; onDone: (r: Result) => void }) {
  const [checked, setChecked] = useState(checks.map(() => false))
  return (
    <section className="mx-auto flex max-w-md flex-col gap-4">
      <p className="text-sm font-bold text-slate-500 uppercase">{title} · autoevaluación</p>
      <p className="text-slate-600 dark:text-slate-400">
        Haz cada tarea <strong>en voz alta</strong> (mejor con alguien o grabándote con el celular) y marca solo lo que lograste.
      </p>
      <Checklist checks={checks} checked={checked} onChange={setChecked} />
      <button onClick={() => onDone({ correct: checked.filter(Boolean).length, total: checks.length })} className="self-end rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
        Ver resultado →
      </button>
    </section>
  )
}
