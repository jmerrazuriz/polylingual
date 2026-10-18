import { type ComponentType, lazy, type ReactNode } from 'react'
import { Link, Route, Routes } from 'react-router'
import { courseById } from './courses'
import { ComingSoon } from './components/ComingSoon'
import { Layout } from './components/Layout'
import { HomePage } from './features/home/HomePage'
import { LearnPage } from './features/learn/LearnPage'
import { useProgress } from './lib/progress/store'

/**
 * Página que se carga al visitarla (su código queda en un archivo aparte). El inicio y
 * el recorrido van en el paquete principal; el resto se baja cuando se abre.
 * Layout muestra «Cargando…» mientras tanto.
 */
function page<M>(load: () => Promise<M>, pick: (m: M) => ComponentType) {
  return lazy(() => load().then((m) => ({ default: pick(m) })))
}

const CoursesPage = page(() => import('./features/courses/CoursesPage'), (m) => m.CoursesPage)
const DailyPage = page(() => import('./features/daily/DailyPage'), (m) => m.DailyPage)
const ChartPage = page(() => import('./features/chart/ChartPage'), (m) => m.ChartPage)
const GermanTablesPage = page(() => import('./features/chart/GermanTablesPage'), (m) => m.GermanTablesPage)
const GermanVocabPage = page(() => import('./features/german/GermanStudyPages'), (m) => m.GermanVocabPage)
const GermanVocabLessonRoute = page(() => import('./features/german/GermanStudyPages'), (m) => m.GermanVocabLessonRoute)
const GermanReadingsPage = page(() => import('./features/german/GermanStudyPages'), (m) => m.GermanReadingsPage)
const GermanReadingRoute = page(() => import('./features/german/GermanStudyPages'), (m) => m.GermanReadingRoute)
const GoetheExamPage = page(() => import('./features/german/GoetheExamPage'), (m) => m.GoetheExamPage)
const LessonRoute = page(() => import('./features/learn/LessonPage'), (m) => m.LessonRoute)
const PlacementPage = page(() => import('./features/learn/PlacementPage'), (m) => m.PlacementPage)
const PathPlacementPage = page(() => import('./features/path/PathPlacementPage'), (m) => m.PathPlacementPage)
const GrammarPage = page(() => import('./features/grammar/GrammarPage'), (m) => m.GrammarPage)
const GrammarLessonRoute = page(() => import('./features/grammar/GrammarLessonPage'), (m) => m.GrammarLessonRoute)
const ConjugationPage = page(() => import('./features/grammar/ConjugationPage'), (m) => m.ConjugationPage)
const ReadingsPage = page(() => import('./features/study/ReadingPages'), (m) => m.ReadingsPage)
const ReadingRoute = page(() => import('./features/study/ReadingPages'), (m) => m.ReadingRoute)
const MockExamPage = page(() => import('./features/study/MockExamPage'), (m) => m.MockExamPage)
const VocabPage = page(() => import('./features/study/VocabPages'), (m) => m.VocabPage)
const VocabLessonRoute = page(() => import('./features/study/VocabPages'), (m) => m.VocabLessonRoute)
const CountersPage = page(() => import('./features/study/CountersPages'), (m) => m.CountersPage)
const CounterLessonRoute = page(() => import('./features/study/CountersPages'), (m) => m.CounterLessonRoute)
const KanjiPage = page(() => import('./features/study/KanjiPages'), (m) => m.KanjiPage)
const KanjiLessonRoute = page(() => import('./features/study/KanjiPages'), (m) => m.KanjiLessonRoute)
const ExtraLessonPage = page(() => import('./features/extra/ExtraLessonPage'), (m) => m.ExtraLessonPage)
const PracticePage = page(() => import('./features/practice/PracticePage'), (m) => m.PracticePage)
const GamesPage = page(() => import('./features/games/GamesPage'), (m) => m.GamesPage)
const GermanGamesPage = page(() => import('./features/german/GermanGamesPage'), (m) => m.GermanGamesPage)
const GermanPracticePage = page(() => import('./features/german/GermanPracticePage'), (m) => m.GermanPracticePage)
const ReviewPage = page(() => import('./features/review/ReviewPage'), (m) => m.ReviewPage)
const UnitReviewRoute = page(() => import('./features/review/UnitReviewPage'), (m) => m.UnitReviewRoute)
const WeakReviewPage = page(() => import('./features/review/WeakReviewPage'), (m) => m.WeakReviewPage)
const ProgressPage = page(() => import('./features/progress/ProgressPage'), (m) => m.ProgressPage)
// Las páginas de cuenta usan Firebase Auth.
const LoginPage = page(() => import('./features/account/LoginPage'), (m) => m.LoginPage)
const ProfilePage = page(() => import('./features/account/ProfilePage'), (m) => m.ProfilePage)

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="cursos" element={<CoursesPage />} />
        <Route path="hoy" element={<CourseOnly course="ja"><DailyPage /></CourseOnly>} />
        <Route path="tabla" element={<TableRoute />} />
        <Route path="aprender" element={<LearnPage />} />
        <Route path="aprender/:lessonId" element={<CourseOnly course="ja"><LessonRoute /></CourseOnly>} />
        <Route path="test-de-nivel" element={<CourseOnly course="ja"><PlacementPage /></CourseOnly>} />
        <Route path="nivelacion" element={<PathPlacementPage />} />
        <Route path="gramatica" element={<GrammarPage />} />
        <Route path="conjugacion" element={<CourseOnly course="ja"><ConjugationPage /></CourseOnly>} />
        <Route path="lectura" element={<CourseOnly course="ja"><ReadingsPage /></CourseOnly>} />
        <Route path="lectura/:textId" element={<CourseOnly course="ja"><ReadingRoute /></CourseOnly>} />
        <Route path="simulacro" element={<CourseOnly course="ja"><MockExamPage /></CourseOnly>} />
        <Route path="simulacro/:level" element={<CourseOnly course="ja"><MockExamPage /></CourseOnly>} />
        <Route path="palabras" element={<CourseOnly course="de"><GermanVocabPage /></CourseOnly>} />
        <Route path="palabras/:lessonId" element={<CourseOnly course="de"><GermanVocabLessonRoute /></CourseOnly>} />
        <Route path="textos" element={<CourseOnly course="de"><GermanReadingsPage /></CourseOnly>} />
        <Route path="textos/:textId" element={<CourseOnly course="de"><GermanReadingRoute /></CourseOnly>} />
        <Route path="goethe/:level" element={<CourseOnly course="de"><GoetheExamPage /></CourseOnly>} />
        <Route path="vocabulario" element={<CourseOnly course="ja"><VocabPage /></CourseOnly>} />
        <Route path="vocabulario/:lessonId" element={<CourseOnly course="ja"><VocabLessonRoute /></CourseOnly>} />
        <Route path="contadores" element={<CourseOnly course="ja"><CountersPage /></CourseOnly>} />
        <Route path="contadores/:lessonId" element={<CourseOnly course="ja"><CounterLessonRoute /></CourseOnly>} />
        <Route path="kanji" element={<CourseOnly course="ja"><KanjiPage /></CourseOnly>} />
        <Route path="kanji/:lessonId" element={<CourseOnly course="ja"><KanjiLessonRoute /></CourseOnly>} />
        <Route path="extra" element={<CourseOnly course="ja"><ExtraLessonPage /></CourseOnly>} />
        <Route path="gramatica/:lessonId" element={<GrammarLessonRoute />} />
        <Route path="practicar" element={<ByCourse ja={<PracticePage />} de={<GermanPracticePage />} />} />
        <Route path="juegos" element={<ByCourse ja={<GamesPage />} de={<GermanGamesPage />} />} />
        <Route path="repasar" element={<ReviewPage />} />
        <Route path="repaso/unidad/:unitId" element={<CourseOnly course="ja"><UnitReviewRoute /></CourseOnly>} />
        <Route path="repaso/debiles" element={<CourseOnly course="ja"><WeakReviewPage /></CourseOnly>} />
        <Route path="progreso" element={<ProgressPage />} />
        <Route path="entrar" element={<LoginPage />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="*" element={<ComingSoon title="Página no encontrada" />} />
      </Route>
    </Routes>
  )
}

