import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { type CourseSection, courseById } from '../courses'
import { useAccount } from '../lib/account/store'
import { useProgress } from '../lib/progress/store'
import { useApplySettings } from '../lib/settings/useApplySettings'
import { useToasts } from '../lib/toasts'

const allSections: { to: string; label: string; icon: string; section?: CourseSection }[] = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/tabla', label: 'Tabla', icon: '🔤', section: 'tabla' },
  { to: '/aprender', label: 'Aprender', icon: '📘', section: 'aprender' },
  { to: '/practicar', label: 'Practicar', icon: '✍️', section: 'practicar' },
  { to: '/juegos', label: 'Juegos', icon: '🎮', section: 'juegos' },
]

/** Secciones del curso activo (cada idioma declara cuáles tiene). */
function useSections() {
  const course = courseById(useProgress((s) => s.course))
  return allSections.filter((s) => !s.section || course.sections.includes(s.section))
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors md:flex-row md:gap-2 md:text-sm ${
    isActive
      ? 'text-accent'
      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
  }`

export function Layout() {
  useApplySettings()
  const sections = useSections()
  const course = courseById(useProgress((s) => s.course))
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-10 print:hidden border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-ink dark:text-white">
              <img src="/favicon.svg" alt="" className="h-8 w-8" />
              <span className="hidden sm:inline">Polylingual</span>
            </Link>
            <Link
              to="/cursos"
              title="Cambiar de curso"
              className="flex items-center gap-1 rounded-full border border-slate-300 px-2.5 py-1 text-sm font-bold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <span aria-hidden>{course.flag}</span>
              {course.name}
              <span className="text-slate-400" aria-hidden>
                ▾
              </span>
            </Link>
          </div>
          <nav className="hidden gap-1 md:flex">
            {sections.map((s) => (
              <NavLink key={s.to} to={s.to} end={s.to === '/'} className={linkClass}>
                {s.label}
              </NavLink>
            ))}
          </nav>
          <AccountButton />
        </div>
      </header>
      <GuestBanner />

      <main id="contenido" className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-24 md:pb-10 print:p-0">
        <Outlet />
      </main>

      <Toaster />

      <nav aria-label="Secciones" className="fixed inset-x-0 bottom-0 z-10 flex print:hidden justify-around border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900 md:hidden">
        {sections.map((s) => (
          <NavLink key={s.to} to={s.to} end={s.to === '/'} className={linkClass}>
            <span className="text-lg leading-none" aria-hidden>
              {s.icon}
            </span>
            {s.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function AccountButton() {
  const { status, user } = useAccount()
  if (status === 'user' && user) {
    return (
      <NavLink
        to="/perfil"
        aria-label="Tu perfil"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-extrabold text-white hover:opacity-90"
      >
        {(user.name ?? user.email ?? '?').charAt(0).toUpperCase()}
      </NavLink>
    )
  }
  return (
    <div className={`flex items-center gap-1 ${status === 'loading' ? 'invisible' : ''}`}>
      <NavLink
        to="/perfil"
        aria-label="Ajustes"
        title="Ajustes"
        className="rounded-full px-2 py-1 text-lg hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        ⚙️
      </NavLink>
      <NavLink
        to="/entrar"
        className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        Entrar
      </NavLink>
    </div>
  )
}

/** Aviso discreto del modo invitado (sin memoria); se puede ocultar durante la visita. */
function GuestBanner() {
  const status = useAccount((s) => s.status)
  const [hidden, setHidden] = useState(false)
  const { pathname } = useLocation()
  if (status !== 'guest' || hidden || pathname === '/entrar') return null

  return (
    <div className="border-b border-amber-200 bg-amber-50 print:hidden text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2">
        <p className="flex-1">
          Estás como invitado: tu progreso no se guardará.{' '}
          <Link to="/entrar" className="font-bold underline">
            Entrar
          </Link>
        </p>
        <button onClick={() => setHidden(true)} aria-label="Ocultar aviso" className="px-1 text-lg leading-none opacity-60 hover:opacity-100">
          ×
        </button>
      </div>
    </div>
  )
}

/** Avisos breves (logros nuevos), anunciados también a los lectores de pantalla. */
function Toaster() {
  const toasts = useToasts((s) => s.toasts)
  const dismiss = useToasts((s) => s.dismiss)
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-20 flex flex-col items-center gap-2 px-4 md:bottom-6 print:hidden">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-ink p-3 text-left text-white shadow-lg"
        >
          <span className="text-3xl" aria-hidden>
            {t.icon}
          </span>
          <span>
            <span className="block font-extrabold">{t.title}</span>
            <span className="text-sm opacity-90">{t.text}</span>
          </span>
        </button>
      ))}
    </div>
  )
}
