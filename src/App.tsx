import { Route, Routes } from 'react-router'
import { ComingSoon } from './components/ComingSoon'
import { Layout } from './components/Layout'
import { ChartPage } from './features/chart/ChartPage'
import { HomePage } from './features/home/HomePage'
import { LearnPage } from './features/learn/LearnPage'
import { LessonRoute } from './features/learn/LessonPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tabla" element={<ChartPage />} />
        <Route path="aprender" element={<LearnPage />} />
        <Route path="aprender/:lessonId" element={<LessonRoute />} />
        <Route path="practicar" element={<ComingSoon title="Practicar" phase={3} />} />
        <Route path="juegos" element={<ComingSoon title="Juegos" phase={3} />} />
        <Route path="perfil" element={<ComingSoon title="Perfil" phase={5} />} />
        <Route path="*" element={<ComingSoon title="Página no encontrada" />} />
      </Route>
    </Routes>
  )
}
