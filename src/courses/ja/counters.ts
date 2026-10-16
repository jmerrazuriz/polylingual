// Números y contadores del japonés. Las lecturas van en hiragana (índice = número);
// `irregular` marca los números cuya lectura cambia de sonido (いっぽん, さんぼん…).

export type Counter = {
  id: string
  /** Kanji del contador (se muestra con su lectura). */
  kanji: string
  reading: string
  /** Para qué se usa. */
  use: string
  /** Cosas que se cuentan con él (para los ejercicios «¿qué contador uso?»). */
  things: string[]
  /** Lecturas del 1 al 10 (posición 0 = 1). */
  readings: string[]
  /** Números (1–10) con lectura especial. */
  irregular: number[]
  /** «¿Cuántos?» con este contador. */
  question: string
  /** Lecturas extra fuera del 1–10 que conviene saber (p. ej. 20 años = はたち). */
  extra?: { label: string; reading: string }[]
  examples: { text: string; reading: string; meaning: string }[]
}

export type CounterLesson = {
  id: string
  title: string
  summary: string
  explanation: string[]
  /** Contadores que enseña (vacío en las lecciones de números). */
  counters: string[]
}

/** Números del 1 al 10 (con sus lecturas alternativas). */
export const numbers: { value: number; kanji: string; readings: string[] }[] = [
  { value: 1, kanji: '一', readings: ['いち'] },
  { value: 2, kanji: '二', readings: ['に'] },
  { value: 3, kanji: '三', readings: ['さん'] },
  { value: 4, kanji: '四', readings: ['よん', 'し'] },
  { value: 5, kanji: '五', readings: ['ご'] },
  { value: 6, kanji: '六', readings: ['ろく'] },
  { value: 7, kanji: '七', readings: ['なな', 'しち'] },
  { value: 8, kanji: '八', readings: ['はち'] },
  { value: 9, kanji: '九', readings: ['きゅう', 'く'] },
  { value: 10, kanji: '十', readings: ['じゅう'] },
]

/** Números grandes con lectura especial que conviene memorizar. */
export const bigNumbers: { value: number; text: string; reading: string; irregular?: boolean }[] = [
  { value: 11, text: '十一', reading: 'じゅういち' },
  { value: 20, text: '二十', reading: 'にじゅう' },
  { value: 35, text: '三十五', reading: 'さんじゅうご' },
  { value: 100, text: '百', reading: 'ひゃく' },
  { value: 300, text: '三百', reading: 'さんびゃく', irregular: true },
  { value: 600, text: '六百', reading: 'ろっぴゃく', irregular: true },
  { value: 800, text: '八百', reading: 'はっぴゃく', irregular: true },
  { value: 1000, text: '千', reading: 'せん' },
  { value: 3000, text: '三千', reading: 'さんぜん', irregular: true },
  { value: 8000, text: '八千', reading: 'はっせん', irregular: true },
  { value: 10000, text: '一万', reading: 'いちまん' },
]

