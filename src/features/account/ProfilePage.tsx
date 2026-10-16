import { useState } from 'react'
import { Link } from 'react-router'
import { hiragana } from '../../content/kana'
import { hiraganaLessons } from '../../content/lessons'
import { authErrorMessage, checkVerification, resendVerification, signOut } from '../../lib/account/service'
import { useAccount } from '../../lib/account/store'
import { readingMastery } from '../../lib/progress/model'
import { useProgress } from '../../lib/progress/store'

export function ProfilePage() {
  const { status, user } = useAccount()
  const lessons = useProgress((s) => s.lessons)
  const kana = useProgress((s) => s.kana)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (status === 'loading') return <p className="py-10 text-center text-slate-500">Cargando…</p>

  if (status === 'guest' || !user) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-10 text-center">
        <span className="text-5xl" aria-hidden>
          👤
        </span>
        <h1 className="text-2xl font-extrabold">Estás como invitado</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Puedes usar toda la app, pero tu progreso se pierde al cerrar o recargar la página.
        </p>
        <Link to="/entrar?modo=crear" className="rounded-full bg-ink px-6 py-3 font-bold text-white hover:opacity-90">
          Crear cuenta gratis
        </Link>
        <Link to="/entrar" className="font-semibold text-accent hover:underline">
          Ya tengo cuenta
        </Link>
      </div>
    )
  }

  const act = async (action: () => Promise<string | null>) => {
    setBusy(true)
    try {
      setMessage(await action())
    } catch (e) {
      setMessage(authErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  const mastered = hiragana.filter((k) => readingMastery(kana[k.char]) === 'mastered').length
  const completed = hiraganaLessons.filter((l) => lessons[l.id]).length

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5">
      <header className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-2xl font-extrabold text-white">
          {(user.name ?? user.email ?? '?').charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-extrabold">{user.name ?? 'Tu cuenta'}</h1>
          <p className="truncate text-sm text-slate-500">
            {user.email} · {user.provider === 'google' ? 'Google' : 'correo'}
          </p>
        </div>
      </header>

      {!user.emailVerified && (
        <section className="flex flex-col gap-3 rounded-2xl bg-amber-50 p-4 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <p className="font-bold">Verifica tu correo para guardar tu progreso</p>
          <p className="text-sm">
            Te enviamos un enlace a {user.email}. Ábrelo y luego toca «Ya lo verifiqué». Mientras tanto, lo que hagas
            se guardará al verificar, siempre que no cierres la página.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              disabled={busy}
              onClick={() =>
                act(async () => ((await checkVerification()) ? '¡Listo! Tu progreso ya se guarda.' : 'Todavía no aparece verificado.'))
              }
              className="rounded-full bg-amber-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 dark:bg-amber-200 dark:text-amber-950"
            >
              Ya lo verifiqué
            </button>
            <button
              disabled={busy}
              onClick={() =>
                act(async () => {
                  await resendVerification()
                  return 'Te enviamos el correo de nuevo. Revisa también la carpeta de spam.'
                })
              }
              className="rounded-full border border-amber-900/40 px-4 py-2 text-sm font-bold disabled:opacity-50"
            >
              Reenviar correo
            </button>
          </div>
        </section>
      )}

      {message && (
        <p role="status" className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">
          {message}
        </p>
      )}

      <dl className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <dt className="text-xs font-bold text-slate-500 uppercase">Lecciones</dt>
          <dd className="text-2xl font-extrabold">
            {completed}/{hiraganaLessons.length}
          </dd>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <dt className="text-xs font-bold text-slate-500 uppercase">Hiragana dominados</dt>
          <dd className="text-2xl font-extrabold">
            {mastered}/{hiragana.length}
          </dd>
        </div>
      </dl>

      <p className="text-sm text-slate-500">
        {user.emailVerified
          ? '✓ Tu progreso se guarda automáticamente en tu cuenta.'
          : 'Tu progreso todavía no se está guardando.'}
      </p>

      <button
        onClick={() =>
          act(async () => {
            await signOut()
            return null
          })
        }
        disabled={busy}
        className="self-start rounded-full border border-slate-300 px-5 py-2 font-bold disabled:opacity-50 dark:border-slate-700"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
