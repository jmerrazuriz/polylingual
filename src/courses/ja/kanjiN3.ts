// Kanji del nivel N3 (etapa C), primera y segunda tanda. Mismo formato que kanji.ts y kanjiN4.ts.
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
  // ── Segunda tanda ──
  // Emociones
  k('悲', 'triste', ['ヒ'], ['かな(しい)'], [['悲しい', 'かなしい', 'triste'], ['悲劇', 'ひげき', 'tragedia']]),
  k('喜', 'alegría', ['キ'], ['よろこ(ぶ)'], [['喜ぶ', 'よろこぶ', 'alegrarse'], ['喜劇', 'きげき', 'comedia']]),
  k('感', 'sentir', ['カン'], [], [['感じる', 'かんじる', 'sentir'], ['感謝', 'かんしゃ', 'gratitud']]),
  k('情', 'emoción; información', ['ジョウ'], ['なさ(け)'], [['感情', 'かんじょう', 'emoción'], ['情報', 'じょうほう', 'información']]),
  k('愛', 'amor', ['アイ'], [], [['愛', 'あい', 'amor'], ['愛する', 'あいする', 'amar']]),
  k('恋', 'amor romántico', ['レン'], ['こい'], [['恋', 'こい', 'amor (romántico)'], ['恋人', 'こいびと', 'pareja']]),
  k('幸', 'felicidad', ['コウ'], ['しあわ(せ)', 'さいわ(い)'], [['幸せ', 'しあわせ', 'feliz'], ['幸運', 'こううん', 'buena suerte']]),
  k('福', 'fortuna', ['フク'], [], [['幸福', 'こうふく', 'felicidad'], ['福', 'ふく', 'fortuna']]),
  k('願', 'deseo, pedir', ['ガン'], ['ねが(う)'], [['願う', 'ねがう', 'desear'], ['お願い', 'おねがい', 'pedido; por favor']]),
  k('信', 'creer, confiar', ['シン'], [], [['信じる', 'しんじる', 'creer'], ['信号', 'しんごう', 'semáforo']]),
  k('苦', 'sufrir; amargo', ['ク'], ['くる(しい)', 'にが(い)'], [['苦しい', 'くるしい', 'doloroso, duro'], ['苦手', 'にがて', 'malo para algo']]),
  k('辛', 'picante; duro', ['シン'], ['から(い)', 'つら(い)'], [['辛い', 'からい', 'picante'], ['辛口', 'からくち', 'de sabor picante']]),

  // Cuerpo y estado
  k('腕', 'brazo; habilidad', ['ワン'], ['うで'], [['腕', 'うで', 'brazo'], ['腕時計', 'うでどけい', 'reloj de pulsera']]),
  k('指', 'dedo; señalar', ['シ'], ['ゆび', 'さ(す)'], [['指', 'ゆび', 'dedo'], ['指す', 'さす', 'señalar']]),
  k('胸', 'pecho', ['キョウ'], ['むね'], [['胸', 'むね', 'pecho'], ['度胸', 'どきょう', 'valentía']]),
  k('背', 'espalda; estatura', ['ハイ'], ['せ', 'せい'], [['背', 'せ', 'estatura'], ['背中', 'せなか', 'espalda']]),
  k('歯', 'diente', ['シ'], ['は'], [['歯', 'は', 'diente'], ['歯医者', 'はいしゃ', 'dentista']]),
  k('鼻', 'nariz', ['ビ'], ['はな'], [['鼻', 'はな', 'nariz'], ['鼻水', 'はなみず', 'moquillo']]),
  k('様', 'manera; señor (respeto)', ['ヨウ'], ['さま'], [['様子', 'ようす', 'aspecto, estado'], ['お客様', 'おきゃくさま', 'cliente']]),
  k('状', 'condición; carta', ['ジョウ'], [], [['状態', 'じょうたい', 'estado, condición'], ['年賀状', 'ねんがじょう', 'tarjeta de año nuevo']]),
  k('態', 'estado, actitud', ['タイ'], [], [['態度', 'たいど', 'actitud'], ['実態', 'じったい', 'situación real']]),
  k('形', 'forma', ['ケイ', 'ギョウ'], ['かたち'], [['形', 'かたち', 'forma'], ['人形', 'にんぎょう', 'muñeca']]),
  k('点', 'punto', ['テン'], [], [['点', 'てん', 'punto'], ['点数', 'てんすう', 'puntaje']]),
  k('他', 'otro, ajeno', ['タ'], ['ほか'], [['他', 'ほか', 'otro'], ['他人', 'たにん', 'otra persona, desconocido']]),

  // Naturaleza y estaciones
  k('島', 'isla', ['トウ'], ['しま'], [['島', 'しま', 'isla'], ['半島', 'はんとう', 'península']]),
  k('湖', 'lago', ['コ'], ['みずうみ'], [['湖', 'みずうみ', 'lago'], ['湖水', 'こすい', 'agua del lago']]),
  k('波', 'ola', ['ハ'], ['なみ'], [['波', 'なみ', 'ola'], ['電波', 'でんぱ', 'ondas de radio']]),
  k('草', 'hierba', ['ソウ'], ['くさ'], [['草', 'くさ', 'hierba'], ['草原', 'そうげん', 'pradera']]),
  k('根', 'raíz', ['コン'], ['ね'], [['根', 'ね', 'raíz'], ['大根', 'だいこん', 'rábano japonés']]),
  k('植', 'plantar', ['ショク'], ['う(える)'], [['植える', 'うえる', 'plantar'], ['植物', 'しょくぶつ', 'planta']]),
  k('季', 'estación (del año)', ['キ'], [], [['季節', 'きせつ', 'estación del año'], ['四季', 'しき', 'las cuatro estaciones']]),
  k('節', 'período; nudo', ['セツ'], ['ふし'], [['節約', 'せつやく', 'ahorro'], ['関節', 'かんせつ', 'articulación']]),
  k('景', 'vista, paisaje', ['ケイ'], [], [['景色', 'けしき', 'paisaje'], ['夜景', 'やけい', 'vista nocturna']]),
  k('暖', 'cálido (clima)', ['ダン'], ['あたた(かい)'], [['暖かい', 'あたたかい', 'cálido'], ['暖房', 'だんぼう', 'calefacción']]),
  k('涼', 'fresco (clima)', ['リョウ'], ['すず(しい)'], [['涼しい', 'すずしい', 'fresco'], ['涼む', 'すずむ', 'refrescarse']]),
  k('虫', 'insecto', ['チュウ'], ['むし'], [['虫', 'むし', 'insecto'], ['昆虫', 'こんちゅう', 'insectos (formal)']]),

  // Sociedad e información
  k('政', 'gobierno, política', ['セイ', 'ショウ'], [], [['政治', 'せいじ', 'política'], ['政府', 'せいふ', 'gobierno']]),
  k('治', 'gobernar; curar', ['ジ', 'チ'], ['なお(る)', 'おさ(める)'], [['治る', 'なおる', 'sanarse'], ['明治', 'めいじ', 'era Meiji']]),
  k('経', 'pasar por; economía', ['ケイ', 'キョウ'], ['へ(る)'], [['経済', 'けいざい', 'economía'], ['経験', 'けいけん', 'experiencia']]),
  k('済', 'terminar; liquidar', ['サイ'], ['す(む)', 'す(ませる)'], [['済む', 'すむ', 'terminar, resolverse'], ['返済', 'へんさい', 'pago de una deuda']]),
  k('産', 'producir', ['サン'], ['う(む)'], [['生産', 'せいさん', 'producción'], ['お土産', 'おみやげ', 'recuerdo (souvenir)']]),
  k('製', 'fabricado', ['セイ'], [], [['日本製', 'にほんせい', 'hecho en Japón'], ['製品', 'せいひん', 'producto']]),
  k('伝', 'transmitir', ['デン'], ['つた(える)'], [['伝える', 'つたえる', 'transmitir'], ['手伝う', 'てつだう', 'ayudar']]),
  k('報', 'informe, noticia', ['ホウ'], ['むく(いる)'], [['情報', 'じょうほう', 'información'], ['天気予報', 'てんきよほう', 'pronóstico del tiempo']]),
  k('告', 'anunciar', ['コク'], ['つ(げる)'], [['報告', 'ほうこく', 'informe'], ['広告', 'こうこく', 'publicidad']]),
  k('記', 'anotar', ['キ'], ['しる(す)'], [['日記', 'にっき', 'diario personal'], ['記者', 'きしゃ', 'periodista']]),
  k('録', 'registrar', ['ロク'], [], [['記録', 'きろく', 'registro'], ['録音', 'ろくおん', 'grabación']]),
  k('談', 'conversar', ['ダン'], [], [['相談', 'そうだん', 'consulta'], ['冗談', 'じょうだん', 'broma']]),

  // Movimiento
  k('過', 'pasar; exceso', ['カ'], ['す(ぎる)', 'す(ごす)'], [['過ぎる', 'すぎる', 'pasar'], ['過ごす', 'すごす', 'pasar (el tiempo)']]),
  k('進', 'avanzar', ['シン'], ['すす(む)'], [['進む', 'すすむ', 'avanzar'], ['進学', 'しんがく', 'seguir estudiando']]),
  k('戻', 'regresar (a un lugar)', ['レイ'], ['もど(る)', 'もど(す)'], [['戻る', 'もどる', 'volver'], ['戻す', 'もどす', 'devolver a su lugar']]),
  k('追', 'perseguir', ['ツイ'], ['お(う)'], [['追う', 'おう', 'perseguir'], ['追加', 'ついか', 'agregado']]),
  k('逃', 'escapar', ['トウ'], ['に(げる)', 'のが(す)'], [['逃げる', 'にげる', 'huir'], ['逃す', 'のがす', 'dejar escapar']]),
  k('迎', 'recibir (a alguien)', ['ゲイ'], ['むか(える)'], [['迎える', 'むかえる', 'ir a buscar, recibir'], ['歓迎', 'かんげい', 'bienvenida']]),
  k('渡', 'atravesar', ['ト'], ['わた(る)', 'わた(す)'], [['渡る', 'わたる', 'cruzar'], ['渡す', 'わたす', 'entregar']]),
  k('移', 'trasladar', ['イ'], ['うつ(る)', 'うつ(す)'], [['移る', 'うつる', 'trasladarse'], ['移動', 'いどう', 'traslado']]),
  k('越', 'pasar por encima', ['エツ'], ['こ(す)', 'こ(える)'], [['引っ越す', 'ひっこす', 'mudarse'], ['越える', 'こえる', 'cruzar, superar']]),
  k('到', 'llegar (a un destino)', ['トウ'], [], [['到着', 'とうちゃく', 'llegada'], ['到底', 'とうてい', 'de ningún modo']]),
  k('配', 'repartir; preocupar', ['ハイ'], ['くば(る)'], [['心配', 'しんぱい', 'preocupación'], ['配る', 'くばる', 'repartir']]),
  k('達', 'alcanzar; plural', ['タツ'], [], [['友達', 'ともだち', 'amigo'], ['配達', 'はいたつ', 'reparto']]),

  // Cantidad y cambio
  k('最', 'el más', ['サイ'], ['もっと(も)'], [['最近', 'さいきん', 'últimamente'], ['最後', 'さいご', 'el último']]),
  k('初', 'primero, inicio', ['ショ'], ['はじ(め)', 'はじ(めて)', 'はつ'], [['初めて', 'はじめて', 'por primera vez'], ['最初', 'さいしょ', 'el primero']]),
  k('未', 'aún no', ['ミ'], [], [['未来', 'みらい', 'futuro'], ['未満', 'みまん', 'menos de']]),
  k('数', 'número; contar', ['スウ'], ['かず', 'かぞ(える)'], [['数', 'かず', 'número, cantidad'], ['数学', 'すうがく', 'matemáticas']]),
  k('量', 'cantidad', ['リョウ'], ['はか(る)'], [['量', 'りょう', 'cantidad'], ['大量', 'たいりょう', 'gran cantidad']]),
  k('増', 'aumentar', ['ゾウ'], ['ふ(える)', 'ま(す)'], [['増える', 'ふえる', 'aumentar'], ['増加', 'ぞうか', 'aumento']]),
  k('減', 'disminuir', ['ゲン'], ['へ(る)', 'へ(らす)'], [['減る', 'へる', 'disminuir'], ['減少', 'げんしょう', 'disminución']]),
  k('変', 'cambiar; raro', ['ヘン'], ['か(わる)', 'か(える)'], [['変わる', 'かわる', 'cambiar'], ['大変', 'たいへん', 'terrible; muy']]),
  k('失', 'perder (algo)', ['シツ'], ['うしな(う)'], [['失う', 'うしなう', 'perder'], ['失敗', 'しっぱい', 'fracaso']]),
  k('得', 'obtener', ['トク'], ['え(る)'], [['得意', 'とくい', 'bueno para algo'], ['得る', 'える', 'obtener']]),
  k('勝', 'ganar', ['ショウ'], ['か(つ)'], [['勝つ', 'かつ', 'ganar'], ['勝負', 'しょうぶ', 'competencia']]),
  k('負', 'perder (un juego); cargar', ['フ'], ['ま(ける)', 'お(う)'], [['負ける', 'まける', 'perder'], ['負担', 'ふたん', 'carga']]),
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
  lesson('n3-emocion-1', 'Triste, alegre, sentir y amar', 'N3 · Sentimientos y cuerpo', '悲喜感情愛恋'),
  lesson('n3-emocion-2', 'Felicidad, deseos y dificultades', 'N3 · Sentimientos y cuerpo', '幸福願信苦辛'),
  lesson('n3-cuerpo', 'Brazo, dedo, pecho, dientes y nariz', 'N3 · Sentimientos y cuerpo', '腕指胸背歯鼻'),
  lesson('n3-estado', 'Estado, forma y puntos', 'N3 · Sentimientos y cuerpo', '様状態形点他'),
  lesson('n3-naturaleza', 'Islas, lagos, olas y plantas', 'N3 · Naturaleza y sociedad', '島湖波草根植'),
  lesson('n3-estaciones', 'Estaciones, paisajes y clima', 'N3 · Naturaleza y sociedad', '季節景暖涼虫'),
  lesson('n3-economia', 'Política, economía y producción', 'N3 · Naturaleza y sociedad', '政治経済産製'),
  lesson('n3-informacion', 'Transmitir, informar y registrar', 'N3 · Naturaleza y sociedad', '伝報告記録談'),
  lesson('n3-mover-1', 'Pasar, avanzar, volver y huir', 'N3 · Movimiento y cambio', '過進戻追逃迎'),
  lesson('n3-mover-2', 'Cruzar, trasladarse y repartir', 'N3 · Movimiento y cambio', '渡移越到配達'),
  lesson('n3-cantidad', 'El más, el primero y las cantidades', 'N3 · Movimiento y cambio', '最初未数量増'),
  lesson('n3-cambio', 'Disminuir, cambiar, ganar y perder', 'N3 · Movimiento y cambio', '減変失得勝負'),
]
