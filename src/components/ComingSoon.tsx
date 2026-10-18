import { Link } from 'react-router'

type Props = {
  title: string
  phase?: number | string
}

export function ComingSoon({ title, phase }: Props) {
  return (
    <section className="flex flex-col items-center gap-4 py-16 text-center">
      <span className="text-6xl" aria-hidden>
        🚧
      </span>
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400">
        {phase ? `Esta sección llega en la etapa ${phase} del desarrollo.` : 'Esta página no existe.'}
      </p>
      <Link to="/" className="font-semibold text-accent hover:underline">
        Volver al inicio
      </Link>
    </section>
  )
}
