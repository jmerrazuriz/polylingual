import type { PathItem, PathLevel, PathStop, PathUnit } from '../../lib/path.ts'
import { germanGrammar } from './grammar.ts'
import { type CefrLevel, cefrGoals, cefrLevels, cefrTitles } from './levels.ts'
import { germanTexts } from './texts.ts'
import { germanVocabLessons } from './vocab.ts'

// Recorrido del alemán por nivel. Cada unidad intercala gramática, palabras y textos de
// «Ottos Weg», en paradas de hasta 3 lecciones. Cada nivel termina en su simulacro Goethe.

const grammarTitle = new Map(germanGrammar.map((g) => [g.id, g.title]))
const textTitle = new Map(germanTexts.map((t) => [t.id, t.title]))

const grammarItem = (id: string): PathItem => ({ kind: 'grammar', id, title: grammarTitle.get(id) ?? id, to: `/gramatica/${id}` })
const vocabItems = (theme: string): PathItem[] =>
  germanVocabLessons.filter((l) => l.theme === theme).map((l) => ({ kind: 'vocab', id: l.id, title: `Palabras: ${l.title}`, to: `/palabras/${l.id}` }))
const textItem = (id: string): PathItem => ({ kind: 'reading', id, title: textTitle.get(id) ?? id, to: `/textos/${id}` })

/** Unidad: [gramática, palabras de un tema] intercalados y los textos al final, en paradas de 3. */
function unit(id: string, title: string, icon: string, grammar: string[], themes: string[], texts: string[]): PathUnit {
  const items: PathItem[] = []
  const rounds = Math.max(grammar.length, themes.length)
  for (let i = 0; i < rounds; i++) {
    if (grammar[i]) items.push(grammarItem(grammar[i]))
    if (themes[i]) items.push(...vocabItems(themes[i]))
  }
  items.push(...texts.map(textItem))
  const stops: PathStop[] = []
  for (let i = 0; i < items.length; i += 3) stops.push({ id: `${id}-${stops.length + 1}`, title: items[i].title, items: items.slice(i, i + 3) })
  return { id, title, icon, stops }
}

const examUnit = (level: CefrLevel): PathUnit => ({
  id: `examen-${level.toLowerCase()}`,
  title: `Meta: simulacro Goethe ${level}`,
  icon: '📝',
  stops: [{ id: `examen-${level.toLowerCase()}-1`, title: `Simulacro Goethe-Zertifikat ${level}`, items: [{ kind: 'exam', id: level, title: `Simulacro Goethe-Zertifikat ${level}`, to: `/goethe/${level.toLowerCase()}` }] }],
})

