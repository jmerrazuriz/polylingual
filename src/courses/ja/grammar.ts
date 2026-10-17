import type { GrammarLesson } from '../grammar.ts'
import { grammarN4 } from './grammarN4.ts'
import { grammarN4b } from './grammarN4b.ts'
import { grammarN3 } from './grammarN3.ts'
import { grammarN3b } from './grammarN3b.ts'
import { grammarN3c } from './grammarN3c.ts'
import { grammarN5 } from './grammarN5.ts'

// Gramática básica de japonés usando solo kana. Las palabras van separadas por
// espacios para que se lean fácil (en japonés real se escriben juntas).

const basics: GrammarLesson[] = [
  {
    id: 'desu',
    title: 'です: «es», «soy»',
    summary: 'La forma educada de decir que algo es algo.',
    pattern: 'A です。 → Es A.',
    explanation: [
      '**です** va al final de la oración y significa «es», «soy» o «son». No cambia según la persona: sirve para yo, tú, él o ellos.',
      'Para negar se usa **じゃ ありません**: «no es». En japonés casi nunca se dice el sujeto si se entiende por el contexto.',
    ],
    examples: [
      { text: 'がくせい です。', reading: 'gakusei desu.', meaning: 'Soy estudiante. / Es estudiante.' },
      { text: 'ねこ です。', reading: 'neko desu.', meaning: 'Es un gato.' },
      { text: 'にほんじん です。', reading: 'nihonjin desu.', meaning: 'Soy japonés.' },
      { text: 'せんせい じゃ ありません。', reading: 'sensei ja arimasen.', meaning: 'No soy profesor.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'がくせい ＿。', hint: 'Soy estudiante.', options: ['です', 'じゃ', 'か', 'は'], answer: 'です' },
      { type: 'choice', prompt: 'いぬ じゃ ＿。', hint: 'No es un perro.', options: ['ありません', 'です', 'ます', 'か'], answer: 'ありません' },
      { type: 'meaning', text: 'せんせい です。', options: ['Es profesor.', 'No es profesor.', '¿Es profesor?', 'Profesor y estudiante.'], answer: 'Es profesor.' },
      { type: 'order', meaning: 'No es un gato.', answer: ['ねこ', 'じゃ', 'ありません'] },
      { type: 'meaning', text: 'がくせい じゃ ありません。', options: ['No es estudiante.', 'Es estudiante.', '¿Es estudiante?', 'Hay un estudiante.'], answer: 'No es estudiante.' },
    ],
  },
  {
    id: 'wa',
    title: 'は: el tema de la oración',
    summary: 'Cómo decir «A es B».',
    pattern: 'A は B です。 → A es B.',
    explanation: [
      '**は** marca el tema: aquello de lo que se habla. Es como decir «en cuanto a A…».',
      'Ojo: como partícula, は se escribe con は pero se pronuncia **«wa»**. Lo importante (です, el verbo) siempre va al final.',
    ],
    examples: [
      { text: 'わたし は がくせい です。', reading: 'watashi wa gakusei desu.', meaning: 'Yo soy estudiante.' },
      { text: 'たなかさん は せんせい です。', reading: 'tanaka-san wa sensei desu.', meaning: 'Tanaka es profesor.' },
      { text: 'ねこ は かわいい です。', reading: 'neko wa kawaii desu.', meaning: 'Los gatos son lindos.' },
      { text: 'わたし は チリじん です。', reading: 'watashi wa chirijin desu.', meaning: 'Soy chileno.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'わたし ＿ がくせい です。', hint: 'Yo soy estudiante.', options: ['は', 'を', 'の', 'か'], answer: 'は' },
      {
        type: 'choice',
        prompt: '¿Cómo se pronuncia は cuando es partícula?',
        options: ['wa', 'ha', 'o', 'e'],
        answer: 'wa',
        explanation: 'Como partícula se lee «wa»; dentro de una palabra, como en はな (flor), se lee «ha».',
      },
      { type: 'order', meaning: 'Yo soy profesor.', answer: ['わたし', 'は', 'せんせい', 'です'] },
      {
        type: 'meaning',
        text: 'たなかさん は にほんじん です。',
        options: ['Tanaka es japonés.', 'Soy japonés.', 'Tanaka no es japonés.', '¿Tanaka es japonés?'],
        answer: 'Tanaka es japonés.',
      },
    ],
  },
  {
    id: 'ka',
    title: 'か: preguntas',
    summary: 'Convertir una oración en pregunta.',
    pattern: '… です か。 → ¿…?',
    explanation: [
      'Para preguntar se agrega **か** al final. Se mantiene el punto 「。」: en japonés tradicional no se usa el signo de interrogación.',
      'Para responder: **はい、そうです** (sí, así es) o **いいえ、ちがいます** (no, no es así).',
    ],
    examples: [
      { text: 'がくせい です か。', reading: 'gakusei desu ka.', meaning: '¿Eres estudiante?' },
      { text: 'はい、 そう です。', reading: 'hai, sou desu.', meaning: 'Sí, así es.' },
      { text: 'いいえ、 ちがいます。', reading: 'iie, chigaimasu.', meaning: 'No, no es así.' },
      { text: 'あなた は にほんじん です か。', reading: 'anata wa nihonjin desu ka.', meaning: '¿Eres japonés?' },
    ],
    exercises: [
      { type: 'choice', prompt: 'あなた は がくせい です ＿。', hint: '¿Eres estudiante?', options: ['か', 'は', 'を', 'の'], answer: 'か' },
      { type: 'meaning', text: 'ねこ です か。', options: ['¿Es un gato?', 'Es un gato.', 'No es un gato.', 'Hay un gato.'], answer: '¿Es un gato?' },
      { type: 'order', meaning: '¿Eres profesor?', answer: ['あなた', 'は', 'せんせい', 'です', 'か'] },
      {
        type: 'choice',
        prompt: 'Te preguntan «がくせい です か» y sí lo eres. Respondes:',
        options: ['はい、 そう です。', 'いいえ、 ちがいます。', 'か です。', 'は です。'],
        answer: 'はい、 そう です。',
      },
    ],
  },
  {
    id: 'no',
    title: 'の: «de», posesión',
    summary: 'Mi libro, el perro de mi amigo.',
    pattern: 'A の B → B de A',
    explanation: [
      '**の** une dos sustantivos: el primero dice de quién es o de qué tipo es el segundo.',
      'El orden es al revés que en español: **わたし の ほん** es «mi libro» (literalmente «de mí, libro»).',
    ],
    examples: [
      { text: 'わたし の ほん', reading: 'watashi no hon', meaning: 'mi libro' },
      { text: 'せんせい の かばん', reading: 'sensei no kaban', meaning: 'el bolso del profesor' },
      { text: 'にほん の くるま', reading: 'nihon no kuruma', meaning: 'un auto japonés' },
      { text: 'ともだち の いぬ です。', reading: 'tomodachi no inu desu.', meaning: 'Es el perro de mi amigo.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'わたし ＿ かさ です。', hint: 'Es mi paraguas.', options: ['の', 'は', 'を', 'か'], answer: 'の' },
      { type: 'meaning', text: 'せんせい の ほん', options: ['el libro del profesor', 'el profesor del libro', 'el profesor lee', 'un libro y un profesor'], answer: 'el libro del profesor' },
      { type: 'order', meaning: 'Es el gato de mi amigo.', answer: ['ともだち', 'の', 'ねこ', 'です'] },
      {
        type: 'choice',
        prompt: '¿Cómo se dice «mi casa»?',
        options: ['わたし の いえ', 'いえ の わたし', 'わたし は いえ', 'いえ は わたし'],
        answer: 'わたし の いえ',
      },
    ],
  },
  {
    id: 'kore',
    title: 'これ, それ, あれ',
    summary: 'Esto, eso, aquello y «¿qué es?».',
    pattern: 'これ は なん です か。 → ¿Qué es esto?',
    explanation: [
      '**これ** es algo cerca de quien habla (esto), **それ** algo cerca de quien escucha (eso) y **あれ** algo lejos de ambos (aquello). Van solos, como sustantivos.',
      'Antes de un sustantivo se usan **この, その, あの**: この ほん (este libro). **なん** significa «qué».',
    ],
    examples: [
      { text: 'これ は ほん です。', reading: 'kore wa hon desu.', meaning: 'Esto es un libro.' },
      { text: 'それ は なん です か。', reading: 'sore wa nan desu ka.', meaning: '¿Qué es eso?' },
      { text: 'あれ は がっこう です。', reading: 'are wa gakkou desu.', meaning: 'Aquello es una escuela.' },
      { text: 'この ねこ は かわいい です。', reading: 'kono neko wa kawaii desu.', meaning: 'Este gato es lindo.' },
    ],
    exercises: [
      {
        type: 'choice',
        prompt: '＿ ほん は わたし の です。',
        hint: 'Este libro es mío.',
        options: ['この', 'これ', 'それ', 'あれ'],
        answer: 'この',
        explanation: 'Antes de un sustantivo (ほん) va この, no これ.',
      },
      {
        type: 'choice',
        prompt: '＿ は なん です か。',
        hint: '¿Qué es eso? (cerca de la otra persona)',
        options: ['それ', 'この', 'その', 'あの'],
        answer: 'それ',
      },
      { type: 'meaning', text: 'あれ は なん です か。', options: ['¿Qué es aquello?', '¿Qué es esto?', 'Aquello es un libro.', '¿Dónde está aquello?'], answer: '¿Qué es aquello?' },
      { type: 'order', meaning: 'Esto es mi bolso.', answer: ['これ', 'は', 'わたし', 'の', 'かばん', 'です'] },
    ],
  },
  {
    id: 'mo',
    title: 'も: «también»',
    summary: 'Yo también, esto también.',
    pattern: 'A も B です。 → A también es B.',
    explanation: [
      '**も** reemplaza a は cuando quieres decir «también»: わたし も がくせい です (yo también soy estudiante).',
      'Repetido, A も B も significa «tanto A como B».',
    ],
    examples: [
      { text: 'わたし も がくせい です。', reading: 'watashi mo gakusei desu.', meaning: 'Yo también soy estudiante.' },
      { text: 'これ も ほん です。', reading: 'kore mo hon desu.', meaning: 'Esto también es un libro.' },
      { text: 'ねこ も いぬ も すき です。', reading: 'neko mo inu mo suki desu.', meaning: 'Me gustan los gatos y también los perros.' },
    ],
    exercises: [
      {
        type: 'choice',
        prompt: 'たなかさん は せんせい です。 やまださん ＿ せんせい です。',
        hint: 'Yamada también es profesor.',
        options: ['も', 'は', 'の', 'を'],
        answer: 'も',
      },
      { type: 'meaning', text: 'わたし も にほんじん です。', options: ['Yo también soy japonés.', 'Yo soy japonés.', 'Yo no soy japonés.', '¿Yo soy japonés?'], answer: 'Yo también soy japonés.' },
      { type: 'order', meaning: 'Esto también es mío.', answer: ['これ', 'も', 'わたし', 'の', 'です'] },
    ],
  },
  {
    id: 'o',
    title: 'を y los verbos en ます',
    summary: 'Comer, beber, leer… y su pasado.',
    pattern: 'A を [verbo]ます。 → [Verbo] A.',
    explanation: [
      '**を** (se pronuncia «o») marca lo que recibe la acción: lo que se come, se bebe o se lee. El verbo siempre va al final.',
      'Formas educadas del verbo: **ます** (presente o futuro), **ません** (negativo), **ました** (pasado) y **ませんでした** (pasado negativo).',
    ],
    examples: [
      { text: 'パン を たべます。', reading: 'pan o tabemasu.', meaning: 'Como pan.' },
      { text: 'みず を のみます。', reading: 'mizu o nomimasu.', meaning: 'Bebo agua.' },
      { text: 'ほん を よみます。', reading: 'hon o yomimasu.', meaning: 'Leo un libro.' },
      { text: 'テレビ を みません。', reading: 'terebi o mimasen.', meaning: 'No veo televisión.' },
      { text: 'すし を たべました。', reading: 'sushi o tabemashita.', meaning: 'Comí sushi.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'みず ＿ のみます。', hint: 'Bebo agua.', options: ['を', 'は', 'の', 'か'], answer: 'を' },
      { type: 'choice', prompt: 'すし を ＿。', hint: 'Comí sushi.', options: ['たべました', 'たべます', 'たべません', 'たべませんでした'], answer: 'たべました' },
      { type: 'meaning', text: 'コーヒー を のみません。', options: ['No bebo café.', 'Bebo café.', 'Bebí café.', '¿Bebes café?'], answer: 'No bebo café.' },
      { type: 'order', meaning: 'Yo leo un libro.', answer: ['わたし', 'は', 'ほん', 'を', 'よみます'] },
    ],
  },
  {
    id: 'ni-e',
    title: 'に y へ: ir a un lugar',
    summary: 'Ir, venir y volver.',
    pattern: 'A に いきます。 → Voy a A.',
    explanation: [
      '**に** o **へ** marcan hacia dónde vas. Como partícula, へ se pronuncia **«e»**.',
      'Verbos de movimiento: **いきます** (ir), **きます** (venir) y **かえります** (volver a casa o al lugar de origen).',
    ],
    examples: [
      { text: 'がっこう に いきます。', reading: 'gakkou ni ikimasu.', meaning: 'Voy a la escuela.' },
      { text: 'にほん へ いきます。', reading: 'nihon e ikimasu.', meaning: 'Voy a Japón.' },
      { text: 'うち に かえります。', reading: 'uchi ni kaerimasu.', meaning: 'Vuelvo a casa.' },
      { text: 'あした メキシコ に いきます。', reading: 'ashita mekishiko ni ikimasu.', meaning: 'Mañana voy a México.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'がっこう ＿ いきます。', hint: 'Voy a la escuela.', options: ['に', 'を', 'の', 'も'], answer: 'に' },
      { type: 'choice', prompt: '¿Cómo se pronuncia へ cuando es partícula?', options: ['e', 'he', 'ha', 'wa'], answer: 'e' },
      { type: 'meaning', text: 'うち に かえります。', options: ['Vuelvo a casa.', 'Estoy en casa.', 'Salgo de casa.', 'Mi casa es grande.'], answer: 'Vuelvo a casa.' },
      { type: 'order', meaning: 'Mañana voy a Japón.', answer: ['あした', 'にほん', 'へ', 'いきます'] },
    ],
  },
  {
    id: 'de',
    title: 'で: dónde y con qué',
    summary: 'El lugar de una acción y el medio.',
    pattern: 'A で [verbo]ます。 → [Verbo] en / con A.',
    explanation: [
      '**で** marca el lugar donde ocurre una acción: «como **en** el restaurante».',
      'También marca el medio o la herramienta: «voy **en** bus», «como **con** palillos».',
    ],
    examples: [
      { text: 'レストラン で たべます。', reading: 'resutoran de tabemasu.', meaning: 'Como en el restaurante.' },
      { text: 'がっこう で べんきょう します。', reading: 'gakkou de benkyou shimasu.', meaning: 'Estudio en la escuela.' },
      { text: 'バス で いきます。', reading: 'basu de ikimasu.', meaning: 'Voy en bus.' },
      { text: 'はし で たべます。', reading: 'hashi de tabemasu.', meaning: 'Como con palillos.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'としょかん ＿ ほん を よみます。', hint: 'Leo libros en la biblioteca.', options: ['で', 'に', 'を', 'の'], answer: 'で' },
      { type: 'choice', prompt: 'バス ＿ がっこう に いきます。', hint: 'Voy a la escuela en bus.', options: ['で', 'を', 'は', 'の'], answer: 'で' },
      { type: 'meaning', text: 'うち で テレビ を みます。', options: ['Veo televisión en casa.', 'Voy a casa a ver televisión.', 'Mi casa tiene televisión.', 'No veo televisión en casa.'], answer: 'Veo televisión en casa.' },
      { type: 'order', meaning: 'Como sushi en el restaurante.', answer: ['レストラン', 'で', 'すし', 'を', 'たべます'] },
    ],
  },
  {
    id: 'adjetivos',
    title: 'Adjetivos い y な',
    summary: 'Grande, rico, tranquilo… y su negativo.',
    pattern: 'おおきい いぬ / しずか な まち',
    explanation: [
      'Los **adjetivos い** terminan en い (おおきい, ちいさい, おいしい). Van antes del sustantivo o antes de です. Su negativo cambia la い final por **くない**: おおきくない です. Ojo: el negativo de いい (bueno) es よくない.',
      'Los **adjetivos な** (しずか, げんき, きれい) llevan **な** antes de un sustantivo: しずか な まち. Su negativo es **じゃ ありません**. きれい termina en い, pero es un adjetivo な.',
    ],
    examples: [
      { text: 'おおきい いぬ', reading: 'ookii inu', meaning: 'un perro grande' },
      { text: 'この ケーキ は おいしい です。', reading: 'kono keeki wa oishii desu.', meaning: 'Este pastel está rico.' },
      { text: 'しずか な まち', reading: 'shizuka na machi', meaning: 'una ciudad tranquila' },
      { text: 'へや は きれい です。', reading: 'heya wa kirei desu.', meaning: 'La habitación está limpia.' },
      { text: 'さむくない です。', reading: 'samukunai desu.', meaning: 'No hace frío.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'しずか ＿ まち', hint: 'una ciudad tranquila', options: ['な', 'の', 'い', 'を'], answer: 'な' },
      {
        type: 'choice',
        prompt: '¿Cuál es el negativo de «たかい です»?',
        options: ['たかくない です', 'たかい じゃ ありません', 'たかな です', 'たかくない じゃ'],
        answer: 'たかくない です',
      },
      { type: 'meaning', text: 'この ラーメン は おいしい です。', options: ['Este ramen está rico.', 'Este ramen no está rico.', 'Quiero ramen.', '¿El ramen está rico?'], answer: 'Este ramen está rico.' },
      { type: 'order', meaning: 'Es un gato pequeño.', answer: ['ちいさい', 'ねこ', 'です'] },
    ],
  },
  {
    id: 'aru-iru',
    title: 'あります e います: «hay»',
    summary: 'Hay un libro, hay un gato.',
    pattern: 'A に B が あります / います。 → En A hay B.',
    explanation: [
      '**あります** se usa para cosas y plantas; **います** para personas y animales. Ambos significan «hay» o «está».',
      '**が** marca lo que hay, y **に** el lugar donde está: へや に ねこ が います (en la habitación hay un gato).',
    ],
    examples: [
      { text: 'ほん が あります。', reading: 'hon ga arimasu.', meaning: 'Hay un libro.' },
      { text: 'ねこ が います。', reading: 'neko ga imasu.', meaning: 'Hay un gato.' },
      { text: 'へや に テレビ が あります。', reading: 'heya ni terebi ga arimasu.', meaning: 'En la habitación hay una televisión.' },
      { text: 'こうえん に こども が います。', reading: 'kouen ni kodomo ga imasu.', meaning: 'En el parque hay niños.' },
    ],
    exercises: [
      {
        type: 'choice',
        prompt: 'いぬ が ＿。',
        hint: 'Hay un perro.',
        options: ['います', 'あります', 'です', 'ます'],
        answer: 'います',
        explanation: 'El perro es un ser vivo que se mueve: います.',
      },
      { type: 'choice', prompt: 'つくえ が ＿。', hint: 'Hay un escritorio.', options: ['あります', 'います', 'です', 'か'], answer: 'あります' },
      {
        type: 'meaning',
        text: 'へや に ねこ が います。',
        options: ['Hay un gato en la habitación.', 'El gato sale de la habitación.', 'Mi gato es grande.', 'No hay gatos en la habitación.'],
        answer: 'Hay un gato en la habitación.',
      },
      { type: 'order', meaning: 'En la casa hay un perro.', answer: ['いえ', 'に', 'いぬ', 'が', 'います'] },
    ],
  },
]

/** Todas las lecciones de gramática, en orden: las básicas, el resto del N5, el N4 y el N3. */
export const japaneseGrammar: GrammarLesson[] = [...basics, ...grammarN5, ...grammarN4, ...grammarN4b, ...grammarN3, ...grammarN3b, ...grammarN3c]
