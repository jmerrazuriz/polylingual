// Kanji del nivel N3 (etapa C), primera tanda. Mismo formato que kanji.ts y kanjiN4.ts.
// on: lectura china (katakana) · kun: lectura japonesa (hiragana, con el okurigana entre paréntesis).

import type { Kanji, KanjiLesson } from './kanji.ts'

const k = (char: string, meaning: string, on: string[], kun: string[], examples: [string, string, string][]): Kanji => ({
  char,
  meaning,
  on,
  kun,
  examples: examples.map(([word, reading, m]) => ({ word, reading, meaning: m })),
})

export const kanjiN3: Kanji[] = [
  // Sentimientos y acciones del día
  k('好', 'gustar', ['コウ'], ['す(き)', 'この(む)'], [['好き', 'すき', 'que gusta'], ['好物', 'こうぶつ', 'comida favorita']]),
  k('笑', 'reír', ['ショウ'], ['わら(う)', 'え(む)'], [['笑う', 'わらう', 'reír'], ['笑顔', 'えがお', 'sonrisa']]),
  k('泣', 'llorar', ['キュウ'], ['な(く)'], [['泣く', 'なく', 'llorar'], ['泣き声', 'なきごえ', 'llanto']]),
  k('怒', 'enojarse', ['ド'], ['おこ(る)', 'いか(る)'], [['怒る', 'おこる', 'enojarse'], ['怒り', 'いかり', 'ira']]),
  k('困', 'tener problemas', ['コン'], ['こま(る)'], [['困る', 'こまる', 'tener problemas'], ['困難', 'こんなん', 'dificultad']]),
  k('忘', 'olvidar', ['ボウ'], ['わす(れる)'], [['忘れる', 'わすれる', 'olvidar'], ['忘れ物', 'わすれもの', 'objeto olvidado']]),
  k('覚', 'recordar; despertar', ['カク'], ['おぼ(える)', 'さ(める)'], [['覚える', 'おぼえる', 'memorizar'], ['目覚まし', 'めざまし', 'despertador']]),
  k('寝', 'dormir', ['シン'], ['ね(る)'], [['寝る', 'ねる', 'dormir, acostarse'], ['昼寝', 'ひるね', 'siesta']]),
  k('疲', 'cansarse', ['ヒ'], ['つか(れる)'], [['疲れる', 'つかれる', 'cansarse'], ['疲労', 'ひろう', 'fatiga']]),
  k('遊', 'jugar', ['ユウ'], ['あそ(ぶ)'], [['遊ぶ', 'あそぶ', 'jugar'], ['遊園地', 'ゆうえんち', 'parque de diversiones']]),
  k('夢', 'sueño', ['ム'], ['ゆめ'], [['夢', 'ゆめ', 'sueño'], ['夢中', 'むちゅう', 'absorto, entusiasmado']]),
  k('念', 'idea, deseo', ['ネン'], [], [['残念', 'ざんねん', 'lamentable'], ['記念', 'きねん', 'conmemoración']]),

  // Trabajo y preparación
  k('働', 'trabajar', ['ドウ'], ['はたら(く)'], [['働く', 'はたらく', 'trabajar'], ['労働', 'ろうどう', 'trabajo (laboral)']]),
  k('約', 'promesa; aproximadamente', ['ヤク'], [], [['約束', 'やくそく', 'promesa, cita'], ['予約', 'よやく', 'reserva']]),
  k('束', 'atado, manojo', ['ソク'], ['たば'], [['花束', 'はなたば', 'ramo de flores'], ['束', 'たば', 'manojo']]),
  k('連', 'llevar consigo; unir', ['レン'], ['つ(れる)'], [['連れる', 'つれる', 'llevar (a alguien)'], ['連絡', 'れんらく', 'contacto, aviso']]),
  k('絡', 'enredar', ['ラク'], ['から(む)'], [['連絡先', 'れんらくさき', 'datos de contacto'], ['絡む', 'からむ', 'enredarse']]),
  k('給', 'dar; salario', ['キュウ'], [], [['給料', 'きゅうりょう', 'sueldo'], ['月給', 'げっきゅう', 'sueldo mensual']]),
  k('準', 'norma, nivel', ['ジュン'], [], [['準備', 'じゅんび', 'preparación'], ['水準', 'すいじゅん', 'nivel']]),
  k('備', 'preparar', ['ビ'], ['そな(える)'], [['備える', 'そなえる', 'prepararse'], ['設備', 'せつび', 'instalaciones']]),
  k('調', 'investigar; tono', ['チョウ'], ['しら(べる)'], [['調べる', 'しらべる', 'investigar, buscar'], ['調子', 'ちょうし', 'estado, condición']]),
  k('選', 'elegir', ['セン'], ['えら(ぶ)'], [['選ぶ', 'えらぶ', 'elegir'], ['選手', 'せんしゅ', 'deportista']]),
  k('比', 'comparar', ['ヒ'], ['くら(べる)'], [['比べる', 'くらべる', 'comparar'], ['比較', 'ひかく', 'comparación']]),
  k('案', 'propuesta, plan', ['アン'], [], [['案内', 'あんない', 'guía, orientación'], ['案', 'あん', 'propuesta']]),

  // Ritmo y estado
  k('遅', 'tarde, lento', ['チ'], ['おく(れる)', 'おそ(い)'], [['遅い', 'おそい', 'lento; tarde'], ['遅れる', 'おくれる', 'atrasarse']]),
  k('忙', 'ocupado', ['ボウ'], ['いそが(しい)'], [['忙しい', 'いそがしい', 'ocupado'], ['多忙', 'たぼう', 'muy ocupado']]),
  k('若', 'joven', ['ジャク'], ['わか(い)'], [['若い', 'わかい', 'joven'], ['若者', 'わかもの', 'los jóvenes']]),
  k('速', 'rápido (velocidad)', ['ソク'], ['はや(い)'], [['速い', 'はやい', 'rápido'], ['速度', 'そくど', 'velocidad']]),
  k('静', 'tranquilo', ['セイ'], ['しず(か)'], [['静か', 'しずか', 'tranquilo'], ['冷静', 'れいせい', 'calma']]),
  k('末', 'final, fin', ['マツ'], ['すえ'], [['週末', 'しゅうまつ', 'fin de semana'], ['月末', 'げつまつ', 'fin de mes']]),

  // Salud
  k('熱', 'calor; fiebre', ['ネツ'], ['あつ(い)'], [['熱', 'ねつ', 'fiebre'], ['熱心', 'ねっしん', 'entusiasta']]),
  k('健', 'sano, fuerte', ['ケン'], [], [['健康', 'けんこう', 'salud'], ['健全', 'けんぜん', 'sano, saludable']]),
  k('康', 'paz, bienestar', ['コウ'], [], [['健康', 'けんこう', 'salud'], ['健康的', 'けんこうてき', 'saludable']]),
  k('危', 'peligroso', ['キ'], ['あぶ(ない)'], [['危ない', 'あぶない', 'peligroso'], ['危険', 'きけん', 'peligro']]),
  k('険', 'escarpado; riesgo', ['ケン'], ['けわ(しい)'], [['保険', 'ほけん', 'seguro'], ['険しい', 'けわしい', 'escarpado']]),
  k('痛', 'dolor', ['ツウ'], ['いた(い)'], [['痛い', 'いたい', 'que duele'], ['頭痛', 'ずつう', 'dolor de cabeza']]),

  // Cosas
  k('紙', 'papel', ['シ'], ['かみ'], [['紙', 'かみ', 'papel'], ['手紙', 'てがみ', 'carta']]),
  k('葉', 'hoja', ['ヨウ'], ['は'], [['葉', 'は', 'hoja'], ['言葉', 'ことば', 'palabra']]),
  k('菜', 'verdura', ['サイ'], ['な'], [['野菜', 'やさい', 'verdura'], ['菜の花', 'なのはな', 'flor de colza']]),
  k('箱', 'caja', ['ソウ'], ['はこ'], [['箱', 'はこ', 'caja'], ['本箱', 'ほんばこ', 'librero']]),
  k('皿', 'plato', ['ベイ'], ['さら'], [['皿', 'さら', 'plato'], ['灰皿', 'はいざら', 'cenicero']]),

  // Lugares
  k('寺', 'templo budista', ['ジ'], ['てら'], [['お寺', 'おてら', 'templo'], ['寺院', 'じいん', 'templo (formal)']]),
  k('県', 'prefectura', ['ケン'], [], [['県', 'けん', 'prefectura'], ['県立', 'けんりつ', 'prefectural']]),
  k('市', 'ciudad; mercado', ['シ'], ['いち'], [['市', 'し', 'ciudad'], ['市場', 'いちば', 'mercado']]),
  k('区', 'distrito', ['ク'], [], [['区', 'く', 'distrito'], ['区役所', 'くやくしょ', 'municipalidad del distrito']]),
  k('村', 'aldea', ['ソン'], ['むら'], [['村', 'むら', 'aldea'], ['村長', 'そんちょう', 'alcalde de la aldea']]),

  // Relaciones
  k('合', 'juntar, coincidir', ['ゴウ', 'ガッ'], ['あ(う)'], [['合う', 'あう', 'coincidir, quedar bien'], ['試合', 'しあい', 'partido']]),
  k('関', 'relación; barrera', ['カン'], ['せき'], [['関係', 'かんけい', 'relación'], ['玄関', 'げんかん', 'entrada de la casa']]),
  k('係', 'encargado; relación', ['ケイ'], ['かかり'], [['係', 'かかり', 'encargado'], ['係員', 'かかりいん', 'empleado a cargo']]),
  k('両', 'ambos', ['リョウ'], [], [['両親', 'りょうしん', 'padres'], ['両手', 'りょうて', 'ambas manos']]),
  k('相', 'mutuo', ['ソウ', 'ショウ'], ['あい'], [['相手', 'あいて', 'la otra persona'], ['相談', 'そうだん', 'consulta']]),
  k('対', 'opuesto, frente a', ['タイ', 'ツイ'], [], [['反対', 'はんたい', 'oposición'], ['対話', 'たいわ', 'diálogo']]),

  // Causas y resultados
  k('原', 'origen; llanura', ['ゲン'], ['はら'], [['原因', 'げんいん', 'causa'], ['野原', 'のはら', 'campo, pradera']]),
  k('因', 'causa', ['イン'], ['よ(る)'], [['要因', 'よういん', 'factor'], ['因果', 'いんが', 'causa y efecto']]),
  k('果', 'fruto; resultado', ['カ'], ['は(たす)', 'は(て)'], [['結果', 'けっか', 'resultado'], ['果物', 'くだもの', 'fruta']]),
  k('由', 'motivo', ['ユ', 'ユウ', 'ユイ'], ['よし'], [['理由', 'りゆう', 'razón'], ['自由', 'じゆう', 'libertad']]),
  k('必', 'necesariamente', ['ヒツ'], ['かなら(ず)'], [['必ず', 'かならず', 'sin falta'], ['必要', 'ひつよう', 'necesario']]),
  k('要', 'necesario, clave', ['ヨウ'], ['い(る)'], [['要る', 'いる', 'necesitar'], ['重要', 'じゅうよう', 'importante']]),

  // Sociedad
  k('交', 'cruzar, intercambiar', ['コウ'], ['まじ(わる)'], [['交通', 'こうつう', 'tránsito'], ['交番', 'こうばん', 'puesto de policía']]),
  k('故', 'motivo; difunto', ['コ'], ['ゆえ'], [['事故', 'じこ', 'accidente'], ['故障', 'こしょう', 'avería']]),
  k('規', 'norma', ['キ'], [], [['規則', 'きそく', 'regla'], ['規定', 'きてい', 'reglamento']]),
  k('則', 'regla, ley', ['ソク'], [], [['原則', 'げんそく', 'principio'], ['反則', 'はんそく', 'falta (en un juego)']]),
  k('化', 'cambiar; -ización', ['カ', 'ケ'], ['ば(ける)'], [['文化', 'ぶんか', 'cultura'], ['化学', 'かがく', 'química']]),
  k('活', 'vida, actividad', ['カツ'], [], [['生活', 'せいかつ', 'vida diaria'], ['活動', 'かつどう', 'actividad']]),

  // Acciones
  k('払', 'pagar', ['フツ'], ['はら(う)'], [['払う', 'はらう', 'pagar'], ['支払い', 'しはらい', 'pago']]),
  k('届', 'hacer llegar', [], ['とど(く)', 'とど(ける)'], [['届く', 'とどく', 'llegar (un envío)'], ['届ける', 'とどける', 'entregar']]),
  k('頼', 'pedir; confiar', ['ライ'], ['たの(む)', 'たよ(る)'], [['頼む', 'たのむ', 'pedir (un favor)'], ['信頼', 'しんらい', 'confianza']]),
  k('張', 'estirar, tensar', ['チョウ'], ['は(る)'], [['出張', 'しゅっちょう', 'viaje de negocios'], ['頑張る', 'がんばる', 'esforzarse']]),
  k('違', 'diferir', ['イ'], ['ちが(う)'], [['違う', 'ちがう', 'ser diferente'], ['間違い', 'まちがい', 'error']]),
  k('投', 'lanzar', ['トウ'], ['な(げる)'], [['投げる', 'なげる', 'lanzar'], ['投票', 'とうひょう', 'votación']]),

  // Casa
  k('掃', 'barrer', ['ソウ'], ['は(く)'], [['掃除', 'そうじ', 'limpieza'], ['掃く', 'はく', 'barrer']]),
  k('除', 'quitar, excluir', ['ジョ', 'ジ'], ['のぞ(く)'], [['除く', 'のぞく', 'excluir'], ['削除', 'さくじょ', 'borrar']]),
  k('宿', 'alojamiento', ['シュク'], ['やど'], [['宿題', 'しゅくだい', 'tarea'], ['宿', 'やど', 'posada']]),
  k('温', 'templado, tibio', ['オン'], ['あたた(かい)'], [['温かい', 'あたたかい', 'templado, tibio'], ['温度', 'おんど', 'temperatura']]),
  k('冷', 'frío (al tacto)', ['レイ'], ['つめ(たい)', 'ひ(える)', 'さ(める)'], [['冷たい', 'つめたい', 'frío'], ['冷蔵庫', 'れいぞうこ', 'refrigerador']]),
  k('濯', 'lavar (ropa)', ['タク'], [], [['洗濯', 'せんたく', 'lavado de ropa'], ['洗濯機', 'せんたくき', 'lavadora']]),
]

