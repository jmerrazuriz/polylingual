import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
  type User,
} from 'firebase/auth'
import { firebaseApp } from '../firebase/app'
import { useProgress } from '../progress/store'
import { type AccountUser, useAccount } from './store'
import { startSync } from './sync'

const auth = getAuth(firebaseApp)
auth.languageCode = 'es'

let stopSync: (() => void) | null = null

function toAccountUser(user: User): AccountUser {
  const google = user.providerData.some((p) => p.providerId === 'google.com')
  return {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    provider: google ? 'google' : 'password',
  }
}

function handleUser(user: User | null) {
  const wasUser = useAccount.getState().status === 'user'
  stopSync?.()
  stopSync = null

  if (!user) {
    useAccount.setState({ status: 'guest', user: null })
    // Al cerrar sesión se vuelve a ser invitado: sin memoria.
    if (wasUser) useProgress.getState().reset()
    return
  }
  useAccount.setState({ status: 'user', user: toAccountUser(user) })
  if (user.emailVerified) stopSync = startSync(user.uid)
}

let started = false

/** Empieza a escuchar la sesión de Firebase. Se llama una vez al cargar la app. */
export function startAccount() {
  if (started) return
  started = true
  onAuthStateChanged(auth, handleUser)
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, provider)
  } catch (e) {
    // Algunos navegadores de teléfono bloquean las ventanas emergentes: se usa una redirección.
    if (e instanceof FirebaseError && e.code === 'auth/popup-blocked') await signInWithRedirect(auth, provider)
    else throw e
  }
}

export async function signInWithEmail(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email.trim(), password)
}

export async function signUpWithEmail(name: string, email: string, password: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password)
  if (name.trim()) await updateProfile(user, { displayName: name.trim() })
  await sendEmailVerification(user)
  handleUser(user)
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email.trim())
}

export async function resendVerification() {
  if (auth.currentUser) await sendEmailVerification(auth.currentUser)
}

/** Vuelve a consultar si el correo ya se verificó; si es así, empieza a guardar el progreso. */
export async function checkVerification(): Promise<boolean> {
  const user = auth.currentUser
  if (!user) return false
  await reload(user)
  // El token nuevo lleva email_verified = true, que exigen las reglas de Firestore.
  await user.getIdToken(true)
  handleUser(user)
  return user.emailVerified
}

export async function signOut() {
  await firebaseSignOut(auth)
}

const messages: Record<string, string> = {
  'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
  'auth/wrong-password': 'El correo o la contraseña no son correctos.',
  'auth/user-not-found': 'No hay una cuenta con ese correo.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Prueba a entrar.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/missing-email': 'Escribe tu correo.',
  'auth/missing-password': 'Escribe tu contraseña.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento y vuelve a probar.',
  'auth/network-request-failed': 'No hay conexión. Revisa tu internet.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/cancelled-popup-request': 'Cerraste la ventana de Google antes de terminar.',
  'auth/account-exists-with-different-credential': 'Ese correo ya está registrado con otro método de acceso.',
}

export function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) return messages[error.code] ?? `No se pudo completar (${error.code}).`
  return 'Algo salió mal. Vuelve a intentarlo.'
}
