import { initializeApp } from 'firebase/app'

// La configuración web de Firebase no es secreta: la seguridad la dan las
// reglas de Firestore (firestore.rules) y las restricciones de la API key.
export const firebaseConfig = {
  apiKey: 'AIzaSyA8nW3agDTs3neUbp3TyuEnYV9Jh6MArqI',
  authDomain: 'polylingual-f79bc.firebaseapp.com',
  projectId: 'polylingual-f79bc',
  storageBucket: 'polylingual-f79bc.firebasestorage.app',
  messagingSenderId: '884217322266',
  appId: '1:884217322266:web:a8134b39c1751a2190aaa3',
}

export const firebaseApp = initializeApp(firebaseConfig)
