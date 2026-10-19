import { describe, expect, it } from 'vitest'
import { diagnoseTyping } from './feedback'
import { checkItalian, collapseDoubles, doublesHint } from './italianInput'

describe('respuestas escritas en italiano', () => {
  it('acepta mayúsculas y apóstrofos distintos; avisa si solo fallan las tildes', () => {
    expect(checkItalian('Città', ['città'])).toBe('ok')
    expect(checkItalian('l’amica', ["l'amica"])).toBe('ok')
    expect(checkItalian("un' amica.", ["un'amica"])).toBe('ok')
    expect(checkItalian('citta', ['città'])).toBe('accents')
    expect(checkItalian('perche', ['perché'])).toBe('accents')
    expect(checkItalian('casa', ['libro'])).toBe('wrong')
  })

  it('una doble consonante que falta o sobra es error, y se explica', () => {
    expect(checkItalian('pala', ['palla'])).toBe('doubles')
    expect(checkItalian('palla', ['pala'])).toBe('doubles')
    expect(checkItalian('mozarella', ['mozzarella'])).toBe('doubles')
    expect(collapseDoubles('sette')).toBe('sete')
    expect(doublesHint('pala', 'palla')).toBe('Lleva doble «l»: se escribe «palla».')
    expect(doublesHint('caro', 'carro')).toBe('Lleva doble «r»: se escribe «carro».')
    expect(doublesHint('sonno', 'sono')).toBe('Va con una sola «n»: se escribe «sono».')
    expect(doublesHint('casa', 'cassa')).toBe('Lleva doble «s»: se escribe «cassa».')
    expect(doublesHint('libro', 'casa')).toBeUndefined()
  })

  it('la corrección explicada detecta dobles y artículos italianos', () => {
    expect(diagnoseTyping('pala', ['palla'])).toBe('Lleva doble «l»: se escribe «palla».')
    expect(diagnoseTyping('il studente', ['lo studente'])).toBe('La palabra está bien, pero el artículo es «lo», no «il».')
    expect(diagnoseTyping('una amica', ["un'amica"])).toBe('La palabra está bien, pero el artículo es «un\'», no «una».')
  })
})
