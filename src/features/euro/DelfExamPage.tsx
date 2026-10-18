import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ComingSoon } from '../../components/ComingSoon'
import { SaveProgressPrompt } from '../../components/SaveProgressPrompt'
import type { ExamTasks } from '../../courses/euro'
import { frenchCourse } from '../../courses/fr/course'
import { delfExams, type ExamModule, moduleNames, scoreDelf } from '../../courses/fr/exams'
import type { CefrLevel } from '../../courses/fr/levels'
import { delfPassedKey } from '../../courses/fr/progress'
import { frenchTexts } from '../../courses/fr/texts'
import type { ReadingText } from '../../courses/reading'
import { useProgress } from '../../lib/progress/store'
import { shuffle } from '../../lib/random'
import { ChecklistModule, QuestionsModule, type Result, WritingModule } from './ExamModules'

// Simulacro estilo DELF (France Éducation International): escuchar, leer, escribir y hablar,
// cada prueba sobre 25. Escuchar y leer se corrigen solos y deciden el aprobado orientativo
// (la mitad y al menos 5/25 en cada una); escribir combina un formulario corregido con una
// autoevaluación, y hablar es autoevaluación guiada (sin IA). Ver PLAN_FRANCES.md.

/** Tareas de escribir y hablar de cada nivel (lo de leer y escuchar sale de los textos del nivel). */
const tasks: Partial<Record<CefrLevel, ExamTasks>> = {
  A1: {
    form: {
      context: 'Julien quiere inscribirse en un club de escalada. Lee la información y completa la ficha de inscripción por él (como en la parte 1 de la prueba escrita).',
      text: 'Julien Moreau habite 21, rue Dumenge, à Lyon. Il a trente-cinq ans. Il est professeur d’histoire. Il est libre le mercredi après-midi. Son numéro de téléphone est le 06 45 78 12 90.',
      fields: [
        { label: 'Nom', answers: ['Moreau'] },
        { label: 'Âge', answers: ['35', 'trente-cinq', '35 ans', 'trente-cinq ans'] },
        { label: 'Profession', answers: ['professeur', 'professeur d’histoire', 'prof', 'professeur d\'histoire'] },
        { label: 'Ville', answers: ['Lyon'] },
        { label: 'Jour disponible', answers: ['mercredi', 'le mercredi', 'mercredi après-midi', 'le mercredi après-midi'] },
      ],
    },
    message: {
      prompt:
        'Escribe un mensaje (40 a 50 palabras) a una amiga francesa, Sophie: estás de vacaciones en Lyon. Cuéntale dónde estás, qué tiempo hace, qué haces y cuándo vuelves.',
      checks: [
        'Saludo y despedida (Salut Sophie ! / Chère Sophie, … Bises, Grosses bises)',
        'Dices dónde estás (Je suis à Lyon…)',
        'Describes el tiempo (Il fait beau, il fait chaud…)',
        'Cuentas al menos dos actividades en presente (Je visite…, je mange…)',
        'Dices cuándo vuelves (Je rentre lundi / le 12 juillet)',
        'Usas bien los artículos y los acentos (le musée, la place, l’hôtel; à, très, déjà)',
      ],
      model:
        'Salut Sophie ! Je suis en vacances à Lyon avec ma sœur. Il fait très beau et chaud. Le matin, nous visitons la vieille ville et les musées. L’après-midi, on se repose au parc. Le soir, je mange dans un petit restaurant : c’est délicieux ! Je rentre lundi. Grosses bises, Camila',
    },
    speaking: [
      'Parte 1 (entrevista dirigida): me presenté en frases completas: nombre, edad, nacionalidad, ciudad, profesión, familia y gustos',
      'Parte 1: respondí preguntas simples sobre mi día (Qu’est-ce que vous faites le week-end ?)',
      'Parte 2 (intercambio de información): con tarjetas de palabras (pays, travail, sport…), hice al menos cuatro preguntas (Où habitez-vous ? Vous aimez le sport ?)',
      'Parte 3 (diálogo simulado): en una tienda, pedí productos con «je voudrais», pregunté el precio y pagué',
      'Usé vous con el examinador y los saludos y despedidas correctos',
      'Hablé sin pasar al español, con la pronunciación clara (letras mudas, nasales)',
    ],
  },
}

function pickTexts(level: CefrLevel, kind: 'reading' | 'dialogue', n: number): ReadingText[] {
  return shuffle(frenchTexts.filter((t) => t.level === level && t.kind === kind)).slice(0, n)
}

export function DelfExamPage() {
  const { level: param } = useParams()
  const level = param?.toUpperCase() as CefrLevel
  const exam = delfExams[level]
  const hasTexts = frenchTexts.some((t) => t.level === level)
  if (!exam || !hasTexts || !tasks[level]) return <ComingSoon title="Este simulacro llegará con su nivel" />
  return <DelfExam key={level} level={level} />
}

