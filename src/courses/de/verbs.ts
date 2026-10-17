import type { Verb } from './engine/conjugation.ts'

// Verbos base del curso (A1–A2). Solo se declara lo irregular; el motor deduce el resto.
// Esta lista crece con cada etapa; los infinitivos sirven de id y no deben cambiar.

const modal = (inf: string, meaning: string, present: Verb['present'], praet: string, konj2: string): Verb => ({
  inf,
  meaning,
  present,
  praet,
  partizip: `ge${praet.slice(0, -2)}t`,
  konj2,
  noImperative: true,
})

export const verbs: Verb[] = [
  // Auxiliares y muy irregulares
  { inf: 'sein', meaning: 'ser, estar', present: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'], praet: 'war', partizip: 'gewesen', aux: 'sein', konj2: 'wäre', imperative: ['sei', 'seid', 'seien Sie'] },
  { inf: 'haben', meaning: 'tener', present: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'], praet: 'hatte', partizip: 'gehabt', konj2: 'hätte', imperative: ['hab', 'habt', 'haben Sie'] },
  { inf: 'werden', meaning: 'volverse, llegar a ser', present: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'], praet: 'wurde', partizip: 'geworden', aux: 'sein', konj2: 'würde', imperative: ['werde', 'werdet', 'werden Sie'] },
  { inf: 'wissen', meaning: 'saber', present: ['weiß', 'weißt', 'weiß', 'wissen', 'wisst', 'wissen'], praet: 'wusste', partizip: 'gewusst', konj2: 'wüsste' },
  { inf: 'tun', meaning: 'hacer', present: ['tue', 'tust', 'tut', 'tun', 'tut', 'tun'], praet: 'tat', partizip: 'getan', imperative: ['tu', 'tut', 'tun Sie'] },
  // Modales
  modal('können', 'poder (capacidad)', ['kann', 'kannst', 'kann', 'können', 'könnt', 'können'], 'konnte', 'könnte'),
  modal('müssen', 'tener que', ['muss', 'musst', 'muss', 'müssen', 'müsst', 'müssen'], 'musste', 'müsste'),
  modal('wollen', 'querer', ['will', 'willst', 'will', 'wollen', 'wollt', 'wollen'], 'wollte', 'wollte'),
  modal('dürfen', 'poder (permiso)', ['darf', 'darfst', 'darf', 'dürfen', 'dürft', 'dürfen'], 'durfte', 'dürfte'),
  modal('sollen', 'deber', ['soll', 'sollst', 'soll', 'sollen', 'sollt', 'sollen'], 'sollte', 'sollte'),
  { ...modal('mögen', 'gustar', ['mag', 'magst', 'mag', 'mögen', 'mögt', 'mögen'], 'mochte', 'möchte'), partizip: 'gemocht' },
  // Débiles (regulares)
  { inf: 'machen', meaning: 'hacer' },
  { inf: 'arbeiten', meaning: 'trabajar' },
  { inf: 'wohnen', meaning: 'vivir (residir)' },
  { inf: 'lernen', meaning: 'aprender' },
  { inf: 'kaufen', meaning: 'comprar' },
  { inf: 'brauchen', meaning: 'necesitar' },
  { inf: 'suchen', meaning: 'buscar' },
  { inf: 'warten', meaning: 'esperar' },
  { inf: 'antworten', meaning: 'responder' },
  { inf: 'zahlen', meaning: 'pagar' },
  { inf: 'öffnen', meaning: 'abrir' },
  { inf: 'tanzen', meaning: 'bailar' },
  { inf: 'reisen', meaning: 'viajar', aux: 'sein' },
  { inf: 'sammeln', meaning: 'coleccionar, juntar' },
  { inf: 'wandern', meaning: 'hacer senderismo', aux: 'sein' },
  { inf: 'besuchen', meaning: 'visitar' },
  { inf: 'studieren', meaning: 'estudiar (en la universidad)' },
  { inf: 'einkaufen', meaning: 'hacer las compras', sep: 'ein' },
  // Fuertes
  { inf: 'fahren', meaning: 'ir (en vehículo), manejar', present3: 'fährt', praet: 'fuhr', partizip: 'gefahren', aux: 'sein' },
  { inf: 'gehen', meaning: 'ir (a pie)', praet: 'ging', partizip: 'gegangen', aux: 'sein', konj2: 'ginge' },
  { inf: 'kommen', meaning: 'venir', praet: 'kam', partizip: 'gekommen', aux: 'sein', konj2: 'käme' },
  { inf: 'bleiben', meaning: 'quedarse', praet: 'blieb', partizip: 'geblieben', aux: 'sein' },
  { inf: 'lesen', meaning: 'leer', present3: 'liest', praet: 'las', partizip: 'gelesen' },
  { inf: 'essen', meaning: 'comer', present3: 'isst', praet: 'aß', partizip: 'gegessen' },
  { inf: 'nehmen', meaning: 'tomar', present3: 'nimmt', present2: 'nimmst', praet: 'nahm', partizip: 'genommen' },
  { inf: 'sprechen', meaning: 'hablar', present3: 'spricht', praet: 'sprach', partizip: 'gesprochen' },
  { inf: 'sehen', meaning: 'ver', present3: 'sieht', praet: 'sah', partizip: 'gesehen' },
  { inf: 'geben', meaning: 'dar', present3: 'gibt', praet: 'gab', partizip: 'gegeben' },
  { inf: 'helfen', meaning: 'ayudar', present3: 'hilft', praet: 'half', partizip: 'geholfen' },
  { inf: 'treffen', meaning: 'encontrarse con', present3: 'trifft', praet: 'traf', partizip: 'getroffen' },
  { inf: 'schlafen', meaning: 'dormir', present3: 'schläft', praet: 'schlief', partizip: 'geschlafen' },
  { inf: 'laufen', meaning: 'correr, caminar', present3: 'läuft', praet: 'lief', partizip: 'gelaufen', aux: 'sein' },
  { inf: 'finden', meaning: 'encontrar', praet: 'fand', partizip: 'gefunden' },
  { inf: 'schreiben', meaning: 'escribir', praet: 'schrieb', partizip: 'geschrieben' },
  { inf: 'trinken', meaning: 'beber', praet: 'trank', partizip: 'getrunken' },
  { inf: 'heißen', meaning: 'llamarse', praet: 'hieß', partizip: 'geheißen' },
  { inf: 'verstehen', meaning: 'entender', praet: 'verstand', partizip: 'verstanden' },
  { inf: 'aufstehen', meaning: 'levantarse', sep: 'auf', praet: 'stand', partizip: 'aufgestanden', aux: 'sein' },
  { inf: 'anrufen', meaning: 'llamar por teléfono', sep: 'an', praet: 'rief', partizip: 'angerufen' },
  // Mixtos
  { inf: 'bringen', meaning: 'traer', praet: 'brachte', partizip: 'gebracht' },
  { inf: 'denken', meaning: 'pensar', praet: 'dachte', partizip: 'gedacht' },
  { inf: 'kennen', meaning: 'conocer', praet: 'kannte', partizip: 'gekannt' },
]

export const verbByInf = new Map(verbs.map((v) => [v.inf, v]))
