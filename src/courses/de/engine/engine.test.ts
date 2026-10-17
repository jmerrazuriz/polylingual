import { describe, expect, it } from 'vitest'
import { verbByInf, verbs } from '../verbs'
import { futur1, imperativ, konjunktiv2, partizip2, perfekt, plusquamperfekt, praeteritum, present } from './conjugation'
import { declineAdjective, determiner, type Noun, nounForm, nounPhrase } from './declension'

const v = (inf: string) => verbByInf.get(inf)!

describe('conjugación', () => {
  it('presente de verbos débiles, con e intercalada, raíz en s y -eln/-ern', () => {
    expect(present(v('machen'))).toEqual(['mache', 'machst', 'macht', 'machen', 'macht', 'machen'])
    expect(present(v('arbeiten'))).toEqual(['arbeite', 'arbeitest', 'arbeitet', 'arbeiten', 'arbeitet', 'arbeiten'])
    expect(present(v('öffnen')).slice(1, 3)).toEqual(['öffnest', 'öffnet'])
    expect(present(v('reisen'))[1]).toBe('reist')
    expect(present(v('tanzen'))[1]).toBe('tanzt')
    expect(present(v('heißen')).slice(1, 3)).toEqual(['heißt', 'heißt'])
    expect(present(v('sammeln'))).toEqual(['sammle', 'sammelst', 'sammelt', 'sammeln', 'sammelt', 'sammeln'])
    expect(present(v('wandern'))[0]).toBe('wandere')
  })

  it('presente de verbos fuertes con cambio de vocal', () => {
    expect(present(v('fahren'))).toEqual(['fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren'])
    expect(present(v('lesen')).slice(1, 3)).toEqual(['liest', 'liest'])
    expect(present(v('essen')).slice(1, 3)).toEqual(['isst', 'isst'])
    expect(present(v('nehmen')).slice(1, 3)).toEqual(['nimmst', 'nimmt'])
    expect(present(v('helfen'))[1]).toBe('hilfst')
    expect(present(v('laufen'))[1]).toBe('läufst')
  })

  it('verbos irregulares, modales y separables', () => {
    expect(present(v('sein'))).toEqual(['bin', 'bist', 'ist', 'sind', 'seid', 'sind'])
    expect(present(v('können'))[2]).toBe('kann')
    expect(present(v('aufstehen'))).toEqual(['stehe auf', 'stehst auf', 'steht auf', 'stehen auf', 'steht auf', 'stehen auf'])
    expect(present(v('einkaufen'))[2]).toBe('kauft ein')
  })

  it('Präteritum débil, fuerte y mixto', () => {
    expect(praeteritum(v('machen'))).toEqual(['machte', 'machtest', 'machte', 'machten', 'machtet', 'machten'])
    expect(praeteritum(v('arbeiten'))[0]).toBe('arbeitete')
    expect(praeteritum(v('fahren'))).toEqual(['fuhr', 'fuhrst', 'fuhr', 'fuhren', 'fuhrt', 'fuhren'])
    expect(praeteritum(v('finden')).slice(1, 5)).toEqual(['fandest', 'fand', 'fanden', 'fandet'])
    expect(praeteritum(v('lesen'))[1]).toBe('lasest')
    expect(praeteritum(v('sein'))).toEqual(['war', 'warst', 'war', 'waren', 'wart', 'waren'])
    expect(praeteritum(v('werden'))).toEqual(['wurde', 'wurdest', 'wurde', 'wurden', 'wurdet', 'wurden'])
    expect(praeteritum(v('bringen'))[3]).toBe('brachten')
    expect(praeteritum(v('können'))[1]).toBe('konntest')
    expect(praeteritum(v('aufstehen'))[0]).toBe('stand auf')
  })

  it('participio II y tiempos compuestos', () => {
    expect(partizip2(v('machen'))).toBe('gemacht')
    expect(partizip2(v('arbeiten'))).toBe('gearbeitet')
    expect(partizip2(v('besuchen'))).toBe('besucht')
    expect(partizip2(v('studieren'))).toBe('studiert')
    expect(partizip2(v('einkaufen'))).toBe('eingekauft')
    expect(partizip2(v('können'))).toBe('gekonnt')
    expect(perfekt(v('fahren'))[0]).toBe('bin gefahren')
    expect(perfekt(v('machen'))[2]).toBe('hat gemacht')
    expect(perfekt(v('aufstehen'))[1]).toBe('bist aufgestanden')
    expect(plusquamperfekt(v('gehen'))[0]).toBe('war gegangen')
    expect(futur1(v('aufstehen'))[0]).toBe('werde aufstehen')
  })

  it('Konjunktiv II propio o con würde', () => {
    expect(konjunktiv2(v('haben'))).toEqual(['hätte', 'hättest', 'hätte', 'hätten', 'hättet', 'hätten'])
    expect(konjunktiv2(v('können'))[2]).toBe('könnte')
    expect(konjunktiv2(v('kommen'))[0]).toBe('käme')
    expect(konjunktiv2(v('machen'))[0]).toBe('würde machen')
  })

  it('imperativo: du, ihr, Sie', () => {
    expect(imperativ(v('machen'))).toEqual(['mach', 'macht', 'machen Sie'])
    expect(imperativ(v('arbeiten'))![0]).toBe('arbeite')
    expect(imperativ(v('fahren'))![0]).toBe('fahr')
    expect(imperativ(v('lesen'))![0]).toBe('lies')
    expect(imperativ(v('nehmen'))![0]).toBe('nimm')
    expect(imperativ(v('helfen'))![0]).toBe('hilf')
    expect(imperativ(v('essen'))![0]).toBe('iss')
    expect(imperativ(v('aufstehen'))).toEqual(['steh auf', 'steht auf', 'stehen Sie auf'])
    expect(imperativ(v('sein'))).toEqual(['sei', 'seid', 'seien Sie'])
    expect(imperativ(v('können'))).toBeNull()
  })

  it('todos los verbos de la lista generan todas sus formas sin huecos', () => {
    for (const verb of verbs) {
      for (const forms of [present(verb), praeteritum(verb), perfekt(verb), konjunktiv2(verb), futur1(verb)])
        for (const f of forms) expect(f, verb.inf).toMatch(/^[a-zäöüß ]+$/i)
      expect(new Set(verbs.map((x) => x.inf)).size).toBe(verbs.length)
    }
  })
})