const lesson = (id: string, title: string, unit: string, chars: string): KanjiLesson => ({ id: `kanji-${id}`, title, unit, chars: [...chars] })

export const kanjiLessonsN3: KanjiLesson[] = [
  lesson('n3-sentir-1', 'Gustar, reír, llorar y enojarse', 'N3 · Personas y vida diaria', '好笑泣怒困忘'),
  lesson('n3-sentir-2', 'Recordar, dormir, cansarse y soñar', 'N3 · Personas y vida diaria', '覚寝疲遊夢念'),
  lesson('n3-ritmo', 'Tarde, ocupado, joven y tranquilo', 'N3 · Personas y vida diaria', '遅忙若速静末'),
  lesson('n3-salud', 'Salud, fiebre y peligro', 'N3 · Personas y vida diaria', '熱健康危険痛'),
  lesson('n3-casa', 'Limpiar, lavar y alojarse', 'N3 · Personas y vida diaria', '掃除宿温冷濯'),
  lesson('n3-cosas', 'Papel, hojas, cajas y platos', 'N3 · Personas y vida diaria', '紙葉菜箱皿'),
  lesson('n3-trabajo', 'Trabajar, prometer y avisar', 'N3 · Trabajo y sociedad', '働約束連絡給'),
  lesson('n3-preparar', 'Preparar, investigar y elegir', 'N3 · Trabajo y sociedad', '準備調選比案'),
  lesson('n3-acciones', 'Pagar, entregar y pedir', 'N3 · Trabajo y sociedad', '払届頼張違投'),
  lesson('n3-relaciones', 'Juntos, relación y frente a', 'N3 · Trabajo y sociedad', '合関係両相対'),
  lesson('n3-causas', 'Causas, resultados y necesidad', 'N3 · Trabajo y sociedad', '原因果由必要'),
  lesson('n3-sociedad', 'Tránsito, reglas y cultura', 'N3 · Trabajo y sociedad', '交故規則化活'),
  lesson('n3-lugares', 'Templos, prefecturas y ciudades', 'N3 · Trabajo y sociedad', '寺県市区村'),
]
