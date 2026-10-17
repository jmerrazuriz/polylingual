import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { ComingSoon } from './components/ComingSoon'
import { Layout } from './components/Layout'
import { ChartPage } from './features/chart/ChartPage'
import { CoursesPage } from './features/courses/CoursesPage'
import { DailyPage } from './features/daily/DailyPage'
import { ExtraLessonPage } from './features/extra/ExtraLessonPage'
import { CounterLessonRoute, CountersPage } from './features/study/CountersPages'
import { KanjiLessonRoute, KanjiPage } from './features/study/KanjiPages'
import { VocabLessonRoute, VocabPage } from './features/study/VocabPages'
import { ConjugationPage } from './features/grammar/ConjugationPage'
import { PathPlacementPage } from './features/path/PathPlacementPage'
import { ReadingRoute, ReadingsPage } from './features/study/ReadingPages'
import { MockExamPage } from './features/study/MockExamPage'
import { GamesPage } from './features/games/GamesPage'
import { GrammarLessonRoute } from './features/grammar/GrammarLessonPage'
import { GrammarPage } from './features/grammar/GrammarPage'
import { HomePage } from './features/home/HomePage'
import { LearnPage } from './features/learn/LearnPage'
import { LessonRoute } from './features/learn/LessonPage'
import { PlacementPage } from './features/learn/PlacementPage'
import { PracticePage } from './features/practice/PracticePage'
import { ProgressPage } from './features/progress/ProgressPage'
import { ReviewPage } from './features/review/ReviewPage'
import { UnitReviewRoute } from './features/review/UnitReviewPage'
import { WeakReviewPage } from './features/review/WeakReviewPage'

// Las páginas de cuenta usan Firebase Auth: se cargan solo al visitarlas.
const LoginPage = lazy(() => import('./features/account/LoginPage').then((m) => ({ default: m.LoginPage })))
const ProfilePage = lazy(() => import('./features/account/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const loading = <p className="py-10 text-center text-slate-500">Cargando…</p>

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
        <Route path="entrar" element={<Suspense fallback={loading}><LoginPage /></Suspense>} />
        <Route path="perfil" element={<Suspense fallback={loading}><ProfilePage /></Suspense>} />
        <Route path="*" element={<ComingSoon title="Página no encontrada" />} />
      </Route>
    </Routes>
  )
}
