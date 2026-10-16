import { create } from 'zustand'

export type AccountUser = {
  uid: string
  name: string | null
  email: string | null
  emailVerified: boolean
  provider: 'google' | 'password'
}

type Account = {
  /** loading: aún no se sabe si hay sesión · guest: sin cuenta (no se guarda nada) · user: con cuenta. */
  status: 'loading' | 'guest' | 'user'
  user: AccountUser | null
}

// Este archivo no importa Firebase para que el resto de la app no lo cargue de entrada;
// lib/account/service.ts (cargado aparte) mantiene este estado al día.
export const useAccount = create<Account>(() => ({ status: 'loading', user: null }))

/** El progreso se guarda solo con cuenta y correo verificado (Google ya viene verificado). */
export const savesProgress = (a: Account) => a.status === 'user' && !!a.user?.emailVerified