const unitsA1: PathUnit[] = [
  unit('de-a1-1', 'A1 · Hallo! Ich bin Otto', '👋', ['de-aussprache', 'de-sein', 'de-w-fragen'], ['hallo', 'personen'], ['dt-a1-ankunft']),
  unit('de-a1-2', 'A1 · Recién llegado', '🧳', ['de-praesens', 'de-satzbau', 'de-ja-nein'], ['laender', 'familie'], ['lt-a1-steckbrief', 'dt-a1-familie']),
  unit('de-a1-3', 'A1 · Números, horas y días', '🕗', ['de-zahlen', 'de-uhrzeit', 'de-zeitpraep'], ['zahlen-zeit', 'kalender'], ['lt-a1-kurs']),
  unit('de-a1-4', 'A1 · Buscando departamento', '🏠', ['de-genus', 'de-plural', 'de-ein-kein'], ['wohnung', 'moebel'], ['dt-a1-wohnung', 'lt-a1-anzeige']),
  unit('de-a1-5', 'A1 · En el Bürgeramt', '🏛️', ['de-nicht', 'de-muessen-duerfen', 'de-imperativ-sie'], ['amt', 'woerter'], ['dt-a1-buergeramt', 'lt-a1-formular']),
  unit('de-a1-6', 'A1 · De compras', '🛒', ['de-akkusativ', 'de-haben', 'de-moechten'], ['essen', 'trinken', 'einkaufen'], ['dt-a1-baeckerei', 'lt-a1-einkaufszettel']),
  unit('de-a1-7', 'A1 · Mi día y mi tiempo libre', '⚽', ['de-trennbar', 'de-vokalwechsel', 'de-gern'], ['alltag', 'freizeit', 'wetter'], ['dt-a1-wochenende', 'lt-a1-tagesablauf']),
  unit('de-a1-8', 'A1 · Por la ciudad', '🚌', ['de-koennen-wollen', 'de-dativ-praep', 'de-wo-wohin'], ['stadt', 'verkehr'], ['dt-a1-weg']),
  unit('de-a1-9', 'A1 · En el médico', '🩺', ['de-imperativ-du', 'de-possessiv'], ['koerper', 'kleidung', 'farben'], ['lt-a1-arzt']),
  unit('de-a1-10', 'A1 · Mi primer trabajo', '🔧', ['de-perfekt-haben', 'de-perfekt-sein', 'de-war-hatte', 'de-konnektoren'], ['arbeit', 'berufe'], ['dt-a1-vorstellung', 'lt-a1-erster-tag']),
  examUnit('A1'),
]

const unitsA2: PathUnit[] = [
  unit('de-a2-1', 'A2 · De vuelta al taller', '🔧', ['de-dativ-artikel', 'de-dativ-verben', 'de-dativ-pronomen'], ['arbeitsalltag'], ['dt-a2-werkstatt']),
  unit('de-a2-2', 'A2 · La casa nueva', '📦', ['de-wechselpraep', 'de-stellen-stehen'], ['umzug'], ['lt-a2-hausordnung', 'dt-a2-umzug']),
  unit('de-a2-3', 'A2 · Lo que pasó', '📨', ['de-perfekt-plus', 'de-praeteritum-modal'], ['kommunikation'], ['lt-a2-mail-vermieter']),
  unit('de-a2-4', 'A2 · La salud', '🩹', ['de-weil', 'de-dass'], ['gesundheit'], ['dt-a2-arzt', 'lt-a2-krankmeldung']),
  unit('de-a2-5', 'A2 · Banco y trámites', '🏦', ['de-wenn', 'de-ob-indirekt'], ['bank', 'behoerde'], ['dt-a2-bank']),
  unit('de-a2-6', 'A2 · Un trabajo mejor', '📄', ['de-komparativ', 'de-superlativ'], ['bewerbung'], ['lt-a2-stellenanzeige']),
  unit('de-a2-7', 'A2 · Compras y cocina', '🛍️', ['de-adjektiv-der', 'de-adjektiv-ein'], ['kaufen2', 'kochen'], ['dt-a2-reklamation', 'lt-a2-rezept']),
  unit('de-a2-8', 'A2 · Amigos y fiestas', '🎉', ['de-reflexiv', 'de-verben-praep', 'de-konjunktiv-hoeflich'], ['feste', 'gefuehle', 'beziehungen'], ['dt-a2-geburtstag']),
  unit('de-a2-9', 'A2 · Viajes y tiempo libre', '🚆', ['de-sollte', 'de-deshalb-trotzdem', 'de-futur'], ['reisen', 'hobbys', 'natur'], ['lt-a2-hamburg', 'dt-a2-weiterbildung']),
  unit('de-a2-10', 'A2 · Papeles y planes', '🗂️', ['de-indefinit', 'de-genitiv-von', 'de-zu-infinitiv'], ['medien', 'autoverkehr'], ['lt-a2-brief-behoerde']),
  unit('de-a2-11', 'A2 · Fechas y lugares', '📅', ['de-ordinal', 'de-temporal', 'de-zum-beim-vom'], ['bildung', 'verben2'], ['dt-a2-weihnachten']),
  unit('de-a2-12', 'A2 · Un año en Alemania', '🌱', ['de-welcher-dieser', 'de-praeteritum-text', 'de-noch-schon'], ['adjektive2', 'woerter2'], ['lt-a2-ein-jahr']),
  examUnit('A2'),
]

