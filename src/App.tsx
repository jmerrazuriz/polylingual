import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { ComingSoon } from './components/ComingSoon'
import { Layout } from './components/Layout'
import { ChartPage } from './features/chart/ChartPage'
import { GamesPage } from './features/games/GamesPage'
import { HomePage } from './features/home/HomePage'
import { LearnPage } from './features/learn/LearnPage'
import { LessonRoute } from './features/learn/LessonPage'
import { PlacementPage } from './features/learn/PlacementPage'
import { PracticePage } from './features/practice/PracticePage'
import { ProgressPage } from './features/progress/ProgressPage'
import { ReviewPage } from './features/review/ReviewPage'

// Las páginas de cuenta usan Firebase Auth: se cargan solo al visitarlas.
const LoginPage = lazy(() => import('./features/account/LoginPage').then((m) => ({ default: m.LoginPage })))
const ProfilePage = lazy(() => import('./features/account/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const loading = <p className="py-10 text-center text-slate-500">Cargando…</p>

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tabla" element={<ChartPage />} />
        <Route path="aprender" element={<LearnPage />} />
        <Route path="aprender/:lessonId" element={<LessonRoute />} />
        <Route path="test-de-nivel" element={<PlacementPage />} />
        <Route path="practicar" element={<PracticePage />} />
        <Route path="juegos" element={<GamesPage />} />
        <Route path="repasar" element={<ReviewPage />} />
        <Route path="progreso" element={<ProgressPage />} />
        <Route path="entrar" element={<Suspense fallback={loading}><LoginPage /></Suspense>} />
        <Route path="perfil" element={<Suspense fallback={loading}><ProfilePage /></Suspense>} />
        <Route path="*" element={<ComingSoon title="Página no encontrada" />} />
      </Route>
    </Routes>
  )
}
