import type { GrammarLesson } from '../grammar.ts'

// Gramática N3, tercera tanda (etapa C2b): expectativas, concesiones, causas, estados y
// matices de la conversación. Con ejercicios de paráfrasis y uso como el JLPT.
// Kanji con furigana, solo de los que enseña el curso.

export const grammarN3c: GrammarLesson[] = [
  {
    id: 'hazu-datta',
    level: 'N3',
    title: 'はずだった: se suponía que',
    summary: 'Se suponía que llegaba hoy, pero…',
    pattern: '〜 はずだった · 〜 はずじゃ なかった',
    explanation: [
      '**はずだった** = «**se suponía que…**», algo que se esperaba pero no ocurrió: にもつは きのう 届[とど]く はずだった (el paquete debía llegar ayer).',
      'En negativo, **はずじゃ なかった** expresa sorpresa o arrepentimiento: こんなに 高[たか]い はずじゃ なかった (no se suponía que fuera tan caro).',
    ],
    examples: [
      { text: '電車[でんしゃ]は 七時[しちじ]に 着[つ]く はずだったが、 一時間[いちじかん] 遅[おく]れた。', reading: 'densha wa shichiji ni tsuku hazu datta ga, ichijikan okureta.', meaning: 'El tren debía llegar a las siete, pero se atrasó una hora.' },
      { text: '今日[きょう]は 休[やす]みの はずだったのに、 仕事[しごと]に よばれた。', reading: 'kyou wa yasumi no hazu datta noni, shigoto ni yobareta.', meaning: 'Hoy se suponía que era mi día libre, y aun así me llamaron al trabajo.' },
      { text: 'こんな 結果[けっか]に なる はずじゃ なかった。', reading: 'konna kekka ni naru hazu ja nakatta.', meaning: 'No se suponía que terminara así.' },
    ],
    exercises: [
      { type: 'choice', prompt: '友[とも]だちが 来[く]る ＿ だったが、 来[こ]なかった。', hint: 'Se suponía que venía mi amigo, pero no vino.', options: ['はず', 'わけ', 'こと', 'もの'], answer: 'はず' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'かいぎは 三時[さんじ]に 終[お]わる はずだった。',
        options: ['かいぎは 三時[さんじ]に 終[お]わる 予定[よてい]だったが、 終[お]わらなかった。', 'かいぎは 三時[さんじ]に 終[お]わった。', 'かいぎは 三時[さんじ]に 始[はじ]まる。', 'かいぎは 三時[さんじ]まで ない。'],
        answer: 'かいぎは 三時[さんじ]に 終[お]わる 予定[よてい]だったが、 終[お]わらなかった。',
      },
      { type: 'meaning', text: 'こんなに 忙[いそが]しく なる はずじゃ なかった。', options: ['No se suponía que iba a estar tan ocupado.', 'Sabía que iba a estar ocupado.', 'Debería estar más ocupado.', 'No estoy ocupado.'], answer: 'No se suponía que iba a estar tan ocupado.' },
    ],
  },
  {
    id: 'koto-ni-natte-iru',
    level: 'N3',
    title: 'ことになっている: así está establecido',
    summary: 'Por regla, aquí no se fuma.',
    pattern: '[dicc./ない] ことに なって いる',
    explanation: [
      '**ことに なって いる** describe una **regla, costumbre o plan ya establecido** por otros: この 学校[がっこう]では、 くつを ぬぐ ことに なって います (en esta escuela se acostumbra quitarse los zapatos).',
      'Se diferencia de **ことに なった** (N4), que cuenta que algo se decidió: ことに なって いる es el estado que resulta, lo que «está estipulado».',
    ],
    examples: [
      { text: '会社[かいしゃ]では、 休[やす]む ときは 朝[あさ] 連絡[れんらく]する ことに なって いる。', reading: 'kaisha de wa, yasumu toki wa asa renraku suru koto ni natte iru.', meaning: 'En la empresa, cuando faltas, hay que avisar en la mañana.' },
      { text: 'この 部屋[へや]では 食[た]べない ことに なって います。', reading: 'kono heya de wa tabenai koto ni natte imasu.', meaning: 'En esta sala no se come (es la regla).' },
      { text: '来週[らいしゅう] 先生[せんせい]に 会[あ]う ことに なって います。', reading: 'raishuu sensei ni au koto ni natte imasu.', meaning: 'Está acordado que me reúna con el profesor la próxima semana.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'この りょうでは、 夜[よる] 十時[じゅうじ]までに 帰[かえ]る ＿ なって いる。', hint: 'En este dormitorio hay que volver antes de las diez (regla).', options: ['ことに', 'ように', 'ために', 'はずに'], answer: 'ことに' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'ここでは くつを ぬぐ ことに なって います。',
        options: ['ここでは くつを ぬぐ きまりです。', 'ここで くつを ぬいだ ことが あります。', 'ここでは くつを ぬいでも いいです。', 'ここで くつを ぬぎたいです。'],
        answer: 'ここでは くつを ぬぐ きまりです。',
      },
      { type: 'meaning', text: 'あしたは 九時[くじ]に 集[あつ]まる ことに なって いる。', options: ['Está acordado reunirnos mañana a las nueve.', 'Decidí reunirme mañana a las nueve.', 'No sé si nos reunimos mañana.', 'Nos reunimos ayer a las nueve.'], answer: 'Está acordado reunirnos mañana a las nueve.' },
    ],
  },
  {
    id: 'mono-no',
    level: 'N3',
    title: 'ものの: aunque, si bien',
    summary: 'Aunque lo compré, no lo uso.',
    pattern: '[informal] ものの、 〜',
    explanation: [
      '**ものの** = «**aunque, si bien**»: se acepta un hecho, pero lo que sigue no es lo esperado: 本[ほん]を 買[か]った ものの、 まだ 読[よ]んで いない (aunque compré el libro, todavía no lo leo).',
      'Es más escrito que のに o けど y no lleva queja. Con adjetivos な: **な ものの**.',
    ],
    examples: [
      { text: '日本語[にほんご]を 習[なら]って いる ものの、 まだ うまく 話[はな]せない。', reading: 'nihongo o naratte iru mono no, mada umaku hanasenai.', meaning: 'Aunque estudio japonés, todavía no lo hablo bien.' },
      { text: '早[はや]く 起[お]きる つもりだった ものの、 また 寝[ね]て しまった。', reading: 'hayaku okiru tsumori datta mono no, mata nete shimatta.', meaning: 'Si bien pensaba levantarme temprano, me volví a quedar dormido.' },
      { text: '便利[べんり]な ものの、 高[たか]くて 買[か]えない。', reading: 'benri na mono no, takakute kaenai.', meaning: 'Aunque es práctico, es caro y no lo puedo comprar.' },
    ],
    exercises: [
      { type: 'choice', prompt: '約束[やくそく]は した ＿、 行[い]けるか わからない。', hint: 'Si bien lo prometí, no sé si podré ir.', options: ['ものの', 'ので', 'から', 'ために'], answer: 'ものの' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'ジムに 入[はい]った ものの、 一度[いちど]も 行[い]って いない。',
        options: ['ジムに 入[はい]ったが、 一度[いちど]も 行[い]って いない。', 'ジムに 入[はい]ったので、 毎日[まいにち] 行[い]って いる。', 'ジムに 入[はい]る 前[まえ]に 一度[いちど] 行[い]った。', 'ジムに 入[はい]りたいが、 まだ 入[はい]って いない。'],
        answer: 'ジムに 入[はい]ったが、 一度[いちど]も 行[い]って いない。',
      },
      { type: 'meaning', text: '仕事[しごと]は 楽[たの]しい ものの、 給料[きゅうりょう]が 安[やす]い。', options: ['Aunque el trabajo es entretenido, el sueldo es bajo.', 'Como el trabajo es entretenido, el sueldo es alto.', 'El trabajo es aburrido y mal pagado.', 'El sueldo es bueno porque el trabajo es entretenido.'], answer: 'Aunque el trabajo es entretenido, el sueldo es bajo.' },
    ],
  },
  {
    id: 'ni-shite-wa',
    level: 'N3',
    title: 'にしては: para ser…',
    summary: 'Para ser principiante, lo hace muy bien.',
    pattern: '[sust./informal] に しては',
    explanation: [
      '**にしては** = «**para ser…**»: el resultado es distinto de lo que se esperaría de esa persona o cosa: 初[はじ]めて に しては、 上手[じょうず]だ (para ser la primera vez, está bien hecho).',
      'Es parecido a **わりに**, pero にしては se usa con algo concreto (una persona, una situación), no con grados: 子[こ]どもに しては 背[せ]が 高[たか]い.',
    ],
    examples: [
      { text: '外国人[がいこくじん]に しては、 漢字[かんじ]を よく 知[し]って いますね。', reading: 'gaikokujin ni shite wa, kanji o yoku shitte imasu ne.', meaning: 'Para ser extranjero, sabes muchos kanji.' },
      { text: '十月[じゅうがつ]に しては 暑[あつ]い 日[ひ]だ。', reading: 'juugatsu ni shite wa atsui hi da.', meaning: 'Para ser octubre, es un día caluroso.' },
      { text: '一時間[いちじかん]で 作[つく]った に しては、 おいしい。', reading: 'ichijikan de tsukutta ni shite wa, oishii.', meaning: 'Para haberlo hecho en una hora, está rico.' },
    ],
    exercises: [
      { type: 'choice', prompt: '初[はじ]めて ＿ しては、 よく できました。', hint: 'Para ser la primera vez, te salió bien.', options: ['に', 'と', 'で', 'が'], answer: 'に' },
      {
        type: 'choice',
        format: 'usage',
        prompt: '«にしては» — ¿en qué frase se usa bien?',
        options: ['この レストランは 駅前[えきまえ]に しては 安[やす]い。', '雨[あめ]に しては、 かさを 持[も]って いく。', '明日[あした]に しては 早[はや]く 起[お]きる。', '日本語[にほんご]に しては 勉強[べんきょう]します。'],
        answer: 'この レストランは 駅前[えきまえ]に しては 安[やす]い。',
        explanation: 'にしては compara con lo que se esperaría: frente a la estación suele ser caro.',
      },
      { type: 'meaning', text: 'かれは 学生[がくせい]に しては、 お金[かね]を 持[も]って いる。', options: ['Para ser estudiante, él tiene dinero.', 'Como es estudiante, no tiene dinero.', 'Él le da dinero a los estudiantes.', 'Él es un estudiante con deudas.'], answer: 'Para ser estudiante, él tiene dinero.' },
    ],
  },
  {
    id: 'kara-ni-wa',
    level: 'N3',
    title: 'からには: ya que, puesto que',
    summary: 'Ya que lo prometí, lo cumplo.',
    pattern: '[informal] からには、 〜',
    explanation: [
      '**からには** = «**ya que, puesto que**»: como se dio cierta situación, uno debe o quiere llegar hasta el final: やると 決[き]めた からには、 最後[さいご]まで がんばる (ya que decidí hacerlo, me esforzaré hasta el final).',
      'Después suele venir una obligación, una decisión o un deseo fuerte (べきだ, つもりだ, たい, なければならない).',
    ],
    examples: [
      { text: '日本[にほん]に 来[き]た からには、 日本語[にほんご]を しっかり 勉強[べんきょう]したい。', reading: 'nihon ni kita kara ni wa, nihongo o shikkari benkyou shitai.', meaning: 'Ya que vine a Japón, quiero estudiar japonés en serio.' },
      { text: '約束[やくそく]した からには、 まもらなければ ならない。', reading: 'yakusoku shita kara ni wa, mamoranakereba naranai.', meaning: 'Ya que lo prometí, tengo que cumplirlo.' },
      { text: 'しあいに 出[で]る からには、 勝[か]ちたい。', reading: 'shiai ni deru kara ni wa, kachitai.', meaning: 'Ya que voy a jugar el partido, quiero ganar.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'はじめた ＿、 最後[さいご]まで やる つもりだ。', hint: 'Ya que empecé, pienso hacerlo hasta el final.', options: ['からには', 'ものの', 'わりに', 'くせに'], answer: 'からには' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '学生[がくせい]である からには、 勉強[べんきょう]する べきだ。',
        options: ['学生[がくせい]なのだから、 勉強[べんきょう]しなければ ならない。', '学生[がくせい]なのに、 勉強[べんきょう]しない。', '学生[がくせい]だったら、 勉強[べんきょう]しても いい。', '学生[がくせい]の ころ、 よく 勉強[べんきょう]した。'],
        answer: '学生[がくせい]なのだから、 勉強[べんきょう]しなければ ならない。',
      },
      { type: 'meaning', text: 'ひきうけた からには、 ちゃんと やります。', options: ['Ya que lo acepté, lo haré bien.', 'Lo acepté, pero no lo haré.', 'No quiero aceptarlo.', 'Lo hice antes de aceptarlo.'], answer: 'Ya que lo acepté, lo haré bien.' },
    ],
  },
  {
    id: 'bakari-ka',
    level: 'N3',
    title: 'ばかりか: no solo… sino que además',
    summary: 'No solo no me ayudó, sino que encima se rió.',
    pattern: 'A ばかりか B (も)',
    explanation: [
      '**ばかりか** = «**no solo A, sino que (incluso) B**», con B más sorprendente que A: かれは 英語[えいご]ばかりか、 中国語[ちゅうごくご]も 話[はな]せる.',
      'Es más fuerte y escrito que **だけでなく**. Muchas veces B es algo negativo e inesperado: 手[て]つだって くれない ばかりか、 じゃまを する (no solo no ayuda, sino que encima molesta).',
    ],
    examples: [
      { text: '弟[おとうと]は 宿題[しゅくだい]を しない ばかりか、 学校[がっこう]も 休[やす]んだ。', reading: 'otouto wa shukudai o shinai bakari ka, gakkou mo yasunda.', meaning: 'Mi hermano no solo no hizo la tarea, sino que además faltó al colegio.' },
      { text: 'あの 店[みせ]は 安[やす]い ばかりか、 店員[てんいん]も しんせつだ。', reading: 'ano mise wa yasui bakari ka, ten-in mo shinsetsu da.', meaning: 'Esa tienda no solo es barata, sino que además los dependientes son amables.' },
      { text: '雨[あめ]ばかりか、 風[かぜ]も 強[つよ]く なって きた。', reading: 'ame bakari ka, kaze mo tsuyoku natte kita.', meaning: 'No solo llueve, sino que también el viento se puso fuerte.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'かれは 歌[うた] ＿、 ダンスも 上手[じょうず]だ。', hint: 'Él no solo canta bien, también baila bien.', options: ['ばかりか', 'ばかり', 'しか', 'からには'], answer: 'ばかりか' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'この 部屋[へや]は せまい ばかりか、 暗[くら]い。',
        options: ['この 部屋[へや]は せまくて、 そのうえ 暗[くら]い。', 'この 部屋[へや]は せまいが、 明[あか]るい。', 'この 部屋[へや]は せまい だけだ。', 'この 部屋[へや]は 暗[くら]く ない。'],
        answer: 'この 部屋[へや]は せまくて、 そのうえ 暗[くら]い。',
      },
      { type: 'meaning', text: 'かれは 遅[おく]れた ばかりか、 あやまりも しなかった。', options: ['No solo llegó tarde, sino que ni siquiera se disculpó.', 'Llegó tarde y se disculpó.', 'Se disculpó por no llegar tarde.', 'No llegó tarde.'], answer: 'No solo llegó tarde, sino que ni siquiera se disculpó.' },
    ],
  },
  {
    id: 'toori',
    level: 'N3',
    title: 'とおり / どおり: tal como',
    summary: 'Tal como dijo el profesor · según lo planeado.',
    pattern: '[dicc./た] とおり(に) · [sust.] の とおり · [sust.] どおり',
    explanation: [
      '**とおり(に)** = «**tal como, de la misma forma que**»: 先生[せんせい]が 言[い]った とおりに やって ください (hágalo tal como dijo el profesor).',
      'Con sustantivos: **の とおり** (説明[せつめい]の とおり) o pegado como **どおり**: 予定[よてい]どおり (según lo previsto), 時間[じかん]どおり (a la hora exacta).',
    ],
    examples: [
      { text: '地図[ちず]の とおりに 行[い]ったら、 すぐ 見[み]つかった。', reading: 'chizu no toori ni ittara, sugu mitsukatta.', meaning: 'Fui tal como decía el mapa y lo encontré enseguida.' },
      { text: '思[おも]った とおり、 試験[しけん]は むずかしかった。', reading: 'omotta toori, shiken wa muzukashikatta.', meaning: 'Tal como pensaba, el examen fue difícil.' },
      { text: 'バスは 時間[じかん]どおりに 来[き]ました。', reading: 'basu wa jikan doori ni kimashita.', meaning: 'El bus llegó a la hora exacta.' },
    ],
    exercises: [
      { type: 'choice', prompt: '計画[けいかく] ＿ に 進[すす]んで います。', hint: 'Avanza según lo planeado.', options: ['どおり', 'ばかり', 'ほど', 'まま'], answer: 'どおり' },
      { type: 'choice', prompt: '私[わたし]が 言[い]う ＿ に 書[か]いて ください。', hint: 'Escriba tal como yo digo.', options: ['とおり', 'ほど', 'まで', 'ぐらい'], answer: 'とおり' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'テストは よそうどおりの 結果[けっか]だった。',
        options: ['テストは 思[おも]って いた 結果[けっか]と 同[おな]じだった。', 'テストは 思[おも]った より よかった。', 'テストは 思[おも]った より 悪[わる]かった。', 'テストの 結果[けっか]は まだ わからない。'],
        answer: 'テストは 思[おも]って いた 結果[けっか]と 同[おな]じだった。',
      },
    ],
  },
  {
    id: 'koto-kara',
    level: 'N3',
    title: 'ことから: por el hecho de que',
    summary: 'Se llama así porque…',
    pattern: '[informal] ことから',
    explanation: [
      '**ことから** explica el **origen o la razón** de un nombre, una deducción o un hecho, a partir de algo observable: ふじさんが 見[み]える ことから、 この 町[まち]は 「ふじみ」と よばれる. Se usa mucho al escribir.',
      'Con adjetivos な y sustantivos: **である ことから** o **な ことから**.',
    ],
    examples: [
      { text: '道[みち]が ぬれて いる ことから、 夜[よる]に 雨[あめ]が 降[ふ]ったと わかる。', reading: 'michi ga nurete iru koto kara, yoru ni ame ga futta to wakaru.', meaning: 'Por el hecho de que la calle está mojada, se sabe que llovió en la noche.' },
      { text: '形[かたち]が 星[ほし]に にて いる ことから、 その 名前[なまえ]が ついた。', reading: 'katachi ga hoshi ni nite iru koto kara, sono namae ga tsuita.', meaning: 'Como su forma se parece a una estrella, se le puso ese nombre.' },
      { text: '電気[でんき]が きえて いる ことから、 だれも いないようだ。', reading: 'denki ga kiete iru koto kara, daremo inai you da.', meaning: 'Como la luz está apagada, parece que no hay nadie.' },
    ],
    exercises: [
      { type: 'choice', prompt: '空[そら]が 暗[くら]く なった ＿、 雨[あめ]に なると 思[おも]った。', hint: 'Como el cielo se oscureció, pensé que llovería.', options: ['ことから', 'ことに', 'ものの', 'ばかりか'], answer: 'ことから' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '花[はな]が たくさん さく ことから、 「花[はな]の 町[まち]」と よばれて いる。',
        options: ['花[はな]が たくさん さくので、 「花[はな]の 町[まち]」と いう 名前[なまえ]だ。', '「花[はな]の 町[まち]」なのに、 花[はな]が ない。', '花[はな]が 好[す]きな 人[ひと]が 「花[はな]の 町[まち]」を 作[つく]った。', '花[はな]を 売[う]る 町[まち]だ。'],
        answer: '花[はな]が たくさん さくので、 「花[はな]の 町[まち]」と いう 名前[なまえ]だ。',
      },
      { type: 'meaning', text: 'くつが ある ことから、 かれは もう 帰[かえ]って いる。', options: ['Como están sus zapatos, él ya volvió.', 'Él volvió a buscar sus zapatos.', 'Sus zapatos no están, así que no volvió.', 'Él compró zapatos al volver.'], answer: 'Como están sus zapatos, él ya volvió.' },
    ],
  },
  {
    id: 'tatte',
    level: 'N3',
    title: 'たって / ても: aunque (informal)',
    summary: 'Aunque llores, no cambia nada.',
    pattern: '[た] って = [て] も · いくら 〜ても',
    explanation: [
      '**〜ても** (N4) significa «**aunque**». En la conversación se dice **〜たって**: 泣[な]いたって、 何[なに]も 変[か]わらない (aunque llores, nada cambia). Con adjetivos: 高[たか]くたって, 静[しず]かだって.',
      'Con **いくら** o palabras de pregunta se refuerza: いくら 言[い]っても わからない (por más que se lo diga, no entiende), 何[なに]を 食[た]べても おいしい (coma lo que coma, está rico).',
    ],
    examples: [
      { text: 'いくら 待[ま]っても、 バスが 来[こ]ない。', reading: 'ikura mattemo, basu ga konai.', meaning: 'Por más que espero, el bus no llega.' },
      { text: '今[いま]から 急[いそ]いだって、 間[ま]に合[あ]わないよ。', reading: 'ima kara isoidatte, maniawanai yo.', meaning: 'Aunque te apures ahora, no vas a llegar a tiempo.' },
      { text: 'だれに 聞[き]いても、 答[こた]えは 同[おな]じだった。', reading: 'dare ni kiitemo, kotae wa onaji datta.', meaning: 'Le preguntara a quien le preguntara, la respuesta era la misma.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'いくら 勉強[べんきょう]して ＿、 おぼえられない。', hint: 'Por más que estudio, no logro memorizarlo.', options: ['も', 'から', 'ので', 'ば'], answer: 'も' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '高[たか]くたって、 買[か]いたい。',
        options: ['高[たか]くても、 買[か]いたい。', '高[たか]いから、 買[か]いたい。', '高[たか]ければ、 買[か]わない。', '高[たか]かったので、 買[か]った。'],
        answer: '高[たか]くても、 買[か]いたい。',
      },
      { type: 'meaning', text: '何度[なんど] 電話[でんわ]したって、 出[で]ない。', options: ['Aunque lo llame muchas veces, no contesta.', 'Lo llamé muchas veces y contestó.', 'Llámalo muchas veces.', 'No lo he llamado.'], answer: 'Aunque lo llame muchas veces, no contesta.' },
    ],
  },
  {
    id: 'nante',
    level: 'N3',
    title: 'なんて: cosas como, qué…',
    summary: '¡Que pase algo así! · cosas como el examen…',
    pattern: '[sust./informal] なんて',
    explanation: [
      '**なんて** pone énfasis en algo con **sorpresa, desprecio o modestia**: 試験[しけん]なんて 大[だい]きらい (odio cosas como los exámenes). かれが 結婚[けっこん]する なんて、 びっくりした (¡que él se case! me sorprendió).',
      'También es la forma coloquial de **など** (cosas como) o de **なんと** (qué): なんて きれいな 景色[けしき]だろう (¡qué paisaje tan bonito!).',
    ],
    examples: [
      { text: 'こんな 所[ところ]で 会[あ]う なんて、 思[おも]わなかった。', reading: 'konna tokoro de au nante, omowanakatta.', meaning: 'No pensé que nos encontraríamos en un lugar así.' },
      { text: '私[わたし]なんて、 まだまだです。', reading: 'watashi nante, madamada desu.', meaning: 'Alguien como yo todavía tiene mucho que aprender.' },
      { text: 'なんて 静[しず]かな 夜[よる]だろう。', reading: 'nante shizuka na yoru darou.', meaning: '¡Qué noche tan tranquila!' },
    ],
    exercises: [
      { type: 'choice', prompt: '一人[ひとり]で 全部[ぜんぶ] 食[た]べた ＿、 すごいね。', hint: '¡Que te lo comieras todo solo! Increíble.', options: ['なんて', 'ばかり', 'ほど', 'こそ'], answer: 'なんて' },
      {
        type: 'choice',
        format: 'usage',
        prompt: '«なんて» — ¿en qué frase se usa bien?',
        options: ['あの 二人[ふたり]が けんかする なんて、 信[しん]じられない。', 'あしたは 雨[あめ]なんて 降[ふ]るでしょう。', 'なんて 時[じ]に 起[お]きますか。', '駅[えき]なんて 歩[ある]いて 五分[ごふん]です。'],
        answer: 'あの 二人[ふたり]が けんかする なんて、 信[しん]じられない。',
        explanation: 'なんて expresa sorpresa ante algo inesperado.',
      },
      { type: 'meaning', text: 'ゲームなんて、 子[こ]どもの あそびだ。', options: ['Cosas como los videojuegos son juego de niños.', 'Los videojuegos son para todos.', 'Los niños no juegan videojuegos.', 'Quiero jugar videojuegos con niños.'], answer: 'Cosas como los videojuegos son juego de niños.' },
    ],
  },
  {
    id: 'you-ga-nai',
    level: 'N3',
    title: 'ようがない: no hay manera de',
    summary: 'No hay forma de contactarlo.',
    pattern: '[raíz ます] ようが ない',
    explanation: [
      '**Raíz de ます + ようが ない** = «**no hay manera de**» hacer algo, porque falta un medio o información: 住所[じゅうしょ]が わからないので、 手[て]がみの 送[おく]りようが ない (como no sé la dirección, no hay forma de enviar la carta).',
      'Con verbos する de sustantivo: **〜の しようが ない** (連絡[れんらく]の しようが ない).',
    ],
    examples: [
      { text: '電話[でんわ]番号[ばんごう]を 知[し]らないので、 連絡[れんらく]の しようが ない。', reading: 'denwa bangou o shiranai node, renraku no shiyou ga nai.', meaning: 'Como no sé su número, no hay forma de contactarlo.' },
      { text: 'こんなに こわれて いたら、 なおしようが ない。', reading: 'konna ni kowarete itara, naoshiyou ga nai.', meaning: 'Si está así de roto, no hay manera de arreglarlo.' },
      { text: '何[なに]も 説明[せつめい]が ないので、 答[こた]えようが ありません。', reading: 'nanimo setsumei ga nai node, kotaeyou ga arimasen.', meaning: 'Como no hay ninguna explicación, no hay manera de responder.' },
    ],
    exercises: [
      { type: 'choice', prompt: '道[みち]が わからないので、 行[い]き ＿ が ない。', hint: 'Como no sé el camino, no hay forma de ir.', options: ['よう', 'そう', 'こと', 'もの'], answer: 'よう' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '名前[なまえ]も 知[し]らないので、 さがしようが ない。',
        options: ['名前[なまえ]も 知[し]らないので、 さがす ことが できない。', '名前[なまえ]を 知[し]って いるから、 さがせる。', '名前[なまえ]を さがして いる。', '名前[なまえ]は 知[し]らなくても いい。'],
        answer: '名前[なまえ]も 知[し]らないので、 さがす ことが できない。',
      },
      { type: 'meaning', text: 'お金[かね]が ないから、 買[か]いようが ない。', options: ['Como no tengo dinero, no hay forma de comprarlo.', 'Tengo dinero, pero no quiero comprar.', 'Lo compré sin dinero.', 'No sé qué comprar.'], answer: 'Como no tengo dinero, no hay forma de comprarlo.' },
    ],
  },
  {
    id: 'zu-ni',
    level: 'N3',
    title: 'ずに: sin hacer',
    summary: 'Salí sin desayunar.',
    pattern: '[ない sin ない] ずに = ないで',
    explanation: [
      '**ずに** = «**sin**» hacer algo; es la forma escrita de **ないで**. Se forma con la forma ない sin ない: 食[た]べない → 食[た]べ**ずに**, 行[い]かない → 行[い]か**ずに**.',
      'Excepción: する → **せずに** (勉強[べんきょう]せずに: sin estudiar).',
    ],
    examples: [
      { text: '朝[あさ]ご飯[はん]を 食[た]べずに 家[いえ]を 出[で]た。', reading: 'asagohan o tabezu ni ie o deta.', meaning: 'Salí de casa sin desayunar.' },
      { text: 'じしょを 使[つか]わずに 読[よ]めるように なりたい。', reading: 'jisho o tsukawazu ni yomeru you ni naritai.', meaning: 'Quiero poder leer sin usar el diccionario.' },
      { text: '勉強[べんきょう]せずに 試験[しけん]を うけた。', reading: 'benkyou sezu ni shiken o uketa.', meaning: 'Rendí el examen sin estudiar.' },
    ],
    exercises: [
      { type: 'type', prompt: '言[い]う → ずに (sin decir)', hint: 'forma ない sin ない + ずに', answers: ['いわずに'], kana: true },
      { type: 'type', prompt: 'する → ずに (sin hacer)', hint: 'excepción', answers: ['せずに'], kana: true, explanation: 'する → せずに.' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'かさを 持[も]たずに 出[で]かけた。',
        options: ['かさを 持[も]たないで 出[で]かけた。', 'かさを 持[も]って 出[で]かけた。', 'かさを 買[か]いに 出[で]かけた。', 'かさが ないので 出[で]かけなかった。'],
        answer: 'かさを 持[も]たないで 出[で]かけた。',
      },
    ],
  },
  {
    id: 'kke',
    level: 'N3',
    title: 'っけ: ¿cómo era…?',
    summary: '¿Cómo se llamaba? · ¿A qué hora era?',
    pattern: '〜 っけ',
    explanation: [
      '**っけ** al final de una pregunta indica que uno **intenta recordar** algo que ya sabía u oyó: あの 人[ひと]、 名前[なまえ]は 何[なん]だっけ (¿cómo se llamaba esa persona?).',
      'Es coloquial. Va después de **だ / た**: かいぎは 何時[なんじ]だっけ, もう 言[い]ったっけ (¿ya te lo dije?).',
    ],
    examples: [
      { text: '試験[しけん]は 来週[らいしゅう]の 何曜日[なんようび]だっけ。', reading: 'shiken wa raishuu no nanyoubi dakke.', meaning: '¿Qué día de la próxima semana era el examen?' },
      { text: 'この 話[はなし]、 前[まえ]に したっけ。', reading: 'kono hanashi, mae ni shitakke.', meaning: '¿Ya te había contado esto?' },
      { text: 'かぎ、 どこに おいたっけ。', reading: 'kagi, doko ni oitakke.', meaning: '¿Dónde dejé las llaves?' },
    ],
    exercises: [
      { type: 'choice', prompt: '田中[たなか]さんの 電話[でんわ]番号[ばんごう]、 何番[なんばん]だった ＿。', hint: '¿Cuál era el número de Tanaka?', options: ['っけ', 'って', 'なんて', 'ばかり'], answer: 'っけ' },
      {
        type: 'choice',
        format: 'usage',
        prompt: '«っけ» — ¿en qué frase se usa bien?',
        options: ['あれ、 今日[きょう]は 何日[なんにち]だっけ。', 'はじめまして、 マリアだっけ。', 'あしたは 雨[あめ]が 降[ふ]るっけ ください。', 'この 本[ほん]を 読[よ]みっけ ます。'],
        answer: 'あれ、 今日[きょう]は 何日[なんにち]だっけ。',
        explanation: 'っけ se usa para preguntar algo que uno intenta recordar.',
      },
      { type: 'meaning', text: 'あの 映画[えいが]、 だれと 見[み]たっけ。', options: ['¿Con quién vi esa película? (no me acuerdo)', '¿Con quién vas a ver esa película?', 'Vi esa película con alguien.', 'Quiero ver esa película contigo.'], answer: '¿Con quién vi esa película? (no me acuerdo)' },
    ],
  },
  {
    id: 'mama',
    level: 'N3',
    title: 'まま: tal cual, sin cambiar',
    summary: 'Me dormí con la tele encendida.',
    pattern: '[た/ない] まま · [sust.] の まま · この まま',
    explanation: [
      '**まま** indica que un estado **sigue igual**, sin cambios, cuando debería haber cambiado: テレビを つけた まま 寝[ね]て しまった (me quedé dormido con la tele encendida).',
      'Con sustantivos: **の まま** (くつの まま 入[はい]らないで: no entre con los zapatos puestos). **この まま** = «así como está»: この まま で いいです (así está bien).',
    ],
    examples: [
      { text: '窓[まど]を 開[あ]けた まま 出[で]かけて しまった。', reading: 'mado o aketa mama dekakete shimatta.', meaning: 'Salí dejando la ventana abierta.' },
      { text: '借[か]りた 本[ほん]を 読[よ]まない まま 返[かえ]した。', reading: 'karita hon o yomanai mama kaeshita.', meaning: 'Devolví el libro prestado sin haberlo leído.' },
      { text: '十年[じゅうねん] たっても、 この 町[まち]は むかしの ままだ。', reading: 'juunen tattemo, kono machi wa mukashi no mama da.', meaning: 'Aunque pasaron diez años, este pueblo sigue igual que antes.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'くつを はいた ＿ 家[いえ]に 入[はい]らないで ください。', hint: 'No entre a la casa con los zapatos puestos.', options: ['まま', 'ばかり', 'ほど', 'うちに'], answer: 'まま' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '電気[でんき]を つけた まま 寝[ね]た。',
        options: ['電気[でんき]を けさないで 寝[ね]た。', '電気[でんき]を けしてから 寝[ね]た。', '電気[でんき]を つける 前[まえ]に 寝[ね]た。', '電気[でんき]が つかなくて 寝[ね]られなかった。'],
        answer: '電気[でんき]を けさないで 寝[ね]た。',
      },
      { type: 'meaning', text: 'この まま 待[ま]って いて ください。', options: ['Espere así como está, por favor.', 'No espere más, por favor.', 'Espere un poco y luego cambie.', 'Venga a esperar aquí.'], answer: 'Espere así como está, por favor.' },
    ],
  },
  {
    id: 'kiru-kakeru',
    level: 'N3',
    title: '〜きる y 〜かける: terminar del todo, dejar a medias',
    summary: 'Lo leí entero · un café a medio tomar.',
    pattern: '[raíz ます] きる · [raíz ます] かける / かけの [sust.]',
    explanation: [
      '**Raíz + きる** = hacer algo **completamente, hasta el final**: 一日[いちにち]で 本[ほん]を 読[よ]みきった (leí el libro entero en un día). En negativo: **きれない** = no se puede terminar (食[た]べきれない: no me lo alcanzo a comer todo).',
      '**Raíz + かける** = **empezar y dejar a medias**: 何[なに]か 言[い]いかけて、 やめた (empezó a decir algo y se calló). Delante de un sustantivo: **かけの**: 飲[の]みかけの コーヒー (un café a medio tomar).',
    ],
    examples: [
      { text: 'こんなに たくさん、 一人[ひとり]では 食[た]べきれない。', reading: 'konna ni takusan, hitori de wa tabekirenai.', meaning: 'Tanto, yo solo no me lo alcanzo a comer.' },
      { text: 'マラソンを 最後[さいご]まで 走[はし]りきった。', reading: 'marason o saigo made hashirikitta.', meaning: 'Corrí la maratón completa hasta el final.' },
      { text: 'つくえの 上[うえ]に 読[よ]みかけの 本[ほん]が ある。', reading: 'tsukue no ue ni yomikake no hon ga aru.', meaning: 'Sobre el escritorio hay un libro a medio leer.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'お金[かね]を 全部[ぜんぶ] 使[つか] ＿ しまった。', hint: 'Me gasté todo el dinero.', options: ['いきって', 'いかけて', 'いすぎて', 'いながら'], answer: 'いきって' },
      { type: 'choice', prompt: 'かれは 何[なに]か 言[い]い ＿、 だまった。', hint: 'Empezó a decir algo y se calló.', options: ['かけて', 'きって', 'すぎて', 'ながら'], answer: 'かけて' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'この 料理[りょうり]は 多[おお]すぎて 食[た]べきれない。',
        options: ['この 料理[りょうり]は 多[おお]すぎて 全部[ぜんぶ]は 食[た]べられない。', 'この 料理[りょうり]は 少[すく]なくて すぐ 食[た]べた。', 'この 料理[りょうり]は まずくて 食[た]べたく ない。', 'この 料理[りょうり]を 全部[ぜんぶ] 食[た]べた。'],
        answer: 'この 料理[りょうり]は 多[おお]すぎて 全部[ぜんぶ]は 食[た]べられない。',
      },
    ],
  },
  {
    id: 'tsumori-de',
    level: 'N3',
    title: 'つもりで: con la idea de, creyendo que',
    summary: 'Lo dije en broma · creía haberlo cerrado.',
    pattern: '[dicc./た] つもりで · [た] つもりだった',
    explanation: [
      '**つもりで** = «**con la intención / la idea de**»: 旅行[りょこう]に 行[い]った つもりで、 お金[かね]を ためる (ahorrar haciendo como si hubiera ido de viaje). じょうだんの つもりで 言[い]った (lo dije en broma).',
      '**Forma た + つもりだった** = «**creía haber hecho**» algo, pero no era así: かぎを かけた つもりだったのに、 開[あ]いて いた (creía haber cerrado con llave, pero estaba abierto).',
    ],
    examples: [
      { text: '先生[せんせい]に なった つもりで、 友[とも]だちに 教[おし]えて みた。', reading: 'sensei ni natta tsumori de, tomodachi ni oshiete mita.', meaning: 'Haciendo como si fuera profesor, probé a enseñarle a mi amigo.' },
      { text: '全部[ぜんぶ] 覚[おぼ]えた つもりだったが、 試験[しけん]で わすれて しまった。', reading: 'zenbu oboeta tsumori datta ga, shiken de wasurete shimatta.', meaning: 'Creía haberlo memorizado todo, pero en el examen se me olvidó.' },
      { text: 'てつだう つもりで 来[き]たのに、 じゃまに なって しまった。', reading: 'tetsudau tsumori de kita noni, jama ni natte shimatta.', meaning: 'Vine con la idea de ayudar, pero terminé estorbando.' },
    ],
    exercises: [
      { type: 'choice', prompt: '電気[でんき]を けした ＿ だったが、 ついて いた。', hint: 'Creía haber apagado la luz, pero estaba encendida.', options: ['つもり', 'はず', 'ため', 'わけ'], answer: 'つもり' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'メールを 送[おく]った つもりだった。',
        options: ['メールを 送[おく]ったと 思[おも]って いたが、 送[おく]って いなかった。', 'メールを 送[おく]る 予定[よてい]だ。', 'メールを 送[おく]りたく なかった。', 'メールを たしかに 送[おく]った。'],
        answer: 'メールを 送[おく]ったと 思[おも]って いたが、 送[おく]って いなかった。',
      },
      { type: 'meaning', text: '旅行[りょこう]に 行[い]った つもりで、 お金[かね]を ためる。', options: ['Ahorro haciendo como si me hubiera ido de viaje.', 'Ahorro para irme de viaje mañana.', 'Gasté el dinero en un viaje.', 'Me fui de viaje sin dinero.'], answer: 'Ahorro haciendo como si me hubiera ido de viaje.' },
    ],
  },
]
