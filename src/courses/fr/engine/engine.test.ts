import { describe, expect, it } from 'vitest'
import { verbByInf, verbs } from '../verbs'
import { conditionnel, conditionnelPasse, futur, futurAnterieur, futurProche, imparfait, imperatif, participePresent, passeCompose, passeSimple, plusQueParfait, present, subjonctif, subjonctifPasse, withSubject } from './conjugation'

const v = (inf: string) => verbByInf.get(inf)!

describe('conjugación francesa', () => {
  it('presente del primer grupo, con cambios ortográficos', () => {
    expect(present(v('parler'))).toEqual(['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent'])
    expect(present(v('manger'))[3]).toBe('mangeons')
    expect(present(v('commencer'))[3]).toBe('commençons')
    expect(present(v('acheter'))).toEqual(['achète', 'achètes', 'achète', 'achetons', 'achetez', 'achètent'])
    expect(present(v('préférer'))).toEqual(['préfère', 'préfères', 'préfère', 'préférons', 'préférez', 'préfèrent'])
    expect(present(v('appeler'))).toEqual(['appelle', 'appelles', 'appelle', 'appelons', 'appelez', 'appellent'])
    expect(present(v('payer'))[0]).toBe('paie')
    expect(present(v('envoyer'))[5]).toBe('envoient')
    expect(present(v('fermer'))[0]).toBe('ferme')
    expect(present(v('étudier'))).toEqual(['étudie', 'étudies', 'étudie', 'étudions', 'étudiez', 'étudient'])
  })

  it('presente del segundo y tercer grupo', () => {
    expect(present(v('finir'))).toEqual(['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent'])
    expect(present(v('vendre'))).toEqual(['vends', 'vends', 'vend', 'vendons', 'vendez', 'vendent'])
    expect(present(v('venir'))).toEqual(['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'])
    expect(present(v('prendre'))).toEqual(['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'])
    expect(present(v('mettre'))).toEqual(['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'])
    expect(present(v('partir'))).toEqual(['pars', 'pars', 'part', 'partons', 'partez', 'partent'])
    expect(present(v('devoir'))).toEqual(['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'])
    expect(present(v('voir'))).toEqual(['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'])
    expect(present(v('boire'))).toEqual(['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'])
    expect(present(v('connaître'))[2]).toBe('connaît')
    expect(present(v('ouvrir'))).toEqual(['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'])
    expect(present(v('être'))).toEqual(['suis', 'es', 'est', 'sommes', 'êtes', 'sont'])
  })

  it('pronominales con elisión del reflexivo', () => {
    expect(present(v('se lever'))).toEqual(['me lève', 'te lèves', 'se lève', 'nous levons', 'vous levez', 'se lèvent'])
    expect(present(v("s'appeler"))[0]).toBe("m'appelle")
    expect(present(v("s'habiller"))[2]).toBe("s'habille")
  })

  it('passé composé con avoir y être, y plus-que-parfait', () => {
    expect(passeCompose(v('parler'))).toEqual(['ai parlé', 'as parlé', 'a parlé', 'avons parlé', 'avez parlé', 'ont parlé'])
    expect(passeCompose(v('aller'))).toEqual(['suis allé(e)', 'es allé(e)', 'est allé(e)', 'sommes allé(e)s', 'êtes allé(e)s', 'sont allé(e)s'])
    expect(passeCompose(v('prendre'))[0]).toBe('ai pris')
    expect(passeCompose(v('finir'))[2]).toBe('a fini')
    expect(passeCompose(v('vendre'))[2]).toBe('a vendu')
    expect(passeCompose(v('se lever'))[2]).toBe("s'est levé(e)")
    expect(plusQueParfait(v('venir'))[0]).toBe('étais venu(e)')
  })

  it('imparfait, futuro y condicional', () => {
    expect(imparfait(v('parler'))).toEqual(['parlais', 'parlais', 'parlait', 'parlions', 'parliez', 'parlaient'])
    expect(imparfait(v('manger'))).toEqual(['mangeais', 'mangeais', 'mangeait', 'mangions', 'mangiez', 'mangeaient'])
    expect(imparfait(v('commencer'))[3]).toBe('commencions')
    expect(imparfait(v('être'))[0]).toBe('étais')
    expect(imparfait(v('finir'))[0]).toBe('finissais')
    expect(futur(v('parler'))).toEqual(['parlerai', 'parleras', 'parlera', 'parlerons', 'parlerez', 'parleront'])
    expect(futur(v('acheter'))[0]).toBe('achèterai')
    expect(futur(v('appeler'))[0]).toBe('appellerai')
    expect(futur(v('préférer'))[0]).toBe('préférerai')
    expect(futur(v('payer'))[0]).toBe('paierai')
    expect(futur(v('vendre'))[0]).toBe('vendrai')
    expect(futur(v('être'))[0]).toBe('serai')
    expect(futur(v('aller'))[3]).toBe('irons')
    expect(conditionnel(v('vouloir'))[0]).toBe('voudrais')
    expect(conditionnel(v('avoir'))[2]).toBe('aurait')
  })

  it('subjuntivo, imperativo, futur proche y gerundio', () => {
    expect(subjonctif(v('parler'))).toEqual(['parle', 'parles', 'parle', 'parlions', 'parliez', 'parlent'])
    expect(subjonctif(v('finir'))[0]).toBe('finisse')
    expect(subjonctif(v('venir'))).toEqual(['vienne', 'viennes', 'vienne', 'venions', 'veniez', 'viennent'])
    expect(subjonctif(v('faire'))[3]).toBe('fassions')
    expect(subjonctif(v('aller'))).toEqual(['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'])
    expect(subjonctif(v('vouloir'))[3]).toBe('voulions')
    expect(subjonctif(v('être'))[0]).toBe('sois')
    expect(imperatif(v('parler'))).toEqual(['parle', 'parlons', 'parlez'])
    expect(imperatif(v('aller'))[0]).toBe('va')
    expect(imperatif(v('finir'))[0]).toBe('finis')
    expect(imperatif(v('se lever'))).toEqual(['lève-toi', 'levons-nous', 'levez-vous'])
    expect(futurProche(v('manger'))[0]).toBe('vais manger')
    expect(futurProche(v('se lever'))[0]).toBe('vais me lever')
    expect(participePresent(v('finir'))).toBe('finissant')
    expect(participePresent(v('être'))).toBe('étant')
  })

  it('tiempos compuestos de B2 y passé simple', () => {
    expect(futurAnterieur(v('finir'))[0]).toBe('aurai fini')
    expect(futurAnterieur(v('partir'))[3]).toBe('serons parti(e)s')
    expect(conditionnelPasse(v('venir'))[0]).toBe('serais venu(e)')
    expect(conditionnelPasse(v('dire'))[5]).toBe('auraient dit')
    expect(subjonctifPasse(v('faire'))[2]).toBe('ait fait')
    expect(subjonctifPasse(v('se lever'))[0]).toBe('me sois levé(e)')
    expect(passeSimple(v('parler'))).toEqual(['parlai', 'parlas', 'parla', 'parlâmes', 'parlâtes', 'parlèrent'])
    expect(passeSimple(v('manger'))[3]).toBe('mangeâmes')
    expect(passeSimple(v('commencer'))[0]).toBe('commençai')
    expect(passeSimple(v('finir'))[2]).toBe('finit')
    expect(passeSimple(v('être'))).toEqual(['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent'])
    expect(passeSimple(v('avoir'))[5]).toBe('eurent')
    expect(passeSimple(v('venir'))).toEqual(['vins', 'vins', 'vint', 'vînmes', 'vîntes', 'vinrent'])
    expect(passeSimple(v('naître'))[2]).toBe('naquit')
    expect(passeSimple(v('prendre'))[2]).toBe('prit')
  })

  it('el pronombre sujeto con elisión: j’ante vocal y h muda', () => {
    expect(withSubject(0, 'aime')).toBe("j'aime")
    expect(withSubject(0, 'habite')).toBe("j'habite")
    expect(withSubject(0, 'parle')).toBe('je parle')
    expect(withSubject(0, 'me lève')).toBe('je me lève')
    expect(withSubject(2, 'parle')).toBe('il parle')
  })

  it('todos los verbos generan todas sus formas sin huecos', () => {
    for (const verb of verbs) {
      for (const f of [present, passeCompose, imparfait, futur, conditionnel, subjonctif, plusQueParfait, futurProche, futurAnterieur, conditionnelPasse, subjonctifPasse, passeSimple]) {
        const forms = f(verb)
        expect(forms, verb.inf).toHaveLength(6)
        for (const x of forms) expect(x, `${verb.inf}: ${x}`).toMatch(/^[a-zàâäéèêëîïôöùûüç' ()-]+$/)
      }
    }
  })
})
