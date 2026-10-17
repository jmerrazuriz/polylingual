import type { GrammarLesson } from '../grammar.ts'

// Gramática C2 del alemán, segunda parte (lecciones 181–195): variedades del alemán, lenguajes
// especializados, recursos de estilo y matices del léxico.

export const grammarC2b: GrammarLesson[] = [
  {
    id: 'de-oesterreich',
    level: 'C2',
    title: 'El alemán de Austria',
    summary: 'Jänner, Erdäpfel, Paradeiser, heuer, Sackerl',
    pattern: 'mismo sistema gramatical · léxico y fórmulas propias (austriacismos)',
    explanation: [
      'El **alemán austriaco** es una variedad estándar con palabras propias: **Jänner** (enero), **heuer** (este año), **Erdäpfel** (papas), **Paradeiser** (tomates), **Marille** (damasco), **Topfen** (quark), **Sackerl** (bolsa), **Semmel** (pan), **Obers** (crema), **Matura** (examen de fin del colegio), **Spital** (hospital).',
      'Diferencias gramaticales pequeñas: Perfekt con **sein** en verbos de posición (ich **bin** gesessen / gestanden / gelegen), diminutivo **-erl** (Sackerl, Busserl), y **das** Cola / **das** E-Mail. Saludos: **Grüß Gott**, **Servus**, **Baba** (chao).',
    ],
    examples: [
      { text: 'Heuer fahren wir im Jänner zum Skifahren nach Tirol.', meaning: 'Este año vamos a esquiar al Tirol en enero.' },
      { text: 'Brauchen Sie ein Sackerl für die Paradeiser?', meaning: '¿Necesita una bolsa para los tomates?' },
      { text: 'Ich bin den ganzen Tag im Büro gesessen.', meaning: 'Estuve sentado todo el día en la oficina.' },
    ],
    exercises: [
      { type: 'choice', prompt: '«Jänner» es…', options: ['enero', 'junio', 'el año', 'el invierno'], answer: 'enero' },
      { type: 'choice', prompt: '«Erdäpfel» en Alemania se dice…', options: ['Kartoffeln', 'Äpfel', 'Tomaten', 'Birnen'], answer: 'Kartoffeln' },
      { type: 'choice', prompt: '«heuer» significa…', options: ['este año', 'hoy', 'el año pasado', 'pronto'], answer: 'este año' },
      { type: 'choice', prompt: 'En Austria se dice «Ich ＿ gesessen».', options: ['bin', 'habe', 'war habe', 'werde'], answer: 'bin' },
    ],
  },
  {
    id: 'de-schweiz',
    level: 'C2',
    title: 'El alemán de Suiza',
    summary: 'Velo, parkieren, Trottoir, Grüezi, sin ß',
    pattern: 'estándar suizo (Schweizer Hochdeutsch) ≠ dialectos suizos (Schweizerdeutsch)',
    explanation: [
      'En Suiza conviven el **estándar suizo** (escrito, formal) y los **dialectos** (Schweizerdeutsch, hablados en casi todo). El estándar suizo **no usa ß**: Strasse, gross, Fussball. Tiene palabras propias, muchas del francés: **Velo** (bicicleta), **Trottoir** (vereda), **parkieren** (estacionar), **Billett** (boleto), **Poulet** (pollo), **Glace** (helado), **Znüni** (colación de media mañana).',
      'Otros: **grillieren** (asar), **Natel** (celular, antiguo), **zügeln** (mudarse), **Grüezi** (hola, formal), **Merci vielmal** (muchas gracias), **Ade** / **Uf Widerluege** (chao). Se escribe **Fr.** o **CHF** para los francos.',
    ],
    examples: [
      { text: 'Bitte das Velo nicht auf dem Trottoir parkieren.', meaning: 'Por favor no estacione la bicicleta en la vereda.' },
      { text: 'Wir zügeln nächsten Monat nach Zürich.', meaning: 'Nos mudamos el próximo mes a Zúrich.' },
      { text: 'Das Billett kostet 4.40 Franken.', meaning: 'El boleto cuesta 4,40 francos.' },
    ],
    exercises: [
      { type: 'choice', prompt: '«Velo» es…', options: ['bicicleta', 'auto', 'vela', 'velocidad'], answer: 'bicicleta' },
      { type: 'choice', prompt: 'En el estándar suizo, «Straße» se escribe…', options: ['Strasse', 'Straße', 'Strase', 'Strahse'], answer: 'Strasse' },
      { type: 'choice', prompt: '«zügeln» en Suiza significa…', options: ['mudarse', 'viajar en tren', 'frenar', 'cocinar'], answer: 'mudarse' },
      { type: 'choice', prompt: 'Saludo formal típico de Suiza:', options: ['Grüezi', 'Moin', 'Servus', 'Tach'], answer: 'Grüezi' },
    ],
  },
  {
    id: 'de-dialekte',
    level: 'C2',
    title: 'Reconocer los dialectos',
    summary: 'Moin! · Grüß Gott! · Gell? · Isch des so?',
    pattern: 'norte (Platt) · centro · sur (bávaro, suabo, alemánico) · este (sajón)',
    explanation: [
      'No hace falta hablar dialecto, pero sí **reconocerlo**. **Norte** (bajo alemán y Hamburgo): **Moin** (hola, a cualquier hora), **nich** (nicht), **ick** (Berlín: ich). **Bávaro**: **Servus**, **gell?** (¿no?), **net** (nicht), **a** (ein): **I hob koa Zeit** (Ich habe keine Zeit).',
      '**Suabo** (Stuttgart): **-le** como diminutivo (Häusle), **isch** (ist), **schaffe** (arbeiten). **Sajón** (Leipzig, Dresde): consonantes suaves (**Gaffee** por Kaffee). **Renano / Colonia**: **Kölsch**, **jot** (gut). Muchas personas mezclan estándar y dialecto según la situación.',
    ],
    examples: [
      { text: 'Moin! Na, alles klar bei dir?', meaning: '¡Hola! ¿Todo bien? (norte)' },
      { text: 'Des passt scho, gell?', meaning: 'Está bien así, ¿no? (bávaro)' },
      { text: 'Mir schaffe jeden Tag, des isch halt so.', meaning: 'Trabajamos todos los días, así es nomás. (suabo)' },
    ],
    exercises: [
      { type: 'choice', prompt: '«Moin» es un saludo típico del…', options: ['norte', 'sur', 'Austria', 'Suiza'], answer: 'norte' },
      { type: 'choice', prompt: '«net» en bávaro significa…', options: ['nicht', 'nett', 'nur', 'nein danke'], answer: 'nicht' },
      { type: 'choice', prompt: '«schaffe» en suabo significa…', options: ['arbeiten', 'schaffen (crear)', 'schlafen', 'schauen'], answer: 'arbeiten' },
      { type: 'meaning', text: 'I hob koa Zeit.', options: ['No tengo tiempo.', 'Tengo tiempo.', 'No hay tiempo para mí.', 'Tengo una idea.'], answer: 'No tengo tiempo.' },
    ],
  },
  {
    id: 'de-jugendsprache',
    level: 'C2',
    title: 'Lenguaje juvenil y anglicismos',
    summary: 'cringe, lost, chillen, Digga, wild',
    pattern: 'anglicismos adaptados · intensificadores · palabras de moda (cambian rápido)',
    explanation: [
      'En la calle, las redes y entre jóvenes hay mucho **vocabulario de moda**, en gran parte inglés: **chillen** (relajarse), **cringe** (vergonzoso), **lost** (perdido, despistado), **wild** (increíble), **Digga** / **Bro** (amigo), **lit** (genial), **sus** (sospechoso), **Ehrenmann / Ehrenfrau** (persona decente), **sheesh** (¡guau!).',
      'Los anglicismos se **conjugan en alemán**: ich habe **gechillt**, wir haben das **gecheckt**, **downloaden** → heruntergeladen / gedownloadet. Ojo: estas palabras envejecen rápido y no se usan en registro formal. Saber reconocerlas ayuda con series, podcasts y redes.',
    ],
    examples: [
      { text: 'Digga, das war echt wild gestern!', meaning: 'Hermano, ¡lo de ayer fue increíble!' },
      { text: 'Ich bin total lost in Mathe.', meaning: 'Estoy completamente perdido en matemáticas.' },
      { text: 'Wir haben am Wochenende nur gechillt.', meaning: 'El fin de semana solo descansamos.' },
    ],
    exercises: [
      { type: 'choice', prompt: '«chillen» significa…', options: ['relajarse', 'gritar', 'enfriar', 'estudiar'], answer: 'relajarse' },
      { type: 'choice', prompt: 'Perfekt de «chillen»:', options: ['gechillt', 'chillgen', 'gechillen', 'chilled'], answer: 'gechillt' },
      { type: 'choice', prompt: '«Das ist so cringe!» expresa…', options: ['vergüenza ajena', 'alegría', 'miedo', 'sorpresa positiva'], answer: 'vergüenza ajena' },
      { type: 'choice', prompt: '¿Dónde NO se usa «Digga»?', options: ['En una carta a la Ausländerbehörde', 'Con amigos', 'En redes sociales', 'En el patio del colegio'], answer: 'En una carta a la Ausländerbehörde' },
    ],
  },
  {
    id: 'de-rechtssprache',
    level: 'C2',
    title: 'El lenguaje jurídico',
    summary: 'unbeschadet · im Sinne des § · hat … zu leisten',
    pattern: 'pasiva y haben/sein + zu · estilo nominal · fórmulas fijas · Konjunktiv para supuestos',
    explanation: [
      'Los contratos y las leyes usan fórmulas que hay que reconocer: **im Sinne des** § 5 (en el sentido del art. 5), **gemäß / nach** § 3, **unbeschadet** + Gen. (sin perjuicio de), **soweit nicht anders vereinbart**, **vorbehaltlich** (bajo reserva de), **mit Wirkung vom** (con efecto desde), **binnen** (dentro de: **binnen** zwei Wochen).',
      'La obligación se expresa con **haben/sein + zu**: Der Mieter **hat** die Kaution **zu leisten**. Die Miete **ist** monatlich im Voraus **zu entrichten**. Y los supuestos con **Konjunktiv** o **sofern**: **Sofern** der Mieter die Frist versäumt, …',
    ],
    examples: [
      { text: 'Der Vermieter hat die Kaution binnen sechs Monaten zurückzuzahlen.', meaning: 'El arrendador debe devolver la garantía dentro de seis meses.' },
      { text: 'Unbeschadet weiterer Ansprüche ist eine Vertragsstrafe zu zahlen.', meaning: 'Sin perjuicio de otras reclamaciones, debe pagarse una penalización.' },
      { text: 'Die Kündigung wird mit Wirkung vom 1. März wirksam.', meaning: 'La rescisión se hace efectiva a partir del 1 de marzo.' },
    ],
    exercises: [
      { type: 'choice', prompt: '«binnen einer Woche» significa…', options: ['dentro de una semana', 'después de una semana', 'cada semana', 'hace una semana'], answer: 'dentro de una semana' },
      { type: 'choice', prompt: 'Der Käufer ＿ den Kaufpreis sofort zu zahlen.', options: ['hat', 'ist', 'wird', 'muss'], answer: 'hat' },
      { type: 'choice', prompt: '＿ des Paragrafen 4 gilt Folgendes …', hint: 'en el sentido de', options: ['Im Sinne', 'Mit Sinn', 'Im Sinn von', 'Sinngemäß von'], answer: 'Im Sinne' },
      { type: 'meaning', text: 'vorbehaltlich der Zustimmung des Vermieters', options: ['bajo reserva de la aprobación del arrendador', 'sin la aprobación del arrendador', 'contra la voluntad del arrendador', 'después de hablar con el arrendador'], answer: 'bajo reserva de la aprobación del arrendador' },
    ],
  },
  {
    id: 'de-infinitiv-imperativ',
    level: 'C2',
    title: 'Instrucciones técnicas e infinitivo imperativo',
    summary: 'Nicht rauchen! · Schraube lösen. · Bitte anschnallen.',
    pattern: 'INFINITIVO al final (orden impersonal) · participio (Aufgepasst!) · sein + zu',
    explanation: [
      'Los **manuales** y **avisos** dan órdenes con el **infinitivo**: **Bitte anschnallen.** **Nicht rauchen!** **Deckel abnehmen, Filter herausziehen, neuen Filter einsetzen.** Es impersonal y neutro, sin du ni Sie. También con **participio**: **Aufgepasst!** **Stillgestanden!** (militar).',
      'En documentación técnica se combinan con **sein + zu** y el pasivo: Die Schrauben **sind** mit 25 Nm **anzuziehen**. Vor dem Einbau **ist** die Dichtung **zu prüfen**. Y aparecen abreviaturas y normas: **DIN**, **ca.**, **max.**, **lt.** (laut), **s. Abb. 3** (véase figura 3).',
    ],
    examples: [
      { text: 'Motor abstellen, Schlüssel abziehen, Batterie abklemmen.', meaning: 'Apagar el motor, sacar la llave, desconectar la batería.' },
      { text: 'Die Radmuttern sind mit 120 Nm anzuziehen (s. Abb. 4).', meaning: 'Las tuercas de rueda deben apretarse a 120 Nm (véase fig. 4).' },
      { text: 'Bitte nicht berühren – Hochspannung!', meaning: 'Por favor no tocar: ¡alta tensión!' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Aviso en un tren: «Bitte ＿!»', options: ['einsteigen', 'steigen Sie ein', 'einsteigst', 'eingestiegen werden'], answer: 'einsteigen' },
      { type: 'choice', prompt: 'Die Schrauben sind fest ＿.', options: ['anzuziehen', 'anziehen', 'angezogen zu', 'zu anziehen'], answer: 'anzuziehen' },
      { type: 'choice', prompt: '«s. Abb. 2» significa…', options: ['véase figura 2', 'sin abreviatura 2', 'según el apartado 2', 'solo 2 piezas'], answer: 'véase figura 2' },
      { type: 'order', meaning: 'No dejar el vehículo sin vigilancia.', answer: ['Fahrzeug', 'nicht', 'unbeaufsichtigt', 'lassen'] },
    ],
  },
  {
    id: 'de-pressesprache',
    level: 'C2',
    title: 'El lenguaje de la prensa',
    summary: 'soll … haben · wie aus Kreisen verlautete · laut Medienberichten',
    pattern: 'distancia (Konj. I, sollen, angeblich) · estilo nominal · metáforas fijas',
    explanation: [
      'La prensa marca **distancia** frente a lo que no está confirmado: **Der Minister soll von dem Skandal gewusst haben.** **Wie aus Regierungskreisen verlautete**, … (según fuentes del gobierno). **Laut Medienberichten** / **Berichten zufolge** … **mutmaßlich** (presunto).',
      'Usa **metáforas fijas**: **Die Preise explodieren.** **Die Wirtschaft schwächelt.** **Die Koalition wackelt.** **Ein Ruck geht durch das Land.** **Das Thema kocht hoch.** Y verbos introductorios variados: verlauten, mitteilen, bekannt geben, dementieren (desmentir).',
    ],
    examples: [
      { text: 'Der Konzern soll jahrelang Abgaswerte manipuliert haben.', meaning: 'Se dice que el grupo manipuló durante años los valores de emisiones.' },
      { text: 'Ein Sprecher dementierte die Berichte umgehend.', meaning: 'Un portavoz desmintió de inmediato las informaciones.' },
      { text: 'Die Energiepreise sind regelrecht explodiert.', meaning: 'Los precios de la energía se dispararon literalmente.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Es heißt, dass er zurücktritt. = Er ＿ zurücktreten.', options: ['soll', 'will', 'muss', 'darf'], answer: 'soll' },
      { type: 'choice', prompt: 'Die Regierung ＿ die Gerüchte (desmintió).', options: ['dementierte', 'bestätigte', 'verlautete', 'verbreitete'], answer: 'dementierte' },
      { type: 'choice', prompt: '«Die Wirtschaft schwächelt» significa…', options: ['la economía se debilita', 'la economía crece mucho', 'la economía está estable', 'la economía colapsó'], answer: 'la economía se debilita' },
      { type: 'meaning', text: 'Wie aus Unternehmenskreisen verlautete, wird das Werk geschlossen.', options: ['Según fuentes de la empresa, la planta se cerrará.', 'La empresa confirmó oficialmente que abre una planta.', 'Nadie sabe nada de la planta.', 'La planta se vende a la empresa.'], answer: 'Según fuentes de la empresa, la planta se cerrará.' },
    ],
  },
  {
    id: 'de-euphemismen',
    level: 'C2',
    title: 'Eufemismos y lenguaje político',
    summary: 'Preisanpassung · freisetzen · Nullwachstum',
    pattern: 'palabra suave para algo negativo → reconocer qué se quiere ocultar',
    explanation: [
      'Empresas y políticos suavizan las malas noticias con **eufemismos**: **Preisanpassung** (= subida de precios), **Mitarbeiter freisetzen** (= despedir), **Nullwachstum / negatives Wachstum** (= estancamiento / caída), **sozialverträglicher Stellenabbau** (= despidos con indemnización), **Herausforderung** (= problema), **suboptimal** (= malo).',
      'También el **lenguaje político** crea términos con carga valorativa: **Steuererleichterung** vs. **Steuergeschenk**, **Reform** vs. **Kürzung**. Un lector C2 reconoce **quién** habla y **qué** imagen quiere transmitir. Un término muy criticado puede elegirse **Unwort des Jahres**.',
    ],
    examples: [
      { text: 'Aufgrund gestiegener Kosten sehen wir uns zu einer Preisanpassung gezwungen.', meaning: 'Debido al aumento de costos, nos vemos obligados a subir los precios.' },
      { text: 'Im Zuge der Umstrukturierung werden 300 Mitarbeiter freigesetzt.', meaning: 'En el marco de la reestructuración, se despedirá a 300 empleados.' },
      { text: 'Die Opposition spricht von einem Steuergeschenk für Reiche.', meaning: 'La oposición habla de un regalo tributario para los ricos.' },
    ],
    exercises: [
      { type: 'choice', prompt: '«Preisanpassung» casi siempre significa…', options: ['subida de precios', 'bajada de precios', 'precio fijo', 'oferta especial'], answer: 'subida de precios' },
      { type: 'choice', prompt: '«Mitarbeiter freisetzen» significa…', options: ['despedir empleados', 'dar vacaciones', 'liberar presos', 'contratar'], answer: 'despedir empleados' },
      { type: 'choice', prompt: '«negatives Wachstum» es un eufemismo de…', options: ['decrecimiento', 'crecimiento fuerte', 'estabilidad', 'inflación'], answer: 'decrecimiento' },
      { type: 'meaning', text: 'Wir stehen vor großen Herausforderungen.', options: ['Tenemos problemas serios (dicho con suavidad).', 'Todo va perfecto.', 'Vamos a ganar un premio.', 'Nos aburrimos.'], answer: 'Tenemos problemas serios (dicho con suavidad).' },
    ],
  },
  {
    id: 'de-stilmittel',
    level: 'C2',
    title: 'Recursos retóricos',
    summary: 'Metapher, Anapher, Alliteration, rhetorische Frage, Klimax',
    pattern: 'reconocer el recurso → explicar su efecto',
    explanation: [
      'Para analizar textos (y discursos) en C2 hay que nombrar los **recursos** y su **efecto**: **Metapher** (Das Land steht am Abgrund), **Vergleich** (stark wie ein Bär), **Anapher** (repetición al inicio: Wir wollen …, wir können …, wir werden …), **Alliteration** (mismo sonido inicial: Kind und Kegel, Haus und Hof).',
      'Otros: **rhetorische Frage** (¿Wer will das schon?), **Klimax** (gradación: Er kam, sah und siegte), **Antithese** (oposición: Arm und Reich), **Ironie**, **Hyperbel** (exageración: Ich habe tausendmal angerufen), **Personifikation** (Die Stadt schläft). Al comentar: Durch die Anapher **wird betont**, dass …',
    ],
    examples: [
      { text: 'Wir schaffen das. Wir schaffen das gemeinsam. Wir schaffen das für unsere Kinder.', meaning: 'Lo lograremos. Lo lograremos juntos. Lo lograremos por nuestros hijos. (anáfora)' },
      { text: 'Wer möchte schon in einer Stadt ohne Bäume leben?', meaning: '¿Quién querría vivir en una ciudad sin árboles? (pregunta retórica)' },
      { text: 'Die Wirtschaft ist der Motor unseres Wohlstands.', meaning: 'La economía es el motor de nuestro bienestar. (metáfora)' },
    ],
    exercises: [
      { type: 'choice', prompt: '«Ich habe dir schon hundertmal gesagt …» es una…', options: ['Hyperbel', 'Anapher', 'Alliteration', 'Antithese'], answer: 'Hyperbel' },
      { type: 'choice', prompt: '«Milch macht müde Männer munter» usa…', options: ['Alliteration', 'Klimax', 'rhetorische Frage', 'Personifikation'], answer: 'Alliteration' },
      { type: 'choice', prompt: '«Die Sonne lacht» es una…', options: ['Personifikation', 'Antithese', 'Anapher', 'Ellipse'], answer: 'Personifikation' },
      { type: 'choice', prompt: '«Jung und Alt kamen zum Fest» contiene una…', options: ['Antithese', 'Hyperbel', 'rhetorische Frage', 'Metapher'], answer: 'Antithese' },
    ],
  },
  {
    id: 'de-rezension',
    level: 'C2',
    title: 'Escribir una reseña',
    summary: 'fesselnd, gelungen, langatmig, überzeichnet',
    pattern: 'datos de la obra → resumen breve → valoración argumentada → recomendación',
    explanation: [
      'Una **reseña** (Rezension) presenta la obra (**In seinem neuen Roman** «…» **erzählt** X **von** …), resume sin revelar el final y, sobre todo, **valora con argumentos**. Vocabulario positivo: **fesselnd** (atrapante), **gelungen**, **vielschichtig** (con muchas capas), **einfühlsam** (sensible), **pointiert**, **sprachgewaltig**.',
      'Negativo: **langatmig** (lento, largo), **vorhersehbar** (predecible), **klischeehaft**, **überzeichnet** (exagerado), **blass** (sin fuerza), **konstruiert** (artificial). Para cerrar: **Ein lesenswertes Buch für alle, die** … / **Wer** … **sucht, wird hier enttäuscht.**',
    ],
    examples: [
      { text: 'Der Roman ist sprachlich brillant, allerdings stellenweise etwas langatmig.', meaning: 'La novela es brillante en el lenguaje, aunque en partes algo lenta.' },
      { text: 'Die Figuren wirken überzeichnet und die Handlung ist vorhersehbar.', meaning: 'Los personajes parecen exagerados y la trama es predecible.' },
      { text: 'Ein vielschichtiger und einfühlsamer Film, den man nicht so schnell vergisst.', meaning: 'Una película con muchas capas y sensible, que no se olvida tan rápido.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Una historia que atrapa es…', options: ['fesselnd', 'langatmig', 'vorhersehbar', 'blass'], answer: 'fesselnd' },
      { type: 'choice', prompt: 'Si ya sabes cómo termina desde la página 10, la historia es…', options: ['vorhersehbar', 'vielschichtig', 'gelungen', 'einfühlsam'], answer: 'vorhersehbar' },
      { type: 'choice', prompt: 'Personajes exagerados, como caricaturas, son…', options: ['überzeichnet', 'einfühlsam', 'pointiert', 'gelungen'], answer: 'überzeichnet' },
      { type: 'choice', prompt: '¿Qué frase cierra bien una reseña?', options: ['Ein lesenswertes Buch für alle, die Familiengeschichten mögen.', 'Das Buch hat 300 Seiten.', 'Der Autor wurde 1970 geboren.', 'Ich habe das Buch gekauft.'], answer: 'Ein lesenswertes Buch für alle, die Familiengeschichten mögen.' },
    ],
  },
  {
    id: 'de-glosse',
    level: 'C2',
    title: 'Columna y glosa: escribir con filo',
    summary: 'inicio provocador, ironía y una idea final que queda',
    pattern: 'gancho → tesis afilada → ejemplos con ironía → giro final (Pointe)',
    explanation: [
      'La **glosa** y la **columna** comentan la actualidad con **opinión y estilo**. Empiezan con un **gancho** (una escena, una pregunta, una cifra sorprendente), sostienen una **tesis clara** y usan **ironía**, **exageración** y **preguntas retóricas**. Terminan con una **Pointe**: un giro o una frase que se recuerda.',
      'Recursos útiles: dirigirse al lector (**Seien wir ehrlich:** …), contrastes (**Was früher Luxus war, ist heute Pflicht**), citas reinterpretadas y frases cortas para dar ritmo. A diferencia del ensayo, aquí se permite ser **subjetivo**, pero siempre con argumentos.',
    ],
    examples: [
      { text: 'Seien wir ehrlich: Niemand liest die AGB. Niemand. Nicht einmal die Juristen, die sie schreiben.', meaning: 'Seamos honestos: nadie lee los términos y condiciones. Nadie. Ni siquiera los abogados que los escriben.' },
      { text: 'Früher reparierte man ein Radio. Heute repariert man nicht einmal mehr eine Meinung.', meaning: 'Antes uno reparaba una radio. Hoy ni siquiera se repara una opinión.' },
      { text: 'Und so bleibt am Ende nur eine Gewissheit: Der nächste Stau kommt bestimmt.', meaning: 'Y así al final queda solo una certeza: el próximo taco llegará seguro.' },
    ],
    exercises: [
      { type: 'choice', prompt: '¿Qué es la «Pointe» de una glosa?', options: ['El giro final que se recuerda', 'El título', 'La bibliografía', 'El resumen objetivo'], answer: 'El giro final que se recuerda' },
      { type: 'choice', prompt: 'Un buen inicio de columna es…', options: ['Eine Szene, eine Frage oder eine überraschende Zahl', 'Eine Liste von Quellen', 'Eine Definition aus dem Wörterbuch', 'Eine Entschuldigung'], answer: 'Eine Szene, eine Frage oder eine überraschende Zahl' },
      { type: 'choice', prompt: 'A diferencia de un resumen, una glosa es…', options: ['subjetiva y con estilo', 'neutral y objetiva', 'sin opinión', 'una lista de datos'], answer: 'subjetiva y con estilo' },
      { type: 'meaning', text: 'Was gestern noch Luxus war, ist heute Pflicht.', options: ['Lo que ayer era un lujo hoy es obligatorio.', 'El lujo de ayer ya no existe.', 'Hoy no hay lujo.', 'El deber es un lujo.'], answer: 'Lo que ayer era un lujo hoy es obligatorio.' },
    ],
  },
  {
    id: 'de-synonyme',
    level: 'C2',
    title: 'Elegir entre sinónimos',
    summary: 'ändern / verändern / wandeln · sagen / äußern / behaupten',
    pattern: 'mismo significado básico, distinto matiz, registro o construcción',
    explanation: [
      'En C2 la diferencia está en el **matiz**: **ändern** (cambiar algo concreto: einen Plan ändern), **verändern** (transformar profundamente: Das Internet hat die Welt verändert), **sich wandeln** (transformarse lentamente, culto). **sagen** (neutro), **äußern** (expresar, formal), **behaupten** (afirmar sin pruebas), **meinen** (opinar; también «querer decir»).',
      'Otros pares: **beginnen** (formal) / **anfangen** (neutro); **erhalten** (formal) / **bekommen** / **kriegen** (coloquial); **sehen** / **betrachten** (contemplar, analizar) / **gucken** (coloquial); **schnell** / **zügig** (con buen ritmo, formal) / **rasch**; **wichtig** / **wesentlich** / **entscheidend**.',
    ],
    examples: [
      { text: 'Die Digitalisierung hat das Handwerk grundlegend verändert.', meaning: 'La digitalización transformó profundamente los oficios.' },
      { text: 'Er behauptet, er habe nichts gewusst – aber Beweise hat er keine.', meaning: 'Afirma que no sabía nada, pero no tiene pruebas.' },
      { text: 'Wir bitten um eine zügige Bearbeitung.', meaning: 'Pedimos una tramitación ágil.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Wir müssen den Termin ＿ (moverlo a otro día).', options: ['ändern', 'verändern', 'wandeln', 'umwandeln'], answer: 'ändern' },
      { type: 'choice', prompt: 'Die Erfahrung hat ihn als Mensch ＿.', options: ['verändert', 'geändert', 'gewandelt', 'umgetauscht'], answer: 'verändert' },
      { type: 'choice', prompt: 'En un correo formal, mejor «Wir haben Ihre Nachricht ＿.»', options: ['erhalten', 'gekriegt', 'gekommen', 'bekriegt'], answer: 'erhalten' },
      { type: 'choice', prompt: 'Afirmar algo sin pruebas es…', options: ['behaupten', 'äußern', 'erwähnen', 'betonen'], answer: 'behaupten' },
    ],
  },
  {
    id: 'de-verwechslungen',
    level: 'C2',
    title: 'Palabras que se confunden',
    summary: 'scheinbar / anscheinend · wider / wieder · seit / seid',
    pattern: 'parecidas en forma o sonido, distintas en sentido u ortografía',
    explanation: [
      'Errores típicos incluso de nativos: **scheinbar** (solo en apariencia, no es cierto) ≠ **anscheinend** (al parecer, probablemente sí). **wieder** (otra vez) ≠ **wider** (contra: widersprechen, Widerstand). **seit** (desde) ≠ **seid** (ihr seid). **das** (artículo/pronombre) ≠ **dass** (conjunción).',
      'Otros: **effektiv** (eficaz) ≠ **effizient** (eficiente, con pocos recursos); **sensibel** (sensible, delicado) ≠ **sensitiv**; **Lehre** (aprendizaje, enseñanza) ≠ **Leere** (vacío); **end-** (final: endgültig) ≠ **ent-** (prefijo: entscheiden); **original** ≠ **originell** (original, ingenioso).',
    ],
    examples: [
      { text: 'Er ist scheinbar ruhig, aber innerlich kocht er.', meaning: 'Aparenta calma, pero por dentro está hirviendo.' },
      { text: 'Anscheinend hat der Kunde den Termin vergessen.', meaning: 'Al parecer, el cliente olvidó la cita.' },
      { text: 'Seit ihr hier seid, ist die Werkstatt viel ordentlicher.', meaning: 'Desde que ustedes están aquí, el taller está mucho más ordenado.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Es probable que haya llovido: ＿ hat es geregnet, die Straße ist nass.', options: ['Anscheinend', 'Scheinbar', 'Wider', 'Endlich'], answer: 'Anscheinend' },
      { type: 'choice', prompt: 'Ich muss dir ＿sprechen (contradecir).', options: ['wider', 'wieder', 'weder', 'wieda'], answer: 'wider' },
      { type: 'choice', prompt: 'Wo ＿ ihr gestern gewesen?', options: ['seid', 'seit', 'seit ihr', 'sind'], answer: 'seid' },
      { type: 'choice', prompt: 'Una idea ingeniosa y creativa es…', options: ['originell', 'original', 'originär', 'origen'], answer: 'originell' },
    ],
  },
  {
    id: 'de-abkuerzungen',
    level: 'C2',
    title: 'Abreviaturas frecuentes',
    summary: 'z. B. · d. h. · u. a. · ggf. · i. d. R. · vgl. · z. Hd.',
    pattern: 'abreviatura con puntos y espacio: z. B., d. h. · siglas sin puntos: EU, GmbH',
    explanation: [
      'Textos, correos y formularios están llenos de **abreviaturas**: **z. B.** (por ejemplo), **d. h.** (es decir), **u. a.** (entre otros), **usw.** (etc.), **bzw.** (o bien, respectivamente), **ggf.** (si procede), **i. d. R.** (por lo general), **vgl.** (compárese), **s. o. / s. u.** (véase arriba / abajo), **ca.**, **evtl.** (eventualmente), **inkl.** / **exkl.**',
      'En cartas: **z. Hd.** (a la atención de), **i. A.** (por encargo), **i. V.** (en representación), **Betr.** (asunto), **Anl.** (anexo), **MfG** (saludos, solo informal), **u. U.** (eventualmente), **o. Ä.** (o similar). Se escriben con **puntos y espacio** (z. B.); las siglas, sin puntos (EU, GmbH, TÜV).',
    ],
    examples: [
      { text: 'Bitte bringen Sie ggf. Ihre alten Unterlagen mit.', meaning: 'Por favor traiga, si corresponde, sus documentos antiguos.' },
      { text: 'Die Reparatur dauert i. d. R. zwei Tage, u. U. auch länger.', meaning: 'La reparación dura por lo general dos días, eventualmente más.' },
      { text: 'z. Hd. Frau Bauer, Personalabteilung', meaning: 'A la atención de la señora Bauer, departamento de personal' },
    ],
    exercises: [
      { type: 'choice', prompt: '«d. h.» significa…', options: ['das heißt', 'durch Hilfe', 'deutsche Hochschule', 'derzeit hier'], answer: 'das heißt' },
      { type: 'choice', prompt: '«ggf.» significa…', options: ['gegebenenfalls', 'ganz genau früher', 'gültig für', 'gegen Gebühr'], answer: 'gegebenenfalls' },
      { type: 'choice', prompt: '«i. d. R.» significa…', options: ['in der Regel', 'in diesem Raum', 'ist das richtig', 'im deutschen Recht'], answer: 'in der Regel' },
      { type: 'choice', prompt: '¿Cómo se escribe correctamente «zum Beispiel» abreviado?', options: ['z. B.', 'zB', 'z.b', 'Z-B'], answer: 'z. B.' },
    ],
  },
  {
    id: 'de-wortspiele',
    level: 'C2',
    title: 'Juegos de palabras y humor',
    summary: 'Kalauer, dobles sentidos y chistes',
    pattern: 'doble sentido de una palabra · palabras que suenan igual · expresiones tomadas al pie de la letra',
    explanation: [
      'El humor alemán juega mucho con el **doble sentido**: un **Kalauer** es un chiste fácil de palabras. Ejemplo: «Was ist ein Keks unter einem Baum? – Ein schattiges Plätzchen.» (Plätzchen = galleta y lugarcito). La **publicidad** y los **titulares** viven de esto: «Bahn frei!» (camino libre / la Bahn).',
      'Para entenderlo hay que conocer los **dos sentidos**: **umfahren** (atropellar / rodear), **Schloss** (castillo / cerradura), **Bank** (banco para sentarse / banco de dinero), **Absatz** (párrafo / taco del zapato / ventas). También se toman modismos al pie de la letra: «Er hat Schwein gehabt» con un dibujo de un cerdo.',
    ],
    examples: [
      { text: 'Treffen sich zwei Jäger. Beide tot.', meaning: 'Se encuentran dos cazadores. Ambos muertos. (juego con «treffen»: encontrarse / acertar)' },
      { text: 'Der Absatz ist gestiegen – sagt die Schuhfabrik.', meaning: 'Las ventas subieron, dice la fábrica de zapatos. (Absatz = ventas / taco)' },
      { text: 'Auf der Bank liegt mein Geld, auf der Bank sitze ich.', meaning: 'En el banco está mi dinero; en el banco (asiento) me siento yo.' },
    ],
    exercises: [
      { type: 'choice', prompt: '«Schloss» puede ser…', options: ['castillo o cerradura', 'solo castillo', 'cerrado o abierto', 'llave o puerta'], answer: 'castillo o cerradura' },
      { type: 'choice', prompt: 'Un «Kalauer» es…', options: ['un chiste fácil de palabras', 'un poema largo', 'un insulto', 'un refrán antiguo'], answer: 'un chiste fácil de palabras' },
      { type: 'choice', prompt: '«Absatz» NO significa…', options: ['velocidad', 'párrafo', 'taco del zapato', 'ventas'], answer: 'velocidad' },
      { type: 'meaning', text: 'Was ist ein Keks unter einem Baum? – Ein schattiges Plätzchen.', options: ['Juego con «Plätzchen»: galleta y lugarcito a la sombra.', 'Una receta de galletas.', 'Un consejo para el verano.', 'Una pregunta de biología.'], answer: 'Juego con «Plätzchen»: galleta y lugarcito a la sombra.' },
    ],
  },
]