const unitsB1: PathUnit[] = [
  unit('de-b1-1', 'B1 · Contar el pasado', '📜', ['de-praeteritum', 'de-plusquamperfekt', 'de-nachdem-bevor'], ['werkstatt', 'karriere'], ['lt-b1-lebenslauf', 'dt-b1-pruefung']),
  unit('de-b1-2', 'B1 · Cuando y mientras', '⏳', ['de-als-wenn', 'de-sobald-solange'], ['wohnen3', 'haushalt'], ['lt-b1-forum-miete']),
  unit('de-b1-3', 'B1 · Lo que se hace', '⚙️', ['de-passiv-praesens', 'de-passiv-vergangenheit', 'de-passiv-modal'], ['technik', 'wetter2'], ['dt-b1-werkstatt-passiv', 'lt-b1-zeitung']),
  unit('de-b1-4', 'B1 · Personas y cosas', '👥', ['de-relativ-1', 'de-relativ-2', 'de-relativ-wo-was'], ['charakter', 'gefuehle2'], ['dt-b1-kollegen']),
  unit('de-b1-5', 'B1 · Correos formales', '✉️', ['de-brief-formal', 'de-n-deklination'], ['anfragen', 'finanzen'], ['lt-b1-beschwerde']),
  unit('de-b1-6', 'B1 · Para qué', '🎯', ['de-um-zu-damit', 'de-ohne-statt', 'de-lassen'], ['gesellschaft', 'recht'], ['dt-b1-integration']),
  unit('de-b1-7', 'B1 · Si yo fuera…', '💭', ['de-konj2-irreal', 'de-konj2-wunsch'], ['gesundheit2', 'notfall'], ['lt-b1-blog-heimweh', 'dt-b1-arzt-praevention']),
  unit('de-b1-8', 'B1 · A pesar de todo', '🌧️', ['de-obwohl', 'de-sodass', 'de-kausal'], ['kultur', 'gastro'], ['lt-b1-ehrenamt']),
  unit('de-b1-9', 'B1 · De quién y por qué', '🔎', ['de-genitiv', 'de-genitiv-praep', 'de-praep-akk'], ['umwelt2', 'unterwegs'], []),
  unit('de-b1-10', 'B1 · Decisiones', '⚖️', ['de-doppelkonnektoren', 'de-je-desto', 'de-brauchen-zu'], ['bildung2', 'medien2'], ['dt-b1-umzug-entscheidung', 'lt-b1-umfrage']),
  unit('de-b1-11', 'B1 · Verbos con preposición', '🔗', ['de-verben-praep-2', 'de-wo-da', 'de-reflexiv-dativ'], ['rektion'], ['dt-b1-radio']),
  unit('de-b1-12', 'B1 · Mi opinión', '🗣️', ['de-meinung', 'de-wortbildung', 'de-futur-vermutung', 'de-adjektiv-stark', 'de-indefinitpronomen'], ['diskussion', 'abstrakt', 'verben3', 'adjektive3', 'konnektoren-b1'], ['lt-b1-bewerbung', 'dt-b1-entscheidung']),
  unit('de-b1-extra-1', 'B1 · Más palabras I', '🧰', [], ['werkzeug', 'kueche', 'koerper2', 'beschwerden', 'kleidung2', 'tiere2', 'garten', 'sport', 'unterkunft', 'haushaltsgeraete'], []),
  unit('de-b1-extra-2', 'B1 · Más palabras II', '🧰', [], ['buero', 'lebensmittel2', 'mengen', 'material', 'lebensereignisse', 'landschaft', 'alltagsverben2', 'zeitangaben', 'adjektive-b1x', 'stadtorte'], []),
  examUnit('B1'),
]

