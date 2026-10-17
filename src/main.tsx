import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

import { watchKanjiCards } from './lib/progress/backfillCards.ts'
import { watchAchievements } from './lib/progress/watchAchievements.ts'
import { reloadOnce } from './lib/reloadOnce.ts'

watchAchievements()
watchKanjiCards()

// Un archivo de la app no se pudo bajar (se publicó una versión nueva mientras estaba
// abierta): se recarga una vez para traer la nueva. Si no, ErrorBoundary muestra el aviso.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnce()) event.preventDefault()
})

// Firebase se carga aparte para que la primera pantalla aparezca antes.
import('./lib/account/service.ts').then((m) => m.startAccount())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
