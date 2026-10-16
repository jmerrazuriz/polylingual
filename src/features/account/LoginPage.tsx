import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import {
  authErrorMessage,
  resetPassword,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '../../lib/account/service'
import { useAccount } from '../../lib/account/store'

type Mode = 'entrar' | 'crear'

const inputClass =
  'w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900'

export function LoginPage() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState<Mode>(params.get('modo') === 'crear' ? 'crear' : 'entrar')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const status = useAccount((s) => s.status)
  const navigate = useNavigate()
  const back = params.get('volver') ?? '/'

  // Con sesión iniciada se vuelve a donde estaba (o al perfil, que muestra si falta verificar el correo).
  useEffect(() => {
    if (status === 'user') navigate(mode === 'crear' ? '/perfil' : back, { replace: true })
  }, [status, mode, back, navigate])

  const run = async (action: () => Promise<void>) => {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await action()
    } catch (e) {
      setError(authErrorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    run(() => (mode === 'crear' ? signUpWithEmail(name, email, password) : signInWithEmail(email, password)))
  }

  const forgot = () => {
    if (!email.trim()) {
      setError('Escribe tu correo arriba y vuelve a tocar «¿Olvidaste tu contraseña?».')
      return
    }
    run(async () => {
      await resetPassword(email)
      setNotice(`Te enviamos un correo a ${email.trim()} para crear una contraseña nueva.`)
    })
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-5 py-4">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-extrabold">{mode === 'crear' ? 'Crear cuenta' : 'Entrar'}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Con una cuenta tu progreso se guarda y lo ves en cualquier dispositivo.
        </p>
      </header>

      <button
        onClick={() => run(signInWithGoogle)}
        disabled={busy}
        className="flex items-center justify-center gap-3 rounded-xl border-2 border-slate-200 bg-white py-3 font-bold hover:border-slate-400 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900"
      >
        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        Continuar con Google
      </button>

      <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />o con tu correo
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === 'crear' && (
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Nombre
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputClass} />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'crear' ? 'new-password' : 'current-password'}
            minLength={6}
            required
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-ink py-3 font-bold text-white hover:opacity-90 disabled:opacity-50"
        >
          {busy ? 'Un momento…' : mode === 'crear' ? 'Crear cuenta' : 'Entrar'}
        </button>
      </form>

      <div className="flex flex-col items-center gap-2 text-sm">
        {mode === 'entrar' && (
          <button onClick={forgot} className="font-semibold text-slate-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        )}
        <button
          onClick={() => {
            setMode(mode === 'crear' ? 'entrar' : 'crear')
            setError(null)
            setNotice(null)
          }}
          className="font-bold text-accent hover:underline"
        >
          {mode === 'crear' ? '¿Ya tienes cuenta? Entra' : '¿No tienes cuenta? Créala gratis'}
        </button>
        <Link to={back} className="mt-2 text-slate-500 hover:underline">
          Seguir como invitado (sin guardar)
        </Link>
      </div>
    </div>
  )
}