const unitsB2: PathUnit[] = [
  unit('de-b2-1', 'B2 · Jefe en Múnich', '🏔️', ['de-satzstellung', 'de-modalpartikeln', 'de-negation'], ['fuehrung', 'bayern', 'kultur2'], ['lt-b2-erste-woche', 'dt-b2-team']),
  unit('de-b2-2', 'B2 · Lo que dicen otros', '📰', ['de-konj1', 'de-indirekte-rede'], ['medien3', 'politik', 'verben4'], ['lt-b2-nachrichten']),
  unit('de-b2-3', 'B2 · Procesos y normas', '⚙️', ['de-passiv-zeiten', 'de-passiv-ersatz', 'de-zustandspassiv', 'de-sein-haben-zu'], ['kfz-technik', 'verkehrsrecht'], ['lt-b2-arbeitsanweisung']),
  unit('de-b2-4', 'B2 · Participios', '🧩', ['de-partizip1', 'de-partizip2', 'de-partizip-erweitert'], ['wissenschaft', 'energie', 'digital'], ['lt-b2-studie']),
  unit('de-b2-5', 'B2 · Suposiciones', '🤔', ['de-modal-subjektiv', 'de-futur2', 'de-konj2-modal-vergangenheit', 'de-infinitiv-perfekt'], ['psyche', 'medizin', 'beziehungen2'], ['dt-b2-burnout']),
  unit('de-b2-6', 'B2 · Estilo formal', '🏛️', ['de-nomen-verb', 'de-nominalisierung', 'de-verbalisierung'], ['nomen-verb', 'verwaltung'], ['lt-b2-behoerde', 'dt-b2-auslaenderbehoerde']),
  unit('de-b2-7', 'B2 · Condiciones y medios', '🛡️', ['de-falls-sofern', 'de-indem', 'de-je-nachdem'], ['versicherung', 'geld2'], ['dt-b2-versicherung']),
  unit('de-b2-8', 'B2 · Contrastes', '🏙️', ['de-adversativ', 'de-als-ob', 'de-relativ-wer'], ['stadtleben', 'migration', 'adjektive4'], ['lt-b2-stadt']),
  unit('de-b2-9', 'B2 · Preposiciones formales', '📑', ['de-genitiv-praep-2', 'de-praep-dativ-b2', 'de-relativ-genitiv'], ['recht2', 'wirtschaft', 'abstrakt2'], ['dt-b2-betriebsrat']),
  unit('de-b2-10', 'B2 · Rección', '🔗', ['de-es-korrelat', 'de-adjektiv-praep', 'de-nomen-praep'], ['adjektiv-praep', 'nomen-praep', 'kundenservice'], ['dt-b2-kundengespraech']),
  unit('de-b2-11', 'B2 · Palabras y registro', '🗨️', ['de-wortbildung-2', 'de-register'], ['umgangssprache', 'redewendungen'], ['lt-b2-blog-sprache', 'dt-b2-stammtisch']),
  unit('de-b2-12', 'B2 · Argumentar y presentar', '🎤', ['de-grafik', 'de-eroerterung'], ['redemittel', 'bildung3', 'konnektoren-b2'], ['lt-b2-eroerterung', 'dt-b2-vortrag']),
  unit('de-b2-extra-1', 'B2 · Más palabras I', '🗂️', [], ['arbeitsmarkt', 'immobilien', 'mobilitaet', 'ernaehrung', 'erziehung', 'konsum', 'kriminalitaet', 'katastrophen'], []),
  unit('de-b2-extra-2', 'B2 · Más palabras II', '🗂️', [], ['religion', 'musik-theater', 'landwirtschaft', 'smartphone', 'verben-b2x', 'adjektive-b2x', 'nomen-b2x', 'tourismus'], []),
  examUnit('B2'),
]

