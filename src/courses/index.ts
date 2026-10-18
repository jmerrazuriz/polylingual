// Cursos (idiomas) de Polylingual. Cada curso vive en su carpeta (src/courses/<id>)
// y declara qué secciones ofrece; la interfaz siempre está en español.

export type CourseSection = 'tabla' | 'aprender' | 'gramatica' | 'practicar' | 'juegos'

export type Course = {
  id: string
  name: string
  /** Nombre del idioma en ese idioma. */
  native: string
  flag: string
  status: 'available' | 'soon'
  /** Frase corta para el selector y el inicio. */
  tagline: string
  /** Código de idioma para la voz del navegador. */
  speechLang: string
  /** «una voz japonesa», para avisar si el navegador no la tiene. */
  voiceName: string
  /** Saludo corto para probar la voz al cambiar la velocidad. */
  voiceSample: string
  sections: CourseSection[]
}

export const courses: Course[] = [
  {
    id: 'ja',
    name: 'Japonés',
    native: '日本語',
    flag: '🇯🇵',
    status: 'available',
    tagline: 'Hiragana, katakana, palabras y gramática básica.',
    speechLang: 'ja-JP',
    voiceName: 'una voz japonesa',
    voiceSample: 'こんにちは',
    sections: ['tabla', 'aprender', 'gramatica', 'practicar', 'juegos'],
  },
  {
    id: 'it',
    name: 'Italiano',
    native: 'Italiano',
    flag: '🇮🇹',
    status: 'soon',
    tagline: 'Pronunciación, vocabulario y gramática.',
    speechLang: 'it-IT',
    voiceName: 'una voz italiana',
    voiceSample: 'Buongiorno',
    sections: ['aprender', 'gramatica', 'practicar', 'juegos'],
  },
  {
    id: 'de',
    name: 'Alemán',
    native: 'Deutsch',
    flag: '🇩🇪',
    status: 'available',
    tagline: 'Ottos Weg: del A1 al C2, para vivir y trabajar en Alemania.',
    speechLang: 'de-DE',
    voiceName: 'una voz alemana',
    voiceSample: 'Guten Tag',
    sections: ['tabla', 'aprender', 'practicar', 'juegos'],
  },
  {
    id: 'fr',
    name: 'Francés',
    native: 'Français',
    flag: '🇫🇷',
    status: 'soon',
    tagline: 'Pronunciación, vocabulario y gramática.',
    speechLang: 'fr-FR',
    voiceName: 'una voz francesa',
    voiceSample: 'Bonjour',
    sections: ['aprender', 'gramatica', 'practicar', 'juegos'],
  },
]

export const courseById = (id: string) => courses.find((c) => c.id === id) ?? courses[0]
