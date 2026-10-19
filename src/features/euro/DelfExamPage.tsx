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
  A2: {
    form: {
      context: 'Camila le responde a una invitación de su colega Sophie. Completa las palabras que faltan (1–5).',
      text: 'Salut Sophie, merci pour ton invitation ! Malheureusement, je ne (1) ___ pas venir samedi : je travaille. Hier, je (2) ___ allée chez le médecin et il m’a dit de me reposer. Mais on (3) ___ se voir dimanche ? Je te (4) ___ ce soir. (5) ___ bises, Camila',
      fields: [
        { label: '(1) – no puedo (pouvoir)', answers: ['peux'] },
        { label: '(2) – fui (auxiliar de aller)', answers: ['suis'] },
        { label: '(3) – podríamos (pouvoir, condicional)', answers: ['pourrait', 'peut'] },
        { label: '(4) – te llamo (appeler)', answers: ['appelle', 'téléphone'] },
        { label: '(5) – muchos besos', answers: ['Grosses', 'grosses'] },
      ],
    },
    message: {
      prompt:
        'Escribe un correo (60 a 80 palabras) a una amiga: le cuentas un fin de semana que pasaste en otra ciudad. Di dónde fuiste, con quién, qué tiempo hacía, qué hiciste y qué te gustó más.',
      checks: [
        'Saludo y despedida adecuados (Chère… / Salut… — Bises, À bientôt)',
        'Usas el passé composé para las acciones (je suis allée, on a visité…)',
        'Usas el imparfait para describir (il faisait beau, c’était…)',
        'Das al menos tres detalles (lugar, actividades, comida, personas)',
        'Das tu opinión (j’ai adoré…, le plus beau, c’était génial parce que…)',
        'Revisas los homófonos y la concordancia con être (a/à, et/est, je suis allée)',
      ],
      model:
        'Chère Sophie, le week-end dernier, je suis allée à Annecy avec Julien. Il faisait très beau et le lac était magnifique ! Samedi, on a loué des vélos et on a fait le tour du lac. Le soir, nous avons mangé une tartiflette dans un petit restaurant : c’était délicieux. Dimanche, j’ai visité la vieille ville. Ce que j’ai préféré, c’est le marché. Je voudrais y retourner avec toi ! Bises, Camila',
    },
    speaking: [
      'Parte 1 (entrevista dirigida): hablé de mí, de mi trabajo, de mi familia y de mis gustos, con detalles',
      'Parte 2 (monólogo): conté una experiencia pasada (un viaje, una fiesta) usando el passé composé y el imparfait',
      'Parte 2: di mi opinión y expliqué por qué (parce que, comme, donc)',
      'Parte 3 (diálogo simulado): resolví una situación práctica (devolver un producto, reservar, pedir información) con cortesía (je voudrais, pourriez-vous…)',
      'Parte 3: propuse una solución o acepté/rechacé con una razón',
      'Hablé con fluidez y sin pasar al español; me corregí cuando me equivoqué',
    ],
  },
  B1: {
    form: {
      context: 'Completa el correo formal de Camila a una escuela de idiomas (1–6). Ojo con los conectores y los modos.',
      text: 'Madame, Monsieur, je vous écris (1) ___ obtenir des renseignements sur vos cours de préparation au DELF B2. (2) ___ je travaille de jour, je souhaiterais suivre des cours le soir. Pourriez-vous m’indiquer (3) ___ les cours commencent en septembre ? Il est important que je (4) ___ le diplôme avant juin, car j’en ai besoin pour ma demande de nationalité. Je vous (5) ___ reconnaissante de me répondre rapidement. (6) ___, Camila Rojas',
      fields: [
        { label: '(1) – para (finalidad)', answers: ['pour', 'afin d’', "afin d'"] },
        { label: '(2) – como (causa, al principio)', answers: ['Comme', 'comme', 'Puisque', 'puisque'] },
        { label: '(3) – si (pregunta indirecta)', answers: ['si'] },
        { label: '(4) – obtener, subjuntivo (obtenir)', answers: ['obtienne'] },
        { label: '(5) – estaría (être, condicional)', answers: ['serais'] },
        { label: '(6) – despedida de un correo formal', answers: ['Cordialement', 'cordialement', 'Bien à vous'] },
      ],
    },
    message: {
      prompt:
        'En un foro se discute: «¿Deberían los supermercados regalar la comida que no venden en vez de botarla?». Escribe tu opinión (160 a 180 palabras), con argumentos y ejemplos.',
      checks: [
        'Presentas el tema y das tu opinión clara (À mon avis…, Je pense que…)',
        'Das al menos dos argumentos, cada uno con un ejemplo',
        'Consideras la opinión contraria (Certains pensent que…, cependant…)',
        'Usas conectores variados (d’abord, de plus, pourtant, c’est pourquoi, en conclusion)',
        'Usas al menos un subjuntivo (il faut que, il est important que, bien que) y un condicional',
        'Terminas con una conclusión o una propuesta',
        'Cuidas las concordancias y los homófonos',
      ],
      model:
        'Chaque jour, les supermarchés jettent des tonnes de nourriture encore bonne. À mon avis, ils devraient la donner à des associations. D’abord, c’est une question de solidarité : de plus en plus de familles ont du mal à se nourrir, alors que nous gaspillons. Par exemple, l’association où je suis bénévole manque souvent de produits frais. De plus, donner au lieu de jeter réduirait les déchets et protégerait l’environnement. Certains pensent que c’est trop compliqué à organiser, à cause des règles d’hygiène. C’est vrai que les produits doivent être conservés correctement. Cependant, en France, une loi oblige déjà les grands supermarchés à donner leurs invendus, et cela fonctionne bien. Il faudrait que cette règle s’applique aussi aux restaurants et aux cantines. En conclusion, il est important que chacun participe : les magasins, mais aussi les consommateurs, qui peuvent acheter seulement ce dont ils ont besoin.',
    },
    speaking: [
      'Parte 1 (entrevista dirigida): hablé de mí, de mi trabajo, de mis proyectos y de mi vida en Francia, sin preparación',
      'Parte 2 (ejercicio en interacción): resolví una situación con el examinador (un reclamo, un desacuerdo con un vecino, organizar algo) y negocié una solución',
      'Parte 2: usé fórmulas para proponer, aceptar, rechazar y convencer (Je vous propose de…, Ce serait mieux si…, Je comprends, mais…)',
      'Parte 3 (punto de vista): a partir de un documento corto, presenté el tema y di mi opinión de forma organizada (introducción, dos argumentos, conclusión)',
      'Parte 3: respondí las preguntas del examinador y defendí mi opinión con ejemplos',
      'Usé subjuntivo, condicional y conectores (pourtant, c’est pourquoi, bien que)',
      'Hablé con fluidez y me corregí sin bloquearme',
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