const unitsC1: PathUnit[] = [
  unit('de-c1-1', 'C1 · La Meisterschule', '🎓', ['de-fokuspartikeln', 'de-modalpartikeln-2', 'de-irgend'], ['handwerk', 'verben5'], ['lt-c1-meisterschule']),
  unit('de-c1-2', 'C1 · Lo que se dijo', '🗞️', ['de-konj1-zeiten', 'de-redeeinleitung', 'de-zitieren'], ['journalismus', 'akademisch'], ['lt-c1-kommentar']),
  unit('de-c1-3', 'C1 · Normas y procesos', '📋', ['de-passiv-unpersoenlich', 'de-fvg-passiv', 'de-gerundiv'], ['gesetzgebung', 'fvg-c1'], ['lt-c1-gesetz']),
  unit('de-c1-4', 'C1 · Textos densos', '🧱', ['de-partizipialsatz', 'de-genitivattribut', 'de-substantivierte-adjektive'], ['nomen-c1', 'industrie'], ['lt-c1-zusammenfassung']),
  unit('de-c1-5', 'C1 · Suposiciones', '🔍', ['de-modal-subjektiv-perfekt', 'de-konj2-formen', 'de-hypothesen'], ['adjektive5', 'gesundheitswesen'], ['dt-c1-hans-zweifel']),
  unit('de-c1-6', 'C1 · El propio taller', '🔧', ['de-insofern', 'de-zu-als-dass', 'de-zusammenfassung'], ['gruendung', 'konjunktur'], ['lt-c1-businessplan', 'dt-c1-handwerkskammer']),
  unit('de-c1-7', 'C1 · Negociar', '🤝', ['de-ohne-dass', 'de-konzessiv-c1', 'de-geschaeftskorrespondenz'], ['verhandlung', 'rhetorik'], ['dt-c1-bank', 'dt-c1-verhandlung-lieferant']),
  unit('de-c1-8', 'C1 · Debatir', '🎙️', ['de-argument-entkraeften', 'de-diskussion-c1', 'de-konsekutiv-c1'], ['staat', 'redemittel-c1'], ['dt-c1-talkshow']),
  unit('de-c1-9', 'C1 · Prefijos y compuestos', '🧬', ['de-praefix-trennbar', 'de-praefixe-bedeutung', 'de-komposita'], ['oekologie', 'konnektoren-c1'], []),
  unit('de-c1-10', 'C1 · Rección culta', '⚖️', ['de-verben-genitiv', 'de-adjektiv-kasus', 'de-es-funktionen'], ['geschichte'], ['lt-c1-mauerfall']),
  unit('de-c1-11', 'C1 · Estilo y coherencia', '✒️', ['de-vorfeld-nachfeld', 'de-textverweise', 'de-reformulieren'], ['kunst', 'redewendungen-c1'], ['lt-c1-erzaehlung', 'dt-c1-pruefung']),
  unit('de-c1-12', 'C1 · Mi voz en alemán', '🏁', ['de-modalitaetsverben', 'de-sprichwoerter'], ['sprichwoerter'], ['lt-c1-essay', 'dt-c1-podcast', 'dt-c1-eroeffnung']),
  unit('de-c1-extra-1', 'C1 · Más palabras I', '📚', [], ['psychologie2', 'soziologie', 'stadtplanung', 'finanzmarkt', 'medizin3', 'bildungspolitik'], []),
  unit('de-c1-extra-2', 'C1 · Más palabras II', '📚', [], ['arbeitsrecht', 'energietechnik', 'verben-c1x', 'adjektive-c1x', 'nomen-c1x', 'redewendungen-c1x'], []),
  examUnit('C1'),
]

