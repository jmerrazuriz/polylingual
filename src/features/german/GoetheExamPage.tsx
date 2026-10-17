import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import { UmlautKeys } from '../../components/UmlautKeys'
import { autoScored, type ExamModule, goetheExams, moduleNames, PASS, scoreGoethe } from '../../courses/de/exams'
import type { CefrLevel } from '../../courses/de/levels'
import { germanTexts } from '../../courses/de/texts'
import { goethePassedKey } from '../../courses/de/progress'
import type { GrammarExercise } from '../../courses/grammar'
import type { ReadingText } from '../../courses/reading'
import { useSpeech } from '../../lib/audio/useSpeech'
import { checkGerman } from '../../lib/germanInput'
import { useProgress } from '../../lib/progress/store'
import { shuffle } from '../../lib/random'
import { GrammarExerciseView } from '../grammar/GrammarExerciseView'

// Simulacro estilo Goethe-Zertifikat. Leer y escuchar se corrigen solos y deciden el
// aprobado; escribir combina un formulario corregido con una autoevaluación guiada, y hablar
// es solo autoevaluación (sin IA). Ver PLAN_ALEMAN.md.

type Result = { correct: number; total: number }

type FormTask = { context: string; text: string; fields: { label: string; answers: string[] }[] }
type MessageTask = { prompt: string; checks: string[]; model: string }
type LevelTasks = { form: FormTask; message: MessageTask; speaking: string[] }

/** Tareas de escribir y hablar de cada nivel (lo de leer y escuchar sale de los textos del nivel). */
const tasks: Partial<Record<CefrLevel, LevelTasks>> = {
  A1: {
    form: {
      context: 'Hans quiere inscribirse en un club de fútbol (Fußballverein). Lee la información y completa el formulario por él.',
      text: 'Hans Schmidt wohnt in der Bergstraße 7 in 50667 Köln. Er ist 31 Jahre alt, verheiratet und arbeitet als Elektriker. Er möchte am Mittwoch trainieren.',
      fields: [
        { label: 'Familienname', answers: ['Schmidt'] },
        { label: 'Straße und Hausnummer', answers: ['Bergstraße 7', 'Bergstrasse 7'] },
        { label: 'Alter', answers: ['31', 'einunddreißig'] },
        { label: 'Beruf', answers: ['Elektriker'] },
        { label: 'Trainingstag', answers: ['Mittwoch', 'am Mittwoch'] },
      ],
    },
    message: {
      prompt:
        'Escribe un correo corto (unas 30 palabras) a tu profesora, la señora Klein: no puedes ir al curso mañana. Di por qué y pregunta por las tareas.',
      checks: [
        'Saludo adecuado (Liebe Frau Klein, / Sehr geehrte Frau Klein,)',
        'Dices que mañana no puedes ir al curso',
        'Das una razón (con «denn» o «weil»)',
        'Preguntas por las tareas (Hausaufgaben)',
        'Despedida (Viele Grüße / Mit freundlichen Grüßen) y tu nombre',
        'Verbo en 2.ª posición y sustantivos con mayúscula',
      ],
      model:
        'Liebe Frau Klein, ich kann morgen leider nicht zum Kurs kommen, denn ich habe einen Termin beim Arzt. Was sind die Hausaufgaben? Viele Grüße, Otto',
    },
    speaking: [
      'Parte 1: me presenté (Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby) en frases completas',
      'Parte 1: deletreé mi nombre (buchstabieren) y dije un número de teléfono',
      'Parte 2: hice dos preguntas sobre un tema (por ejemplo «Essen»: Was isst du gern? …)',
      'Parte 2: respondí las preguntas de mi pareja',
      'Parte 3: hice dos peticiones con «Können Sie…?» / «Ich möchte…»',
      'Hablé sin pasar al español y con la pronunciación clara',
    ],
  },
  A2: {
    form: {
      context: 'Otto le escribe un mensaje a Hans. Completa las palabras que faltan (1–5).',
      text: 'Hallo Hans, ich (1) ___ heute leider nicht kommen, (2) ___ ich muss länger arbeiten. (3) ___ du morgen Zeit? Wir (4) ___ ins Kino gehen. Ich rufe (5) ___ später an. Otto',
      fields: [
        { label: '(1) – no puedo venir', answers: ['kann'] },
        { label: '(2) – porque (sin cambiar el orden)', answers: ['denn'] },
        { label: '(3) – ¿tienes…?', answers: ['Hast'] },
        { label: '(4) – podemos', answers: ['können'] },
        { label: '(5) – te (acusativo)', answers: ['dich'] },
      ],
    },
    message: {
      prompt:
        'Escribe un correo (unas 40 palabras) a tu colega Murat: el sábado haces una fiesta en tu casa. Invítalo, di a qué hora empieza, qué puede traer y cómo se llega.',
      checks: [
        'Saludo adecuado (Lieber Murat, / Hallo Murat,)',
        'Lo invitas y dices el día y la hora',
        'Dices qué puede traer (mitbringen)',
        'Explicas cómo llegar (Adresse, Bus, U-Bahn…)',
        'Usas una subordinada (weil, dass, wenn) o «deshalb»',
        'Despedida y tu nombre; sustantivos con mayúscula',
      ],
      model:
        'Lieber Murat, am Samstag mache ich eine Party und ich lade dich ein! Sie beginnt um 19 Uhr. Kannst du vielleicht einen Salat mitbringen? Du kannst mit der U-Bahn bis Schillerstraße fahren, dann sind es nur fünf Minuten zu Fuß. Ich freue mich, wenn du kommst! Viele Grüße, Otto',
    },
    speaking: [
      'Parte 1: hice y respondí preguntas sobre mí con tarjetas (Geburtstag, Wohnort, Beruf, Hobby, Familie)',
      'Parte 2: hablé un minuto sobre mi vida (por ejemplo «Wohnen»: dónde, con quién, qué me gusta y qué no)',
      'Parte 2: usé el pasado (Perfekt) para contar algo que pasó',
      'Parte 3: planifiqué una actividad con mi pareja y propuse una hora (Hast du am … Zeit?)',
      'Parte 3: acepté o rechacé con una razón (Da kann ich leider nicht, weil…)',
      'Hablé con fluidez, sin pasar al español',
    ],
  },
}

