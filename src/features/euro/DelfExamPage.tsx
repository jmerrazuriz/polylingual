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
  B2: {
    form: {
      context: 'Completa la carta formal de Camila al director del hospital (1–6). Registro formal: conectores, subjuntivo y condicional.',
      text: 'Monsieur le Directeur, je me permets de vous écrire au nom de l’équipe de pédiatrie. (1) ___ les nombreuses alertes que nous vous avons adressées, la situation ne s’est pas améliorée. Il est indispensable que des remplacements (2) ___ assurés pendant les congés. (3) ___, plusieurs collègues risquent de quitter le service. Nous vous serions reconnaissants (4) ___ bien vouloir nous recevoir. Si vous acceptiez, nous (5) ___ vous présenter des propositions concrètes. (6) ___ l’attente de votre réponse, je vous prie d’agréer, Monsieur le Directeur, l’expression de mes salutations distinguées.',
      fields: [
        { label: '(1) – a pesar de (+ sustantivo)', answers: ['Malgré', 'malgré', 'En dépit de', 'en dépit de'] },
        { label: '(2) – sean (être, subjuntivo)', answers: ['soient'] },
        { label: '(3) – de lo contrario', answers: ['Sinon', 'sinon', 'Faute de quoi', 'À défaut'] },
        { label: '(4) – de (fórmula: … de bien vouloir)', answers: ['de'] },
        { label: '(5) – podríamos (pouvoir, condicional)', answers: ['pourrions'] },
        { label: '(6) – fórmula: ___ l’attente de', answers: ['Dans', 'dans'] },
      ],
    },
    message: {
      prompt:
        'Para la sección de opinión de un diario: «¿Debería limitarse por ley el número de pacientes por enfermero?». Escribe un texto argumentativo de unas 250 palabras, con introducción, desarrollo y conclusión.',
      checks: [
        'Introducción: presentas el tema, planteas la problemática (Faut-il… ?) y anuncias el plan',
        'Desarrollo en dos o tres partes, cada una con un argumento, una explicación y un ejemplo',
        'Consideras y refutas la opinión contraria (Certes…, mais… / On pourrait objecter que…)',
        'Usas conectores B2 variados (en revanche, or, néanmoins, par conséquent, en outre)',
        'Matizas tus afirmaciones (il semblerait que, sans doute, dans une certaine mesure)',
        'Usas estructuras B2: subjuntivo, condicional pasado, nominalización, participio',
        'Conclusión: respondes la pregunta y abres una perspectiva',
        'Registro formal homogéneo y concordancias revisadas',
      ],
      model:
        'Depuis plusieurs années, les soignants alertent sur la dégradation de leurs conditions de travail. Faut-il pour autant fixer par la loi un nombre maximal de patients par infirmier ? Nous verrons d’abord les avantages d’une telle mesure, puis ses limites. D’une part, des ratios obligatoires garantiraient la sécurité des patients. En effet, plusieurs études montrent que le risque d’erreur augmente lorsqu’une infirmière doit s’occuper de plus de huit malades. D’autre part, cette mesure rendrait le métier plus attractif : nombreux sont ceux qui le quittent faute de temps pour bien soigner. Certes, on pourrait objecter qu’une telle loi coûterait cher et qu’il manque déjà des infirmiers. Néanmoins, la Californie, qui a adopté des ratios en 2004, a vu revenir de nombreux soignants. En outre, le coût des arrêts maladie et des démissions est loin d’être négligeable. En définitive, il semblerait qu’une limitation légale soit non seulement souhaitable, mais nécessaire. Encore faut-il qu’elle s’accompagne d’un véritable plan de formation, sans quoi elle resterait lettre morte.',
    },
    speaking: [
      'Preparé en 30 minutos un documento corto (un artículo, una opinión) y saqué su problemática',
      'Presenté el tema y anuncié mi plan (Je vais d’abord…, ensuite…, enfin…)',
      'Defendí un punto de vista claro con al menos dos argumentos y ejemplos concretos',
      'Usé conectores y fórmulas para matizar (Il me semble que…, Dans une certaine mesure…)',
      'En el debate con el examinador, mantuve mi postura y reaccioné a sus objeciones (Je comprends votre point de vue, mais…)',
      'Reformulé cuando no me entendieron, sin pasar al español',
      'Usé un registro formal y estructuras B2 (subjuntivo, condicional, hipótesis)',
    ],
  },
  C1: {
    form: {
      context: 'Completa el párrafo del artículo de Camila (1–6). Registro académico: subjuntivo, conectores cultos, construcciones impersonales y participio absoluto.',
      text: 'La douleur de l’enfant demeure, à bien des égards, sous-évaluée. (1) ___ de l’enquête menée dans quarante services que seul un tiers d’entre eux recourt à une échelle validée. Bien que les outils (2) ___ connus depuis longtemps, leur usage reste marginal. (3) ___, la douleur non évaluée n’est pas traitée. Il importe donc que chaque équipe (4) ___ formée. (5) ___ cette formation dispensée, encore faudra-t-il en mesurer les effets. Si les moyens le permettaient, une étude multicentrique (6) ___ être menée dès l’an prochain.',
      fields: [
        { label: '(1) – se desprende (fórmula impersonal: Il ___)', answers: ['Il ressort', 'il ressort'] },
        { label: '(2) – sean (être, subjuntivo)', answers: ['soient'] },
        { label: '(3) – por lo tanto, desde entonces (dos palabras)', answers: ['Dès lors', 'dès lors', 'De ce fait', 'de ce fait'] },
        { label: '(4) – sea (être, subjuntivo)', answers: ['soit'] },
        { label: '(5) – una vez (participio absoluto: ___ cette formation dispensée)', answers: ['Une fois', 'une fois'] },
        { label: '(6) – podría (pouvoir, condicional)', answers: ['pourrait'] },
      ],
    },
    message: {
      prompt:
        'Ensayo argumentado (DALF C1, unas 250 palabras). Tras leer documentos sobre el tema, escribe para la revista de tu hospital: «La presencia de los padres durante los cuidados dolorosos: ¿obstáculo o recurso?». Antes, en el examen real, harías una síntesis de los documentos (unas 220 palabras, sin opinión).',
      checks: [
        'Título y frase de enganche; presentas el tema y formulas la problemática en forma de pregunta',
        'Anuncias el plan y lo sigues: dos o tres partes con una idea, argumentos y un ejemplo propio cada una',
        'Concedes el argumento contrario antes de rebatirlo (Certes…, il n’en reste pas moins que…)',
        'Conectores cultos y variados (dès lors, qui plus est, a fortiori, encore que, toujours est-il que)',
        'Matizas y modalizas (il semblerait que, dans une certaine mesure, il n’est pas exclu que)',
        'Estructuras C1: nominalización, participio absoluto, inversión tras peut-être o aussi, subjuntivo cuidado',
        'Conclusión que responde la problemática y abre una perspectiva (Reste à savoir si…)',
        'Registro homogéneo, vocabulario preciso (sin verbos comodín) y unas 250 palabras',
      ],
      model:
        'Parents au chevet : obstacle ou ressource ? « Ne restez pas, ce sera plus facile pour tout le monde. » Combien de parents ont entendu cette phrase avant une prise de sang ? Longtemps, leur présence a été perçue comme une gêne. Faut-il pour autant les tenir à l’écart des soins douloureux ? Nous verrons que, loin d’être un obstacle, ils constituent une ressource, à condition d’être préparés. Certes, un parent angoissé peut transmettre sa peur à l’enfant et déstabiliser l’équipe. Il n’en reste pas moins que l’absence du parent est, pour un jeune enfant, une source d’angoisse bien plus grande encore. Qui plus est, les études récentes montrent qu’un parent informé réduit sensiblement l’anxiété de l’enfant et, partant, sa douleur. Ainsi, dans notre service, une information de dix minutes a suffi pour diminuer le recours à la contention. Encore faut-il que les soignants soient formés : la présence parentale ne s’improvise pas. Il convient de définir le rôle de chacun, de sorte que le parent sache ce que l’on attend de lui. En définitive, la question n’est pas tant de savoir s’il faut accepter les parents que de savoir comment les accompagner. Reste à savoir si les établissements se donneront les moyens de cette ambition.',
    },
    speaking: [
      'Preparé en una hora un dossier de varios documentos y saqué una problemática clara',
      'Hice un exposé de unos 10 minutos con introducción, plan anunciado, dos o tres partes y conclusión',
      'Usé fórmulas de transición (Dans un premier temps…, J’en viens maintenant à…, Pour conclure…)',
      'Di una opinión argumentada y matizada, con ejemplos concretos',
      'En el debate (unos 20 minutos), defendí mi posición, concedí y maticé (Je vous rejoins sur ce point, mais…)',
      'Reformulé las preguntas difíciles para ganar tiempo (Si je comprends bien votre question…)',
      'Mantuve un registro cuidado con el jurado (vous, ne completo, vocabulario preciso)',
      'Usé estructuras C1: subjuntivo, hipótesis, inversión, conectores cultos',
    ],
  },
  C2: {
    form: {
      context: 'Completa el párrafo de la columna de Camila (1–6). Registro culto: subjuntivo poco frecuente, ne literario, concordancias y conectores.',
      text: 'On nous répète que le temps manque. (1) ___ que je sache, il n’a jamais manqué pour remplir des formulaires. Non que l’administration (2) ___ inutile : elle protège les patients. Mais voilà deux ans que je ne (3) ___ vu un tableau de bord mesurer le temps passé à écouter. La plupart des soignants le (4) ___ : écouter ne s’évalue pas, donc ne compte pas. Il est pourtant plus urgent qu’on ne le (5) ___. (6) ___ dit, ce qui ne se mesure pas finit par disparaître.',
      fields: [
        { label: '(1) – que yo sepa: «___ que je sache» (dos palabras)', answers: ['Pour autant', 'pour autant'] },
        { label: '(2) – sea (être, subjuntivo)', answers: ['soit'] },
        { label: '(3) – he (avoir, passé composé con ne literario)', answers: ['l’ai', "l'ai"] },
        { label: '(4) – saben (savoir, presente, plural)', answers: ['savent'] },
        { label: '(5) – cree (croire, presente, con on)', answers: ['croit'] },
        { label: '(6) – dicho de otro modo: «___ dit»', answers: ['Autrement', 'autrement'] },
      ],
    },
    message: {
      prompt:
        'Prueba escrita del DALF C2 (unas 700 palabras). A partir de un dossier sobre la telemedicina, escribe un editorial para la revista de un colegio profesional de enfermería: «¿La teleconsulta reduce o aumenta las desigualdades de acceso a la salud?». Usa los documentos sin copiarlos y defiende una posición matizada.',
      checks: [
        'Respetas el tipo de texto (editorial: título, tono comprometido, firma) y el destinatario (colegas enfermeros)',
        'Introducción con gancho, problemática clara y anuncio del plan',
        'Usas los documentos del dossier reformulados y atribuidos (comme le souligne…, selon…), sin copiar frases',
        'Una tesis personal matizada, con concesión y refutación (certes…, il n’en reste pas moins…)',
        'Argumentos variados: datos (logos), experiencia profesional (ethos) y un caso concreto (pathos)',
        'Riqueza léxica C2: colocaciones, sinónimos precisos, nominalizaciones, ningún verbo comodín',
        'Estructuras C2: subjuntivo tras si tant est que o non que, inversión, participio absoluto, ne literario',
        'Conclusión que responde la problemática con una apertura y un remate memorable',
        'Unas 700 palabras, registro homogéneo y relectura (concordancias, acentos, puntuación francesa)',
      ],
      model:
        'Téléconsultation : le remède et la fracture. Il y a cinq ans encore, consulter un médecin par écran relevait de l’exception. Elle s’est depuis imposée, présentée comme la réponse aux déserts médicaux. Faut-il pour autant y voir l’outil de l’égalité retrouvée ? Pour autant que l’on puisse en juger, la réponse est plus nuancée. Certes, les chiffres du dossier sont éloquents : des trajets de plusieurs heures évités, des urgences désengorgées, des patients suivis plus régulièrement. Il serait absurde de mépriser ces progrès au nom d’une nostalgie du cabinet médical. Il n’en reste pas moins que, comme le souligne la revue de santé publique, les personnes âgées et les plus précaires sont aussi celles qui y recourent le moins. Autrement dit, l’outil censé réduire les inégalités risque de les creuser, si tant est qu’on le laisse fonctionner seul. Infirmières, nous le savons mieux que quiconque : un patient qui minimise ses symptômes ne se trahit pas toujours à l’écran ; il se trahit dans un geste, une hésitation, une main qui tremble. C’est pourquoi la téléconsultation assistée mérite d’être généralisée. Une infirmière présente au domicile ou en pharmacie, ce sont des yeux et des mains pour le médecin, et une voix rassurante pour le patient. Non que nous voulions nous substituer aux médecins : il s’agit de rendre la technique humaine. Reste la question du coût. Mais combien coûtent les hospitalisations évitables, les diagnostics tardifs, les renoncements aux soins ? En définitive, la téléconsultation ne sera un remède que si elle s’accompagne de présence. Sans quoi elle ne fera que déplacer la fracture, de la route vers l’écran.',
    },
    speaking: [
      'Preparé en una hora un dossier oral y escrito y saqué una problemática personal',
      'Hice un exposé de unos 10 minutos con plan anunciado, sin resumir los documentos uno por uno',
      'Retomé los documentos sonoros con precisión (le premier intervenant souligne…, le reportage montre…)',
      'Defendí una posición clara y matizada, con ejemplos concretos y propios',
      'En el debate (unos 20 minutos), reformulé, concedí y refuté sin perder el hilo',
      'Respondí a objeciones difíciles o provocadoras con calma (C’est une objection pertinente ; je la nuancerais toutefois…)',
      'Usé un léxico preciso y variado, sin muletillas ni calcos del español',
      'Adapté el registro: cuidado con el jurado, capaz de citar o comentar un uso familiar o regional',
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
  return level === 'C2' ? <DalfC2Exam /> : <DelfExam key={level} level={level} />
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

type C2Step = 'intro' | 'oral-q' | 'oral-p' | 'ecrit-q' | 'ecrit-p' | 'result'
type C2Parts = { oralQ?: Result; oralP?: Result; ecritQ?: Result; ecritP?: Result }

const ratio = (r?: Result) => (r && r.total ? r.correct / r.total : 0)
/** Cada prueba del C2 vale lo mismo en comprensión (corregida) y en expresión (autoevaluada). */
const combine = (a?: Result, b?: Result): Result => ({ correct: Math.round(((ratio(a) + ratio(b)) / 2) * 100), total: 100 })

/**
 * DALF C2: dos pruebas de 50 puntos que integran comprensión y expresión. Oral: escuchar un dossier y
 * exponer y debatir (autoevaluado). Escrito: leer un dossier y escribir un texto argumentado. El aprobado
 * guardado depende solo de la comprensión, que se corrige sola.
 */
function DalfC2Exam() {
  const exam = delfExams.C2
  const t = tasks.C2!
  const [step, setStep] = useState<C2Step>('intro')
  const [parts, setParts] = useState<C2Parts>({})
  const [oral] = useState(() => pickTexts('C2', 'dialogue', 3))
  const [ecrit] = useState(() => pickTexts('C2', 'reading', 3))
  const submitRecord = useProgress((s) => s.submitRecord)

  const done = (key: keyof C2Parts, r: Result, next: C2Step) => {
    const p = { ...parts, [key]: r }
    setParts(p)
    if (next === 'result' && scoreDelf('C2', { oral: p.oralQ, ecrit: p.ecritQ }).passedAuto) submitRecord(delfPassedKey('C2'), 1)
    setStep(next)
  }

  if (step === 'intro') {
    return (
      <section className="mx-auto flex max-w-md flex-col gap-4 py-6">
        <span className="text-6xl" aria-hidden>
          🏁
        </span>
        <h1 className="text-2xl font-extrabold">Simulacro DALF C2</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Dos pruebas de {exam.max} puntos que integran comprensión y expresión, como el examen real. En cada una, la <strong>comprensión</strong> se corrige sola
          y decide si apruebas (la mitad de los puntos y al menos {exam.minimum}/{exam.max} en cada prueba); la <strong>expresión</strong> es una autoevaluación
          guiada, con un texto modelo.
        </p>
        <ul className="flex flex-col gap-1 text-sm">
          <li>{moduleNames.oral} · escuchar un dossier, luego exposé y debate (autoevaluado)</li>
          <li>{moduleNames.ecrit} · leer un dossier, luego un texto argumentado (en parte autoevaluado)</li>
        </ul>
        <button onClick={() => setStep('oral-q')} className="self-start rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Empezar
        </button>
      </section>
    )
  }

  if (step === 'oral-q') return <QuestionsModule key="oral" title={`${moduleNames.oral} · comprensión`} texts={oral} listen lang="fr" onDone={(r) => done('oralQ', r, 'oral-p')} />
  if (step === 'oral-p') return <ChecklistModule title={`${moduleNames.oral} · exposé y debate`} checks={t.speaking} onDone={(r) => done('oralP', r, 'ecrit-q')} />
  if (step === 'ecrit-q') return <QuestionsModule key="ecrit" title={`${moduleNames.ecrit} · comprensión`} texts={ecrit} listen={false} lang="fr" onDone={(r) => done('ecritQ', r, 'ecrit-p')} />
  if (step === 'ecrit-p') return <WritingModule title={`${moduleNames.ecrit} · expresión`} formTask={t.form} messageTask={t.message} lang="fr" check={frenchCourse.check} onDone={(r) => done('ecritP', r, 'result')} />

  const auto = scoreDelf('C2', { oral: parts.oralQ, ecrit: parts.ecritQ })
  const full = scoreDelf('C2', { oral: combine(parts.oralQ, parts.oralP), ecrit: combine(parts.ecritQ, parts.ecritP) })
  const rows: [string, Result | undefined][] = [
    ['Comprensión oral', parts.oralQ],
    ['Exposé y debate (autoevaluado)', parts.oralP],
    ['Comprensión escrita', parts.ecritQ],
    ['Expresión escrita (en parte autoevaluada)', parts.ecritP],
  ]
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-6 text-center">
      <span className="text-6xl" aria-hidden>
        {auto.passedAuto ? '🎉' : '💪'}
      </span>
      <h1 className="text-2xl font-extrabold">{auto.passedAuto ? '¡Aprobaste el simulacro DALF C2!' : 'Todavía no: sigue practicando'}</h1>
      <p className="text-3xl font-extrabold">{(full.points.oral ?? 0) + (full.points.ecrit ?? 0)}/100</p>
      <dl className="grid w-full grid-cols-2 gap-2 text-left">
        {(['oral', 'ecrit'] as const).map((m) => (
          <div key={m} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <dt className="text-xs font-bold text-slate-500 uppercase">{moduleNames[m]}</dt>
            <dd className={`text-2xl font-extrabold ${full.eliminated.includes(m) ? 'text-red-600' : ''}`}>
              {full.points[m] ?? 0}/{exam.max}
            </dd>
          </div>
        ))}
      </dl>
      <ul className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
        {rows.map(([label, r]) => (
          <li key={label}>
            {label}: {r ? `${r.correct}/${r.total}` : '—'}
          </li>
        ))}
      </ul>
      <p className="text-sm text-slate-500">
        Se aprueba con 50/100 y sin ninguna prueba bajo {exam.minimum}/{exam.max}. Aquí el aprobado depende de la comprensión, que se corrige sola; la
        expresión es de práctica, porque no hay corrección automática de textos libres.
        {full.passed !== null && (full.passed ? ' Con tu autoevaluación, también aprobarías el total.' : ' Con tu autoevaluación, el total todavía no alcanza.')}
      </p>
      <SaveProgressPrompt />
      <Link to="/aprender" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
        Volver al recorrido
      </Link>
    </section>
  )
}
