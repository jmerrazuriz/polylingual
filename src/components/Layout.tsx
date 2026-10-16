import { Link, NavLink, Outlet } from 'react-router'

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
          <NavLink
            to="/perfil"
            className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Entrar
          </NavLink>
        </div>
      </header>

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
