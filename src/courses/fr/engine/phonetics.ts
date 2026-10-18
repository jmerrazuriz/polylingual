// Elisión: delante de vocal o de h muda, le/la/je/me/de/que… pierden la vocal (l’école, j’habite).
// Con h aspirada no hay elisión ni enlace (le héros, je hais).

const VOWEL = /^[aeiouyàâäéèêëîïôöùûüœæ]/i

/** Comienzos de palabras frecuentes con h aspirada. */
const H_ASPIRE = [
  'hach', 'haï', 'hai', 'haie', 'hall', 'hamac', 'hamburger', 'hamster', 'hanche', 'handicap', 'hangar', 'hant', 'harc',
  'hardi', 'hareng', 'haricot', 'harpe', 'hasard', 'hâte', 'hauss', 'haut', 'havre', 'hennir', 'hérisson', 'hernie', 'héros',
  'heurt', 'hibou', 'hiérarch', 'hiss', 'hockey', 'hollande', 'homard', 'hongr', 'honte', 'hoquet', 'hors', 'hotte', 'housse',
  'hublot', 'huer', 'huit', 'hurl', 'hutte',
]

export const isHAspire = (word: string) => /^h/i.test(word) && H_ASPIRE.some((p) => word.toLowerCase().startsWith(p))

/** ¿Elide la palabra anterior? Vocal o h muda. `hAspire` fuerza el caso cuando la lista no lo cubre. */
export function elides(word: string, hAspire?: boolean): boolean {
  if (/^h/i.test(word)) return !(hAspire ?? isHAspire(word))
  return VOWEL.test(word)
}
