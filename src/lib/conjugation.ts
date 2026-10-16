// Motor de conjugación del japonés (en kana). Verbos de los tres grupos y adjetivos い/な.
//
// Grupo 1 (godan, «verbos う»): cambian la última sílaba por fila (か→き→く→け→こ).
// Grupo 2 (ichidan, «verbos る»): se quita る y se agrega la terminación.
// Grupo 3 (irregulares): する, くる (y los compuestos con する: べんきょうする).

export type VerbGroup = 'godan' | 'ichidan' | 'irregular'

export type VerbForm =
  | 'masu'
  | 'masen'
  | 'mashita'
  | 'masendeshita'
  | 'mashou'
  | 'dict'
  | 'nai'
  | 'ta'
  | 'nakatta'
  | 'te'
  | 'tai'
  | 'potential'
  | 'volitional'
  | 'imperative'
  | 'ba'
  | 'tara'
  | 'passive'
  | 'causative'

export type AdjForm = 'present' | 'negative' | 'past' | 'pastNegative' | 'te' | 'adverb' | 'polite' | 'politeNegative' | 'politePast'

export const verbFormInfo: Record<VerbForm, { label: string; level: 'N5' | 'N4'; example: string }> = {
  masu: { label: 'ます (presente educado)', level: 'N5', example: 'たべます' },
  masen: { label: 'ません (negativo educado)', level: 'N5', example: 'たべません' },
  mashita: { label: 'ました (pasado educado)', level: 'N5', example: 'たべました' },
  masendeshita: { label: 'ませんでした (pasado negativo educado)', level: 'N5', example: 'たべませんでした' },
  mashou: { label: 'ましょう (hagamos…)', level: 'N5', example: 'たべましょう' },
  dict: { label: 'diccionario (presente informal)', level: 'N5', example: 'たべる' },
  nai: { label: 'ない (negativo informal)', level: 'N5', example: 'たべない' },
  ta: { label: 'た (pasado informal)', level: 'N5', example: 'たべた' },
  nakatta: { label: 'なかった (pasado negativo informal)', level: 'N5', example: 'たべなかった' },
  te: { label: 'て (forma て)', level: 'N5', example: 'たべて' },
  tai: { label: 'たい (quiero…)', level: 'N5', example: 'たべたい' },
  potential: { label: 'potencial (poder…)', level: 'N4', example: 'たべられる' },
  volitional: { label: 'volitiva (vamos a…)', level: 'N4', example: 'たべよう' },
  imperative: { label: 'imperativa (¡haz…!)', level: 'N4', example: 'たべろ' },
  ba: { label: 'condicional ば (si…)', level: 'N4', example: 'たべれば' },
  tara: { label: 'condicional たら (si / cuando…)', level: 'N4', example: 'たべたら' },
  passive: { label: 'pasiva (ser …-ado)', level: 'N4', example: 'たべられる' },
  causative: { label: 'causativa (hacer que…)', level: 'N4', example: 'たべさせる' },
}

/** Filas del silabario para los verbos del grupo 1: [a, i, u, e, o]. */
const ROWS: Record<string, [string, string, string, string, string]> = {
  う: ['わ', 'い', 'う', 'え', 'お'],
  く: ['か', 'き', 'く', 'け', 'こ'],
  ぐ: ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  す: ['さ', 'し', 'す', 'せ', 'そ'],
  つ: ['た', 'ち', 'つ', 'て', 'と'],
  ぬ: ['な', 'に', 'ぬ', 'ね', 'の'],
  ぶ: ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
  む: ['ま', 'み', 'む', 'め', 'も'],
  る: ['ら', 'り', 'る', 'れ', 'ろ'],
}

/** Terminación de la forma て/た del grupo 1 según la última sílaba. */
const TE: Record<string, [string, string]> = {
  う: ['って', 'った'],
  つ: ['って', 'った'],
  る: ['って', 'った'],
  む: ['んで', 'んだ'],
  ぶ: ['んで', 'んだ'],
  ぬ: ['んで', 'んだ'],
  く: ['いて', 'いた'],
  ぐ: ['いで', 'いだ'],
  す: ['して', 'した'],
}