/** La tabla de consulta del curso activo: kana en japonés; artículos, casos y verbos en alemán. */
function TableRoute() {
  const course = useProgress((s) => s.course)
  return course === 'de' ? <GermanTablesPage /> : <ChartPage />
}

/**
 * Secciones propias de un idioma (kana, kanji, Goethe…). En otro curso no se muestran:
 * cada idioma es independiente. Se ofrece cambiar al curso dueño de la sección.
 */
function CourseOnly({ course, children }: { course: string; children: ReactNode }) {
  const active = useProgress((s) => s.course)
  const setCourse = useProgress((s) => s.setCourse)
  if (active === course) return children
  const owner = courseById(course)
  return (
    <section className="flex flex-col items-center gap-4 py-16 text-center">
      <span className="text-6xl" aria-hidden>
        {owner.flag}
      </span>
      <h1 className="text-2xl font-extrabold">Esta sección es del curso de {owner.name.toLowerCase()}</h1>
      <p className="max-w-md text-slate-500 dark:text-slate-400">
        Estás en el curso de {courseById(active).name.toLowerCase()}. Cada idioma tiene sus propias secciones y su propio progreso.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => setCourse(course)} className="rounded-full bg-ink px-5 py-2.5 font-bold text-white hover:opacity-90">
          Cambiar a {owner.name.toLowerCase()}
        </button>
        <Link to="/" className="rounded-full border border-slate-300 px-5 py-2.5 font-bold dark:border-slate-700">
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}

/** Una sección que existe en varios cursos con contenido propio (juegos, práctica). */
function ByCourse({ ja, de }: { ja: ReactNode; de: ReactNode }) {
  const course = useProgress((s) => s.course)
  return course === 'de' ? de : course === 'ja' ? ja : <CourseOnly course="ja">{ja}</CourseOnly>
}
