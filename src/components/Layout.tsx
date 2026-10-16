import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { useAccount } from '../lib/account/store'

const sections = [
  { to: '/', label: 'Inicio', glyph: '家' },
  { to: '/tabla', label: 'Tabla', glyph: 'あ' },
  { to: '/aprender', label: 'Aprender', glyph: '学' },
  { to: '/practicar', label: 'Practicar', glyph: '書' },
  { to: '/juegos', label: 'Juegos', glyph: '遊' },
] as const

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors md:flex-row md:gap-2 md:text-sm ${
    isActive
      ? 'text-accent'
      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
  }`

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-ink dark:text-white">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            Polylingual
          </Link>
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-24 md:pb-10">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900 md:hidden">
        {sections.map((s) => (
          <NavLink key={s.to} to={s.to} end={s.to === '/'} className={linkClass}>
            <span className="font-jp text-lg leading-none">{s.glyph}</span>
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
    <NavLink
      to="/entrar"
      className={`rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 ${
        status === 'loading' ? 'invisible' : ''
      }`}
    >
      Entrar
    </NavLink>
  )
}

/** Aviso discreto del modo invitado (sin memoria); se puede ocultar durante la visita. */
function GuestBanner() {
  const status = useAccount((s) => s.status)
  const [hidden, setHidden] = useState(false)
  const { pathname } = useLocation()
  if (status !== 'guest' || hidden || pathname === '/entrar') return null

  return (
    <div className="border-b border-amber-200 bg-amber-50 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
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
