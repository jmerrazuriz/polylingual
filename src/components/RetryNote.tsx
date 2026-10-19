/** Aviso sobre una pregunta que vuelve porque se falló: hay que acertarla para terminar la lección. */
export function RetryNote() {
  return (
    <p role="note" className="self-center rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
      🔁 Otra vez: la fallaste antes
    </p>
  )
}
