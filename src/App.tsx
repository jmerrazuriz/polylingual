import { Route, Routes } from 'react-router'
import { ComingSoon } from './components/ComingSoon'
import { Layout } from './components/Layout'
import { ChartPage } from './features/chart/ChartPage'
import { GamesPage } from './features/games/GamesPage'
import { HomePage } from './features/home/HomePage'
import { LearnPage } from './features/learn/LearnPage'
import { LessonRoute } from './features/learn/LessonPage'
import { PracticePage } from './features/practice/PracticePage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tabla" element={<ChartPage />} />
        <Route path="aprender" element={<LearnPage />} />
        <Route path="aprender/:lessonId" element={<LessonRoute />} />
        <Route path="practicar" element={<PracticePage />} />
        <Route path="juegos" element={<GamesPage />} />
        <Route path="perfil" element={<ComingSoon title="Perfil" phase={5} />} />
        <Route path="*" element={<ComingSoon title="Página no encontrada" />} />
      </Route>
    </Routes>
  )
}