export const counters: Counter[] = [
  {
    id: 'tsu',
    kanji: 'つ',
    reading: 'つ',
    use: 'Cosas en general, cuando no sabes qué contador usar (solo del 1 al 10).',
    things: ['manzanas', 'preguntas', 'cajas'],
    readings: ['ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお'],
    irregular: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    question: 'いくつ',
    examples: [
      { text: 'りんごを みっつ ください。', reading: 'ringo o mittsu kudasai.', meaning: 'Tres manzanas, por favor.' },
      { text: 'しつもんが ふたつ あります。', reading: 'shitsumon ga futatsu arimasu.', meaning: 'Tengo dos preguntas.' },
    ],
  },
  {
    id: 'nin',
    kanji: '人',
    reading: 'にん',
    use: 'Personas.',
    things: ['personas', 'estudiantes', 'amigos'],
    readings: ['ひとり', 'ふたり', 'さんにん', 'よにん', 'ごにん', 'ろくにん', 'ななにん', 'はちにん', 'きゅうにん', 'じゅうにん'],
    irregular: [1, 2, 4],
    question: 'なんにん',
    examples: [
      { text: 'かぞくは よにん です。', reading: 'kazoku wa yonin desu.', meaning: 'Mi familia somos cuatro.' },
      { text: 'ともだちが ふたり きます。', reading: 'tomodachi ga futari kimasu.', meaning: 'Vienen dos amigos.' },
    ],
  },
  {
    id: 'hon',
    kanji: '本',
    reading: 'ほん',
    use: 'Cosas largas y delgadas: lápices, botellas, paraguas, árboles.',
    things: ['lápices', 'botellas', 'paraguas'],
    readings: ['いっぽん', 'にほん', 'さんぼん', 'よんほん', 'ごほん', 'ろっぽん', 'ななほん', 'はっぽん', 'きゅうほん', 'じゅっぽん'],
    irregular: [1, 3, 6, 8, 10],
    question: 'なんぼん',
    examples: [
      { text: 'えんぴつが さんぼん あります。', reading: 'enpitsu ga sanbon arimasu.', meaning: 'Hay tres lápices.' },
      { text: 'ビールを いっぽん ください。', reading: 'biiru o ippon kudasai.', meaning: 'Una botella de cerveza, por favor.' },
    ],
  },
  {
    id: 'mai',
    kanji: '枚',
    reading: 'まい',
    use: 'Cosas planas y delgadas: hojas, camisas, entradas, fotos.',
    things: ['hojas de papel', 'camisas', 'entradas'],
    readings: ['いちまい', 'にまい', 'さんまい', 'よんまい', 'ごまい', 'ろくまい', 'ななまい', 'はちまい', 'きゅうまい', 'じゅうまい'],
    irregular: [],
    question: 'なんまい',
    examples: [
      { text: 'かみを にまい ください。', reading: 'kami o nimai kudasai.', meaning: 'Dos hojas de papel, por favor.' },
      { text: 'シャツを ごまい かいました。', reading: 'shatsu o gomai kaimashita.', meaning: 'Compré cinco camisas.' },
    ],
  },
  {
    id: 'hiki',
    kanji: '匹',
    reading: 'ひき',
    use: 'Animales pequeños: gatos, perros, peces, insectos.',
    things: ['gatos', 'peces', 'insectos'],
    readings: ['いっぴき', 'にひき', 'さんびき', 'よんひき', 'ごひき', 'ろっぴき', 'ななひき', 'はっぴき', 'きゅうひき', 'じゅっぴき'],
    irregular: [1, 3, 6, 8, 10],
    question: 'なんびき',
    examples: [
      { text: 'ねこが さんびき います。', reading: 'neko ga sanbiki imasu.', meaning: 'Hay tres gatos.' },
      { text: 'さかなを いっぴき かいました。', reading: 'sakana o ippiki kaimashita.', meaning: 'Compré un pescado.' },
    ],
  },
  {
    id: 'ko',
    kanji: '個',
    reading: 'こ',
    use: 'Objetos pequeños y compactos: huevos, caramelos, piedras.',
    things: ['huevos', 'caramelos', 'piedras'],
    readings: ['いっこ', 'にこ', 'さんこ', 'よんこ', 'ごこ', 'ろっこ', 'ななこ', 'はっこ', 'きゅうこ', 'じゅっこ'],
    irregular: [1, 6, 8, 10],
    question: 'なんこ',
    examples: [
      { text: 'たまごを ろっこ かいます。', reading: 'tamago o rokko kaimasu.', meaning: 'Compro seis huevos.' },
      { text: 'あめを いっこ どうぞ。', reading: 'ame o ikko douzo.', meaning: 'Toma un caramelo.' },
    ],
  },
  {
    id: 'satsu',
    kanji: '冊',
    reading: 'さつ',
    use: 'Libros, cuadernos y revistas.',
    things: ['libros', 'cuadernos', 'revistas'],
    readings: ['いっさつ', 'にさつ', 'さんさつ', 'よんさつ', 'ごさつ', 'ろくさつ', 'ななさつ', 'はっさつ', 'きゅうさつ', 'じゅっさつ'],
    irregular: [1, 8, 10],
    question: 'なんさつ',
    examples: [{ text: 'ほんを いっさつ よみました。', reading: 'hon o issatsu yomimashita.', meaning: 'Leí un libro.' }],
  },
  {
    id: 'dai',
    kanji: '台',
    reading: 'だい',
    use: 'Máquinas y vehículos: autos, bicicletas, computadores.',
    things: ['autos', 'bicicletas', 'computadores'],
    readings: ['いちだい', 'にだい', 'さんだい', 'よんだい', 'ごだい', 'ろくだい', 'ななだい', 'はちだい', 'きゅうだい', 'じゅうだい'],
    irregular: [],
    question: 'なんだい',
    examples: [{ text: 'くるまが にだい あります。', reading: 'kuruma ga nidai arimasu.', meaning: 'Hay dos autos.' }],
  },
  {
    id: 'hai',
    kanji: '杯',
    reading: 'はい',
    use: 'Vasos, tazas y tazones (lo que contienen).',
    things: ['vasos de agua', 'tazas de café', 'tazones de arroz'],
    readings: ['いっぱい', 'にはい', 'さんばい', 'よんはい', 'ごはい', 'ろっぱい', 'ななはい', 'はっぱい', 'きゅうはい', 'じゅっぱい'],
    irregular: [1, 3, 6, 8, 10],
    question: 'なんばい',
    examples: [{ text: 'コーヒーを にはい のみました。', reading: 'koohii o nihai nomimashita.', meaning: 'Tomé dos tazas de café.' }],
  },
  {
    id: 'ji',
    kanji: '時',
    reading: 'じ',
    use: 'La hora del reloj.',
    things: ['la hora'],
    readings: ['いちじ', 'にじ', 'さんじ', 'よじ', 'ごじ', 'ろくじ', 'しちじ', 'はちじ', 'くじ', 'じゅうじ'],
    irregular: [4, 7, 9],
    question: 'なんじ',
    extra: [
      { label: '11', reading: 'じゅういちじ' },
      { label: '12', reading: 'じゅうにじ' },
      { label: 'y media', reading: '〜じはん' },
    ],
    examples: [{ text: 'いま、 くじ です。', reading: 'ima, kuji desu.', meaning: 'Ahora son las nueve.' }],
  },
  {
    id: 'fun',
    kanji: '分',
    reading: 'ふん',
    use: 'Minutos.',
    things: ['minutos'],
    readings: ['いっぷん', 'にふん', 'さんぷん', 'よんぷん', 'ごふん', 'ろっぷん', 'ななふん', 'はっぷん', 'きゅうふん', 'じゅっぷん'],
    irregular: [1, 3, 4, 6, 8, 10],
    question: 'なんぷん',
    examples: [{ text: 'えきまで ごふん です。', reading: 'eki made gofun desu.', meaning: 'Son cinco minutos hasta la estación.' }],
  },
  {
    id: 'gatsu',
    kanji: '月',
    reading: 'がつ',
    use: 'Los meses del año (1 = enero).',
    things: ['meses del año'],
    readings: ['いちがつ', 'にがつ', 'さんがつ', 'しがつ', 'ごがつ', 'ろくがつ', 'しちがつ', 'はちがつ', 'くがつ', 'じゅうがつ'],
    irregular: [4, 7, 9],
    question: 'なんがつ',
    extra: [
      { label: '11', reading: 'じゅういちがつ' },
      { label: '12', reading: 'じゅうにがつ' },
    ],
    examples: [{ text: 'たんじょうびは しがつ です。', reading: 'tanjoubi wa shigatsu desu.', meaning: 'Mi cumpleaños es en abril.' }],
  },
  {
    id: 'nichi',
    kanji: '日',
    reading: 'にち',
    use: 'Días del mes. Del 1 al 10 (y el 20) tienen lecturas propias.',
    things: ['días del mes'],
    readings: ['ついたち', 'ふつか', 'みっか', 'よっか', 'いつか', 'むいか', 'なのか', 'ようか', 'ここのか', 'とおか'],
    irregular: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    question: 'なんにち',
    extra: [
      { label: '14', reading: 'じゅうよっか' },
      { label: '20', reading: 'はつか' },
      { label: '24', reading: 'にじゅうよっか' },
    ],
    examples: [{ text: 'がっこうは ようか から です。', reading: 'gakkou wa youka kara desu.', meaning: 'Las clases empiezan el día 8.' }],
  },
  {
    id: 'sai',
    kanji: '歳',
    reading: 'さい',
    use: 'La edad.',
    things: ['años de edad'],
    readings: ['いっさい', 'にさい', 'さんさい', 'よんさい', 'ごさい', 'ろくさい', 'ななさい', 'はっさい', 'きゅうさい', 'じゅっさい'],
    irregular: [1, 8, 10],
    question: 'なんさい',
    extra: [{ label: '20', reading: 'はたち' }],
    examples: [{ text: 'おとうとは はっさい です。', reading: 'otouto wa hassai desu.', meaning: 'Mi hermano menor tiene ocho años.' }],
  },
  {
    id: 'kai',
    kanji: '回',
    reading: 'かい',
    use: 'Veces que pasa algo.',
    things: ['veces'],
    readings: ['いっかい', 'にかい', 'さんかい', 'よんかい', 'ごかい', 'ろっかい', 'ななかい', 'はっかい', 'きゅうかい', 'じゅっかい'],
    irregular: [1, 6, 8, 10],
    question: 'なんかい',
    examples: [{ text: 'にほんへ にかい いきました。', reading: 'nihon e nikai ikimashita.', meaning: 'Fui a Japón dos veces.' }],
  },
  {
    id: 'en',
    kanji: '円',
    reading: 'えん',
    use: 'Yenes, la moneda de Japón.',
    things: ['yenes'],
    readings: ['いちえん', 'にえん', 'さんえん', 'よえん', 'ごえん', 'ろくえん', 'ななえん', 'はちえん', 'きゅうえん', 'じゅうえん'],
    irregular: [4],
    question: 'いくら',
    extra: [
      { label: '100', reading: 'ひゃくえん' },
      { label: '1000', reading: 'せんえん' },
    ],
    examples: [{ text: 'これは ひゃくえん です。', reading: 'kore wa hyakuen desu.', meaning: 'Esto cuesta cien yenes.' }],
  },
]

