// Kanji del nivel N5 (el primero del examen JLPT), agrupados en lecciones.
// on: lectura china (en katakana) · kun: lectura japonesa (en hiragana; entre
// paréntesis va el okurigana, la parte que se escribe en kana: た(べる) → 食べる).

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

export const kanjiList: Kanji[] = [
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
]

export const kanjiByChar = new Map(kanjiList.map((kj) => [kj.char, kj]))

const lesson = (id: string, title: string, unit: string, chars: string): KanjiLesson => ({ id: `kanji-${id}`, title, unit, chars: [...chars] })

export const kanjiLessons: KanjiLesson[] = [
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
  lesson('adjetivos', 'Grande, pequeño, nuevo…', 'Adjetivos', '大小長高安新古'),
  lesson('verbos-1', 'Ver, oír, comer, ir…', 'Verbos', '見聞食飲行来'),
  lesson('verbos-2', 'Salir, entrar, hablar…', 'Verbos', '出入休話読書'),
]
