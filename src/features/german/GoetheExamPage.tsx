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
  B1: {
    form: {
      context: 'Completa el correo formal de Otto a una academia (1–6). Ojo con los conectores y la posición del verbo.',
      text: 'Sehr geehrte Damen und Herren, ich interessiere mich (1) ___ Ihren Kurs «Elektromobilität». (2) ___ ich seit zehn Jahren als Mechaniker arbeite, habe ich schon viel Erfahrung. Könnten Sie mir bitte mitteilen, (3) ___ der Kurs auch am Abend stattfindet? Ich möchte den Kurs machen, (4) ___ mich beruflich weiterzubilden. Ich (5) ___ Ihnen dankbar, wenn Sie mir die Kosten nennen könnten. Mit (6) ___ Grüßen, Otto Martínez',
      fields: [
        { label: '(1) – preposición de «sich interessieren»', answers: ['für'] },
        { label: '(2) – como (causa, verbo al final)', answers: ['Da', 'Weil'] },
        { label: '(3) – si (pregunta indirecta)', answers: ['ob'] },
        { label: '(4) – para (mismo sujeto)', answers: ['um'] },
        { label: '(5) – Konjunktiv II de sein', answers: ['wäre'] },
        { label: '(6) – freundlich + terminación', answers: ['freundlichen'] },
      ],
    },
    message: {
      prompt:
        'En un foro se discute: «¿Deberían las empresas permitir el teletrabajo (Homeoffice)?». Escribe tu opinión (unas 80 palabras).',
      checks: [
        'Introduces el tema y das tu opinión clara (Meiner Meinung nach… / Ich bin der Meinung, dass…)',
        'Das al menos una ventaja y una desventaja',
        'Usas conectores (einerseits/andererseits, deshalb, obwohl, außerdem)',
        'Das un ejemplo de tu experiencia',
        'Usas al menos dos subordinadas con el verbo al final',
        'Terminas con una conclusión (Zusammenfassend… / Zum Schluss…)',
      ],
      model:
        'Ich bin der Meinung, dass Firmen Homeoffice erlauben sollten. Einerseits spart man viel Zeit, weil man nicht zur Arbeit fahren muss. Außerdem kann man sich zu Hause oft besser konzentrieren. Andererseits fehlt der Kontakt zu den Kollegen, und nicht jeder hat zu Hause einen ruhigen Arbeitsplatz. In meinem Beruf als Mechaniker ist Homeoffice natürlich nicht möglich. Zusammenfassend finde ich, dass man flexibel sein sollte: zwei Tage zu Hause und drei Tage im Büro wären ideal.',
    },
    speaking: [
      'Parte 1: planifiqué con mi pareja una actividad (por ejemplo una fiesta de despedida): propuse ideas y reaccioné a las suyas',
      'Parte 1: usé fórmulas para proponer y aceptar o rechazar (Wie wäre es, wenn…? Gute Idee! Ich habe einen anderen Vorschlag…)',
      'Parte 2: presenté un tema en unos 3 minutos con estructura: introducción, experiencia personal, situación en mi país, ventajas y desventajas, conclusión',
      'Parte 2: di mi opinión y la fundamenté',
      'Parte 3: respondí preguntas sobre mi presentación y comenté la de mi pareja',
      'Hablé con fluidez y usé conectores y subordinadas',
    ],
  },
  B2: {
    form: {
      context: 'Completa el correo formal de Otto a su aseguradora (1–6). Es registro formal: preposiciones con genitivo, Nomen-Verb y Konjunktiv II.',
      text: 'Sehr geehrte Damen und Herren, (1) ___ meines Schreibens vom 3. März möchte ich Sie um eine schnelle Bearbeitung bitten. (2) ___ eines Lieferengpasses konnte die Reparatur erst gestern abgeschlossen werden. Den Kostenvoranschlag stelle ich Ihnen gern zur (3) ___. Ich wäre Ihnen dankbar, (4) ___ Sie mir die Kosten bis Ende des Monats erstatten könnten. Die Rechnung ist innerhalb von 14 Tagen (5) ___ bezahlen. Für Rückfragen stehe ich Ihnen jederzeit zur Verfügung. Mit freundlichen (6) ___, Otto Martínez',
      fields: [
        { label: '(1) – respecto a (+ genitivo)', answers: ['Bezüglich', 'Hinsichtlich'] },
        { label: '(2) – debido a (+ genitivo)', answers: ['Aufgrund', 'Wegen', 'Infolge'] },
        { label: '(3) – zur ___ stellen (poner a disposición)', answers: ['Verfügung'] },
        { label: '(4) – si (condición)', answers: ['wenn', 'falls'] },
        { label: '(5) – sein + ___ + infinitivo', answers: ['zu'] },
        { label: '(6) – fórmula de despedida', answers: ['Grüßen'] },
      ],
    },
    message: {
      prompt:
        'En el foro de una revista se discute: «¿Debería haber un límite general de velocidad en las autopistas alemanas?». Escribe un texto argumentativo (unas 150 palabras).',
      checks: [
        'Introduces el tema con una frase general (… wird heute viel diskutiert)',
        'Presentas al menos dos argumentos a favor (Befürworter meinen… / Dafür spricht…)',
        'Presentas al menos dos argumentos en contra (Kritiker wenden ein… / Dagegen spricht…)',
        'Das tu opinión fundamentada con un ejemplo (Meines Erachtens…)',
        'Usas conectores B2 (zum einen … zum anderen, hinzu kommt, zwar … aber, allerdings)',
        'Usas al menos una construcción formal (pasivo, estilo nominal, Konjunktiv I o II)',
        'Terminas con una conclusión clara (Alles in allem… / Abschließend lässt sich sagen…)',
      ],
      model:
        'Kaum ein Thema wird in Deutschland so leidenschaftlich diskutiert wie ein Tempolimit auf Autobahnen. Befürworter meinen, dass ein Limit von 130 km/h die Zahl schwerer Unfälle deutlich verringern würde. Hinzu kommt, dass weniger Kraftstoff verbraucht wird, was einen Beitrag zum Klimaschutz leistet. Kritiker wenden dagegen ein, dass die deutschen Autobahnen bereits zu den sichersten der Welt gehören. Zum einen gebe es auf vielen Strecken schon heute Begrenzungen, zum anderen sehen manche darin eine Einschränkung ihrer Freiheit. Meines Erachtens überwiegen allerdings die Vorteile: Als Mechaniker sehe ich täglich, welche Schäden durch hohe Geschwindigkeiten entstehen. Zwar würde man auf langen Strecken etwas mehr Zeit brauchen, aber dafür käme man entspannter und sicherer an. Alles in allem halte ich ein Tempolimit für eine sinnvolle Maßnahme, die Leben retten kann.',
    },
    speaking: [
      'Parte 1: hice una presentación de unos 4 minutos sobre un tema (por ejemplo «Teletrabajo» o «Autos eléctricos») con introducción, estructura y conclusión',
      'Parte 1: anuncié la estructura y pasé de un punto a otro (Zunächst… / Damit komme ich zu… / Abschließend…)',
      'Parte 1: comparé la situación en Alemania con la de mi país y di ejemplos',
      'Parte 2: respondí preguntas sobre mi presentación y comenté la de mi pareja',
      'Parte 3: discutí un tema polémico: di mi opinión, la fundamenté y reaccioné a la de mi pareja (Da muss ich widersprechen… / Da gebe ich Ihnen recht…)',
      'Parte 3: intenté llegar a una conclusión o un compromiso',
      'Hablé con fluidez, con registro formal y corregí mis errores sin bloquearme',
    ],
  },
  C1: {
    form: {
      context: 'Completa la carta formal de Otto a un proveedor que no cumplió un plazo (1–6). Registro C1: fórmulas fijas, Funktionsverbgefüge y conectores cultos.',
      text: 'Sehr geehrte Frau Lorenz, (1) ___ nehmend auf unseren Rahmenvertrag vom 2. Mai muss ich Ihnen leider mitteilen, dass die bestellten Teile erneut nicht fristgerecht geliefert wurden. (2) ___ wiederholter Zusicherungen Ihrerseits warten wir nun seit zwei Wochen. Dies hat (3) ___, dass drei Kundenaufträge nicht abgeschlossen werden konnten. Ich sehe mich daher (4) ___, eine Vertragsstrafe geltend zu machen. Ich bitte Sie, die Lieferung (5) ___ zu veranlassen. Andernfalls werde ich eine Kündigung des Vertrags in (6) ___ ziehen. Mit freundlichen Grüßen, Otto Martínez',
      fields: [
        { label: '(1) – ___ nehmend auf (fórmula de referencia)', answers: ['Bezug'] },
        { label: '(2) – a pesar de (+ genitivo, formal)', answers: ['Ungeachtet', 'Trotz'] },
        { label: '(3) – ___ haben, dass (tener como consecuencia)', answers: ['zur Folge'] },
        { label: '(4) – sich ___ sehen (verse obligado)', answers: ['gezwungen', 'veranlasst'] },
        { label: '(5) – de inmediato (formal)', answers: ['umgehend', 'unverzüglich'] },
        { label: '(6) – in ___ ziehen (tomar en consideración)', answers: ['Erwägung', 'Betracht'] },
      ],
    },
    message: {
      prompt:
        'Para la sección de opinión de una revista: «¿Debería introducirse la semana laboral de cuatro días en toda Alemania?». Escribe un texto argumentativo de unas 230 palabras.',
      checks: [
        'Introduces el tema con una referencia actual y planteas la pregunta central',
        'Desarrollas al menos dos argumentos a favor y dos en contra, con ejemplos',
        'Rebates un argumento contrario (Zwar …, doch … / Dem lässt sich entgegenhalten, dass …)',
        'Matizas tus afirmaciones (Es ist davon auszugehen … / nicht zwingend / weitgehend)',
        'Usas estilo nominal y estructuras C1 (pasiva, participios, Konjunktiv I para citar)',
        'Usas conectores variados y referencias en el texto (insofern, wenngleich, folglich; Letzteres, dies)',
        'Terminas con una conclusión matizada y propia',
        'El registro es formal y homogéneo, sin expresiones coloquiales',
      ],
      model:
        'Kaum eine arbeitsmarktpolitische Idee wird derzeit so kontrovers diskutiert wie die Einführung der Vier-Tage-Woche. Im Mittelpunkt steht die Frage, ob eine Verkürzung der Arbeitswoche die Produktivität steigert oder die ohnehin angespannte Lage auf dem Arbeitsmarkt verschärft. Befürworter verweisen auf Pilotprojekte, denen zufolge die Zahl der Krankheitstage deutlich gesunken sei. Hinzu kommt, dass Arbeitgeber mit flexiblen Modellen leichter Fachkräfte gewinnen können. Kritiker wenden dagegen ein, angesichts des Fachkräftemangels sei es widersprüchlich, weniger zu arbeiten. Zwar ist dieser Einwand nicht von der Hand zu weisen, doch wird dabei außer Acht gelassen, dass viele Modelle die Arbeitszeit lediglich auf vier Tage verteilen. Letzteres dürfte vor allem für Branchen mit Schichtbetrieb schwer umsetzbar sein. In meiner eigenen Werkstatt hat sich das Modell insofern bewährt, als die Mitarbeiter motivierter und seltener krank sind. Allerdings lässt sich diese Erfahrung nicht zwingend auf Großbetriebe übertragen. Alles in allem halte ich eine gesetzliche Vorgabe für verfehlt; sinnvoller wäre es, den Betrieben Spielraum für eigene Lösungen zu lassen.',
    },
    speaking: [
      'Parte 1: hice una presentación de 3–4 minutos sobre un tema abstracto, con introducción, desarrollo estructurado y conclusión',
      'Parte 1: comparé distintas posturas, di ejemplos concretos y matizé mis afirmaciones',
      'Parte 1: respondí a las preguntas del examinador sin perder el hilo',
      'Parte 2: discutí con mi pareja un tema polémico: tomé la palabra, la mantuve y reaccioné a sus argumentos (Darf ich da kurz einhaken? / Das trifft nur bedingt zu …)',
      'Parte 2: rebatí al menos un argumento y propuse un compromiso o una conclusión común',
      'Usé un vocabulario amplio y preciso (Funktionsverbgefüge, conectores cultos), sin repetir las mismas palabras',
      'Hablé con fluidez y espontaneidad, y me corregí sin interrumpir la comunicación',
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