/** Raíces de los irregulares. Los compuestos con する conjugan la parte する. */
const IRREGULAR: Record<string, Record<VerbForm, string>> = {
  する: {
    masu: 'します', masen: 'しません', mashita: 'しました', masendeshita: 'しませんでした', mashou: 'しましょう',
    dict: 'する', nai: 'しない', ta: 'した', nakatta: 'しなかった', te: 'して', tai: 'したい',
    potential: 'できる', volitional: 'しよう', imperative: 'しろ', ba: 'すれば', tara: 'したら',
    passive: 'される', causative: 'させる',
  },
  くる: {
    masu: 'きます', masen: 'きません', mashita: 'きました', masendeshita: 'きませんでした', mashou: 'きましょう',
    dict: 'くる', nai: 'こない', ta: 'きた', nakatta: 'こなかった', te: 'きて', tai: 'きたい',
    potential: 'こられる', volitional: 'こよう', imperative: 'こい', ba: 'くれば', tara: 'きたら',
    passive: 'こられる', causative: 'こさせる',
  },
}

function godan(verb: string, form: VerbForm): string {
  const last = verb.slice(-1)
  const stem = verb.slice(0, -1)
  const row = ROWS[last]
  if (!row) throw new Error(`No es un verbo del grupo 1: ${verb}`)
  const [a, i, , e, o] = row
  // いく (y sus compuestos, como もっていく) es regular salvo en て/た: いって, いった.
  const [te, ta] = verb.endsWith('いく') ? ['って', 'った'] : TE[last]
  // ある: el negativo informal es ない (no «あらない»).
  if (verb === 'ある' && (form === 'nai' || form === 'nakatta')) return form === 'nai' ? 'ない' : 'なかった'
  switch (form) {
    case 'masu': return stem + i + 'ます'
    case 'masen': return stem + i + 'ません'
    case 'mashita': return stem + i + 'ました'
    case 'masendeshita': return stem + i + 'ませんでした'
    case 'mashou': return stem + i + 'ましょう'
    case 'dict': return verb
    case 'nai': return stem + a + 'ない'
    case 'nakatta': return stem + a + 'なかった'
    case 'te': return stem + te
    case 'ta': return stem + ta
    case 'tai': return stem + i + 'たい'
    case 'potential': return stem + e + 'る'
    case 'volitional': return stem + o + 'う'
    case 'imperative': return stem + e
    case 'ba': return stem + e + 'ば'
    case 'tara': return stem + ta + 'ら'
    case 'passive': return stem + a + 'れる'
    case 'causative': return stem + a + 'せる'
  }
}

function ichidan(verb: string, form: VerbForm): string {
  if (!verb.endsWith('る')) throw new Error(`No es un verbo del grupo 2: ${verb}`)
  const stem = verb.slice(0, -1)
  const endings: Record<VerbForm, string> = {
    masu: 'ます', masen: 'ません', mashita: 'ました', masendeshita: 'ませんでした', mashou: 'ましょう',
    dict: 'る', nai: 'ない', ta: 'た', nakatta: 'なかった', te: 'て', tai: 'たい',
    potential: 'られる', volitional: 'よう', imperative: 'ろ', ba: 'れば', tara: 'たら',
    passive: 'られる', causative: 'させる',
  }
  return stem + endings[form]
}

/** Conjuga un verbo (en kana, forma de diccionario). */
export function conjugateVerb(verb: string, group: VerbGroup, form: VerbForm): string {
  if (group === 'ichidan') return ichidan(verb, form)
  if (group === 'godan') return godan(verb, form)
  // Irregulares: する y くる, solos o al final de un compuesto (べんきょうする).
  for (const base of ['する', 'くる'] as const) {
    if (verb.endsWith(base)) return verb.slice(0, -base.length) + IRREGULAR[base][form]
  }
  throw new Error(`Verbo irregular desconocido: ${verb}`)
}

/** Conjuga un adjetivo い (おおきい) o な (しずか, sin el な). */
export function conjugateAdjective(adj: string, kind: 'i' | 'na', form: AdjForm): string {
  if (kind === 'na') {
    const forms: Record<AdjForm, string> = {
      present: 'だ', negative: 'じゃない', past: 'だった', pastNegative: 'じゃなかった', te: 'で', adverb: 'に',
      polite: 'です', politeNegative: 'じゃありません', politePast: 'でした',
    }
    return adj + forms[form]
  }
  if (!adj.endsWith('い')) throw new Error(`No es un adjetivo い: ${adj}`)
  // いい se conjuga desde よい: よくない, よかった.
  const stem = adj === 'いい' ? 'よ' : adj.endsWith('かっこいい') ? adj.slice(0, -2) + 'よ' : adj.slice(0, -1)
  const forms: Record<AdjForm, string> = {
    present: adj,
    negative: stem + 'くない',
    past: stem + 'かった',
    pastNegative: stem + 'くなかった',
    te: stem + 'くて',
    adverb: stem + 'く',
    polite: adj + 'です',
    politeNegative: stem + 'くないです',
    politePast: stem + 'かったです',
  }
  return forms[form]
}
