import { describe, expect, it } from 'vitest'
import { verbByInf, verbs } from '../verbs'
import {
  condizionale,
  condizionalePassato,
  congiuntivo,
  congiuntivoImperfetto,
  congiuntivoPassato,
  congiuntivoTrapassato,
  futuro,
  futuroAnteriore,
  gerundio,
  imperativo,
  imperativoNegativo,
  imperfetto,
  passatoProssimo,
  passatoRemoto,
  present,
  progressivo,
  tenses,
  trapassatoProssimo,
  trapassatoRemoto,
  withChe,
  withSubject,
} from './conjugation'

const v = (inf: string) => verbByInf.get(inf)!

describe('conjugación italiana', () => {
  it('presente de las tres conjugaciones, con -isc- y cambios ortográficos', () => {
    expect(present(v('parlare'))).toEqual(['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano'])
    expect(present(v('credere'))).toEqual(['credo', 'credi', 'crede', 'crediamo', 'credete', 'credono'])
    expect(present(v('dormire'))).toEqual(['dormo', 'dormi', 'dorme', 'dormiamo', 'dormite', 'dormono'])
    expect(present(v('finire'))).toEqual(['finisco', 'finisci', 'finisce', 'finiamo', 'finite', 'finiscono'])
    expect(present(v('cercare'))).toEqual(['cerco', 'cerchi', 'cerca', 'cerchiamo', 'cercate', 'cercano'])
    expect(present(v('pagare'))[1]).toBe('paghi')
    expect(present(v('mangiare'))).toEqual(['mangio', 'mangi', 'mangia', 'mangiamo', 'mangiate', 'mangiano'])
    expect(present(v('studiare'))[1]).toBe('studi')
    expect(present(v('inviare'))[1]).toBe('invii')
    expect(present(v('conoscere'))[1]).toBe('conosci')
  })

  it('presente de los irregulares', () => {
    expect(present(v('essere'))).toEqual(['sono', 'sei', 'è', 'siamo', 'siete', 'sono'])
    expect(present(v('andare'))[5]).toBe('vanno')
    expect(present(v('fare'))[0]).toBe('faccio')
    expect(present(v('venire'))[1]).toBe('vieni')
  })

  it('pronominales', () => {
    expect(present(v('alzarsi'))).toEqual(['mi alzo', 'ti alzi', 'si alza', 'ci alziamo', 'vi alzate', 'si alzano'])
    expect(present(v('vestirsi'))[2]).toBe('si veste')
    expect(present(v('sedersi'))[0]).toBe('mi siedo')
    expect(present(v('annoiarsi'))[1]).toBe('ti annoi')
  })

  it('passato prossimo con avere y essere, con concordancia', () => {
    expect(passatoProssimo(v('parlare'))).toEqual(['ho parlato', 'hai parlato', 'ha parlato', 'abbiamo parlato', 'avete parlato', 'hanno parlato'])
    expect(passatoProssimo(v('andare'))).toEqual(['sono andato/a', 'sei andato/a', 'è andato/a', 'siamo andati/e', 'siete andati/e', 'sono andati/e'])
    expect(passatoProssimo(v('credere'))[0]).toBe('ho creduto')
    expect(passatoProssimo(v('dormire'))[0]).toBe('ho dormito')
    expect(passatoProssimo(v('fare'))[2]).toBe('ha fatto')
    expect(passatoProssimo(v('essere'))[0]).toBe('sono stato/a')
    expect(passatoProssimo(v('piacere'))[2]).toBe('è piaciuto/a')
    expect(passatoProssimo(v('alzarsi'))[0]).toBe('mi sono alzato/a')
    expect(passatoProssimo(v('alzarsi'))[3]).toBe('ci siamo alzati/e')
    expect(trapassatoProssimo(v('venire'))[0]).toBe('ero venuto/a')
  })

  it('imperfetto', () => {
    expect(imperfetto(v('parlare'))).toEqual(['parlavo', 'parlavi', 'parlava', 'parlavamo', 'parlavate', 'parlavano'])
    expect(imperfetto(v('essere'))[0]).toBe('ero')
    expect(imperfetto(v('fare'))[0]).toBe('facevo')
    expect(imperfetto(v('dire'))[2]).toBe('diceva')
    expect(imperfetto(v('bere'))[0]).toBe('bevevo')
    expect(imperfetto(v('tradurre'))[0]).toBe('traducevo')
  })

  it('futuro y condicional', () => {
    expect(futuro(v('parlare'))).toEqual(['parlerò', 'parlerai', 'parlerà', 'parleremo', 'parlerete', 'parleranno'])
    expect(futuro(v('cercare'))[0]).toBe('cercherò')
    expect(futuro(v('pagare'))[0]).toBe('pagherò')
    expect(futuro(v('mangiare'))[0]).toBe('mangerò')
    expect(futuro(v('cominciare'))[0]).toBe('comincerò')
    expect(futuro(v('lasciare'))[0]).toBe('lascerò')
    expect(futuro(v('studiare'))[0]).toBe('studierò')
    expect(futuro(v('credere'))[0]).toBe('crederò')
    expect(futuro(v('finire'))[0]).toBe('finirò')
    expect(futuro(v('essere'))[0]).toBe('sarò')
    expect(futuro(v('venire'))[0]).toBe('verrò')
    expect(futuro(v('fare'))[2]).toBe('farà')
    expect(futuro(v('dire'))[0]).toBe('dirò')
    expect(condizionale(v('volere'))[0]).toBe('vorrei')
    expect(condizionale(v('parlare'))).toEqual(['parlerei', 'parleresti', 'parlerebbe', 'parleremmo', 'parlereste', 'parlerebbero'])
  })

  it('subjuntivo presente e imperfecto', () => {
    expect(congiuntivo(v('parlare'))).toEqual(['parli', 'parli', 'parli', 'parliamo', 'parliate', 'parlino'])
    expect(congiuntivo(v('cercare'))[0]).toBe('cerchi')
    expect(congiuntivo(v('mangiare'))[0]).toBe('mangi')
    expect(congiuntivo(v('credere'))).toEqual(['creda', 'creda', 'creda', 'crediamo', 'crediate', 'credano'])
    expect(congiuntivo(v('finire'))[5]).toBe('finiscano')
    expect(congiuntivo(v('essere'))).toEqual(['sia', 'sia', 'sia', 'siamo', 'siate', 'siano'])
    expect(congiuntivo(v('avere'))[4]).toBe('abbiate')
    expect(congiuntivo(v('andare'))).toEqual(['vada', 'vada', 'vada', 'andiamo', 'andiate', 'vadano'])
    expect(congiuntivo(v('fare'))[0]).toBe('faccia')
    expect(congiuntivo(v('venire'))[0]).toBe('venga')
    expect(congiuntivo(v('dire'))[3]).toBe('diciamo')
    expect(congiuntivo(v('sapere'))[0]).toBe('sappia')
    expect(congiuntivo(v('dare'))[5]).toBe('diano')
    expect(congiuntivo(v('uscire'))[0]).toBe('esca')
    expect(congiuntivoImperfetto(v('parlare'))).toEqual(['parlassi', 'parlassi', 'parlasse', 'parlassimo', 'parlaste', 'parlassero'])
    expect(congiuntivoImperfetto(v('essere'))).toEqual(['fossi', 'fossi', 'fosse', 'fossimo', 'foste', 'fossero'])
    expect(congiuntivoImperfetto(v('fare'))[0]).toBe('facessi')
    expect(congiuntivoImperfetto(v('dare'))[2]).toBe('desse')
    expect(congiuntivoImperfetto(v('stare'))[0]).toBe('stessi')
    expect(congiuntivoImperfetto(v('dormire'))[2]).toBe('dormisse')
  })

  it('tiempos compuestos', () => {
    expect(futuroAnteriore(v('finire'))[0]).toBe('avrò finito')
    expect(condizionalePassato(v('venire'))[0]).toBe('sarei venuto/a')
    expect(congiuntivoPassato(v('fare'))[2]).toBe('abbia fatto')
    expect(congiuntivoTrapassato(v('partire'))[3]).toBe('fossimo partiti/e')
    expect(trapassatoRemoto(v('finire'))[2]).toBe('ebbe finito')
  })

  it('passato remoto regular e irregular', () => {
    expect(passatoRemoto(v('parlare'))).toEqual(['parlai', 'parlasti', 'parlò', 'parlammo', 'parlaste', 'parlarono'])
    expect(passatoRemoto(v('credere'))).toEqual(['credei', 'credesti', 'credé', 'credemmo', 'credeste', 'crederono'])
    expect(passatoRemoto(v('dormire'))).toEqual(['dormii', 'dormisti', 'dormì', 'dormimmo', 'dormiste', 'dormirono'])
    expect(passatoRemoto(v('essere'))).toEqual(['fui', 'fosti', 'fu', 'fummo', 'foste', 'furono'])
    expect(passatoRemoto(v('avere'))).toEqual(['ebbi', 'avesti', 'ebbe', 'avemmo', 'aveste', 'ebbero'])
    expect(passatoRemoto(v('fare'))).toEqual(['feci', 'facesti', 'fece', 'facemmo', 'faceste', 'fecero'])
    expect(passatoRemoto(v('prendere'))).toEqual(['presi', 'prendesti', 'prese', 'prendemmo', 'prendeste', 'presero'])
    expect(passatoRemoto(v('venire'))[2]).toBe('venne')
    expect(passatoRemoto(v('nascere'))[2]).toBe('nacque')
    expect(passatoRemoto(v('dire'))[1]).toBe('dicesti')
    expect(passatoRemoto(v('dare'))[0]).toBe('diedi')
    expect(passatoRemoto(v('cercare'))[2]).toBe('cercò')
  })

  it('imperativo, gerundio y stare + gerundio', () => {
    expect(imperativo(v('parlare'))).toEqual(['parla', 'parli', 'parliamo', 'parlate'])
    expect(imperativo(v('credere'))).toEqual(['credi', 'creda', 'crediamo', 'credete'])
    expect(imperativo(v('finire'))).toEqual(['finisci', 'finisca', 'finiamo', 'finite'])
    expect(imperativo(v('cercare'))[1]).toBe('cerchi')
    expect(imperativo(v('andare'))[0]).toBe("va'")
    expect(imperativo(v('essere'))[0]).toBe('sii')
    expect(imperativo(v('venire'))).toEqual(['vieni', 'venga', 'veniamo', 'venite'])
    expect(imperativo(v('alzarsi'))).toEqual(['alzati', 'si alzi', 'alziamoci', 'alzatevi'])
    expect(imperativo(v('sedersi'))[0]).toBe('siediti')
    expect(imperativoNegativo(v('parlare'))).toBe('non parlare')
    expect(imperativoNegativo(v('alzarsi'))).toBe('non alzarti')
    expect(gerundio(v('parlare'))).toBe('parlando')
    expect(gerundio(v('fare'))).toBe('facendo')
    expect(gerundio(v('dire'))).toBe('dicendo')
    expect(gerundio(v('essere'))).toBe('essendo')
    expect(gerundio(v('alzarsi'))).toBe('alzandosi')
    expect(progressivo(v('leggere'))[0]).toBe('sto leggendo')
    expect(progressivo(v('alzarsi'))[0]).toBe('mi sto alzando')
  })

  it('el pronombre sujeto y «che» para el subjuntivo', () => {
    expect(withSubject(0, 'parlo')).toBe('io parlo')
    expect(withSubject(2, 'parla')).toBe('lui parla')
    expect(withChe(0, 'parli')).toBe('che io parli')
  })

  it('todos los verbos generan todas sus formas sin huecos', () => {
    for (const verb of verbs) {
      for (const t of Object.values(tenses)) {
        const forms = t.forms(verb)
        expect(forms, verb.inf).toHaveLength(6)
        for (const x of forms) expect(x, `${verb.inf} (${t.name}): ${x}`).toMatch(/^[a-zàèéìòù' /]+$/)
      }
      for (const x of imperativo(verb)) expect(x, verb.inf).toMatch(/^[a-zàèéìòù' ]+$/)
    }
  })
})
