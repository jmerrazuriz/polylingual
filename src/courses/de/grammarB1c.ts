import type { GrammarLesson } from '../grammar.ts'

// Gramática B1 del alemán, tercera parte (lecciones 85–95): estructuras frecuentes en el
// trabajo y en el examen B1, y fórmulas para escribir cartas y dar opiniones.

export const grammarB1c: GrammarLesson[] = [
  {
    id: 'de-lassen',
    level: 'B1',
    title: 'lassen: hacer que otro haga',
    summary: 'Ich lasse mein Auto reparieren.',
    pattern: 'lassen + infinitivo al final (sin zu)',
    explanation: [
      '**lassen** + infinitivo significa que **otra persona** hace algo por ti: Ich **lasse** mein Auto **reparieren** (hago reparar mi auto). Ich **lasse** mir die Haare **schneiden** (me corto el pelo en la peluquería).',
      'También significa **dejar, permitir**: **Lass** mich **helfen**! (¡déjame ayudar!) y **dejar algo en un lugar**: Ich habe meinen Schirm im Bus **gelassen**. Presente: ich lasse, du **lässt**, er **lässt**.',
    ],
    examples: [
      { text: 'Frau Weber lässt ihr Auto bei Otto reparieren.', meaning: 'La señora Weber hace reparar su auto donde Otto.' },
      { text: 'Lass mich das machen!', meaning: '¡Déjame hacerlo a mí!' },
      { text: 'Ich lasse die Dokumente übersetzen.', meaning: 'Mando a traducir los documentos.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Hans ＿ sich die Haare schneiden.', options: ['lässt', 'lasst', 'lassen', 'lässen'], answer: 'lässt' },
      { type: 'order', meaning: 'Mando a reparar mi bicicleta.', answer: ['Ich', 'lasse', 'mein', 'Fahrrad', 'reparieren'] },
      { type: 'meaning', text: 'Lass mich in Ruhe!', options: ['¡Déjame tranquilo!', '¡Déjame ayudarte!', '¡Quédate tranquilo!', '¡Vamos a descansar!'], answer: '¡Déjame tranquilo!' },
      { type: 'choice', prompt: '¿Qué significa «Ich lasse das Zeugnis übersetzen»?', options: ['Mando a traducir el certificado.', 'Traduzco el certificado yo mismo.', 'No traduzco el certificado.', 'Dejo el certificado en casa.'], answer: 'Mando a traducir el certificado.' },
    ],
  },
  {
    id: 'de-brauchen-zu',
    level: 'B1',
    title: 'nicht brauchen zu, nur, erst',
    summary: 'Du brauchst nicht zu kommen.',
    pattern: 'nicht / nur + brauchen + zu + infinitivo = no tener que / solo tener que',
    explanation: [
      '**nicht brauchen zu** = **no tener que**: Du **brauchst** morgen **nicht zu** kommen (mañana no tienes que venir). Es el negativo amable de müssen. Con **nur**: Sie **brauchen nur** hier **zu** unterschreiben (solo tiene que firmar aquí).',
      'Diferencia entre **nur** y **erst**: **nur** = solo (cantidad), **erst** = recién, no antes de: Ich habe **nur** zehn Euro. Der Kurs beginnt **erst** um zehn.',
    ],
    examples: [
      { text: 'Sie brauchen keinen Termin zu machen.', meaning: 'No necesita pedir hora.' },
      { text: 'Du brauchst nur auf den Knopf zu drücken.', meaning: 'Solo tienes que apretar el botón.' },
      { text: 'Otto ist erst seit zwei Jahren in Deutschland.', meaning: 'Otto lleva recién dos años en Alemania.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Du ＿ nicht zu warten.', options: ['brauchst', 'musst', 'brauchen', 'darfst'], answer: 'brauchst' },
      { type: 'choice', prompt: 'Sie brauchen nur Ihren Ausweis mit＿bringen.', options: ['zu', 'um', '—', 'ge'], answer: 'zu' },
      { type: 'choice', prompt: 'Der Zug kommt ＿ um 10 Uhr, nicht um 9.', hint: 'recién', options: ['erst', 'nur', 'schon', 'noch'], answer: 'erst' },
      { type: 'meaning', text: 'Du brauchst mich nicht abzuholen.', options: ['No tienes que ir a buscarme.', 'Tienes que ir a buscarme.', 'No puedes ir a buscarme.', 'Me fuiste a buscar.'], answer: 'No tienes que ir a buscarme.' },
    ],
  },
  {
    id: 'de-wortbildung',
    level: 'B1',
    title: 'Formar palabras: -ung, -heit, -keit, -er, -in',
    summary: 'wohnen → die Wohnung · frei → die Freiheit.',
    pattern: 'verbo → -ung (f) · adjetivo → -heit / -keit (f) · verbo → -er (m) · -in (f)',
    explanation: [
      'Muchos sustantivos se forman con sufijos: verbo + **-ung** (siempre femenino): wohnen → die Wohn**ung**, bewerben → die Bewerb**ung**. Adjetivo + **-heit / -keit** (femenino): frei → die Frei**heit**, möglich → die Möglich**keit**.',
      'Personas: verbo + **-er** (masculino): lehren → der Lehr**er**, fahren → der Fahr**er**; y + **-in** para la mujer: die Fahrer**in**. El infinitivo también puede ser sustantivo neutro: **das** Lernen, **das** Essen.',
    ],
    examples: [
      { text: 'Die Anmeldung muss innerhalb von zwei Wochen erfolgen.', meaning: 'La inscripción debe hacerse dentro de dos semanas.' },
      { text: 'Die Sicherheit bei der Arbeit ist sehr wichtig.', meaning: 'La seguridad en el trabajo es muy importante.' },
      { text: 'Beim Autofahren darf man nicht telefonieren.', meaning: 'Al manejar no se puede hablar por teléfono.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'erfahren → die ＿', options: ['Erfahrung', 'Erfahrheit', 'Erfahrkeit', 'Erfahrer'], answer: 'Erfahrung' },
      { type: 'choice', prompt: 'gesund → die ＿', options: ['Gesundheit', 'Gesundung', 'Gesundkeit', 'Gesunder'], answer: 'Gesundheit' },
      { type: 'choice', prompt: '¿Qué artículo tiene «Möglichkeit»?', options: ['die', 'der', 'das', 'den'], answer: 'die' },
      { type: 'type', prompt: 'verkaufen → la vendedora: die ＿', answers: ['Verkäuferin'], german: true },
    ],
  },
  {
    id: 'de-futur-vermutung',
    level: 'B1',
    title: 'Suposiciones: werden + wohl',
    summary: 'Er wird wohl krank sein.',
    pattern: 'werden + (wohl/sicher/bestimmt) + infinitivo = suposición',
    explanation: [
      'El **Futur I** también sirve para hacer **suposiciones** sobre el presente: Hans antwortet nicht. Er **wird wohl** noch **schlafen** (seguramente todavía está durmiendo).',
      'Palabras que lo acompañan: **wohl, wahrscheinlich, vielleicht, sicher, bestimmt**. Para el pasado: **werden + participio + haben/sein**: Er **wird** den Bus **verpasst haben**.',
    ],
    examples: [
      { text: 'Otto ist nicht da. Er wird wohl in der Werkstatt sein.', meaning: 'Otto no está. Seguramente está en el taller.' },
      { text: 'Das wird schon klappen.', meaning: 'Ya va a resultar.' },
      { text: 'Sie wird den Termin vergessen haben.', meaning: 'Seguramente se olvidó de la cita.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das Licht ist an. Hans ＿ wohl zu Hause sein.', options: ['wird', 'würde', 'wurde', 'ist'], answer: 'wird' },
      { type: 'meaning', text: 'Er wird wohl im Stau stehen.', options: ['Seguramente está en un taco.', 'Estuvo en un taco.', 'Va a evitar el taco.', 'Nunca hay taco.'], answer: 'Seguramente está en un taco.' },
      { type: 'choice', prompt: 'Sie ＿ den Zug verpasst haben.', hint: 'suposición sobre el pasado', options: ['wird', 'hat', 'ist', 'war'], answer: 'wird' },
      { type: 'order', meaning: 'Seguramente ya está durmiendo.', answer: ['Er', 'wird', 'wohl', 'schon', 'schlafen'] },
    ],
  },
  {
    id: 'de-reflexiv-dativ',
    level: 'B1',
    title: 'Reflexivos en dativo: mir, dir',
    summary: 'Ich wasche mir die Hände. Ich kaufe mir ein Auto.',
    pattern: 'reflexivo + otro complemento en acusativo → mir / dir (dativo)',
    explanation: [
      'Si el verbo reflexivo tiene **otro complemento en acusativo**, el reflexivo pasa a **dativo**: Ich wasche **mich** (acusativo), pero Ich wasche **mir** die Hände. Solo cambian **ich** (mich → **mir**) y **du** (dich → **dir**).',
      'Verbos típicos: sich etwas **ansehen** (mirar algo con atención), sich etwas **vorstellen** (imaginarse algo), sich etwas **kaufen**, sich etwas **wünschen**, sich etwas **merken** (recordar algo), sich die Zähne **putzen**.',
    ],
    examples: [
      { text: 'Ich kann mir das gut vorstellen.', meaning: 'Me lo puedo imaginar bien.' },
      { text: 'Merk dir die Nummer!', meaning: '¡Acuérdate del número!' },
      { text: 'Otto hat sich ein neues Fahrrad gekauft.', meaning: 'Otto se compró una bicicleta nueva.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich putze ＿ die Zähne.', options: ['mir', 'mich', 'sich', 'mein'], answer: 'mir' },
      { type: 'choice', prompt: 'Was wünschst du ＿ zum Geburtstag?', options: ['dir', 'dich', 'sich', 'du'], answer: 'dir' },
      { type: 'choice', prompt: 'Ich wasche ＿ jeden Morgen.', hint: 'sin otro complemento', options: ['mich', 'mir', 'sich', 'mein'], answer: 'mich' },
      { type: 'meaning', text: 'Ich sehe mir die Wohnung morgen an.', options: ['Mañana voy a ver el departamento.', 'Mañana me mudo al departamento.', 'Ayer vi el departamento.', 'No quiero ver el departamento.'], answer: 'Mañana voy a ver el departamento.' },
    ],
  },
  {
    id: 'de-sobald-solange',
    level: 'B1',
    title: 'sobald, solange, bis, seitdem',
    summary: 'Sobald ich Zeit habe, rufe ich dich an.',
    pattern: 'sobald (en cuanto) · solange (mientras dure) · bis (hasta que) · seitdem (desde que)',
    explanation: [
      'Más conectores de tiempo, todos con el verbo al final: **sobald** (en cuanto): **Sobald** ich zu Hause bin, rufe ich dich an. **solange** (mientras, todo el tiempo que): **Solange** du krank bist, bleibst du im Bett.',
      '**bis** (hasta que): Warte, **bis** ich komme. **seit / seitdem** (desde que): **Seitdem** Otto in Berlin wohnt, fährt er Fahrrad.',
    ],
    examples: [
      { text: 'Sobald die Ersatzteile da sind, repariert Otto das Auto.', meaning: 'En cuanto lleguen los repuestos, Otto repara el auto.' },
      { text: 'Solange die Heizung kaputt ist, wohne ich bei Hans.', meaning: 'Mientras la calefacción esté mala, vivo donde Hans.' },
      { text: 'Seitdem er den neuen Job hat, ist er viel zufriedener.', meaning: 'Desde que tiene el trabajo nuevo, está mucho más contento.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ ich das Ergebnis habe, sage ich es dir.', hint: 'en cuanto', options: ['Sobald', 'Solange', 'Seitdem', 'Bis'], answer: 'Sobald' },
      { type: 'choice', prompt: 'Wir warten, ＿ der Regen aufhört.', hint: 'hasta que', options: ['bis', 'seit', 'sobald', 'als'], answer: 'bis' },
      { type: 'choice', prompt: '＿ ich hier wohne, habe ich viele Freunde.', hint: 'desde que', options: ['Seitdem', 'Solange', 'Bis', 'Sobald'], answer: 'Seitdem' },
      { type: 'choice', prompt: '＿ du Fieber hast, darfst du nicht arbeiten.', hint: 'mientras', options: ['Solange', 'Sobald', 'Bis', 'Bevor'], answer: 'Solange' },
    ],
  },
  {
    id: 'de-indefinitpronomen',
    level: 'B1',
    title: 'einer, keiner, welche',
    summary: 'Hast du einen Stift? – Ja, ich habe einen.',
    pattern: 'einer / eine / eins · keiner / keine / keins · welche (plural)',
    explanation: [
      'Para no repetir el sustantivo se usan pronombres: Hast du **einen** Stift? – Ja, ich habe **einen** / Nein, ich habe **keinen**. En nominativo y acusativo neutro: **eins / keins** (Ich brauche ein Messer. – Hier ist **eins**).',
      'En plural y con sustantivos incontables se usa **welche**: Hast du Briefmarken? – Ja, ich habe **welche**. Wir brauchen Milch. – Im Kühlschrank ist noch **welche**.',
    ],
    examples: [
      { text: 'Braucht jemand einen Schlüssel? – Ich brauche einen.', meaning: '¿Alguien necesita una llave? – Yo necesito una.' },
      { text: 'Gibt es hier ein Café? – Ja, da vorne ist eins.', meaning: '¿Hay un café por aquí? – Sí, ahí adelante hay uno.' },
      { text: 'Haben wir noch Brötchen? – Nein, es gibt keine mehr.', meaning: '¿Nos quedan panecillos? – No, ya no hay.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Hast du einen Kugelschreiber? – Ja, ich habe ＿.', options: ['einen', 'eins', 'eine', 'welche'], answer: 'einen' },
      { type: 'choice', prompt: 'Ich brauche Eier. Hast du ＿?', options: ['welche', 'eins', 'einen', 'keins'], answer: 'welche' },
      { type: 'choice', prompt: 'Gibt es hier ein Hotel? – Nein, hier gibt es ＿.', options: ['keins', 'keinen', 'keine', 'kein'], answer: 'keins' },
      { type: 'choice', prompt: 'Ich suche eine Apotheke. – Dort ist ＿.', options: ['eine', 'einer', 'eins', 'einen'], answer: 'eine' },
    ],
  },
  {
    id: 'de-kausal',
    level: 'B1',
    title: 'Causas: weil, da, denn, nämlich, wegen',
    summary: 'Varias formas de decir «porque».',
    pattern: 'weil/da + verbo al final · denn + orden normal · nämlich (posición 3+) · wegen + genitivo',
    explanation: [
      '**weil** y **da** inician subordinadas (verbo al final). **da** se usa sobre todo al **principio** y para causas conocidas: **Da** der Zug Verspätung hatte, kam ich zu spät. **denn** une dos oraciones principales: …, **denn** ich hatte keine Zeit.',
      '**nämlich** (es que) explica la causa en una segunda oración y nunca va en posición 1: Ich kann nicht kommen. Ich habe **nämlich** Nachtschicht. **wegen** + genitivo nombra la causa con un sustantivo: **Wegen** der Nachtschicht…',
    ],
    examples: [
      { text: 'Da Otto Erfahrung hat, bekommt er die Stelle.', meaning: 'Como Otto tiene experiencia, consigue el puesto.' },
      { text: 'Ich bin müde. Ich habe nämlich schlecht geschlafen.', meaning: 'Estoy cansado. Es que dormí mal.' },
      { text: 'Wegen der Kälte bleiben wir drinnen.', meaning: 'Por el frío nos quedamos adentro.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich komme später. Ich muss ＿ noch arbeiten.', options: ['nämlich', 'weil', 'denn', 'da'], answer: 'nämlich' },
      { type: 'choice', prompt: '＿ es regnet, nehmen wir das Auto.', hint: 'como', options: ['Da', 'Denn', 'Nämlich', 'Wegen'], answer: 'Da' },
      { type: 'choice', prompt: '＿ des Unfalls ist die Straße gesperrt.', options: ['Wegen', 'Weil', 'Denn', 'Da'], answer: 'Wegen' },
      { type: 'choice', prompt: 'Er bleibt zu Hause, ＿ er ist krank.', options: ['denn', 'weil', 'da', 'nämlich'], answer: 'denn' },
    ],
  },
  {
    id: 'de-praep-akk',
    level: 'B1',
    title: 'durch, gegen, um, entlang, bis',
    summary: 'Preposiciones que siempre piden acusativo.',
    pattern: 'durch · für · gegen · ohne · um · bis · entlang + ACUSATIVO',
    explanation: [
      'Estas preposiciones siempre llevan **acusativo**: **durch** (a través de), **für** (para), **gegen** (contra; alrededor de, con horas), **ohne** (sin), **um** (alrededor de; a las), **bis** (hasta) y **entlang** (a lo largo de, va detrás del sustantivo).',
      'Ejemplos: **durch den** Park, **gegen die** Wand, **um den** Tisch, **den** Fluss **entlang**. Con horas: **gegen** acht Uhr (a eso de las ocho), **um** acht Uhr (a las ocho en punto).',
    ],
    examples: [
      { text: 'Otto fährt jeden Morgen durch den Park zur Arbeit.', meaning: 'Otto va cada mañana al trabajo atravesando el parque.' },
      { text: 'Wir kommen gegen sieben Uhr.', meaning: 'Llegamos a eso de las siete.' },
      { text: 'Gehen Sie die Straße entlang bis zur Kreuzung.', meaning: 'Siga por la calle hasta el cruce.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Wir gehen durch ＿ Wald.', hint: 'der Wald', options: ['den', 'dem', 'des', 'der'], answer: 'den' },
      { type: 'choice', prompt: 'Das Auto ist gegen ＿ Baum gefahren.', hint: 'der Baum', options: ['einen', 'einem', 'eines', 'ein'], answer: 'einen' },
      { type: 'choice', prompt: 'Ich komme ＿ acht Uhr, nicht genau.', hint: 'a eso de', options: ['gegen', 'um', 'bis', 'durch'], answer: 'gegen' },
      { type: 'choice', prompt: 'Wir sitzen um ＿ Tisch.', hint: 'der Tisch', options: ['den', 'dem', 'der', 'des'], answer: 'den' },
    ],
  },
  {
    id: 'de-brief-formal',
    level: 'B1',
    title: 'Escribir correos formales',
    summary: 'Sehr geehrte Damen und Herren, … Mit freundlichen Grüßen',
    pattern: 'Anrede → motivo → detalles/petición → cierre → Gruß',
    explanation: [
      'Un correo formal tiene partes fijas. **Saludo**: Sehr geehrte Frau Klein, / Sehr geehrter Herr Braun, / Sehr geehrte Damen und Herren, (si no sabes el nombre). Tras la coma, la primera palabra va **con minúscula**.',
      'Fórmulas útiles: **ich schreibe Ihnen, weil…** · **ich möchte mich über … beschweren** · **ich interessiere mich für…** · **Könnten Sie mir bitte mitteilen, ob…?** · **Ich wäre Ihnen dankbar, wenn…** · **Ich freue mich auf Ihre Antwort.** Cierre: **Mit freundlichen Grüßen** + nombre.',
    ],
    examples: [
      { text: 'Sehr geehrte Damen und Herren, ich schreibe Ihnen, weil meine Bestellung noch nicht angekommen ist.', meaning: 'Estimados señores: les escribo porque mi pedido todavía no ha llegado.' },
      { text: 'Ich wäre Ihnen dankbar, wenn Sie mir bald antworten könnten.', meaning: 'Les agradecería que me respondieran pronto.' },
      { text: 'Ich freue mich auf Ihre Antwort. Mit freundlichen Grüßen, Otto Martínez', meaning: 'Quedo atento a su respuesta. Saludos cordiales, Otto Martínez' },
    ],
    exercises: [
      { type: 'choice', prompt: 'No sabes el nombre de la persona. ¿Cómo empiezas?', options: ['Sehr geehrte Damen und Herren,', 'Liebe Kolleginnen und Kollegen,', 'Sehr geehrter Herr Kunde,', 'Hallo, liebe Damen und Herren,'], answer: 'Sehr geehrte Damen und Herren,' },
      { type: 'choice', prompt: '¿Cuál es un cierre formal?', options: ['Mit freundlichen Grüßen', 'Tschüss', 'Bis bald', 'Liebe Grüße'], answer: 'Mit freundlichen Grüßen' },
      { type: 'choice', prompt: 'Ich wäre Ihnen dankbar, ＿ Sie mich zurückrufen könnten.', options: ['wenn', 'dass', 'ob', 'weil'], answer: 'wenn' },
      { type: 'choice', prompt: 'Para quejarte: Ich möchte mich über den Service ＿.', options: ['beschweren', 'beschwere', 'freuen', 'bewerben'], answer: 'beschweren' },
    ],
  },
  {
    id: 'de-meinung',
    level: 'B1',
    title: 'Dar tu opinión',
    summary: 'Meiner Meinung nach… · Einerseits… andererseits…',
    pattern: 'Meiner Meinung nach + VERBO · Ich bin der Meinung, dass … · einerseits … andererseits',
    explanation: [
      'Para **opinar**: **Ich finde / glaube / denke, dass…** · **Meiner Meinung nach** ist das… (¡verbo justo después!) · **Ich bin der Meinung, dass…** Para estar de acuerdo: **Da hast du recht.** · **Das sehe ich auch so.** Para no estarlo: **Das sehe ich anders.** · **Da bin ich nicht sicher.**',
      'Para comparar ventajas y desventajas (típico del examen B1): **Einerseits** … , **andererseits** … · **Ein Vorteil ist, dass…** · **Ein Nachteil ist, dass…** · **Zum Schluss möchte ich sagen, dass…**',
    ],
    examples: [
      { text: 'Meiner Meinung nach sollte man in der Stadt mit dem Fahrrad fahren.', meaning: 'En mi opinión, en la ciudad uno debería andar en bicicleta.' },
      { text: 'Einerseits ist die Stelle gut bezahlt, andererseits muss ich nachts arbeiten.', meaning: 'Por un lado el puesto está bien pagado; por otro, tengo que trabajar de noche.' },
      { text: 'Das sehe ich anders: Ich finde, dass Homeoffice viele Vorteile hat.', meaning: 'Yo lo veo distinto: creo que el teletrabajo tiene muchas ventajas.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Meiner Meinung nach ＿ das eine gute Idee.', options: ['ist', 'das ist', 'sein', 'sind'], answer: 'ist' },
      { type: 'choice', prompt: 'Einerseits ist es billig, ＿ ist es weit weg.', options: ['andererseits', 'außerdem', 'deshalb', 'trotzdem'], answer: 'andererseits' },
      { type: 'choice', prompt: 'No estás de acuerdo. Dices:', options: ['Das sehe ich anders.', 'Da hast du recht.', 'Das sehe ich auch so.', 'Genau!'], answer: 'Das sehe ich anders.' },
      { type: 'order', meaning: 'Soy de la opinión de que eso es importante.', answer: ['Ich', 'bin', 'der', 'Meinung', 'dass', 'das', 'wichtig', 'ist'] },
    ],
  },
]
