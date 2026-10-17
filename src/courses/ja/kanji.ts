// Kanji de los niveles N5 y N4 del examen JLPT, agrupados en lecciones (el N4 está en kanjiN4.ts).
// on: lectura china (en katakana) · kun: lectura japonesa (en hiragana; entre
// paréntesis va el okurigana, la parte que se escribe en kana: た(べる) → 食べる).

import { kanjiLessonsN4, kanjiN4 } from './kanjiN4.ts'

export type KanjiExample = { word: string; reading: string; meaning: string }

export type Kanji = {
  char: string
  meaning: string
  on: string[]
  kun: string[]
  examples: KanjiExample[]
}

export type KanjiLesson = { id: string; title: string; unit: string; chars: string[] }

const k = (char: string, meaning: string, on: string[], kun: string[], examples: [string, string, string][]): Kanji => ({
  char,
  meaning,
  on,
  kun,
  examples: examples.map(([word, reading, m]) => ({ word, reading, meaning: m })),
})

const kanjiN5: Kanji[] = [
  // Números
  k('一', 'uno', ['イチ', 'イツ'], ['ひと(つ)'], [['一つ', 'ひとつ', 'uno (cosa)'], ['一月', 'いちがつ', 'enero']]),
  k('二', 'dos', ['ニ'], ['ふた(つ)'], [['二つ', 'ふたつ', 'dos (cosas)'], ['二人', 'ふたり', 'dos personas']]),
  k('三', 'tres', ['サン'], ['み(つ)', 'みっ(つ)'], [['三つ', 'みっつ', 'tres (cosas)'], ['三月', 'さんがつ', 'marzo']]),
  k('四', 'cuatro', ['シ'], ['よ', 'よっ(つ)', 'よん'], [['四つ', 'よっつ', 'cuatro (cosas)'], ['四月', 'しがつ', 'abril']]),
  k('五', 'cinco', ['ゴ'], ['いつ(つ)'], [['五つ', 'いつつ', 'cinco (cosas)'], ['五月', 'ごがつ', 'mayo']]),
  k('六', 'seis', ['ロク'], ['む(つ)', 'むっ(つ)'], [['六つ', 'むっつ', 'seis (cosas)'], ['六月', 'ろくがつ', 'junio']]),
  k('七', 'siete', ['シチ'], ['なな', 'なな(つ)'], [['七つ', 'ななつ', 'siete (cosas)'], ['七月', 'しちがつ', 'julio']]),
  k('八', 'ocho', ['ハチ'], ['や(つ)', 'やっ(つ)'], [['八つ', 'やっつ', 'ocho (cosas)'], ['八月', 'はちがつ', 'agosto']]),
  k('九', 'nueve', ['キュウ', 'ク'], ['ここの(つ)'], [['九つ', 'ここのつ', 'nueve (cosas)'], ['九月', 'くがつ', 'septiembre']]),
  k('十', 'diez', ['ジュウ', 'ジッ'], ['とお'], [['十', 'とお', 'diez (cosas)'], ['十月', 'じゅうがつ', 'octubre']]),
  k('百', 'cien', ['ヒャク'], [], [['百円', 'ひゃくえん', 'cien yenes'], ['三百', 'さんびゃく', 'trescientos']]),
  k('千', 'mil', ['セン'], ['ち'], [['千円', 'せんえん', 'mil yenes'], ['三千', 'さんぜん', 'tres mil']]),
  k('万', 'diez mil', ['マン', 'バン'], [], [['一万円', 'いちまんえん', 'diez mil yenes'], ['百万', 'ひゃくまん', 'un millón']]),
  k('円', 'yen, círculo', ['エン'], ['まる(い)'], [['百円', 'ひゃくえん', 'cien yenes'], ['円い', 'まるい', 'redondo']]),

  // Tiempo
  k('日', 'día, sol', ['ニチ', 'ジツ'], ['ひ', 'か'], [['日曜日', 'にちようび', 'domingo'], ['毎日', 'まいにち', 'todos los días']]),
  k('月', 'luna, mes', ['ゲツ', 'ガツ'], ['つき'], [['月曜日', 'げつようび', 'lunes'], ['月', 'つき', 'luna']]),
  k('火', 'fuego', ['カ'], ['ひ'], [['火曜日', 'かようび', 'martes'], ['火', 'ひ', 'fuego']]),
  k('水', 'agua', ['スイ'], ['みず'], [['水曜日', 'すいようび', 'miércoles'], ['水', 'みず', 'agua']]),
  k('木', 'árbol', ['モク', 'ボク'], ['き'], [['木曜日', 'もくようび', 'jueves'], ['木', 'き', 'árbol']]),
  k('金', 'oro, dinero', ['キン', 'コン'], ['かね'], [['金曜日', 'きんようび', 'viernes'], ['お金', 'おかね', 'dinero']]),
  k('土', 'tierra', ['ド', 'ト'], ['つち'], [['土曜日', 'どようび', 'sábado'], ['土', 'つち', 'tierra']]),
  k('年', 'año', ['ネン'], ['とし'], [['今年', 'ことし', 'este año'], ['二年', 'にねん', 'dos años']]),
  k('時', 'hora, tiempo', ['ジ'], ['とき'], [['一時', 'いちじ', 'la una'], ['時間', 'じかん', 'tiempo, horas']]),
  k('分', 'minuto, parte', ['フン', 'ブン'], ['わ(かる)', 'わ(ける)'], [['五分', 'ごふん', 'cinco minutos'], ['分かる', 'わかる', 'entender']]),
  k('半', 'mitad', ['ハン'], ['なか(ば)'], [['三時半', 'さんじはん', 'las tres y media'], ['半分', 'はんぶん', 'la mitad']]),
  k('今', 'ahora', ['コン'], ['いま'], [['今', 'いま', 'ahora'], ['今日', 'きょう', 'hoy']]),
  k('午', 'mediodía', ['ゴ'], [], [['午前', 'ごぜん', 'a. m. (antes del mediodía)'], ['午後', 'ごご', 'p. m. (después del mediodía)']]),
  k('前', 'delante, antes', ['ゼン'], ['まえ'], [['前', 'まえ', 'delante, antes'], ['名前', 'なまえ', 'nombre']]),
  k('後', 'detrás, después', ['ゴ', 'コウ'], ['うし(ろ)', 'あと'], [['後ろ', 'うしろ', 'detrás'], ['後で', 'あとで', 'más tarde']]),
  k('週', 'semana', ['シュウ'], [], [['今週', 'こんしゅう', 'esta semana'], ['毎週', 'まいしゅう', 'cada semana']]),
  k('毎', 'cada', ['マイ'], [], [['毎日', 'まいにち', 'todos los días'], ['毎朝', 'まいあさ', 'todas las mañanas']]),

  // Personas
  k('人', 'persona', ['ジン', 'ニン'], ['ひと'], [['日本人', 'にほんじん', 'japonés (persona)'], ['三人', 'さんにん', 'tres personas']]),
  k('男', 'hombre', ['ダン', 'ナン'], ['おとこ'], [['男の人', 'おとこのひと', 'hombre'], ['男子', 'だんし', 'chico']]),
  k('女', 'mujer', ['ジョ', 'ニョ'], ['おんな'], [['女の人', 'おんなのひと', 'mujer'], ['女子', 'じょし', 'chica']]),
  k('子', 'niño, hijo', ['シ', 'ス'], ['こ'], [['子ども', 'こども', 'niño'], ['女の子', 'おんなのこ', 'niña']]),
  k('父', 'padre', ['フ'], ['ちち'], [['父', 'ちち', 'mi padre'], ['お父さん', 'おとうさん', 'papá']]),
  k('母', 'madre', ['ボ'], ['はは'], [['母', 'はは', 'mi madre'], ['お母さん', 'おかあさん', 'mamá']]),
  k('友', 'amigo', ['ユウ'], ['とも'], [['友だち', 'ともだち', 'amigo'], ['友人', 'ゆうじん', 'amigo (formal)']]),
  k('先', 'antes, adelante', ['セン'], ['さき'], [['先生', 'せんせい', 'profesor'], ['先週', 'せんしゅう', 'la semana pasada']]),
  k('生', 'vida, nacer', ['セイ', 'ショウ'], ['い(きる)', 'う(まれる)', 'なま'], [['学生', 'がくせい', 'estudiante'], ['生まれる', 'うまれる', 'nacer']]),
  k('学', 'estudio', ['ガク'], ['まな(ぶ)'], [['大学', 'だいがく', 'universidad'], ['学校', 'がっこう', 'escuela']]),
  k('校', 'escuela', ['コウ'], [], [['学校', 'がっこう', 'escuela'], ['高校', 'こうこう', 'liceo, bachillerato']]),

  // Naturaleza y direcciones
  k('山', 'montaña', ['サン'], ['やま'], [['山', 'やま', 'montaña'], ['富士山', 'ふじさん', 'monte Fuji']]),
  k('川', 'río', ['セン'], ['かわ'], [['川', 'かわ', 'río'], ['小川', 'おがわ', 'arroyo']]),
  k('天', 'cielo', ['テン'], ['あめ', 'あま'], [['天気', 'てんき', 'clima'], ['天ぷら', 'てんぷら', 'tempura']]),
  k('気', 'energía, ánimo', ['キ', 'ケ'], [], [['元気', 'げんき', 'sano, animado'], ['天気', 'てんき', 'clima']]),
  k('雨', 'lluvia', ['ウ'], ['あめ'], [['雨', 'あめ', 'lluvia'], ['大雨', 'おおあめ', 'lluvia fuerte']]),
  k('上', 'arriba', ['ジョウ'], ['うえ', 'あ(がる)', 'のぼ(る)'], [['上', 'うえ', 'arriba'], ['上手', 'じょうず', 'hábil']]),
  k('下', 'abajo', ['カ', 'ゲ'], ['した', 'さ(がる)', 'くだ(さい)'], [['下', 'した', 'abajo'], ['地下鉄', 'ちかてつ', 'metro']]),
  k('中', 'dentro, medio', ['チュウ'], ['なか'], [['中', 'なか', 'dentro'], ['中国', 'ちゅうごく', 'China']]),
  k('右', 'derecha', ['ウ', 'ユウ'], ['みぎ'], [['右', 'みぎ', 'derecha'], ['右手', 'みぎて', 'mano derecha']]),
  k('左', 'izquierda', ['サ'], ['ひだり'], [['左', 'ひだり', 'izquierda'], ['左手', 'ひだりて', 'mano izquierda']]),
  k('外', 'fuera', ['ガイ', 'ゲ'], ['そと', 'ほか'], [['外', 'そと', 'afuera'], ['外国', 'がいこく', 'país extranjero']]),
  k('東', 'este', ['トウ'], ['ひがし'], [['東', 'ひがし', 'este'], ['東京', 'とうきょう', 'Tokio']]),
  k('西', 'oeste', ['セイ', 'サイ'], ['にし'], [['西', 'にし', 'oeste'], ['関西', 'かんさい', 'Kansai (región)']]),
  k('南', 'sur', ['ナン'], ['みなみ'], [['南', 'みなみ', 'sur'], ['南米', 'なんべい', 'Sudamérica']]),
  k('北', 'norte', ['ホク'], ['きた'], [['北', 'きた', 'norte'], ['北海道', 'ほっかいどう', 'Hokkaidō']]),

  // Adjetivos
  k('大', 'grande', ['ダイ', 'タイ'], ['おお(きい)'], [['大きい', 'おおきい', 'grande'], ['大学', 'だいがく', 'universidad']]),
  k('小', 'pequeño', ['ショウ'], ['ちい(さい)', 'こ', 'お'], [['小さい', 'ちいさい', 'pequeño'], ['小学校', 'しょうがっこう', 'escuela primaria']]),
  k('長', 'largo, jefe', ['チョウ'], ['なが(い)'], [['長い', 'ながい', 'largo'], ['社長', 'しゃちょう', 'presidente de empresa']]),
  k('高', 'alto, caro', ['コウ'], ['たか(い)'], [['高い', 'たかい', 'alto, caro'], ['高校', 'こうこう', 'liceo, bachillerato']]),
  k('安', 'barato, tranquilo', ['アン'], ['やす(い)'], [['安い', 'やすい', 'barato'], ['安心', 'あんしん', 'tranquilidad']]),
  k('新', 'nuevo', ['シン'], ['あたら(しい)'], [['新しい', 'あたらしい', 'nuevo'], ['新聞', 'しんぶん', 'periódico']]),
  k('古', 'viejo', ['コ'], ['ふる(い)'], [['古い', 'ふるい', 'viejo (cosas)'], ['中古', 'ちゅうこ', 'de segunda mano']]),

  // Verbos
  k('見', 'ver', ['ケン'], ['み(る)'], [['見る', 'みる', 'ver'], ['見学', 'けんがく', 'visita de estudio']]),
  k('聞', 'oír, preguntar', ['ブン', 'モン'], ['き(く)'], [['聞く', 'きく', 'escuchar, preguntar'], ['新聞', 'しんぶん', 'periódico']]),
  k('食', 'comer', ['ショク'], ['た(べる)'], [['食べる', 'たべる', 'comer'], ['食堂', 'しょくどう', 'comedor']]),
  k('飲', 'beber', ['イン'], ['の(む)'], [['飲む', 'のむ', 'beber'], ['飲み物', 'のみもの', 'bebida']]),
  k('行', 'ir', ['コウ', 'ギョウ'], ['い(く)', 'おこな(う)'], [['行く', 'いく', 'ir'], ['銀行', 'ぎんこう', 'banco']]),
  k('来', 'venir', ['ライ'], ['く(る)', 'き(ます)'], [['来る', 'くる', 'venir'], ['来週', 'らいしゅう', 'la próxima semana']]),
  k('出', 'salir', ['シュツ'], ['で(る)', 'だ(す)'], [['出る', 'でる', 'salir'], ['出口', 'でぐち', 'salida']]),
  k('入', 'entrar', ['ニュウ'], ['はい(る)', 'い(れる)'], [['入る', 'はいる', 'entrar'], ['入口', 'いりぐち', 'entrada']]),
  k('休', 'descansar', ['キュウ'], ['やす(む)'], [['休む', 'やすむ', 'descansar'], ['休み', 'やすみ', 'vacaciones, descanso']]),
  k('話', 'hablar', ['ワ'], ['はな(す)', 'はなし'], [['話す', 'はなす', 'hablar'], ['電話', 'でんわ', 'teléfono']]),
  k('読', 'leer', ['ドク'], ['よ(む)'], [['読む', 'よむ', 'leer'], ['読書', 'どくしょ', 'lectura']]),
  k('書', 'escribir', ['ショ'], ['か(く)'], [['書く', 'かく', 'escribir'], ['辞書', 'じしょ', 'diccionario']]),

  // Más naturaleza y tiempo
  k('花', 'flor', ['カ'], ['はな'], [['花', 'はな', 'flor'], ['花火', 'はなび', 'fuegos artificiales']]),
  k('朝', 'mañana (del día)', ['チョウ'], ['あさ'], [['朝', 'あさ', 'la mañana'], ['朝ご飯', 'あさごはん', 'desayuno']]),
  k('夜', 'noche', ['ヤ'], ['よる', 'よ'], [['夜', 'よる', 'noche'], ['今夜', 'こんや', 'esta noche']]),
  k('魚', 'pez', ['ギョ'], ['さかな', 'うお'], [['魚', 'さかな', 'pez, pescado'], ['金魚', 'きんぎょ', 'pez dorado']]),
  k('犬', 'perro', ['ケン'], ['いぬ'], [['犬', 'いぬ', 'perro'], ['子犬', 'こいぬ', 'cachorro']]),
  k('空', 'firmamento, vacío', ['クウ'], ['そら', 'あ(く)', 'から'], [['空', 'そら', 'cielo, firmamento'], ['空港', 'くうこう', 'aeropuerto']]),

  // Más adjetivos
  k('白', 'blanco', ['ハク'], ['しろ', 'しろ(い)'], [['白い', 'しろい', 'blanco'], ['白鳥', 'はくちょう', 'cisne']]),
  k('多', 'mucho', ['タ'], ['おお(い)'], [['多い', 'おおい', 'muchos'], ['多分', 'たぶん', 'quizás']]),
  k('少', 'poco', ['ショウ'], ['すく(ない)', 'すこ(し)'], [['少し', 'すこし', 'un poco'], ['少ない', 'すくない', 'pocos']]),
  k('間', 'entre, intervalo', ['カン', 'ケン'], ['あいだ', 'ま'], [['間', 'あいだ', 'entre, intervalo'], ['一週間', 'いっしゅうかん', 'una semana']]),

  // Cuerpo
  k('口', 'boca', ['コウ', 'ク'], ['くち'], [['口', 'くち', 'boca'], ['人口', 'じんこう', 'población']]),
  k('目', 'ojo', ['モク'], ['め'], [['目', 'め', 'ojo'], ['目的', 'もくてき', 'objetivo']]),
  k('耳', 'oreja', ['ジ'], ['みみ'], [['耳', 'みみ', 'oreja'], ['右耳', 'みぎみみ', 'oreja derecha']]),
  k('手', 'mano', ['シュ'], ['て'], [['手', 'て', 'mano'], ['手紙', 'てがみ', 'carta']]),
  k('足', 'pie, pierna', ['ソク'], ['あし', 'た(りる)'], [['足', 'あし', 'pie, pierna'], ['一足', 'いっそく', 'un par (de zapatos)']]),

  // Cosas y preguntas
  k('何', 'qué', ['カ'], ['なに', 'なん'], [['何', 'なに', 'qué'], ['何人', 'なんにん', 'cuántas personas']]),
  k('本', 'libro, origen', ['ホン'], ['もと'], [['本', 'ほん', 'libro'], ['日本', 'にほん', 'Japón']]),
  k('名', 'nombre', ['メイ', 'ミョウ'], ['な'], [['名前', 'なまえ', 'nombre'], ['有名', 'ゆうめい', 'famoso']]),
  k('語', 'idioma, palabra', ['ゴ'], ['かた(る)'], [['日本語', 'にほんご', 'japonés (idioma)'], ['英語', 'えいご', 'inglés']]),
  k('国', 'país', ['コク'], ['くに'], [['国', 'くに', 'país'], ['国語', 'こくご', 'lengua nacional']]),

  // Ciudad
  k('電', 'electricidad', ['デン'], [], [['電車', 'でんしゃ', 'tren'], ['電気', 'でんき', 'electricidad, luz']]),
  k('車', 'auto, vehículo', ['シャ'], ['くるま'], [['車', 'くるま', 'auto'], ['自転車', 'じてんしゃ', 'bicicleta']]),
  k('駅', 'estación', ['エキ'], [], [['駅', 'えき', 'estación'], ['駅員', 'えきいん', 'empleado de estación']]),
  k('道', 'camino', ['ドウ'], ['みち'], [['道', 'みち', 'camino'], ['柔道', 'じゅうどう', 'judo']]),
  k('店', 'tienda', ['テン'], ['みせ'], [['店', 'みせ', 'tienda'], ['店員', 'てんいん', 'dependiente']]),

  // Trabajo y acciones
  k('会', 'reunirse', ['カイ'], ['あ(う)'], [['会う', 'あう', 'encontrarse con alguien'], ['会社', 'かいしゃ', 'empresa']]),
  k('社', 'empresa, santuario', ['シャ'], ['やしろ'], [['会社', 'かいしゃ', 'empresa'], ['神社', 'じんじゃ', 'santuario sintoísta']]),
  k('言', 'decir', ['ゲン', 'ゴン'], ['い(う)', 'こと'], [['言う', 'いう', 'decir'], ['言葉', 'ことば', 'palabra']]),
  k('買', 'comprar', ['バイ'], ['か(う)'], [['買う', 'かう', 'comprar'], ['買い物', 'かいもの', 'compras']]),
  k('立', 'ponerse de pie', ['リツ'], ['た(つ)'], [['立つ', 'たつ', 'pararse'], ['国立', 'こくりつ', 'nacional']]),
]

