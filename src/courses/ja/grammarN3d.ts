import type { GrammarLesson } from '../grammar.ts'

// Gramática N3, cuarta tanda: actitudes, comparaciones, tendencias, keigo avanzado y matices
// de tiempo. Con ejercicios de paráfrasis y uso como el JLPT. Kanji con furigana, solo de los
// que enseña el curso.

export const grammarN3d: GrammarLesson[] = [
  {
    id: 'you-to-shinai',
    level: 'N3',
    title: 'ようとしない: no tener intención de',
    summary: 'No quiere comer · no intenta escuchar.',
    pattern: '[volitiva] と しない',
    explanation: [
      '**Volitiva + と しない** = alguien **no muestra intención** de hacer algo, aunque debería o se lo piden: 子[こ]どもが 野菜[やさい]を 食[た]べようと しない (el niño no quiere comer verduras).',
      'Se usa para hablar de **otra persona**, casi siempre con algo de queja. Para uno mismo se dice つもりは ない.',
    ],
    examples: [
      { text: '弟[おとうと]は 何[なに]を 言[い]っても 聞[き]こうと しない。', reading: 'otouto wa nani o ittemo kikou to shinai.', meaning: 'Le diga lo que le diga, mi hermano no quiere escuchar.' },
      { text: 'ねこが 箱[はこ]から 出[で]ようと しない。', reading: 'neko ga hako kara deyou to shinai.', meaning: 'El gato no quiere salir de la caja.' },
      { text: '彼[かれ]は 自分[じぶん]の 失敗[しっぱい]を 認[みと]めようと しない。', reading: 'kare wa jibun no shippai o mitomeyou to shinai.', meaning: 'Él no está dispuesto a reconocer su error.' },
    ],
    exercises: [
      { type: 'choice', prompt: '父[ちち]は 病院[びょういん]に 行[い]こうと ＿。', hint: 'Mi padre no quiere ir al hospital.', options: ['しない', 'する', 'なる', 'いる'], answer: 'しない' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '息子[むすこ]は 部屋[へや]を 片[かた]づけようと しない。',
        options: ['息子[むすこ]は 部屋[へや]を 片[かた]づける 気[き]が ない。', '息子[むすこ]は 部屋[へや]を 片[かた]づけたばかりだ。', '息子[むすこ]は 部屋[へや]を 片[かた]づけようと して いる。', '息子[むすこ]は 部屋[へや]を 片[かた]づけられない。'],
        answer: '息子[むすこ]は 部屋[へや]を 片[かた]づける 気[き]が ない。',
      },
      { type: 'meaning', text: '妹[いもうと]は 朝[あさ]ご飯[はん]を 食[た]べようと しない。', options: ['Mi hermana no quiere tomar desayuno.', 'Mi hermana está a punto de desayunar.', 'Mi hermana no puede desayunar.', 'Mi hermana desayunó temprano.'], answer: 'Mi hermana no quiere tomar desayuno.' },
    ],
  },
  {
    id: 'ni-kawatte',
    level: 'N3',
    title: 'にかわって: en nombre de, en lugar de',
    summary: 'Hablo en nombre del jefe.',
    pattern: '[sust.] に かわって / に かわり',
    explanation: [
      '**Sustantivo + に かわって** = «**en nombre de, en lugar de**» alguien: 社長[しゃちょう]に かわって、 私[わたし]が あいさつします (saludaré yo en nombre del presidente).',
      'También indica que algo **reemplaza** a otra cosa: 手[て]がみに かわって、 メールが 使[つか]われる ように なった. En lo escrito se usa **に かわり**.',
    ],
    examples: [
      { text: '病気[びょうき]の 先生[せんせい]に かわって、 田中[たなか]先生[せんせい]が 教[おし]えます。', reading: 'byouki no sensei ni kawatte, tanaka sensei ga oshiemasu.', meaning: 'En lugar del profesor enfermo, enseña el profesor Tanaka.' },
      { text: '母[はは]に かわって、 私[わたし]が 晩[ばん]ご飯[はん]を 作[つく]った。', reading: 'haha ni kawatte, watashi ga bangohan o tsukutta.', meaning: 'Hice yo la cena en lugar de mi mamá.' },
      { text: '人[ひと]に かわって、 ロボットが 働[はたら]く 工場[こうじょう]が 増[ふ]えた。', reading: 'hito ni kawatte, robotto ga hataraku koujou ga fueta.', meaning: 'Aumentaron las fábricas donde trabajan robots en lugar de personas.' },
    ],
    exercises: [
      { type: 'choice', prompt: '部長[ぶちょう]に ＿、 私[わたし]が 会議[かいぎ]に 出[で]ます。', hint: 'En lugar del jefe, iré yo a la reunión.', options: ['かわって', 'ついて', 'とって', 'よって'], answer: 'かわって' },
      {
        type: 'choice',
        format: 'usage',
        prompt: '«に かわって» — ¿en qué frase se usa bien?',
        options: ['けがを した 選手[せんしゅ]に かわって、 山田[やまだ]さんが 試合[しあい]に 出[で]た。', '雨[あめ]に かわって、 かさを 持[も]って いく。', '日本語[にほんご]に かわって 勉強[べんきょう]して います。', '友[とも]だちに かわって、 プレゼントを もらった。'],
        answer: 'けがを した 選手[せんしゅ]に かわって、 山田[やまだ]さんが 試合[しあい]に 出[で]た。',
        explanation: 'Yamada jugó en lugar del jugador lesionado.',
      },
      { type: 'meaning', text: '父[ちち]に かわって、 おれいを 申[もう]し上[あ]げます。', options: ['Le doy las gracias en nombre de mi padre.', 'Mi padre le da las gracias.', 'Le agradezco a mi padre.', 'Mi padre cambió de opinión.'], answer: 'Le doy las gracias en nombre de mi padre.' },
    ],
  },
  {
    id: 'ageku',
    level: 'N3',
    title: 'あげく: después de mucho, al final',
    summary: 'Tras pensarlo mucho, no lo compré.',
    pattern: '[た] あげく · [sust.] の あげく',
    explanation: [
      '**Forma た + あげく** = «**después de (mucho)…, al final**»: tras un proceso largo o difícil se llega a un resultado, muchas veces negativo: さんざん まよった あげく、 何[なに]も 買[か]わなかった (después de dudar mucho, no compré nada).',
      'Con sustantivos: **の あげく** (けんかの あげく). Se parece a **けっきょく**, pero あげく subraya el cansancio del proceso.',
    ],
    examples: [
      { text: '二時間[にじかん] 待[ま]たされた あげく、 店[みせ]に 入[はい]れなかった。', reading: 'nijikan matasareta ageku, mise ni hairenakatta.', meaning: 'Después de hacerme esperar dos horas, al final no pude entrar a la tienda.' },
      { text: '長[なが]い 議論[ぎろん]の あげく、 計画[けいかく]は 中止[ちゅうし]に なった。', reading: 'nagai giron no ageku, keikaku wa chuushi ni natta.', meaning: 'Tras una larga discusión, el plan se canceló.' },
      { text: 'よく 考[かんが]えた あげく、 会社[かいしゃ]を やめる ことに した。', reading: 'yoku kangaeta ageku, kaisha o yameru koto ni shita.', meaning: 'Después de pensarlo mucho, decidí dejar la empresa.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'いろいろ さがした ＿、 かぎは かばんの 中[なか]に あった。', hint: 'Después de buscar por todas partes, la llave estaba en el bolso.', options: ['あげく', 'うちに', 'たびに', 'ついでに'], answer: 'あげく' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '何度[なんど]も 話[はな]し合[あ]った あげく、 二人[ふたり]は 別[わか]れた。',
        options: ['何度[なんど]も 話[はな]し合[あ]ったが、 最後[さいご]に 二人[ふたり]は 別[わか]れた。', '二人[ふたり]は 別[わか]れてから 話[はな]し合[あ]った。', '二人[ふたり]は 一度[いちど]も 話[はな]さずに 別[わか]れた。', '話[はな]し合[あ]ったので、 二人[ふたり]は 別[わか]れなかった。'],
        answer: '何度[なんど]も 話[はな]し合[あ]ったが、 最後[さいご]に 二人[ふたり]は 別[わか]れた。',
      },
      { type: 'meaning', text: '道[みち]に まよった あげく、 駅[えき]に もどって しまった。', options: ['Tras perderme mucho, terminé volviendo a la estación.', 'Volví a la estación para no perderme.', 'Me perdí antes de llegar a la estación.', 'No me perdí gracias a la estación.'], answer: 'Tras perderme mucho, terminé volviendo a la estación.' },
    ],
  },
  {
    id: 'ta-tokoro-de',
    level: 'N3',
    title: 'たところで: aunque, de nada sirve',
    summary: 'Aunque te apures, no llegas.',
    pattern: '[た] ところで、 〜 (negativo)',
    explanation: [
      '**Forma た + ところで** = «**aunque (hagas)…, no sirve de nada**»: 今[いま]から 走[はし]った ところで、 間[ま]に合[あ]わない (aunque corra ahora, no voy a llegar a tiempo).',
      'Después viene un resultado **negativo o sin valor** (ない, むだだ, 意味[いみ]が ない). Con palabras de pregunta: いくら 説明[せつめい]した ところで (por más que explique).',
    ],
    examples: [
      { text: '今[いま]さら あやまった ところで、 許[ゆる]して もらえないだろう。', reading: 'imasara ayamatta tokoro de, yurushite moraenai darou.', meaning: 'Aunque me disculpe a estas alturas, seguramente no me perdonará.' },
      { text: 'いくら 考[かんが]えた ところで、 答[こた]えは 出[で]ない。', reading: 'ikura kangaeta tokoro de, kotae wa denai.', meaning: 'Por más que lo piense, no voy a encontrar la respuesta.' },
      { text: '一人[ひとり]で はんたいした ところで、 何[なに]も 変[か]わらない。', reading: 'hitori de hantai shita tokoro de, nanimo kawaranai.', meaning: 'Aunque me oponga yo solo, nada va a cambiar.' },
    ],
    exercises: [
      { type: 'choice', prompt: '今[いま]から 勉強[べんきょう]した ＿、 あしたの 試験[しけん]には 間[ま]に合[あ]わない。', hint: 'Aunque estudie desde ahora, no alcanzo para el examen de mañana.', options: ['ところで', 'ところに', 'ところを', 'ところだ'], answer: 'ところで' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'もんくを 言[い]った ところで、 どうにも ならない。',
        options: ['もんくを 言[い]っても、 何[なに]も 変[か]わらない。', 'もんくを 言[い]ったから、 よく なった。', 'もんくを 言[い]う ところだった。', 'もんくを 言[い]わないで ください。'],
        answer: 'もんくを 言[い]っても、 何[なに]も 変[か]わらない。',
      },
      { type: 'meaning', text: '急[いそ]いだ ところで、 もう バスは 出[で]た。', options: ['Aunque me apure, el bus ya se fue.', 'Me apuré y alcancé el bus.', 'Justo cuando me apuraba, salió el bus.', 'El bus sale cuando me apuro.'], answer: 'Aunque me apure, el bus ya se fue.' },
    ],
  },
  {
    id: 'nagara-mo',
    level: 'N3',
    title: 'ながら(も): aunque, a pesar de',
    summary: 'Aunque lo sabía, no dije nada.',
    pattern: '[raíz ます / い / な / sust.] ながら(も)',
    explanation: [
      'Además de «mientras» (N4), **ながら** puede significar «**aunque, a pesar de**», sobre todo con verbos de estado y adjetivos: 知[し]って いながら、 何[なに]も 言[い]わなかった (aunque lo sabía, no dijo nada).',
      'Con **も** se refuerza: 小[ちい]さいながらも、 きれいな 家[いえ]だ (aunque pequeña, es una casa bonita). Expresiones fijas: ざんねんながら (lamentablemente).',
    ],
    examples: [
      { text: '体[からだ]に 悪[わる]いと わかって いながら、 たばこを やめられない。', reading: 'karada ni warui to wakatte inagara, tabako o yamerarenai.', meaning: 'Aunque sé que es malo para la salud, no puedo dejar el cigarro.' },
      { text: 'せまいながらも、 楽[たの]しい 部屋[へや]です。', reading: 'semai nagara mo, tanoshii heya desu.', meaning: 'Aunque es estrecha, es una habitación agradable.' },
      { text: '子[こ]どもながら、 しっかり した 意見[いけん]を 言[い]う。', reading: 'kodomo nagara, shikkari shita iken o iu.', meaning: 'Aunque es un niño, da opiniones muy sensatas.' },
    ],
    exercises: [
      { type: 'choice', prompt: '悪[わる]いと 思[おも]い ＿、 うそを ついて しまった。', hint: 'Aunque sabía que estaba mal, terminé mintiendo.', options: ['ながら', 'ように', 'ために', 'ばかり'], answer: 'ながら' },
      {
        type: 'choice',
        format: 'usage',
        prompt: '«ながら(も)» con sentido de «aunque» — ¿en qué frase se usa bien?',
        options: ['このカメラは 安[やす]いながらも、 よく 写[うつ]る。', '音楽[おんがく]を 聞[き]きながら 勉強[べんきょう]する。', 'あしたは 雨[あめ]ながら 行[い]きます。', '駅[えき]ながら 友[とも]だちに 会[あ]った。'],
        answer: 'このカメラは 安[やす]いながらも、 よく 写[うつ]る。',
        explanation: 'La segunda frase es correcta, pero ahí ながら significa «mientras».',
      },
      { type: 'meaning', text: '近[ちか]くに 住[す]んで いながら、 一度[いちど]も 会[あ]った ことが ない。', options: ['Aunque vivimos cerca, nunca nos hemos visto.', 'Como vivimos cerca, nos vemos seguido.', 'Mientras vivía cerca, lo vi una vez.', 'Nos vimos una vez y nos fuimos a vivir cerca.'], answer: 'Aunque vivimos cerca, nunca nos hemos visto.' },
    ],
  },
  {
    id: 'gachi',
    level: 'N3',
    title: 'がち: tender a, con frecuencia',
    summary: 'Suele faltar · tiende a olvidarse.',
    pattern: '[raíz ます / sust.] がち',
    explanation: [
      '**Raíz de ます o sustantivo + がち** = «**tender a**», algo que pasa con frecuencia y casi siempre es **negativo**: 冬[ふゆ]は かぜを ひきがちだ (en invierno uno tiende a resfriarse).',
      'Funciona como adjetivo な: 病気[びょうき]がちな 子[こ]ども (un niño que se enferma a menudo), 遅[おく]れがちに なる.',
    ],
    examples: [
      { text: '忙[いそが]しいと、 食事[しょくじ]が おろそかに なりがちだ。', reading: 'isogashii to, shokuji ga orosoka ni narigachi da.', meaning: 'Cuando uno está ocupado, tiende a descuidar las comidas.' },
      { text: '最近[さいきん]、 くもりがちの 天気[てんき]が 続[つづ]いて いる。', reading: 'saikin, kumorigachi no tenki ga tsuzuite iru.', meaning: 'Últimamente sigue un tiempo más bien nublado.' },
      { text: '一人[ひとり]で 住[す]むと、 家[いえ]に こもりがちに なる。', reading: 'hitori de sumu to, ie ni komorigachi ni naru.', meaning: 'Viviendo solo, uno tiende a encerrarse en casa.' },
    ],
    exercises: [
      { type: 'choice', prompt: '母[はは]は 年[とし]を とって、 わすれ ＿ に なった。', hint: 'Con los años, mi mamá se volvió olvidadiza.', options: ['がち', 'ぎみ', 'っぽい', 'らしい'], answer: 'がち' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '雨[あめ]の 日[ひ]は 電車[でんしゃ]が 遅[おく]れがちだ。',
        options: ['雨[あめ]の 日[ひ]は 電車[でんしゃ]が よく 遅[おく]れる。', '雨[あめ]の 日[ひ]は 電車[でんしゃ]が 遅[おく]れない。', '雨[あめ]の 日[ひ]は 電車[でんしゃ]が 早[はや]く 着[つ]く。', '雨[あめ]の 日[ひ]に 一度[いちど] 電車[でんしゃ]が 遅[おく]れた。'],
        answer: '雨[あめ]の 日[ひ]は 電車[でんしゃ]が よく 遅[おく]れる。',
      },
      { type: 'meaning', text: '彼[かれ]は 子[こ]どもの ころ、 病気[びょうき]がちだった。', options: ['De niño, él se enfermaba a menudo.', 'De niño, él nunca se enfermaba.', 'De niño, él cuidaba a enfermos.', 'Él se enfermó una vez de niño.'], answer: 'De niño, él se enfermaba a menudo.' },
    ],
  },
  {
    id: 'gimi',
    level: 'N3',
    title: '気味: un poco, con tendencia a',
    summary: 'Estoy medio resfriado.',
    pattern: '[raíz ます / sust.] 気味[ぎみ]',
    explanation: [
      '**気味[ぎみ]** = «**un poco, algo de**»: se nota una ligera señal de un estado, casi siempre **negativo**: かぜ気味[ぎみ]だ (estoy medio resfriado), 疲[つか]れ気味[ぎみ] (algo cansado).',
      'Se diferencia de **がち**: がち es algo que **pasa a menudo**; 気味[ぎみ] es un estado que **se siente ahora** un poco.',
    ],
    examples: [
      { text: '今日[きょう]は 少[すこ]し かぜ気味[ぎみ]なので、 早[はや]く 寝[ね]ます。', reading: 'kyou wa sukoshi kazegimi na node, hayaku nemasu.', meaning: 'Hoy estoy medio resfriado, así que me acuesto temprano.' },
      { text: '最近[さいきん] 太[ふと]り気味[ぎみ]だから、 運動[うんどう]を 始[はじ]めた。', reading: 'saikin futorigimi dakara, undou o hajimeta.', meaning: 'Últimamente estoy subiendo un poco de peso, así que empecé a hacer ejercicio.' },
      { text: '計画[けいかく]が 遅[おく]れ気味[ぎみ]です。', reading: 'keikaku ga okuregimi desu.', meaning: 'El plan va un poco atrasado.' },
    ],
    exercises: [
      { type: 'choice', prompt: '仕事[しごと]が 多[おお]くて、 少[すこ]し 疲[つか]れ ＿ です。', hint: 'Tengo mucho trabajo y estoy algo cansado.', options: ['気味[ぎみ]', 'がち', 'っぽい', 'だらけ'], answer: '気味[ぎみ]' },
      {
        type: 'choice',
        format: 'usage',
        prompt: '«気味[ぎみ]» — ¿en qué frase se usa bien?',
        options: ['のどが いたくて、 かぜ気味[ぎみ]だ。', 'この ケーキは おいし気味[ぎみ]だ。', 'あしたは 晴[は]れ気味[ぎみ]で 出[で]かけます。', '友[とも]だちに 会[あ]い気味[ぎみ]です。'],
        answer: 'のどが いたくて、 かぜ気味[ぎみ]だ。',
        explanation: '気味[ぎみ] se usa con estados negativos que se sienten un poco.',
      },
      { type: 'meaning', text: '最近[さいきん]、 ねぶそく気味[ぎみ]です。', options: ['Últimamente duermo un poco menos de lo que debería.', 'Últimamente duermo demasiado.', 'Nunca duermo mal.', 'Ayer no dormí nada.'], answer: 'Últimamente duermo un poco menos de lo que debería.' },
    ],
  },
  {
    id: 'ni-taishite',
    level: 'N3',
    title: 'に対して: hacia, frente a, en cambio',
    summary: 'Amable con los clientes · A, en cambio B.',
    pattern: '[sust.] に 対[たい]して · [informal] の に 対[たい]して',
    explanation: [
      '**に 対[たい]して** marca **hacia quién o qué** va una acción o actitud: お客[きゃく]さんに 対[たい]して ていねいに 話[はな]す (hablar con cortesía a los clientes). Delante de un sustantivo: **に 対[たい]する** (質問[しつもん]に 対[たい]する 答[こた]え).',
      'También **contrasta** dos cosas: 兄[あに]は 静[しず]かなのに 対[たい]して、 弟[おとうと]は にぎやかだ (el hermano mayor es tranquilo; el menor, en cambio, es bullicioso).',
    ],
    examples: [
      { text: '先生[せんせい]に 対[たい]して、 そんな 言[い]い方[かた]を しては いけない。', reading: 'sensei ni taishite, sonna iikata o shite wa ikenai.', meaning: 'No debes hablarle así a un profesor.' },
      { text: '私[わたし]の 質問[しつもん]に 対[たい]する 答[こた]えは まだ ない。', reading: 'watashi no shitsumon ni taisuru kotae wa mada nai.', meaning: 'Todavía no hay respuesta a mi pregunta.' },
      { text: '北[きた]は 寒[さむ]いのに 対[たい]して、 南[みなみ]は 暖[あたた]かい。', reading: 'kita wa samui noni taishite, minami wa atatakai.', meaning: 'El norte es frío; el sur, en cambio, es cálido.' },
    ],
    exercises: [
      { type: 'choice', prompt: '子[こ]どもに ＿、 きびしすぎるのは よくない。', hint: 'No es bueno ser demasiado estricto con los niños.', options: ['対[たい]して', 'とって', 'ついて', 'よって'], answer: '対[たい]して' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '姉[あね]は 背[せ]が 高[たか]いのに 対[たい]して、 私[わたし]は 低[ひく]い。',
        options: ['姉[あね]は 背[せ]が 高[たか]いが、 私[わたし]は はんたいに 低[ひく]い。', '姉[あね]も 私[わたし]も 背[せ]が 高[たか]い。', '姉[あね]は 私[わたし]より 背[せ]が 低[ひく]い。', '姉[あね]は 背[せ]が 高[たか]く なりたい。'],
        answer: '姉[あね]は 背[せ]が 高[たか]いが、 私[わたし]は はんたいに 低[ひく]い。',
      },
      { type: 'meaning', text: '彼[かれ]は だれに 対[たい]しても しんせつだ。', options: ['Él es amable con todo el mundo.', 'Nadie es amable con él.', 'Él solo es amable con algunos.', 'Él se opone a todos.'], answer: 'Él es amable con todo el mundo.' },
    ],
  },
  {
    id: 'ni-kurabete',
    level: 'N3',
    title: 'に比べて: en comparación con',
    summary: 'Comparado con el año pasado, hace calor.',
    pattern: '[sust.] に 比[くら]べて / と 比[くら]べて',
    explanation: [
      '**に 比[くら]べて** = «**en comparación con**»: 去年[きょねん]に 比[くら]べて、 今年[ことし]は 雪[ゆき]が 多[おお]い (comparado con el año pasado, este año nieva más).',
      'Es más formal que **より** y se usa mucho en noticias e informes. También **と 比[くら]べて** y, por escrito, **に 比[くら]べ**.',
    ],
    examples: [
      { text: '東京[とうきょう]に 比[くら]べて、 この 町[まち]は 物価[ぶっか]が 安[やす]い。', reading: 'toukyou ni kurabete, kono machi wa bukka ga yasui.', meaning: 'En comparación con Tokio, en este pueblo el costo de vida es bajo.' },
      { text: '十年前[じゅうねんまえ]に 比[くら]べて、 外国人[がいこくじん]が 増[ふ]えた。', reading: 'juunen mae ni kurabete, gaikokujin ga fueta.', meaning: 'Comparado con hace diez años, aumentaron los extranjeros.' },
      { text: '兄[あに]と 比[くら]べて、 弟[おとうと]は よく 勉強[べんきょう]する。', reading: 'ani to kurabete, otouto wa yoku benkyou suru.', meaning: 'En comparación con el hermano mayor, el menor estudia mucho.' },
    ],
    exercises: [
      { type: 'choice', prompt: '先月[せんげつ]に ＿、 売[う]り上[あ]げが にばいに なった。', hint: 'En comparación con el mes pasado, las ventas se duplicaron.', options: ['比[くら]べて', '対[たい]して', 'よって', 'ついて'], answer: '比[くら]べて' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '去年[きょねん]に 比[くら]べて、 今年[ことし]の 夏[なつ]は 暑[あつ]い。',
        options: ['今年[ことし]の 夏[なつ]は 去年[きょねん]より 暑[あつ]い。', '今年[ことし]の 夏[なつ]は 去年[きょねん]と 同[おな]じだ。', '去年[きょねん]の 夏[なつ]は 今年[ことし]より 暑[あつ]かった。', '今年[ことし]の 夏[なつ]は 暑[あつ]くない。'],
        answer: '今年[ことし]の 夏[なつ]は 去年[きょねん]より 暑[あつ]い。',
      },
      { type: 'meaning', text: '昔[むかし]に 比[くら]べて、 生活[せいかつ]が 便利[べんり]に なった。', options: ['En comparación con antes, la vida se volvió más cómoda.', 'Antes la vida era más cómoda.', 'La vida no ha cambiado desde antes.', 'Antes comparábamos la vida.'], answer: 'En comparación con antes, la vida se volvió más cómoda.' },
    ],
  },
  {
    id: 'wo-hajime',
    level: 'N3',
    title: 'をはじめ: empezando por, entre otros',
    summary: 'Empezando por Tokio, en todo el país…',
    pattern: '[sust.] を はじめ(と して)',
    explanation: [
      '**Sustantivo + を はじめ** = «**empezando por, entre ellos (el principal)**»: se nombra el ejemplo más representativo y luego el grupo: 東京[とうきょう]を はじめ、 大[おお]きな 町[まち]では 物価[ぶっか]が 高[たか]い.',
      'Es formal; se usa en discursos y textos. También **を はじめと して** y, delante de un sustantivo, **を はじめと する**.',
    ],
    examples: [
      { text: '社長[しゃちょう]を はじめ、 社員[しゃいん] 全員[ぜんいん]が 集[あつ]まった。', reading: 'shachou o hajime, shain zen-in ga atsumatta.', meaning: 'Se reunieron todos los empleados, empezando por el presidente.' },
      { text: 'すしを はじめ、 日本[にほん]料理[りょうり]は 外国[がいこく]でも 人気[にんき]が ある。', reading: 'sushi o hajime, nihon ryouri wa gaikoku demo ninki ga aru.', meaning: 'La comida japonesa, empezando por el sushi, es popular también en el extranjero.' },
      { text: '両親[りょうしん]を はじめ、 多[おお]くの 人[ひと]に 助[たす]けて もらった。', reading: 'ryoushin o hajime, ooku no hito ni tasukete moratta.', meaning: 'Me ayudó mucha gente, empezando por mis padres.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'この 町[まち]には、 お寺[てら]を ＿、 古[ふる]い 建物[たてもの]が 多[おお]い。', hint: 'En este pueblo hay muchos edificios antiguos, empezando por el templo.', options: ['はじめ', 'はじめて', 'はじまり', 'はじめる'], answer: 'はじめ' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '英語[えいご]を はじめ、 五[いつ]つの 言葉[ことば]が 話[はな]せる。',
        options: ['英語[えいご]など、 五[いつ]つの 言葉[ことば]が 話[はな]せる。', '英語[えいご]だけ 話[はな]せる。', '英語[えいご]を 話[はな]し はじめた。', '英語[えいご]以外[いがい]は 話[はな]せない。'],
        answer: '英語[えいご]など、 五[いつ]つの 言葉[ことば]が 話[はな]せる。',
      },
      { type: 'meaning', text: '先生[せんせい]を はじめ、 クラスの みんなが 来[き]て くれた。', options: ['Vinieron todos los de la clase, empezando por el profesor.', 'Vino el profesor, pero los de la clase no pudieron venir.', 'La clase empezó cuando llegaron todos, menos el profesor.', 'El profesor invitó a toda la clase a empezar el curso.'], answer: 'Vinieron todos los de la clase, empezando por el profesor.' },
    ],
  },
  {
    id: 'ba-yokatta',
    level: 'N3',
    title: 'ばよかった: debería haber, ojalá',
    summary: 'Debí haber estudiado más.',
    pattern: '[ば] よかった · [ない → なければ] よかった',
    explanation: [
      '**Condicional ば + よかった** expresa **arrepentimiento**: «**debería haber…, ojalá hubiera…**»: もっと 勉強[べんきょう]すれば よかった (debí haber estudiado más). Con **のに** suena más fuerte.',
      'En negativo: **なければ よかった** (ojalá no lo hubiera hecho): あんな こと、 言[い]わなければ よかった. Con たら: 行[い]ったら よかった.',
    ],
    examples: [
      { text: 'かさを 持[も]って くれば よかった。', reading: 'kasa o motte kureba yokatta.', meaning: 'Debí haber traído paraguas.' },
      { text: 'あの とき、 本当[ほんとう]の ことを 話[はな]せば よかった。', reading: 'ano toki, hontou no koto o hanaseba yokatta.', meaning: 'Ojalá hubiera dicho la verdad en ese momento.' },
      { text: 'こんなに 高[たか]いなら、 買[か]わなければ よかった。', reading: 'konna ni takai nara, kawanakereba yokatta.', meaning: 'Si era tan caro, ojalá no lo hubiera comprado.' },
    ],
    exercises: [
      { type: 'type', prompt: '早[はや]く 寝[ね]る → «debí haberme acostado temprano»: 早[はや]く 寝[ね]＿ よかった', hint: 'condicional ば de 寝[ね]る', answers: ['れば'], kana: true },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'もっと 早[はや]く 家[いえ]を 出[で]れば よかった。',
        options: ['もっと 早[はや]く 家[いえ]を 出[で]なかったのは ざんねんだ。', 'もっと 早[はや]く 家[いえ]を 出[で]て よかった。', 'あしたは もっと 早[はや]く 家[いえ]を 出[で]る。', '早[はや]く 家[いえ]を 出[で]なくても いい。'],
        answer: 'もっと 早[はや]く 家[いえ]を 出[で]なかったのは ざんねんだ。',
      },
      { type: 'meaning', text: 'あんな 映画[えいが]、 見[み]なければ よかった。', options: ['Ojalá no hubiera visto esa película.', 'Qué bueno que no vi esa película.', 'Quiero ver esa película.', 'Debería ver esa película.'], answer: 'Ojalá no hubiera visto esa película.' },
    ],
  },
  {
    id: 'te-kara-de-nai-to',
    level: 'N3',
    title: 'てからでないと: no antes de, hasta que no',
    summary: 'Hasta que no pagues, no puedes entrar.',
    pattern: '[て] からでないと / からでなければ 〜ない',
    explanation: [
      '**Forma て + からでないと** = «**hasta que no… no**»: algo es **condición previa** para lo siguiente: お金[かね]を はらってからでないと、 入[はい]れません (no se puede entrar hasta pagar).',
      'Después viene algo imposible o difícil (ない, できない, むずかしい). Más formal: **てからでなければ**.',
    ],
    examples: [
      { text: '両親[りょうしん]に 相談[そうだん]してからでないと、 決[き]められません。', reading: 'ryoushin ni soudan shite kara de nai to, kimeraremasen.', meaning: 'No puedo decidirlo hasta hablarlo con mis padres.' },
      { text: '実際[じっさい]に 見[み]てからでないと、 買[か]うか どうか わからない。', reading: 'jissai ni mite kara de nai to, kau ka dou ka wakaranai.', meaning: 'Hasta que no lo vea en persona, no sé si lo compraré.' },
      { text: '手[て]を 洗[あら]ってからでないと、 食[た]べては いけません。', reading: 'te o aratte kara de nai to, tabete wa ikemasen.', meaning: 'No se puede comer sin lavarse antes las manos.' },
    ],
    exercises: [
      { type: 'choice', prompt: '説明[せつめい]を 聞[き]いて ＿、 使[つか]わないで ください。', hint: 'No lo use hasta escuchar la explicación.', options: ['からでないと', 'からには', 'ばかりか', 'ところで'], answer: 'からでないと' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '予約[よやく]してからでないと、 その レストランには 入[はい]れない。',
        options: ['予約[よやく]しなければ、 その レストランには 入[はい]れない。', '予約[よやく]しなくても、 その レストランに 入[はい]れる。', 'その レストランに 入[はい]ってから 予約[よやく]する。', 'その レストランは 予約[よやく]が できない。'],
        answer: '予約[よやく]しなければ、 その レストランには 入[はい]れない。',
      },
      { type: 'meaning', text: '宿題[しゅくだい]が 終[お]わってからでないと、 遊[あそ]べません。', options: ['No puedes jugar hasta terminar la tarea.', 'Puedes jugar mientras haces la tarea.', 'Juega antes de hacer la tarea.', 'Terminé la tarea jugando.'], answer: 'No puedes jugar hasta terminar la tarea.' },
    ],
  },
  {
    id: 'to-iu-koto-da',
    level: 'N3',
    title: 'ということだ: dicen que, o sea que',
    summary: 'Según el pronóstico, mañana llueve · o sea, no vienes.',
    pattern: '[informal] と いう ことだ',
    explanation: [
      '**と いう ことだ** transmite una **información oída**, como そうだ pero más formal: ニュースに よると、 電車[でんしゃ]が 止[と]まって いると いう ことだ (según las noticias, el tren está detenido).',
      'También **saca una conclusión**: «**o sea que**»: 返事[へんじ]が ないと いう ことは、 来[こ]ないと いう ことだ (si no responde, quiere decir que no viene).',
    ],
    examples: [
      { text: '天気[てんき]よほうに よると、 あしたは 雪[ゆき]だと いう ことだ。', reading: 'tenki yohou ni yoru to, ashita wa yuki da to iu koto da.', meaning: 'Según el pronóstico, mañana va a nevar.' },
      { text: '部長[ぶちょう]は 来月[らいげつ] おおさかに 移[うつ]ると いう ことです。', reading: 'buchou wa raigetsu oosaka ni utsuru to iu koto desu.', meaning: 'Dicen que el jefe se traslada a Osaka el próximo mes.' },
      { text: '電話[でんわ]に 出[で]ないと いう ことは、 まだ 寝[ね]て いると いう ことだ。', reading: 'denwa ni denai to iu koto wa, mada nete iru to iu koto da.', meaning: 'Si no contesta el teléfono, quiere decir que todavía está durmiendo.' },
    ],
    exercises: [
      { type: 'choice', prompt: '先生[せんせい]の 話[はなし]では、 試験[しけん]は 来週[らいしゅう]だと いう ＿。', hint: 'Según dijo el profesor, el examen es la próxima semana.', options: ['ことだ', 'ものだ', 'わけだ', 'はずだ'], answer: 'ことだ' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '新聞[しんぶん]に よると、 物価[ぶっか]が 上[あ]がると いう ことだ。',
        options: ['新聞[しんぶん]に よると、 物価[ぶっか]が 上[あ]がるそうだ。', '新聞[しんぶん]の 物価[ぶっか]が 上[あ]がった。', '物価[ぶっか]が 上[あ]がれば、 新聞[しんぶん]を 買[か]わない。', '物価[ぶっか]は 上[あ]がらないだろう。'],
        answer: '新聞[しんぶん]に よると、 物価[ぶっか]が 上[あ]がるそうだ。',
      },
      { type: 'meaning', text: 'まだ 席[せき]が あると いう ことは、 人気[にんき]が ないと いう ことだ。', options: ['Que todavía queden asientos quiere decir que no es popular.', 'Quedan asientos porque es popular.', 'No quedan asientos porque es popular.', 'Dicen que es popular y no hay asientos.'], answer: 'Que todavía queden asientos quiere decir que no es popular.' },
    ],
  },
  {
    id: 'ni-tsurete',
    level: 'N3',
    title: 'につれて: a medida que',
    summary: 'A medida que pasa el tiempo, se olvida.',
    pattern: '[dicc. / sust.] に つれて',
    explanation: [
      '**Diccionario o sustantivo + に つれて** = «**a medida que**»: un cambio produce **otro cambio** en paralelo: 時間[じかん]が たつに つれて、 さびしさが 消[き]えた (a medida que pasaba el tiempo, la soledad desapareció).',
      'Ambas partes son **cambios graduales** (なる, 増[ふ]える, 上[あ]がる…). Es parecido a **ば〜ほど** y a **と ともに**.',
    ],
    examples: [
      { text: '日本語[にほんご]が わかるに つれて、 日本[にほん]の 生活[せいかつ]が 楽[たの]しく なった。', reading: 'nihongo ga wakaru ni tsurete, nihon no seikatsu ga tanoshiku natta.', meaning: 'A medida que entendía japonés, la vida en Japón se volvió más entretenida.' },
      { text: '山[やま]を のぼるに つれて、 気温[きおん]が 下[さ]がって きた。', reading: 'yama o noboru ni tsurete, kion ga sagatte kita.', meaning: 'A medida que subíamos la montaña, la temperatura bajaba.' },
      { text: '年[とし]を とるに つれて、 体[からだ]が 弱[よわ]く なる。', reading: 'toshi o toru ni tsurete, karada ga yowaku naru.', meaning: 'A medida que uno envejece, el cuerpo se debilita.' },
    ],
    exercises: [
      { type: 'choice', prompt: '冬[ふゆ]が 近[ちか]づく ＿、 寒[さむ]く なって きた。', hint: 'A medida que se acerca el invierno, empezó a hacer frío.', options: ['につれて', 'について', 'にとって', 'にかわって'], answer: 'につれて' },
      {
        type: 'choice',
        format: 'usage',
        prompt: '«に つれて» — ¿en qué frase se usa bien?',
        options: ['町[まち]が 大[おお]きく なるに つれて、 車[くるま]も 増[ふ]えた。', '駅[えき]に 着[つ]くに つれて、 電話[でんわ]を した。', 'あした 雨[あめ]が 降[ふ]るに つれて、 かさを 持[も]って いく。', '友[とも]だちに 会[あ]うに つれて、 映画[えいが]を 見[み]た。'],
        answer: '町[まち]が 大[おお]きく なるに つれて、 車[くるま]も 増[ふ]えた。',
        explanation: 'につれて une dos cambios graduales.',
      },
      { type: 'meaning', text: '子[こ]どもが 大[おお]きく なるに つれて、 お金[かね]が かかる。', options: ['A medida que los hijos crecen, se gasta más dinero.', 'Cuando los hijos eran pequeños, gastábamos mucho.', 'Los hijos grandes ganan dinero.', 'El dinero hace crecer a los hijos.'], answer: 'A medida que los hijos crecen, se gasta más dinero.' },
    ],
  },
  {
    id: 'keigo-itadaku',
    level: 'N3',
    title: 'Keigo III: お〜いただく y ご〜ください',
    summary: 'Le ruego que espere · gracias por venir.',
    pattern: 'お/ご + raíz ます / sust. + いただく · ください · になる',
    explanation: [
      '**お + raíz ます + いただく** (o **ご + sustantivo**) es una forma muy cortés de decir que **otra persona hace algo por uno**: お待[ま]ちいただき、 ありがとうございます (gracias por esperar), ご連絡[れんらく]いただけますか (¿podría contactarme?).',
      'Para **pedir** con mucha cortesía: **お〜ください / ご〜ください**: こちらで お待[ま]ちください, ご注意[ちゅうい]ください. Para hablar de lo que hace el otro con respeto: **お〜に なる** (お帰[かえ]りに なる).',
    ],
    examples: [
      { text: '本日[ほんじつ]は お集[あつ]まり いただき、 ありがとうございます。', reading: 'honjitsu wa oatsumari itadaki, arigatou gozaimasu.', meaning: 'Gracias por reunirse hoy aquí.' },
      { text: 'ご意見[いけん]を お聞[き]かせ いただけませんか。', reading: 'goiken o okikase itadakemasen ka.', meaning: '¿Podría darnos su opinión?' },
      { text: '電車[でんしゃ]と ホームの 間[あいだ]に ご注意[ちゅうい]ください。', reading: 'densha to hoomu no aida ni gochuui kudasai.', meaning: 'Tengan cuidado con el espacio entre el tren y el andén.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'しょうしょう お待[ま]ち ＿。', hint: 'Espere un momento, por favor (muy cortés).', options: ['ください', 'します', 'いたします', 'もうします'], answer: 'ください' },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: 'お返事[へんじ]を いただけますか。',
        options: ['返事[へんじ]を して もらえますか。', '返事[へんじ]を しましょうか。', '返事[へんじ]を あげましょうか。', '返事[へんじ]を しなくても いいですか。'],
        answer: '返事[へんじ]を して もらえますか。',
      },
      { type: 'meaning', text: 'ご来店[らいてん] いただき、 ありがとうございます。', options: ['Gracias por visitar nuestra tienda.', 'Gracias por comprar en línea.', 'Bienvenido a casa.', 'Gracias por esperar.'], answer: 'Gracias por visitar nuestra tienda.' },
    ],
  },
  {
    id: 'keigo-rareru',
    level: 'N3',
    title: 'Keigo IV: respeto con れる・られる',
    summary: '¿A qué hora viene el profesor?',
    pattern: 'forma pasiva = respeto: 書[か]かれる · 来[こ]られる · される',
    explanation: [
      'La forma **pasiva** también sirve como **respeto** hacia quien hace la acción: 社長[しゃちょう]は 何時[なんじ]に 来[こ]られますか (¿a qué hora viene el presidente?), 先生[せんせい]が 書[か]かれた 本[ほん] (el libro que escribió el profesor).',
      'Es menos formal que いらっしゃる o お〜に なる, y muy común en el trabajo y las noticias. する → **される**: 部長[ぶちょう]が 説明[せつめい]されました.',
    ],
    examples: [
      { text: '先生[せんせい]は もう 帰[かえ]られました。', reading: 'sensei wa mou kaeraremashita.', meaning: 'El profesor ya se retiró.' },
      { text: '部長[ぶちょう]は 毎朝[まいあさ] 新聞[しんぶん]を 読[よ]まれます。', reading: 'buchou wa maiasa shinbun o yomaremasu.', meaning: 'El jefe lee el periódico todas las mañanas.' },
      { text: '社長[しゃちょう]が 会議[かいぎ]で 話[はな]された 内容[ないよう]を まとめました。', reading: 'shachou ga kaigi de hanasareta naiyou o matomemashita.', meaning: 'Resumí lo que dijo el presidente en la reunión.' },
    ],
    exercises: [
      { type: 'type', prompt: '行[い]く → respeto con れる (行[い]＿)', hint: 'forma pasiva de 行[い]く', answers: ['いかれる', 'かれる'], kana: true },
      {
        type: 'choice',
        format: 'paraphrase',
        prompt: '田中[たなか]先生[せんせい]は 来年[らいねん] りゅうがくされます。',
        options: ['田中[たなか]先生[せんせい]は 来年[らいねん] りゅうがくなさいます。', '田中[たなか]先生[せんせい]は 来年[らいねん] りゅうがくさせられます。', '田中[たなか]先生[せんせい]は 来年[らいねん] りゅうがくして もらいます。', '田中[たなか]先生[せんせい]は 来年[らいねん] りゅうがくが できません。'],
        answer: '田中[たなか]先生[せんせい]は 来年[らいねん] りゅうがくなさいます。',
      },
      { type: 'meaning', text: 'お客[きゃく]さまが 来[こ]られました。', options: ['Llegó el cliente.', 'Hicieron venir al cliente.', 'El cliente no pudo venir.', 'Fui a ver al cliente.'], answer: 'Llegó el cliente.' },
    ],
  },
]
