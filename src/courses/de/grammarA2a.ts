import type { GrammarLesson } from '../grammar.ts'

// Gramática A2 del alemán, primera mitad (lecciones 31–45). Ottos Weg: Otto ya trabaja en un
// taller, se cambia de departamento y se arregla con trámites, el médico y el banco.

export const grammarA2a: GrammarLesson[] = [
  {
    id: 'de-dativ-artikel',
    level: 'A2',
    title: 'El dativo: dem, der, den',
    summary: 'A quién: dem Kollegen, der Chefin, den Kindern.',
    pattern: 'der → dem · die → der · das → dem · die (pl.) → den + -n',
    explanation: [
      'El **dativo** marca a la persona que **recibe** algo (el complemento indirecto): Ich gebe **dem** Kollegen den Schlüssel. Artículos: der → **dem**, die → **der**, das → **dem**, plural die → **den**. Con ein: **einem**, **einer**, **einem**.',
      'En plural el sustantivo agrega **-n** si no termina en -n o -s: die Kinder → mit den Kinder**n**. Los masculinos débiles también cambian: dem Kolleg**en**, dem Kund**en**.',
    ],
    examples: [
      { text: 'Otto zeigt dem Chef die Rechnung.', meaning: 'Otto le muestra la factura al jefe.' },
      { text: 'Hans schenkt seiner Schwester ein Buch.', meaning: 'Hans le regala un libro a su hermana.' },
      { text: 'Die Lehrerin erklärt den Kindern die Aufgabe.', meaning: 'La profesora les explica la tarea a los niños.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich gebe ＿ Kollegin den Schlüssel.', hint: 'die Kollegin', options: ['der', 'die', 'dem', 'den'], answer: 'der' },
      { type: 'choice', prompt: 'Otto hilft ＿ Nachbarn.', hint: 'der Nachbar (débil)', options: ['dem', 'den', 'der', 'des'], answer: 'dem' },
      { type: 'choice', prompt: 'Wir spielen mit den ＿.', hint: 'die Kinder', options: ['Kindern', 'Kinder', 'Kind', 'Kindes'], answer: 'Kindern' },
      { type: 'type', prompt: 'Er schreibt ＿ Chef eine E-Mail. (der Chef, Dativ)', answers: ['dem'], german: true },
    ],
  },
  {
    id: 'de-dativ-verben',
    level: 'A2',
    title: 'Verbos con dativo',
    summary: 'helfen, gefallen, gehören, danken, schmecken, passen.',
    pattern: 'Das Hemd gefällt mir. · Ich helfe dir.',
    explanation: [
      'Algunos verbos llevan **solo dativo**: **helfen** (ayudar), **danken** (agradecer), **gefallen** (gustar), **gehören** (pertenecer), **schmecken** (gustar la comida), **passen** (quedar bien), **antworten** (responder), **gratulieren** (felicitar).',
      'Con **gefallen** y **schmecken** la cosa es el sujeto y la persona va en dativo, como «gustar» en español: Die Wohnung **gefällt mir** (el departamento me gusta).',
    ],
    examples: [
      { text: 'Die neue Wohnung gefällt Otto sehr.', meaning: 'A Otto le gusta mucho el departamento nuevo.' },
      { text: 'Wem gehört das Fahrrad? – Es gehört dem Nachbarn.', meaning: '¿De quién es la bicicleta? – Es del vecino.' },
      { text: 'Ich danke Ihnen für Ihre Hilfe.', meaning: 'Le agradezco su ayuda.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Die Suppe schmeckt ＿ sehr gut.', hint: 'a mí', options: ['mir', 'mich', 'ich', 'mein'], answer: 'mir' },
      { type: 'choice', prompt: 'Kannst du ＿ helfen?', hint: 'a mí', options: ['mir', 'mich', 'meiner', 'ich'], answer: 'mir' },
      { type: 'choice', prompt: 'Die Jacke passt ＿ nicht.', hint: 'a ella', options: ['ihr', 'sie', 'ihn', 'ihm'], answer: 'ihr' },
      { type: 'meaning', text: 'Das Auto gehört meinem Bruder.', options: ['El auto es de mi hermano.', 'Mi hermano compró el auto.', 'Mi hermano maneja el auto.', 'El auto le gusta a mi hermano.'], answer: 'El auto es de mi hermano.' },
    ],
  },
  {
    id: 'de-dativ-pronomen',
    level: 'A2',
    title: 'Pronombres en dativo',
    summary: 'mir, dir, ihm, ihr, uns, euch, ihnen, Ihnen.',
    pattern: 'ich → mir · du → dir · er/es → ihm · sie → ihr · wir → uns · ihr → euch · sie/Sie → ihnen/Ihnen',
    explanation: [
      'Los pronombres en dativo: **mir, dir, ihm, ihr, ihm, uns, euch, ihnen, Ihnen**. Aparecen en frases muy comunes: Wie geht es **dir**? Es geht **mir** gut. Das gefällt **ihm**.',
      'Cuando hay dos complementos, el **pronombre** va antes que el sustantivo: Ich gebe **ihm** das Buch. Si los dos son pronombres, el acusativo va primero: Ich gebe **es ihm**.',
    ],
    examples: [
      { text: 'Wie geht es Ihnen? – Danke, mir geht es gut.', meaning: '¿Cómo está usted? – Gracias, estoy bien.' },
      { text: 'Hans hat mir die Stadt gezeigt.', meaning: 'Hans me mostró la ciudad.' },
      { text: 'Kannst du uns morgen helfen?', meaning: '¿Puedes ayudarnos mañana?' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Wie geht es ＿, Hans?', hint: 'a ti', options: ['dir', 'dich', 'du', 'dein'], answer: 'dir' },
      { type: 'choice', prompt: 'Otto gibt ＿ das Geld.', hint: 'a ellos', options: ['ihnen', 'sie', 'ihr', 'euch'], answer: 'ihnen' },
      { type: 'choice', prompt: 'Das Essen schmeckt ＿ nicht.', hint: 'a nosotros', options: ['uns', 'wir', 'unser', 'euch'], answer: 'uns' },
      { type: 'type', prompt: 'Ich danke ＿. (a usted)', answers: ['Ihnen'], german: true },
    ],
  },
  {
    id: 'de-wechselpraep',
    level: 'A2',
    title: 'Preposiciones de dos casos',
    summary: 'in, an, auf, über, unter, vor, hinter, neben, zwischen.',
    pattern: 'Wo? → dativo (im Schrank) · Wohin? → acusativo (in den Schrank)',
    explanation: [
      'Nueve preposiciones pueden llevar **dativo o acusativo**: **in, an, auf, über, unter, vor, hinter, neben, zwischen**. Si hay **posición** (¿dónde?, **Wo?**) van con **dativo**; si hay **movimiento hacia** un lugar (¿adónde?, **Wohin?**) van con **acusativo**.',
      'Das Buch liegt **auf dem** Tisch (está sobre la mesa). Ich lege das Buch **auf den** Tisch (lo pongo sobre la mesa). Contracciones: an dem → **am**, in dem → **im**, in das → **ins**, an das → **ans**.',
    ],
    examples: [
      { text: 'Die Schlüssel liegen auf dem Tisch.', meaning: 'Las llaves están sobre la mesa.' },
      { text: 'Otto hängt das Bild an die Wand.', meaning: 'Otto cuelga el cuadro en la pared.' },
      { text: 'Der Supermarkt ist zwischen der Bank und der Post.', meaning: 'El supermercado está entre el banco y el correo.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Die Milch steht im ＿.', hint: 'Wo? · der Kühlschrank', options: ['Kühlschrank', 'Kühlschranks', 'Kühlschranken', 'Kühlschränke'], answer: 'Kühlschrank' },
      { type: 'choice', prompt: 'Ich stelle die Milch in ＿ Kühlschrank.', hint: 'Wohin? · der Kühlschrank', options: ['den', 'dem', 'der', 'das'], answer: 'den' },
      { type: 'choice', prompt: 'Das Bild hängt an ＿ Wand.', hint: 'Wo? · die Wand', options: ['der', 'die', 'den', 'dem'], answer: 'der' },
      { type: 'choice', prompt: 'Wir gehen heute ＿ Kino.', hint: 'Wohin? · das Kino', options: ['ins', 'im', 'in dem', 'am'], answer: 'ins' },
    ],
  },
  {
    id: 'de-stellen-stehen',
    level: 'A2',
    title: 'stellen/stehen, legen/liegen, hängen',
    summary: 'Poner algo (acusativo) o estar en un lugar (dativo).',
    pattern: 'stellen → stehen · legen → liegen · setzen → sitzen · hängen → hängen',
    explanation: [
      'Verbos de **acción** (poner algo en un lugar) + acusativo: **stellen** (poner de pie), **legen** (poner acostado), **setzen** (sentar), **hängen** (colgar). Son regulares: ich habe gestellt, gelegt.',
      'Verbos de **posición** (estar en un lugar) + dativo: **stehen** (estar de pie), **liegen** (estar acostado), **sitzen** (estar sentado), **hängen** (estar colgado). Son irregulares: gestanden, gelegen, gesessen, gehangen.',
    ],
    examples: [
      { text: 'Otto stellt die Flasche auf den Tisch. Jetzt steht sie auf dem Tisch.', meaning: 'Otto pone la botella en la mesa. Ahora está en la mesa.' },
      { text: 'Wohin hast du meine Brille gelegt?', meaning: '¿Dónde dejaste mis lentes?' },
      { text: 'Die Jacke hängt im Schrank.', meaning: 'La chaqueta está colgada en el armario.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das Buch ＿ auf dem Regal.', hint: 'está (acostado)', options: ['liegt', 'legt', 'stellt', 'setzt'], answer: 'liegt' },
      { type: 'choice', prompt: 'Ich ＿ die Tasse auf den Tisch.', hint: 'pongo (de pie)', options: ['stelle', 'stehe', 'liege', 'sitze'], answer: 'stelle' },
      { type: 'choice', prompt: 'Das Kind ＿ auf dem Stuhl.', hint: 'está sentado', options: ['sitzt', 'setzt', 'stellt', 'legt'], answer: 'sitzt' },
      { type: 'choice', prompt: 'Wohin ＿ du den Mantel?', hint: 'cuelgas', options: ['hängst', 'liegst', 'stehst', 'sitzt'], answer: 'hängst' },
    ],
  },
  {
    id: 'de-perfekt-plus',
    level: 'A2',
    title: 'Perfekt: separables, inseparables e irregulares',
    summary: 'eingekauft, besucht, verstanden, angerufen.',
    pattern: 'separable: ein-ge-kauft · inseparable (be-, ver-, er-…): besucht · -ieren: telefoniert',
    explanation: [
      'Con **verbos separables** el **ge-** va entre el prefijo y la raíz: einkaufen → ein**ge**kauft, anrufen → an**ge**rufen, aufstehen → auf**ge**standen.',
      'Con prefijos **inseparables** (**be-, ver-, er-, ent-, emp-, ge-, zer-, miss-**) **no hay ge-**: besuchen → **besucht**, verstehen → **verstanden**, erzählen → **erzählt**. Tampoco con **-ieren**: reparieren → **repariert**.',
    ],
    examples: [
      { text: 'Gestern hat Otto ein Auto repariert.', meaning: 'Ayer Otto reparó un auto.' },
      { text: 'Hast du schon eingekauft?', meaning: '¿Ya hiciste las compras?' },
      { text: 'Ich habe die Aufgabe nicht verstanden.', meaning: 'No entendí la tarea.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Hans hat mich gestern ＿.', hint: 'anrufen', options: ['angerufen', 'geanrufen', 'anrufen', 'angeruft'], answer: 'angerufen' },
      { type: 'choice', prompt: 'Wir haben unsere Freunde ＿.', hint: 'besuchen', options: ['besucht', 'gebesucht', 'besuchen', 'besuchtet'], answer: 'besucht' },
      { type: 'type', prompt: 'Participio de «einkaufen»', answers: ['eingekauft'], german: true },
      { type: 'type', prompt: 'Participio de «reparieren»', answers: ['repariert'], german: true },
    ],
  },
  {
    id: 'de-praeteritum-modal',
    level: 'A2',
    title: 'El pasado de los modales',
    summary: 'konnte, musste, wollte, durfte, sollte.',
    pattern: 'ich konnte · du konntest · er konnte · wir konnten · ihr konntet · sie konnten',
    explanation: [
      'Para el pasado de los **modales** se usa el **Präteritum**, no el Perfekt: können → **konnte**, müssen → **musste**, wollen → **wollte**, dürfen → **durfte**, sollen → **sollte**, mögen → **mochte**. Sin umlaut.',
      'Terminaciones: ich konnte, du konnte**st**, er konnte, wir konnte**n**, ihr konnte**t**, sie konnte**n**. El otro verbo sigue al final: Ich **musste** gestern lange **arbeiten**.',
    ],
    examples: [
      { text: 'Otto konnte gestern nicht kommen, er musste arbeiten.', meaning: 'Otto no pudo venir ayer; tuvo que trabajar.' },
      { text: 'Als Kind wollte ich Pilot werden.', meaning: 'De niño quería ser piloto.' },
      { text: 'Wir durften im Kurs kein Handy benutzen.', meaning: 'En el curso no podíamos usar el celular.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Gestern ＿ ich zum Arzt gehen.', hint: 'tuve que', options: ['musste', 'muss', 'müsste', 'gemusst'], answer: 'musste' },
      { type: 'choice', prompt: 'Hans ＿ leider nicht kommen.', hint: 'no pudo', options: ['konnte', 'kann', 'konntet', 'könnte'], answer: 'konnte' },
      { type: 'type', prompt: 'du ＿ (wollen, pasado)', answers: ['wolltest'], german: true },
      { type: 'meaning', text: 'Wir sollten um acht Uhr da sein.', options: ['Teníamos que estar ahí a las ocho.', 'Deberíamos estar ahí a las ocho.', 'Estuvimos ahí a las ocho.', 'Queremos estar ahí a las ocho.'], answer: 'Teníamos que estar ahí a las ocho.' },
    ],
  },
  {
    id: 'de-weil',
    level: 'A2',
    title: 'weil: el verbo al final',
    summary: 'Ich lerne Deutsch, weil ich hier arbeite.',
    pattern: 'Hauptsatz, weil + … + VERBO.',
    explanation: [
      '**weil** (porque) inicia una **oración subordinada**: el verbo conjugado va **al final**: Ich bleibe zu Hause, weil ich krank **bin**. Antes de weil va coma.',
      'Compara con **denn** (A1), que no cambia el orden: …, **denn** ich **bin** krank. Con verbos separables, en la subordinada van juntos: …, weil ich früh **aufstehe**. Con modales, el modal va al final: …, weil ich arbeiten **muss**.',
    ],
    examples: [
      { text: 'Otto lernt Deutsch, weil er in Deutschland arbeiten möchte.', meaning: 'Otto aprende alemán porque quiere trabajar en Alemania.' },
      { text: 'Ich komme zu spät, weil der Bus Verspätung hat.', meaning: 'Llego tarde porque el bus viene atrasado.' },
      { text: 'Warum bist du müde? – Weil ich um fünf aufgestanden bin.', meaning: '¿Por qué estás cansado? – Porque me levanté a las cinco.' },
    ],
    exercises: [
      { type: 'order', meaning: '…porque estoy enfermo.', answer: ['weil', 'ich', 'krank', 'bin'] },
      { type: 'order', meaning: '…porque tengo que trabajar.', answer: ['weil', 'ich', 'arbeiten', 'muss'] },
      { type: 'choice', prompt: 'Ich gehe zum Arzt, weil ich Fieber ＿.', options: ['habe', 'hat', 'haben', 'hatte ich'], answer: 'habe' },
      {
        type: 'choice',
        prompt: '¿Qué frase es correcta?',
        options: ['Hans kommt nicht, weil er keine Zeit hat.', 'Hans kommt nicht, weil er hat keine Zeit.', 'Hans kommt nicht, weil hat er keine Zeit.', 'Hans kommt nicht weil, er keine Zeit hat.'],
        answer: 'Hans kommt nicht, weil er keine Zeit hat.',
      },
    ],
  },
  {
    id: 'de-dass',
    level: 'A2',
    title: 'dass: que…',
    summary: 'Ich glaube, dass… · Ich finde, dass…',
    pattern: 'Ich weiß, dass + … + VERBO.',
    explanation: [
      '**dass** (que) introduce lo que se piensa, se dice o se sabe: Ich **glaube**, **dass** Hans heute kommt. El verbo va **al final**.',
      'Se usa mucho con: **glauben, denken, finden** (opinar), **wissen, hoffen, sagen, meinen** y con **Es ist wichtig, dass…**, **Ich freue mich, dass…** No confundir con **das** (artículo o pronombre).',
    ],
    examples: [
      { text: 'Ich finde, dass die Wohnung zu teuer ist.', meaning: 'Creo que el departamento es demasiado caro.' },
      { text: 'Der Chef hat gesagt, dass wir morgen früher anfangen.', meaning: 'El jefe dijo que mañana empezamos más temprano.' },
      { text: 'Ich hoffe, dass du bald gesund bist.', meaning: 'Espero que pronto estés sano.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich weiß, ＿ du recht hast.', hint: 'que', options: ['dass', 'das', 'weil', 'ob'], answer: 'dass' },
      { type: 'order', meaning: 'Creo que Hans tiene razón.', answer: ['Ich', 'glaube', 'dass', 'Hans', 'recht', 'hat'] },
      { type: 'choice', prompt: 'Es ist wichtig, dass du pünktlich ＿.', options: ['bist', 'bist du', 'sein', 'ist'], answer: 'bist' },
      { type: 'meaning', text: 'Ich freue mich, dass du kommst.', options: ['Me alegra que vengas.', 'Me alegra venir.', 'Espero que vengas.', 'No sé si vienes.'], answer: 'Me alegra que vengas.' },
    ],
  },
  {
    id: 'de-wenn',
    level: 'A2',
    title: 'wenn: si / cuando',
    summary: 'Wenn ich Zeit habe, komme ich.',
    pattern: 'Wenn + … + VERBO, VERBO + sujeto … → Wenn es regnet, bleibe ich zu Hause.',
    explanation: [
      '**wenn** significa «si» (condición) o «cuando» (cada vez que, o en el futuro): **Wenn** ich Zeit **habe**, helfe ich dir. El verbo de la subordinada va al final.',
      'Si la oración empieza con la subordinada, la principal empieza con el **verbo**: Wenn es regnet, **bleibe** ich zu Hause. (Verbo – coma – verbo.)',
    ],
    examples: [
      { text: 'Wenn du Fragen hast, ruf mich an.', meaning: 'Si tienes preguntas, llámame.' },
      { text: 'Wenn ich Feierabend habe, gehe ich einkaufen.', meaning: 'Cuando termino de trabajar, voy a comprar.' },
      { text: 'Was machst du, wenn der Zug Verspätung hat?', meaning: '¿Qué haces si el tren viene atrasado?' },
    ],
    exercises: [
      { type: 'order', meaning: 'Si hace buen tiempo, vamos al parque.', answer: ['Wenn', 'das', 'Wetter', 'gut', 'ist', 'gehen', 'wir', 'in', 'den', 'Park'] },
      { type: 'choice', prompt: 'Wenn ich müde bin, ＿ ich früh ins Bett.', options: ['gehe', 'ich gehe', 'gehen', 'geht'], answer: 'gehe' },
      { type: 'choice', prompt: '＿ du Hilfe brauchst, sag es mir.', options: ['Wenn', 'Dass', 'Weil', 'Ob'], answer: 'Wenn' },
      { type: 'meaning', text: 'Wenn ich Zeit habe, rufe ich dich an.', options: ['Si tengo tiempo, te llamo.', 'Te llamé cuando tuve tiempo.', 'No tengo tiempo para llamarte.', 'Llámame si tienes tiempo.'], answer: 'Si tengo tiempo, te llamo.' },
    ],
  },
  {
    id: 'de-ob-indirekt',
    level: 'A2',
    title: 'Preguntas indirectas: ob, wo, wann…',
    summary: 'Wissen Sie, wo der Bahnhof ist?',
    pattern: 'Wissen Sie, + W-Wort/ob + … + VERBO?',
    explanation: [
      'Para preguntar con más cortesía se usa una **pregunta indirecta**: **Wissen Sie, wo** der Bahnhof **ist**? **Können Sie mir sagen, wann** der Kurs **beginnt**? El verbo va al final.',
      'Si la pregunta original es de sí o no, se usa **ob** («si»): Ist das Büro offen? → Wissen Sie, **ob** das Büro offen **ist**?',
    ],
    examples: [
      { text: 'Können Sie mir sagen, wie viel die Fahrkarte kostet?', meaning: '¿Me puede decir cuánto cuesta el boleto?' },
      { text: 'Ich weiß nicht, ob Hans heute arbeitet.', meaning: 'No sé si Hans trabaja hoy.' },
      { text: 'Otto fragt, wann die Werkstatt öffnet.', meaning: 'Otto pregunta a qué hora abre el taller.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Wissen Sie, ＿ der Arzt heute Sprechstunde hat?', hint: '¿si…?', options: ['ob', 'wenn', 'dass', 'was'], answer: 'ob' },
      { type: 'order', meaning: '¿Sabe dónde está la estación?', answer: ['Wissen', 'Sie', 'wo', 'der', 'Bahnhof', 'ist'] },
      { type: 'choice', prompt: 'Ich weiß nicht, wann der Zug ＿.', options: ['kommt', 'kommt er', 'kommen', 'ist kommt'], answer: 'kommt' },
      { type: 'meaning', text: 'Können Sie mir sagen, wo die Toilette ist?', options: ['¿Me puede decir dónde está el baño?', '¿Me puede decir si hay baño?', '¿Puedo ir al baño?', '¿Dónde está usted?'], answer: '¿Me puede decir dónde está el baño?' },
    ],
  },
  {
    id: 'de-komparativ',
    level: 'A2',
    title: 'Comparar: größer als, so groß wie',
    summary: 'Berlin ist größer als Köln.',
    pattern: 'adjetivo + -er + als · so + adjetivo + wie',
    explanation: [
      'El comparativo se forma con **-er**: klein → klein**er**, billig → billig**er**. Muchos adjetivos cortos toman umlaut: alt → **ä**lter, groß → gr**ö**ßer, jung → j**ü**nger, warm → w**ä**rmer. Irregulares: gut → **besser**, viel → **mehr**, gern → **lieber**, hoch → **höher**.',
      'Para comparar se usa **als**: Die Wohnung ist größer **als** die alte. Para igualdad: **so** groß **wie**: Hans ist **so** alt **wie** Otto.',
    ],
    examples: [
      { text: 'Die neue Wohnung ist größer und heller als die alte.', meaning: 'El departamento nuevo es más grande y más luminoso que el viejo.' },
      { text: 'In Berlin ist es im Winter kälter als in Valparaíso.', meaning: 'En Berlín hace más frío en invierno que en Valparaíso.' },
      { text: 'Mein Deutsch ist noch nicht so gut wie dein Spanisch.', meaning: 'Mi alemán todavía no es tan bueno como tu español.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Der Zug ist schneller ＿ der Bus.', options: ['als', 'wie', 'so', 'dann'], answer: 'als' },
      { type: 'choice', prompt: 'Hans ist so groß ＿ Otto.', options: ['wie', 'als', 'so', 'mehr'], answer: 'wie' },
      { type: 'choice', prompt: 'Comparativo de «gut»', options: ['besser', 'guter', 'güter', 'mehr gut'], answer: 'besser' },
      { type: 'type', prompt: 'Comparativo de «alt»', answers: ['älter'], german: true },
    ],
  },
  {
    id: 'de-superlativ',
    level: 'A2',
    title: 'El superlativo: am größten',
    summary: 'Der Fernsehturm ist am höchsten.',
    pattern: 'am + adjetivo + -sten · der/die/das + adjetivo + -ste',
    explanation: [
      'El superlativo: **am** + adjetivo + **-(e)sten**: am kleinsten, am billigsten, am ält**esten** (tras -t, -d, -s, -z se agrega e). Irregulares: gut → **am besten**, viel → **am meisten**, gern → **am liebsten**, groß → **am größten**, hoch → **am höchsten**.',
      'Delante de un sustantivo va con artículo y terminación: **der schnellste** Weg, **die beste** Lösung.',
    ],
    examples: [
      { text: 'Welcher Weg ist am schnellsten?', meaning: '¿Qué camino es el más rápido?' },
      { text: 'Das ist die beste Pizza in Berlin.', meaning: 'Es la mejor pizza de Berlín.' },
      { text: 'Am liebsten fahre ich mit dem Fahrrad.', meaning: 'Lo que más me gusta es andar en bicicleta.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Im Juli ist es am ＿.', hint: 'warm', options: ['wärmsten', 'wärmer', 'warmsten', 'wärmste'], answer: 'wärmsten' },
      { type: 'choice', prompt: 'Superlativo de «gut»: am ＿', options: ['besten', 'gutesten', 'bessersten', 'gutsten'], answer: 'besten' },
      { type: 'choice', prompt: 'Das ist ＿ beste Lösung.', hint: 'die Lösung', options: ['die', 'der', 'das', 'am'], answer: 'die' },
      { type: 'type', prompt: 'Superlativo de «viel»: am ＿', answers: ['meisten'], german: true },
    ],
  },
  {
    id: 'de-adjektiv-der',
    level: 'A2',
    title: 'Adjetivos después de der, die, das',
    summary: 'der neue Job, die kleine Wohnung, das alte Auto.',
    pattern: 'der/die/das + adjetivo + -e (nominativo) · -en en casi todo lo demás',
    explanation: [
      'Después de **der, die, das** (y dieser, welcher, jeder) el adjetivo lleva **-e** en el **nominativo singular** (der neu**e** Kollege, die klein**e** Wohnung, das alt**e** Auto) y en el **acusativo femenino y neutro** (ich sehe die klein**e** Wohnung).',
      'En todos los demás casos lleva **-en**: den neu**en** Kollegen, mit dem alt**en** Auto, die neu**en** Kollegen (plural). Consulta la tabla en la sección Tabla.',
    ],
    examples: [
      { text: 'Der neue Kollege heißt Murat.', meaning: 'El nuevo colega se llama Murat.' },
      { text: 'Otto repariert das alte Auto von Frau Weber.', meaning: 'Otto repara el auto viejo de la señora Weber.' },
      { text: 'Wir sprechen mit den neuen Nachbarn.', meaning: 'Hablamos con los vecinos nuevos.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Die ＿ Wohnung ist schön.', hint: 'klein', options: ['kleine', 'kleinen', 'kleiner', 'kleines'], answer: 'kleine' },
      { type: 'choice', prompt: 'Ich kenne den ＿ Chef noch nicht.', hint: 'neu · Akk.', options: ['neuen', 'neue', 'neuer', 'neues'], answer: 'neuen' },
      { type: 'choice', prompt: 'Mit dem ＿ Auto fahre ich nicht.', hint: 'alt · Dat.', options: ['alten', 'alte', 'alter', 'altes'], answer: 'alten' },
      { type: 'type', prompt: 'das ＿ Hemd (weiß, nominativo)', answers: ['weiße'], german: true },
    ],
  },
  {
    id: 'de-adjektiv-ein',
    level: 'A2',
    title: 'Adjetivos después de ein, kein, mein',
    summary: 'ein neuer Job, eine kleine Wohnung, ein altes Auto.',
    pattern: 'ein + adjetivo: -er (m) · -e (f) · -es (n) · -en en dativo',
    explanation: [
      'Después de **ein, kein, mein**… el adjetivo «muestra» el género que el artículo no muestra: ein neu**er** Job (m), eine klein**e** Wohnung (f), ein alt**es** Auto (n). En acusativo masculino: einen neu**en** Job.',
      'En dativo y en plural (con kein/mein) siempre **-en**: mit einem neu**en** Kollegen, meine alt**en** Freunde.',
    ],
    examples: [
      { text: 'Otto hat einen neuen Job.', meaning: 'Otto tiene un trabajo nuevo.' },
      { text: 'Wir suchen eine größere Wohnung mit einem kleinen Balkon.', meaning: 'Buscamos un departamento más grande con un balcón pequeño.' },
      { text: 'Das ist ein gutes Angebot.', meaning: 'Es una buena oferta.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das ist ein ＿ Tisch.', hint: 'schön · der Tisch', options: ['schöner', 'schöne', 'schönes', 'schönen'], answer: 'schöner' },
      { type: 'choice', prompt: 'Hans kauft ein ＿ Fahrrad.', hint: 'neu · das Fahrrad', options: ['neues', 'neuer', 'neue', 'neuen'], answer: 'neues' },
      { type: 'choice', prompt: 'Ich wohne in einer ＿ Stadt.', hint: 'klein · Dat.', options: ['kleinen', 'kleine', 'kleiner', 'kleines'], answer: 'kleinen' },
      { type: 'type', prompt: 'Ich habe einen ＿ Termin. (wichtig, Akk.)', answers: ['wichtigen'], german: true },
    ],
  },
]
