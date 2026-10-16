import { useEffect } from 'react'
import { useProgress } from '../progress/store'

const darkQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

/** Aplica el tema (claro, oscuro o el del sistema) y el tamaño de letra en <html>. */
export function useApplySettings() {
  const theme = useProgress((s) => s.settings.theme)
  const fontScale = useProgress((s) => s.settings.fontScale)

  useEffect(() => {
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && !!darkQuery?.matches)
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#020617' : '#1e1b4b')
    }
    apply()
    if (theme !== 'system' || !darkQuery) return
    darkQuery.addEventListener('change', apply)
    return () => darkQuery.removeEventListener('change', apply)
  }, [theme])

  useEffect(() => {
    // Todo el diseño usa rem: subir la letra base agranda texto y botones por igual.
    document.documentElement.style.fontSize = fontScale === 'large' ? '112.5%' : ''
  }, [fontScale])
}
