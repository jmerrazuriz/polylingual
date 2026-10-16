/** Segundos transcurridos desde `since` (ms de Date.now()). */
export const secondsSince = (since: number) => (Date.now() - since) / 1000

export const now = () => Date.now()

/** 75 → "1:15" */
export const formatSeconds = (s: number) => {
  const total = Math.round(s)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
