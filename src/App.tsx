import { type ComponentType, lazy } from 'react'
import { Route, Routes } from 'react-router'
import { ComingSoon } from './components/ComingSoon'
import { Layout } from './components/Layout'
import { HomePage } from './features/home/HomePage'
import { LearnPage } from './features/learn/LearnPage'

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
        <Route path="hoy" element={<DailyPage />} />
        <Route path="tabla" element={<ChartPage />} />
        <Route path="aprender" element={<LearnPage />} />
        <Route path="aprender/:lessonId" element={<LessonRoute />} />
        <Route path="test-de-nivel" element={<PlacementPage />} />
        <Route path="nivelacion" element={<PathPlacementPage />} />
        <Route path="gramatica" element={<GrammarPage />} />
        <Route path="conjugacion" element={<ConjugationPage />} />
        <Route path="lectura" element={<ReadingsPage />} />
        <Route path="lectura/:textId" element={<ReadingRoute />} />
        <Route path="simulacro" element={<MockExamPage />} />
        <Route path="vocabulario" element={<VocabPage />} />
        <Route path="vocabulario/:lessonId" element={<VocabLessonRoute />} />
        <Route path="contadores" element={<CountersPage />} />
        <Route path="contadores/:lessonId" element={<CounterLessonRoute />} />
        <Route path="kanji" element={<KanjiPage />} />
        <Route path="kanji/:lessonId" element={<KanjiLessonRoute />} />
        <Route path="extra" element={<ExtraLessonPage />} />
        <Route path="gramatica/:lessonId" element={<GrammarLessonRoute />} />
        <Route path="practicar" element={<PracticePage />} />
        <Route path="juegos" element={<GamesPage />} />
        <Route path="repasar" element={<ReviewPage />} />
        <Route path="repaso/unidad/:unitId" element={<UnitReviewRoute />} />
        <Route path="repaso/debiles" element={<WeakReviewPage />} />
        <Route path="progreso" element={<ProgressPage />} />
        <Route path="entrar" element={<LoginPage />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="*" element={<ComingSoon title="Página no encontrada" />} />
      </Route>
    </Routes>
  )
}
