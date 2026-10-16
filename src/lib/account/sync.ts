import { doc, getFirestore, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseApp } from '../firebase/app'
import { mergeProgress, parseProgress, stableStringify } from '../progress/model'
import { progressSnapshot, useProgress } from '../progress/store'

const db = getFirestore(firebaseApp)

/** Espera tras el último cambio antes de guardar: agrupa una sesión entera en pocas escrituras. */
const SAVE_DELAY_MS = 2000
export const PROGRESS_VERSION = 1

/**
 * Mantiene el progreso en memoria sincronizado con users/{uid}:
 * - Al entrar, une lo hecho como invitado con lo guardado en la cuenta.
 * - Cada cambio local se guarda (agrupado) en Firestore.
 * - Los cambios hechos en otro dispositivo llegan en vivo.
 * Devuelve la función para dejar de sincronizar.
 */
export function startSync(uid: string): () => void {
  const ref = doc(db, 'users', uid)
  /** Último progreso igual en memoria y en Firestore; evita escrituras innecesarias. */
  let synced: string | null = null
  let loaded = false
  let timer: ReturnType<typeof setTimeout> | undefined

  const save = () => {
    const data = progressSnapshot()
    const json = stableStringify(data)
    if (json === synced) return
    synced = json
    setDoc(ref, { progress: data, version: PROGRESS_VERSION, updatedAt: serverTimestamp() }).catch((e) => {
      synced = null
      console.error('No se pudo guardar el progreso', e)
    })
  }

  const schedule = () => {
    if (!loaded) return
    clearTimeout(timer)
    timer = setTimeout(save, SAVE_DELAY_MS)
  }

  const stopSnapshot = onSnapshot(
    ref,
    (snap) => {
      if (snap.metadata.hasPendingWrites) return
      const remote = parseProgress(snap.data()?.progress)
      const remoteJson = stableStringify(remote)

      if (!loaded) {
        loaded = true
        synced = remoteJson
        const merged = mergeProgress(remote, progressSnapshot())
        useProgress.getState().replace(merged)
        if (stableStringify(merged) !== remoteJson) save()
        return
      }
      if (remoteJson === synced) return
      // Cambio desde otro dispositivo.
      synced = remoteJson
      useProgress.getState().replace(remote)
    },
    (e) => console.error('No se pudo leer el progreso', e),
  )

  const stopStore = useProgress.subscribe(schedule)

  // Si se cierra la pestaña con cambios pendientes, se intenta guardar antes.
  const flush = () => {
    if (timer && document.visibilityState === 'hidden') {
      clearTimeout(timer)
      save()
    }
  }
  document.addEventListener('visibilitychange', flush)

  return () => {
    clearTimeout(timer)
    if (loaded) save()
    stopSnapshot()
    stopStore()
    document.removeEventListener('visibilitychange', flush)
  }
}
