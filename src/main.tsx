import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

import { watchKanjiCards } from './lib/progress/backfillCards.ts'
import { watchAchievements } from './lib/progress/watchAchievements.ts'

watchAchievements()
watchKanjiCards()

// Firebase se carga aparte para que la primera pantalla aparezca antes.
import('./lib/account/service.ts').then((m) => m.startAccount())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
