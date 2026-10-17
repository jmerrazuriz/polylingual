import { collection, doc, getFirestore, onSnapshot, serverTimestamp, writeBatch } from 'firebase/firestore'
import { firebaseApp } from '../firebase/app'
import { mergeProgress, stableStringify } from '../progress/model'
import { joinProgress, normalizeProgress, type ShardDoc, splitProgress } from '../progress/storage'
import { progressSnapshot, useProgress } from '../progress/store'

const db = getFirestore(firebaseApp)

/** Espera tras el último cambio antes de guardar: agrupa una sesión entera en pocas escrituras. */
const SAVE_DELAY_MS = 2000
/** 2: progreso separado por cursos (idiomas). 3: tarjetas y estadísticas en users/{uid}/srs. */
export const PROGRESS_VERSION = 3

const emptyShardJson = (course: string) => stableStringify({ course, cards: {}, stats: {} } satisfies ShardDoc)

/** Documento de tarjetas tal como llegó, sin la fecha de guardado (para compararlo). */
function shardContent(data: Record<string, unknown>): ShardDoc {
  const { course, cards, stats } = data as Partial<ShardDoc>
  return { course: course ?? '', cards: cards ?? {}, stats: stats ?? {} }
}

/**
 * Mantiene el progreso en memoria sincronizado con users/{uid} y sus documentos
 * de tarjetas (users/{uid}/srs/*, ver progress/storage):
 * - Al entrar, une lo hecho como invitado con lo guardado en la cuenta (y pasa al
 *   formato nuevo lo guardado con el anterior).
 * - Cada cambio local se guarda (agrupado), escribiendo solo los documentos que cambiaron.
 * - Los cambios hechos en otro dispositivo llegan en vivo.
 * Devuelve la función para dejar de sincronizar.
 */
export function startSync(uid: string): () => void {
  const ref = doc(db, 'users', uid)
  const srs = collection(db, 'users', uid, 'srs')

  // Lo último leído de Firestore.
  let mainRaw: unknown
  let mainLoaded = false
  let shardsRaw = new Map<string, ShardDoc>()
  let shardsLoaded = false
  // Lo que ya está igual en memoria y en Firestore (JSON por documento); evita escrituras innecesarias.
  let syncedMain: string | null = null
  let syncedShards = new Map<string, string>()

  let loaded = false
  let timer: ReturnType<typeof setTimeout> | undefined

  const save = () => {
    const { main, shards } = splitProgress(progressSnapshot())
    const batch = writeBatch(db)
    let writes = 0
    const mainJson = stableStringify(main)
    if (mainJson !== syncedMain) {
      batch.set(ref, { progress: main, version: PROGRESS_VERSION, updatedAt: serverTimestamp() })
      writes++
    }
    const written = new Map<string, string>()
    for (const [id, shard] of Object.entries(shards)) {
      const json = stableStringify(shard)
      // Un documento que no existe cuenta como vacío: no se crean documentos vacíos.
      if (json === (syncedShards.get(id) ?? emptyShardJson(shard.course))) continue
      batch.set(doc(srs, id), { ...shard, updatedAt: serverTimestamp() })
      written.set(id, json)
      writes++
    }
    if (writes === 0) return
    syncedMain = mainJson
    for (const [id, json] of written) syncedShards.set(id, json)
    batch.commit().catch((e) => {
      // Con el próximo cambio se vuelven a escribir todos los documentos de este intento.
      syncedMain = null
      for (const id of written.keys()) syncedShards.set(id, '')
      console.error('No se pudo guardar el progreso', e)
    })
  }

  const schedule = () => {
    if (!loaded) return
    clearTimeout(timer)
    timer = setTimeout(save, SAVE_DELAY_MS)
  }

  /** Llegó algo de Firestore: se arma el progreso con el documento principal y los de tarjetas. */
  const onRemote = () => {
    if (!mainLoaded || !shardsLoaded) return
    syncedMain = stableStringify(mainRaw ?? null)
    syncedShards = new Map([...shardsRaw].map(([id, shard]) => [id, stableStringify(shard)]))
    const remote = joinProgress(mainRaw, [...shardsRaw.values()])

    if (!loaded) {
      loaded = true
      useProgress.getState().replace(mergeProgress(remote, progressSnapshot()))
      // Guarda lo hecho como invitado y pasa al formato nuevo lo que venía en el anterior.
      save()
      return
    }
    if (stableStringify(remote) === stableStringify(normalizeProgress(progressSnapshot()))) return
    // Cambio desde otro dispositivo.
    useProgress.getState().replace(remote)
  }

  const stopMain = onSnapshot(
    ref,
    (snap) => {
      if (snap.metadata.hasPendingWrites) return
      mainRaw = snap.data()?.progress
      mainLoaded = true
      onRemote()
    },
    (e) => console.error('No se pudo leer el progreso', e),
  )

  const stopShards = onSnapshot(
    srs,
    (snap) => {
      if (snap.metadata.hasPendingWrites) return
      shardsRaw = new Map(snap.docs.map((d) => [d.id, shardContent(d.data())]))
      shardsLoaded = true
      onRemote()
    },
    (e) => console.error('No se pudieron leer las tarjetas de repaso', e),
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
    stopMain()
    stopShards()
    stopStore()
    document.removeEventListener('visibilitychange', flush)
  }
}