const unitsC2: PathUnit[] = [
  unit('de-c2-1', 'C2 · Austria', '🎻', ['de-oesterreich', 'de-konj1-optativ'], ['oesterreich', 'gehoben'], ['lt-c2-wien']),
  unit('de-c2-2', 'C2 · Suiza', '🧀', ['de-schweiz', 'de-thema-rhema'], ['schweiz', 'wirtschaft3'], ['dt-c2-zuerich']),
  unit('de-c2-3', 'C2 · Dialectos', '🗺️', ['de-dialekte', 'de-partikeln-kombination'], ['dialekt', 'gefuehle3'], ['dt-c2-dialekt']),
  unit('de-c2-4', 'C2 · Registro y matices', '📱', ['de-jugendsprache', 'de-verwechslungen', 'de-synonyme'], ['jugendsprache', 'adjektive6'], ['dt-c2-jugend']),
  unit('de-c2-5', 'C2 · Lo que debió hacerse', '🔁', ['de-ersatzinfinitiv', 'de-wahrnehmungsverben', 'de-uneingeleitete-saetze'], ['verben6'], ['dt-c2-reklamation']),
  unit('de-c2-6', 'C2 · Narrar', '📚', ['de-erlebte-rede', 'de-tempus-stil'], ['literaturanalyse'], ['lt-c2-erzaehlung']),
  unit('de-c2-7', 'C2 · Contratos y tribunales', '⚖️', ['de-rechtssprache', 'de-redewiedergabe-c2', 'de-konditional-c2'], ['strafrecht'], ['lt-c2-vertrag', 'dt-c2-gericht']),
  unit('de-c2-8', 'C2 · Lenguaje técnico', '🛠️', ['de-infinitiv-imperativ', 'de-attribut-komplex', 'de-abkuerzungen'], ['kfz-fachsprache', 'abkuerzungen'], ['lt-c2-anleitung']),
  unit('de-c2-9', 'C2 · Prensa y poder', '📰', ['de-pressesprache', 'de-euphemismen', 'de-praep-c2'], ['politik3', 'wissenschaft3'], ['lt-c2-pressemitteilung']),
  unit('de-c2-10', 'C2 · Hablar rápido', '📻', ['de-ellipse', 'de-ironie'], ['redewendungen-c2'], ['dt-c2-radio']),
  unit('de-c2-11', 'C2 · Escribir con estilo', '✍️', ['de-stilmittel', 'de-glosse', 'de-rezension'], ['stilfiguren'], ['lt-c2-glosse', 'lt-c2-rezension']),
  unit('de-c2-12', 'C2 · Ottos Weg', '🏡', ['de-final-c2', 'de-wortspiele'], ['philosophie', 'sprichwoerter2'], ['lt-c2-rede', 'dt-c2-philosophie', 'dt-c2-einbuergerung']),
  unit('de-c2-extra-1', 'C2 · Más palabras I', '🖋️', [], ['geisteswissenschaft', 'film', 'gespraech-nativ', 'gehoben2'], []),
  unit('de-c2-extra-2', 'C2 · Más palabras II', '🖋️', [], ['verben-c2x', 'adjektive-c2x', 'redewendungen-c2x', 'sprichwoerter3'], []),
  examUnit('C2'),
]

const unitsByLevel: Record<CefrLevel, PathUnit[]> = {
  A1: unitsA1,
  A2: unitsA2,
  B1: unitsB1,
  B2: unitsB2,
  C1: unitsC1,
  C2: unitsC2,
}

export const germanPath: PathUnit[] = cefrLevels.flatMap((l) => unitsByLevel[l])

export const germanPathLevels: PathLevel[] = (() => {
  let firstIndex = 0
  return cefrLevels.map((level) => {
    const units = unitsByLevel[level]
    const out = { level, title: cefrTitles[level], goal: cefrGoals[level], units, firstIndex }
    firstIndex += units.length
    return out
  })
})()

/** Todas las lecciones del recorrido, en orden. */
export const germanPathItems: PathItem[] = germanPath.flatMap((u) => u.stops.flatMap((s) => s.items))
