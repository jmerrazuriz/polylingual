import { describe, expect, it } from 'vitest'
import { articleReason, contract, demonstrative, negativeArticle, possessive, withDefinite, withIndefinite, withPartitive, withPreposition, type Noun } from './articles'
import { numberToWords, ordinal } from './numbers'
import { elides } from './phonetics'

const n = (word: string, gender: 'm' | 'f', hAspire?: boolean): Noun => ({ word, gender, hAspire })

describe('artículos y determinantes', () => {
  it('elisión con vocal y h muda, no con h aspirada', () => {
    expect(withDefinite(n('chat', 'm'))).toBe('le chat')
    expect(withDefinite(n('maison', 'f'))).toBe('la maison')
    expect(withDefinite(n('école', 'f'))).toBe("l'école")
    expect(withDefinite(n('homme', 'm'))).toBe("l'homme")
    expect(withDefinite(n('héros', 'm'))).toBe('le héros')
    expect(withDefinite(n('haricot', 'm'))).toBe('le haricot')
    expect(withDefinite(n('hôpital', 'm'))).toBe("l'hôpital")
    expect(withDefinite(n('enfants', 'm'), true)).toBe('les enfants')
    expect(elides('hache')).toBe(false)
    expect(elides('hiver')).toBe(true)
  })

  it('indefinido, partitivo y negación', () => {
    expect(withIndefinite(n('pomme', 'f'))).toBe('une pomme')
    expect(withIndefinite(n('livres', 'm'), true)).toBe('des livres')
    expect(withPartitive(n('pain', 'm'))).toBe('du pain')
    expect(withPartitive(n('confiture', 'f'))).toBe('de la confiture')
    expect(withPartitive(n('eau', 'f'))).toBe("de l'eau")
    expect(negativeArticle(n('eau', 'f'))).toBe("d'")
    expect(negativeArticle(n('pain', 'm'))).toBe('de')
  })

  it('contracciones con à y de', () => {
    expect(contract('à', 'le')).toBe('au')
    expect(contract('à', 'les')).toBe('aux')
    expect(contract('de', 'le')).toBe('du')
    expect(contract('de', 'les')).toBe('des')
    expect(contract('à', 'la')).toBe('à la')
    expect(withPreposition('à', n('marché', 'm'))).toBe('au marché')
    expect(withPreposition('de', n('hôpital', 'm'))).toBe("de l'hôpital")
    expect(withPreposition('à', n('enfants', 'm'), true)).toBe('aux enfants')
  })

  it('demostrativos y posesivos', () => {
    expect(demonstrative(n('livre', 'm'))).toBe('ce')
    expect(demonstrative(n('ami', 'm'))).toBe('cet')
    expect(demonstrative(n('homme', 'm'))).toBe('cet')
    expect(demonstrative(n('femme', 'f'))).toBe('cette')
    expect(demonstrative(n('héros', 'm'))).toBe('ce')
    expect(possessive(0, n('amie', 'f'))).toBe('mon')
    expect(possessive(0, n('maison', 'f'))).toBe('ma')
    expect(possessive(2, n('histoire', 'f'))).toBe('son')
    expect(possessive(3, n('voiture', 'f'))).toBe('notre')
    expect(possessive(5, n('enfants', 'm'), true)).toBe('leurs')
    expect(articleReason(n('école', 'f'), "l'")).toMatch(/vocal/)
    expect(articleReason(n('héros', 'm'), 'le')).toMatch(/aspirada/)
  })
})

describe('números', () => {
  it('escribe los números con las reglas de 70, 80 y 90', () => {
    const cases: [number, string][] = [
      [0, 'zéro'], [16, 'seize'], [17, 'dix-sept'], [21, 'vingt et un'], [22, 'vingt-deux'], [61, 'soixante et un'],
      [70, 'soixante-dix'], [71, 'soixante et onze'], [77, 'soixante-dix-sept'], [80, 'quatre-vingts'], [81, 'quatre-vingt-un'],
      [90, 'quatre-vingt-dix'], [91, 'quatre-vingt-onze'], [99, 'quatre-vingt-dix-neuf'], [100, 'cent'], [101, 'cent un'],
      [200, 'deux cents'], [201, 'deux cent un'], [1000, 'mille'], [1001, 'mille un'], [2000, 'deux mille'],
      [80000, 'quatre-vingt mille'], [200000, 'deux cent mille'], [1000000, 'un million'], [2500000, 'deux millions cinq cent mille'],
      [1984, 'mille neuf cent quatre-vingt-quatre'],
    ]
    for (const [x, w] of cases) expect(numberToWords(x), String(x)).toBe(w)
  })

  it('variantes belga y suiza', () => {
    expect(numberToWords(70, 'belgique')).toBe('septante')
    expect(numberToWords(71, 'belgique')).toBe('septante et un')
    expect(numberToWords(80, 'belgique')).toBe('quatre-vingts')
    expect(numberToWords(80, 'suisse')).toBe('huitante')
    expect(numberToWords(95, 'suisse')).toBe('nonante-cinq')
  })

  it('ordinales', () => {
    expect(ordinal(1)).toBe('premier')
    expect(ordinal(1, true)).toBe('première')
    expect(ordinal(2)).toBe('deuxième')
    expect(ordinal(4)).toBe('quatrième')
    expect(ordinal(5)).toBe('cinquième')
    expect(ordinal(9)).toBe('neuvième')
    expect(ordinal(21)).toBe('vingt et unième')
    expect(ordinal(80)).toBe('quatre-vingtième')
  })
})