const tisch: Noun = { word: 'Tisch', gender: 'm', plural: 'Tische' }
const wohnung: Noun = { word: 'Wohnung', gender: 'f', plural: 'Wohnungen' }
const haus: Noun = { word: 'Haus', gender: 'n', plural: 'Häuser' }
const kollege: Noun = { word: 'Kollege', gender: 'm', plural: 'Kollegen', weak: true }
const auto: Noun = { word: 'Auto', gender: 'n', plural: 'Autos' }

describe('declinación', () => {
  it('artículos y posesivos', () => {
    expect(determiner({ kind: 'def' }, 'dat', 'f')).toBe('der')
    expect(determiner({ kind: 'indef' }, 'akk', 'm')).toBe('einen')
    expect(determiner({ kind: 'indef' }, 'nom', 'pl')).toBeNull()
    expect(determiner({ kind: 'ein-word', stem: 'kein' }, 'nom', 'pl')).toBe('keine')
    expect(determiner({ kind: 'ein-word', stem: 'euer' }, 'dat', 'm')).toBe('eurem')
    expect(determiner({ kind: 'ein-word', stem: 'euer' }, 'nom', 'm')).toBe('euer')
    expect(determiner({ kind: 'der-word', stem: 'dies' }, 'gen', 'n')).toBe('dieses')
  })

  it('el sustantivo: dativo plural, genitivo y n-Deklination', () => {
    expect(nounForm(tisch, 'dat', 'pl')).toBe('Tischen')
    expect(nounForm(wohnung, 'dat', 'pl')).toBe('Wohnungen')
    expect(nounForm(auto, 'dat', 'pl')).toBe('Autos')
    expect(nounForm(tisch, 'gen', 'sg')).toBe('Tischs')
    expect(nounForm(haus, 'gen', 'sg')).toBe('Hauses')
    expect(nounForm(kollege, 'akk', 'sg')).toBe('Kollegen')
    expect(nounForm(kollege, 'nom', 'sg')).toBe('Kollege')
  })

  it('frases nominales con adjetivo (débil, mixto y fuerte)', () => {
    expect(nounPhrase(tisch, { kind: 'def' }, 'nom', 'sg', 'groß')).toBe('der große Tisch')
    expect(nounPhrase(tisch, { kind: 'indef' }, 'akk', 'sg', 'groß')).toBe('einen großen Tisch')
    expect(nounPhrase(haus, { kind: 'indef' }, 'nom', 'sg', 'neu')).toBe('ein neues Haus')
    expect(nounPhrase(wohnung, { kind: 'none' }, 'dat', 'sg', 'billig')).toBe('billiger Wohnung')
    expect(nounPhrase(kollege, { kind: 'indef' }, 'dat', 'sg', 'nett')).toBe('einem netten Kollegen')
    expect(nounPhrase(haus, { kind: 'def' }, 'dat', 'pl', 'alt')).toBe('den alten Häusern')
    expect(nounPhrase(auto, { kind: 'ein-word', stem: 'mein' }, 'nom', 'pl', 'teuer')).toBe('meine teuren Autos')
    expect(declineAdjective('dunkel', 'strong', 'nom', 'f')).toBe('dunkle')
    expect(declineAdjective('hoch', 'weak', 'nom', 'm')).toBe('hohe')
  })
})