/** Todos los kanji del curso: N5 y luego N4. */
export const kanjiList: Kanji[] = [...kanjiN5, ...kanjiN4]

export const kanjiByChar = new Map(kanjiList.map((kj) => [kj.char, kj]))

const lesson = (id: string, title: string, unit: string, chars: string): KanjiLesson => ({ id: `kanji-${id}`, title, unit, chars: [...chars] })

const kanjiLessonsN5: KanjiLesson[] = [
  lesson('num-1', 'Números del 1 al 5', 'Números', '一二三四五'),
  lesson('num-2', 'Números del 6 al 10', 'Números', '六七八九十'),
  lesson('num-3', 'Cien, mil, diez mil y yen', 'Números', '百千万円'),
  lesson('tiempo-1', 'Los días de la semana', 'Tiempo', '日月火水木金土'),
  lesson('tiempo-2', 'Año, hora y minutos', 'Tiempo', '年時分半今'),
  lesson('tiempo-3', 'Antes, después y cada', 'Tiempo', '午前後週毎'),
  lesson('personas-1', 'Personas y familia', 'Personas', '人男女子父母'),
  lesson('personas-2', 'Amigos y escuela', 'Personas', '友先生学校'),
  lesson('naturaleza', 'Naturaleza y clima', 'Naturaleza y lugares', '山川天気雨'),
  lesson('posicion', 'Arriba, abajo y a los lados', 'Naturaleza y lugares', '上下中右左外'),
  lesson('puntos', 'Los puntos cardinales', 'Naturaleza y lugares', '東西南北'),
  lesson('naturaleza-2', 'Flores, animales, mañana y noche', 'Naturaleza y lugares', '花朝夜魚犬空'),
  lesson('adjetivos', 'Grande, pequeño, nuevo…', 'Adjetivos', '大小長高安新古'),
  lesson('adjetivos-2', 'Blanco, mucho, poco y entre', 'Adjetivos', '白多少間'),
  lesson('verbos-1', 'Ver, oír, comer, ir…', 'Verbos', '見聞食飲行来'),
  lesson('verbos-2', 'Salir, entrar, hablar…', 'Verbos', '出入休話読書'),
  lesson('cuerpo', 'Partes del cuerpo', 'Cuerpo y cosas', '口目耳手足'),
  lesson('cosas', 'Qué, libro, nombre, idioma y país', 'Cuerpo y cosas', '何本名語国'),
  lesson('ciudad', 'Transporte y ciudad', 'Ciudad y trabajo', '電車駅道店'),
  lesson('trabajo', 'Empresa, decir, comprar…', 'Ciudad y trabajo', '会社言買立'),
]

/** Lecciones en orden: las del N4 siguen a las del N5 (cada una abre la siguiente). */
export const kanjiLessons: KanjiLesson[] = [...kanjiLessonsN5, ...kanjiLessonsN4]
