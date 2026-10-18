import { describe, expect, it } from 'vitest'
import { diagnoseTyping } from './feedback'
import { checkFrench, stripAccents } from './frenchInput'

describe('respuestas escritas en francés', () => {
  it('acepta mayúsculas, œ/oe y apóstrofos distintos; avisa si solo fallan los acentos', () => {
    expect(checkFrench('Élève', ['élève'])).toBe('ok')
    expect(checkFrench('soeur', ['sœur'])).toBe('ok')
    expect(checkFrench('l’école', ["l'école"])).toBe('ok')
    expect(checkFrench("j' habite.", ["j'habite"])).toBe('ok')
    expect(checkFrench('eleve', ['élève'])).toBe('accents')
    expect(checkFrench('garcon', ['garçon'])).toBe('accents')
    expect(checkFrench('maison', ['école'])).toBe('wrong')
    expect(stripAccents('fenêtre')).toBe('fenetre')
  })

  it('la corrección explicada detecta el artículo con elisión', () => {
    expect(diagnoseTyping('le école', ["l'école"])).toBe('La palabra está bien, pero el artículo es «l\'», no «le».')
  })
})