function pickTexts(level: CefrLevel, kind: 'reading' | 'dialogue', n: number): ReadingText[] {
  return shuffle(germanTexts.filter((t) => t.level === level && t.kind === kind)).slice(0, n)
}

export function GoetheExamPage() {
  const { level: param } = useParams()
  const level = param?.toUpperCase() as CefrLevel
  const exam = goetheExams[level]
  const hasTexts = germanTexts.some((t) => t.level === level)
  if (!exam || !hasTexts || !tasks[level]) return <ComingSoon title="Este simulacro llegará con su nivel" />
  return <GoetheExam key={level} level={level} />
}

type Phase = 'intro' | ExamModule | 'result'

function GoetheExam({ level }: { level: CefrLevel }) {
  const exam = goetheExams[level]
  const [phase, setPhase] = useState<Phase>('intro')
  const [results, setResults] = useState<Partial<Record<ExamModule, Result>>>({})
  const [lesen] = useState(() => pickTexts(level, 'reading', 2))
  const [hoeren] = useState(() => pickTexts(level, 'dialogue', 2))
  const submitRecord = useProgress((s) => s.submitRecord)
  const order: ExamModule[] = ['lesen', 'hoeren', 'schreiben', 'sprechen']

  const finishModule = (m: ExamModule, r: Result) => {
    const next = { ...results, [m]: r }
    setResults(next)
    const i = order.indexOf(m)
    if (i + 1 < order.length) setPhase(order[i + 1])
    else {
      const score = scoreGoethe(level, next)
      if (score.passedAuto) submitRecord(goethePassedKey(level), 1)
      setPhase('result')
    }
  }

  if (phase === 'intro') {
    return (
      <section className="mx-auto flex max-w-md flex-col gap-4 py-6">
        <span className="text-6xl" aria-hidden>
          📝
        </span>
        <h1 className="text-2xl font-extrabold">Simulacro Goethe-Zertifikat {level}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Cuatro módulos, como el examen real. <strong>Leer</strong> y <strong>escuchar</strong> se corrigen solos y deciden si apruebas
          (necesitas {PASS} %). <strong>Escribir</strong> combina una parte que se corrige sola con una autoevaluación, y <strong>hablar</strong> es
          una autoevaluación guiada: practícalo en voz alta, idealmente con alguien.
        </p>
        <ul className="flex flex-col gap-1 text-sm">
          {order.map((m) => (
            <li key={m}>
              {moduleNames[m]} · ~{exam.minutes[m]} min {m === 'schreiben' ? '(en parte autoevaluado)' : autoScored.includes(m) ? '' : '(autoevaluado)'}
            </li>
          ))}
        </ul>
        <button onClick={() => setPhase('lesen')} className="self-start rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Empezar
        </button>
      </section>
    )
  }

  if (phase === 'lesen') return <QuestionsModule key="lesen" title={moduleNames.lesen} texts={lesen} listen={false} onDone={(r) => finishModule('lesen', r)} />
  if (phase === 'hoeren') return <QuestionsModule key="hoeren" title={moduleNames.hoeren} texts={hoeren} listen onDone={(r) => finishModule('hoeren', r)} />
  if (phase === 'schreiben') return <WritingModule formTask={tasks[level]!.form} messageTask={tasks[level]!.message} onDone={(r) => finishModule('schreiben', r)} />
  if (phase === 'sprechen') return <ChecklistModule title={moduleNames.sprechen} checks={tasks[level]!.speaking} onDone={(r) => finishModule('sprechen', r)} />

  const score = scoreGoethe(level, results)
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-6 text-center">
      <span className="text-6xl" aria-hidden>
        {score.passedAuto ? '🎉' : '💪'}
      </span>
      <h1 className="text-2xl font-extrabold">{score.passedAuto ? '¡Aprobaste el simulacro!' : 'Todavía no: sigue practicando'}</h1>
      <dl className="grid w-full grid-cols-2 gap-2 text-left">
        {order.map((m) => (
          <div key={m} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <dt className="text-xs font-bold text-slate-500 uppercase">
              {moduleNames[m]} {m === 'schreiben' ? '· en parte autoevaluado' : autoScored.includes(m) ? '' : '· autoevaluado'}
            </dt>
            <dd className={`text-2xl font-extrabold ${(score.points[m] ?? 0) < PASS ? 'text-red-600' : ''}`}>{score.points[m] ?? 0}/100</dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-slate-500">
        El aprobado depende de leer y escuchar ({exam.modular ? `${PASS} en cada uno` : `${PASS} % entre los dos`}). Escribir y hablar son de práctica: no hay
        corrección automática de textos libres.
      </p>
      <SaveProgressPrompt />
      <Link to="/aprender" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
        Volver al recorrido
      </Link>
    </section>
  )
}

/** Leer o escuchar: cada texto y sus preguntas. Al escuchar, el audio se puede oír dos veces y no se muestra el texto. */
function QuestionsModule({ title, texts, listen, onDone }: { title: string; texts: ReadingText[]; listen: boolean; onDone: (r: Result) => void }) {
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
            <ul lang="de" className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-lg dark:border-slate-800 dark:bg-slate-900">
              {text.lines.map((line, i) => (
                <li key={i}>
                  {line.speaker && <span className="mr-2 text-sm font-bold text-accent">{line.speaker}:</span>}
                  {line.text}
                </li>
              ))}
            </ul>
          )}
          {listen && !available && <p className="text-sm text-amber-700">Tu navegador no tiene voz alemana: se muestra el texto.</p>}
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
function WritingModule({ formTask, messageTask, onDone }: { formTask: FormTask; messageTask: MessageTask; onDone: (r: Result) => void }) {
  const [values, setValues] = useState<string[]>(formTask.fields.map(() => ''))
  const [checked, setChecked] = useState<boolean[] | null>(null)
  const [message, setMessage] = useState('')
  const [formScore, setFormScore] = useState<number | null>(null)
  const [focus, setFocus] = useState(0)
  // El campo activo, para que los botones ä ö ü ß escriban en él.
  const active = useRef<HTMLInputElement | null>(null)

  if (formScore === null) {
    return (
      <section className="mx-auto flex max-w-md flex-col gap-4">
        <p className="text-sm font-bold text-slate-500 uppercase">{moduleNames.schreiben} · Parte 1 (se corrige sola)</p>
        <p className="text-slate-600 dark:text-slate-400">{formTask.context}</p>
        <p lang="de" className="rounded-2xl border border-slate-200 bg-white p-4 text-lg dark:border-slate-800 dark:bg-slate-900">
          {formTask.text}
        </p>
        {formTask.fields.map((f, i) => (
          <label key={f.label} className="flex flex-col gap-1 text-sm font-bold">
            <span lang="de">{f.label}</span>
            <input
              lang="de"
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
        <UmlautKeys
          inputRef={active}
          value={values[focus]}
          onChange={(v) => setValues(values.map((x, k) => (k === focus ? v : x)))}
        />
        <button
          onClick={() => setFormScore(formTask.fields.filter((f, i) => checkGerman(values[i], f.answers) !== 'wrong').length)}
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
        <p className="text-sm font-bold text-slate-500 uppercase">{moduleNames.schreiben} · Parte 2: mensaje (autoevaluado)</p>
        <p>{messageTask.prompt}</p>
        <textarea
          lang="de"
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
      <p lang="de" className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
        {message}
      </p>
      <p className="text-sm">
        <span className="font-bold">Modelo:</span> <span lang="de">{messageTask.model}</span>
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
function ChecklistModule({ title, checks, onDone }: { title: string; checks: string[]; onDone: (r: Result) => void }) {
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