export const counterById = new Map(counters.map((c) => [c.id, c]))

export const counterLessons: CounterLesson[] = [
  {
    id: 'cont-numeros',
    title: 'Números del 1 al 10',
    summary: 'La base para contar todo.',
    explanation: [
      'Los números japoneses son muy regulares. Solo hay que fijarse en tres: el 4 (**よん** o **し**), el 7 (**なな** o **しち**) y el 9 (**きゅう** o **く**).',
      'Se prefiere よん, なな y きゅう, porque し suena como «muerte» y く como «sufrimiento». Las otras lecturas aparecen en meses y horas.',
    ],
    counters: [],
  },
  {
    id: 'cont-grandes',
    title: 'Números grandes',
    summary: 'Decenas, cientos, miles y diez mil.',
    explanation: [
      'Se arman como piezas: 35 es **さんじゅうご** (3 × 10 + 5). 百 es cien, 千 es mil y **万** es diez mil: en japonés se agrupa de 4 en 4 cifras.',
      'Ojo con los cambios de sonido: 300 **さんびゃく**, 600 **ろっぴゃく**, 800 **はっぴゃく**, 3000 **さんぜん** y 8000 **はっせん**.',
    ],
    counters: [],
  },
  {
    id: 'cont-tsu-nin',
    title: 'つ y 人: cosas y personas',
    summary: 'El contador comodín y el de personas.',
    explanation: [
      'En japonés no se dice «tres gatos» con el número solo: se agrega un **contador** según el tipo de cosa. Va después del número: さん + びき.',
      '**つ** sirve para casi cualquier cosa (hasta 10) y tiene lecturas propias: ひとつ, ふたつ, みっつ… Para personas se usa **人**: ojo con ひとり, ふたり y よにん.',
    ],
    counters: ['tsu', 'nin'],
  },
  {
    id: 'cont-hon-mai',
    title: '本 y 枚: largo y plano',
    summary: 'Lápices, botellas, hojas y camisas.',
    explanation: [
      '**本** cuenta cosas largas y delgadas. Cambia de sonido: いっぽん, さんぼん, ろっぽん, はっぽん, じゅっぽん.',
      '**枚** cuenta cosas planas y delgadas, y es totalmente regular: いちまい, にまい, さんまい…',
    ],
    counters: ['hon', 'mai'],
  },
  {
    id: 'cont-hiki-ko',
    title: '匹 y 個: animales y objetos pequeños',
    summary: 'Gatos, peces, huevos y caramelos.',
    explanation: [
      '**匹** cuenta animales pequeños y cambia igual que 本: いっぴき, さんびき, ろっぴき, はっぴき, じゅっぴき.',
      '**個** cuenta objetos pequeños y compactos: いっこ, ろっこ, はっこ, じゅっこ.',
    ],
    counters: ['hiki', 'ko'],
  },
  {
    id: 'cont-satsu-dai-hai',
    title: '冊, 台 y 杯',
    summary: 'Libros, vehículos y vasos.',
    explanation: [
      '**冊** cuenta libros y cuadernos; **台** cuenta máquinas y vehículos (regular); **杯** cuenta vasos y tazas, y cambia como 本: いっぱい, さんばい, ろっぱい.',
      'Una pista: cuando el contador empieza con h, el 1, 6, 8 y 10 suelen cambiar a «pp» y el 3 a «b».',
    ],
    counters: ['satsu', 'dai', 'hai'],
  },
  {
    id: 'cont-hora',
    title: 'La hora: 時 y 分',
    summary: '¿Qué hora es?',
    explanation: [
      '**時** es la hora: ojo con よじ (4), しちじ (7) y くじ (9). «Y media» es はん: さんじはん.',
      '**分** son los minutos y cambia mucho: いっぷん, さんぷん, よんぷん, ろっぷん, はっぷん, じゅっぷん.',
    ],
    counters: ['ji', 'fun'],
  },
  {
    id: 'cont-fechas',
    title: 'Fechas: 月 y 日',
    summary: 'Meses y días del mes.',
    explanation: [
      'Los meses son número + **がつ**: いちがつ (enero)… con しがつ (abril), しちがつ (julio) y くがつ (septiembre).',
      'Los días del 1 al 10 tienen nombres propios: ついたち, ふつか, みっか… Del 11 en adelante son número + にち, salvo 14 (じゅうよっか), 20 (はつか) y 24 (にじゅうよっか).',
    ],
    counters: ['gatsu', 'nichi'],
  },
  {
    id: 'cont-edad-veces',
    title: 'Edad, veces y yenes',
    summary: '歳, 回 y 円.',
    explanation: [
      '**歳** es la edad: いっさい, はっさい, じゅっさい, y 20 años tiene su propia palabra: **はたち**.',
      '**回** cuenta veces (いっかい, ろっかい…) y **円** son los yenes; ojo con 4 yenes: **よえん**.',
    ],
    counters: ['sai', 'kai', 'en'],
  },
]