type Phase = 'intro' | ExamModule | 'result'

function DelfExam({ level }: { level: CefrLevel }) {
  const exam = delfExams[level]
  const [phase, setPhase] = useState<Phase>('intro')
  const [results, setResults] = useState<Partial<Record<ExamModule, Result>>>({})
  const [oral] = useState(() => pickTexts(level, 'dialogue', 2))
  const [ecrit] = useState(() => pickTexts(level, 'reading', 2))
  const submitRecord = useProgress((s) => s.submitRecord)
  const order = exam.modules
  const t = tasks[level]!
  const name = `${exam.diploma} ${level}`

  const finishModule = (m: ExamModule, r: Result) => {
    const next = { ...results, [m]: r }
    setResults(next)
    const i = order.indexOf(m)
    if (i + 1 < order.length) setPhase(order[i + 1])
    else {
      if (scoreDelf(level, next).passedAuto) submitRecord(delfPassedKey(level), 1)
      setPhase('result')
    }
  }

  if (phase === 'intro') {
    return (
      <section className="mx-auto flex max-w-md flex-col gap-4 py-6">
        <span className="text-6xl" aria-hidden>
          📝
        </span>
        <h1 className="text-2xl font-extrabold">Simulacro {name}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Cuatro pruebas de {exam.max} puntos, como el examen real. <strong>Escuchar</strong> y <strong>leer</strong> se corrigen solos y deciden si apruebas: la
          mitad de los puntos y al menos {exam.minimum}/{exam.max} en cada una. <strong>Escribir</strong> combina una parte que se corrige sola con una
          autoevaluación, y <strong>hablar</strong> es una autoevaluación guiada: practícalo en voz alta, idealmente con alguien.
        </p>
        <ul className="flex flex-col gap-1 text-sm">
          {order.map((m) => (
            <li key={m}>
              {moduleNames[m]} · ~{exam.minutes[m]} min {m === 'pe' ? '(en parte autoevaluado)' : exam.autoScored.includes(m) ? '' : '(autoevaluado)'}
            </li>
          ))}
        </ul>
        <button onClick={() => setPhase(order[0])} className="self-start rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Empezar
        </button>
      </section>
    )
  }

  if (phase === 'co') return <QuestionsModule key="co" title={moduleNames.co} texts={oral} listen lang="fr" onDone={(r) => finishModule('co', r)} />
  if (phase === 'ce') return <QuestionsModule key="ce" title={moduleNames.ce} texts={ecrit} listen={false} lang="fr" onDone={(r) => finishModule('ce', r)} />
  if (phase === 'pe') return <WritingModule title={moduleNames.pe} formTask={t.form} messageTask={t.message} lang="fr" check={frenchCourse.check} onDone={(r) => finishModule('pe', r)} />
  if (phase === 'po') return <ChecklistModule title={moduleNames.po} checks={t.speaking} onDone={(r) => finishModule('po', r)} />

  const score = scoreDelf(level, results)
  const total = order.reduce((n, m) => n + (score.points[m] ?? 0), 0)
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-6 text-center">
      <span className="text-6xl" aria-hidden>
        {score.passedAuto ? '🎉' : '💪'}
      </span>
      <h1 className="text-2xl font-extrabold">{score.passedAuto ? '¡Aprobaste el simulacro!' : 'Todavía no: sigue practicando'}</h1>
      <p className="text-3xl font-extrabold">
        {total}/{order.length * exam.max}
      </p>
      <dl className="grid w-full grid-cols-2 gap-2 text-left">
        {order.map((m) => (
          <div key={m} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <dt className="text-xs font-bold text-slate-500 uppercase">
              {moduleNames[m]} {m === 'pe' ? '· en parte autoevaluado' : exam.autoScored.includes(m) ? '' : '· autoevaluado'}
            </dt>
            <dd className={`text-2xl font-extrabold ${score.eliminated.includes(m) ? 'text-red-600' : ''}`}>
              {score.points[m] ?? 0}/{exam.max}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-sm text-slate-500">
        Se aprueba con {(order.length * exam.max) / 2}/{order.length * exam.max} y sin ninguna prueba bajo {exam.minimum}/{exam.max}. Aquí el aprobado depende de
        escuchar y leer; escribir y hablar son de práctica, porque no hay corrección automática de textos libres.
        {score.passed !== null && (score.passed ? ' Con tu autoevaluación, también aprobarías el total.' : ' Con tu autoevaluación, el total todavía no alcanza.')}
      </p>
      <SaveProgressPrompt />
      <Link to="/aprender" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
        Volver al recorrido
      </Link>
    </section>
  )
}
