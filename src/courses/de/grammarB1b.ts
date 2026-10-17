import type { GrammarLesson } from '../grammar.ts'

// Gramática B1 del alemán, segunda parte (lecciones 73–84): finalidad, concesión,
// consecuencia, genitivo, adjetivos sin artículo y verbos con preposición.

export const grammarB1b: GrammarLesson[] = [
  {
    id: 'de-um-zu-damit',
    level: 'B1',
    title: 'Para: um … zu y damit',
    summary: 'Ich lerne, um eine bessere Stelle zu finden.',
    pattern: 'um + … + zu + infinitivo (mismo sujeto) · damit + … + VERBO (otro sujeto)',
    explanation: [
      'Para expresar **finalidad** («para»): si el sujeto es **el mismo** en las dos partes, se usa **um … zu** + infinitivo: Otto lernt Deutsch, **um** in Deutschland **zu arbeiten**.',
      'Si los sujetos son **distintos**, se usa **damit** con verbo al final: Hans erklärt es langsam, **damit** Otto alles **versteht**. Con el mismo sujeto también vale damit, pero um … zu suena más natural.',
    ],
    examples: [
      { text: 'Otto macht einen Kurs, um Meister zu werden.', meaning: 'Otto hace un curso para llegar a ser maestro mecánico.' },
      { text: 'Ich spreche langsam, damit du mich verstehst.', meaning: 'Hablo despacio para que me entiendas.' },
      { text: 'Wir sparen Geld, um im Sommer nach Chile zu fliegen.', meaning: 'Ahorramos dinero para volar a Chile en verano.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich lerne, ＿ die Prüfung zu bestehen.', options: ['um', 'damit', 'dass', 'weil'], answer: 'um' },
      { type: 'choice', prompt: 'Ich gebe dir den Schlüssel, ＿ du in die Wohnung kannst.', options: ['damit', 'um', 'dass', 'ob'], answer: 'damit' },
      { type: 'order', meaning: 'Trabajo para ganar dinero.', answer: ['Ich', 'arbeite', 'um', 'Geld', 'zu', 'verdienen'] },
      { type: 'choice', prompt: 'Otto steht früh auf, um pünktlich ＿.', options: ['zu sein', 'sein', 'ist', 'zu ist'], answer: 'zu sein' },
    ],
  },
  {
    id: 'de-ohne-statt',
    level: 'B1',
    title: 'ohne … zu y statt … zu',
    summary: 'Er ging, ohne etwas zu sagen.',
    pattern: 'ohne … zu + infinitivo · (an)statt … zu + infinitivo',
    explanation: [
      '**ohne … zu** = «sin + infinitivo»: Otto ging, **ohne** sich **zu verabschieden** (se fue sin despedirse). **statt / anstatt … zu** = «en vez de»: **Statt** zu lernen, sah er fern.',
      'Si los sujetos son distintos, se usa **ohne dass** / **statt dass** con verbo al final: Er ging, **ohne dass** ich es **merkte**.',
    ],
    examples: [
      { text: 'Hans hat das Formular unterschrieben, ohne es zu lesen.', meaning: 'Hans firmó el formulario sin leerlo.' },
      { text: 'Statt mit dem Auto zu fahren, nimmt Otto das Fahrrad.', meaning: 'En vez de ir en auto, Otto toma la bicicleta.' },
      { text: 'Sie hat die Wohnung gekündigt, ohne dass ihr Mann davon wusste.', meaning: 'Ella terminó el contrato del departamento sin que su marido lo supiera.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Er ist gegangen, ＿ Tschüss zu sagen.', hint: 'sin', options: ['ohne', 'statt', 'um', 'damit'], answer: 'ohne' },
      { type: 'choice', prompt: '＿ zu arbeiten, spielt er am Handy.', hint: 'en vez de', options: ['Statt', 'Ohne', 'Um', 'Damit'], answer: 'Statt' },
      { type: 'order', meaning: 'Firmó sin leer.', answer: ['Er', 'hat', 'unterschrieben', 'ohne', 'zu', 'lesen'] },
      { type: 'meaning', text: 'Sie kam, ohne dass jemand sie gesehen hat.', options: ['Llegó sin que nadie la viera.', 'Llegó y todos la vieron.', 'Llegó para que la vieran.', 'No llegó porque nadie la vio.'], answer: 'Llegó sin que nadie la viera.' },
    ],
  },
  {
    id: 'de-obwohl',
    level: 'B1',
    title: 'obwohl: aunque',
    summary: 'Obwohl es regnet, gehen wir spazieren.',
    pattern: 'obwohl + … + VERBO (subordinada) ↔ trotzdem (posición 1)',
    explanation: [
      '**obwohl** (aunque) introduce una **concesión**: algo que pasa a pesar de otra cosa. Es subordinada: verbo al final. **Obwohl** Otto müde **ist**, geht er zum Kurs.',
      'La misma idea con **trotzdem** (aun así) en la oración principal: Otto ist müde, **trotzdem geht** er zum Kurs. Y con la preposición **trotz** + genitivo: **Trotz** des Regens…',
    ],
    examples: [
      { text: 'Obwohl die Wohnung klein ist, fühlt sich Otto dort wohl.', meaning: 'Aunque el departamento es pequeño, Otto se siente bien ahí.' },
      { text: 'Hans kam zur Party, obwohl er krank war.', meaning: 'Hans vino a la fiesta aunque estaba enfermo.' },
      { text: 'Der Test war schwer. Trotzdem hat Otto bestanden.', meaning: 'El examen fue difícil. Aun así Otto aprobó.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ es kalt ist, trägt er keine Jacke.', options: ['Obwohl', 'Trotzdem', 'Weil', 'Damit'], answer: 'Obwohl' },
      { type: 'choice', prompt: 'Es ist kalt, ＿ trägt er keine Jacke.', options: ['trotzdem', 'obwohl', 'weil', 'deshalb'], answer: 'trotzdem' },
      { type: 'order', meaning: 'Aunque estoy cansado, trabajo.', answer: ['Obwohl', 'ich', 'müde', 'bin', 'arbeite', 'ich'] },
      { type: 'choice', prompt: '¿Qué frase significa lo mismo que «Obwohl er wenig verdient, ist er zufrieden»?', options: ['Er verdient wenig, trotzdem ist er zufrieden.', 'Er verdient wenig, deshalb ist er zufrieden.', 'Er ist zufrieden, weil er wenig verdient.', 'Er verdient viel und ist zufrieden.'], answer: 'Er verdient wenig, trotzdem ist er zufrieden.' },
    ],
  },
  {
    id: 'de-sodass',
    level: 'B1',
    title: 'Consecuencias: sodass, so … dass',
    summary: 'Es regnete so stark, dass wir zu Hause blieben.',
    pattern: '…, sodass + … + VERBO · so + adjetivo + …, dass …',
    explanation: [
      '**sodass** (de modo que) expresa una **consecuencia**: Der Bus hatte Verspätung, **sodass** Otto zu spät **kam**.',
      'Para resaltar la intensidad: **so** + adjetivo …, **dass**: Die Prüfung war **so** schwer, **dass** viele durchgefallen sind. También: **zu** + adjetivo, **um … zu** (demasiado… para).',
    ],
    examples: [
      { text: 'Die Heizung war kaputt, sodass wir im Mantel saßen.', meaning: 'La calefacción estaba mala, así que estábamos sentados con abrigo.' },
      { text: 'Otto war so müde, dass er im Bus eingeschlafen ist.', meaning: 'Otto estaba tan cansado que se quedó dormido en el bus.' },
      { text: 'Die Wohnung ist zu teuer, um sie allein zu bezahlen.', meaning: 'El departamento es demasiado caro para pagarlo solo.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Es war ＿ laut, dass ich nicht schlafen konnte.', options: ['so', 'zu', 'sehr', 'sodass'], answer: 'so' },
      { type: 'choice', prompt: 'Der Zug fiel aus, ＿ wir ein Taxi nehmen mussten.', options: ['sodass', 'damit', 'obwohl', 'bevor'], answer: 'sodass' },
      { type: 'meaning', text: 'Er hat so viel gegessen, dass ihm schlecht wurde.', options: ['Comió tanto que se sintió mal.', 'Comió poco porque se sentía mal.', 'Se sintió mal antes de comer.', 'No comió para no sentirse mal.'], answer: 'Comió tanto que se sintió mal.' },
      { type: 'choice', prompt: 'Der Koffer ist ＿ schwer, um ihn zu tragen.', options: ['zu', 'so', 'sehr', 'als'], answer: 'zu' },
    ],
  },
  {
    id: 'de-genitiv',
    level: 'B1',
    title: 'El genitivo',
    summary: 'das Auto des Chefs, die Wohnung der Familie.',
    pattern: 'des + -(e)s (m/n) · der (f/pl) · eines / einer',
    explanation: [
      'El **genitivo** indica pertenencia en el alemán escrito: das Auto **des Chefs**, die Tür **des Hauses**, die Wohnung **der Familie**, die Probleme **der Mieter**. Artículos: **des** (m/n), **der** (f, pl), **eines / einer**.',
      'El sustantivo masculino o neutro agrega **-s** o **-es** (este último en palabras de una sílaba o terminadas en s/ß/z): des Vaters, des Kind**es**, des Hauses. Los débiles agregan -n: des Kollege**n**.',
    ],
    examples: [
      { text: 'Die Werkstatt des Herrn Becker liegt am Stadtrand.', meaning: 'El taller del señor Becker está en las afueras.' },
      { text: 'Am Ende des Monats bekommt Otto sein Gehalt.', meaning: 'A fin de mes Otto recibe su sueldo.' },
      { text: 'Die Meinung der Kollegen ist mir wichtig.', meaning: 'La opinión de los colegas es importante para mí.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das ist das Büro ＿ Chefs.', options: ['des', 'der', 'dem', 'den'], answer: 'des' },
      { type: 'choice', prompt: 'Die Farbe ＿ Wohnung gefällt mir.', options: ['der', 'des', 'die', 'dem'], answer: 'der' },
      { type: 'choice', prompt: 'Der Name des ＿ ist Murat.', hint: 'der Kollege', options: ['Kollegen', 'Kolleges', 'Kollege', 'Kollegs'], answer: 'Kollegen' },
      { type: 'type', prompt: 'am Ende des ＿ (der Tag)', answers: ['Tages', 'Tags'], german: true },
    ],
  },
  {
    id: 'de-genitiv-praep',
    level: 'B1',
    title: 'wegen, trotz, während, statt + genitivo',
    summary: 'Wegen des Streiks fährt kein Bus.',
    pattern: 'wegen / trotz / während / statt / innerhalb / außerhalb + GENITIVO',
    explanation: [
      'Estas preposiciones piden **genitivo** en el alemán estándar: **wegen** (por, a causa de), **trotz** (a pesar de), **während** (durante), **statt** (en vez de), **innerhalb** (dentro de), **außerhalb** (fuera de). **Wegen des** Regens…, **Trotz der** Kälte…',
      'Al hablar mucha gente usa **dativo** con wegen y trotz (wegen dem Regen). En exámenes y textos formales, usa el genitivo.',
    ],
    examples: [
      { text: 'Wegen eines Unfalls gibt es auf der Autobahn Stau.', meaning: 'Por un accidente hay taco en la autopista.' },
      { text: 'Trotz des schlechten Wetters haben wir gegrillt.', meaning: 'A pesar del mal tiempo hicimos un asado.' },
      { text: 'Während der Probezeit kann man schnell kündigen.', meaning: 'Durante el período de prueba se puede renunciar rápido.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ des Streiks fahren keine Züge.', hint: 'a causa de', options: ['Wegen', 'Trotz', 'Statt', 'Während'], answer: 'Wegen' },
      { type: 'choice', prompt: 'Trotz ＿ Regens gehen wir spazieren.', hint: 'der Regen', options: ['des', 'dem', 'den', 'der'], answer: 'des' },
      { type: 'choice', prompt: '＿ der Arbeit darf man nicht privat telefonieren.', hint: 'durante', options: ['Während', 'Wegen', 'Trotz', 'Statt'], answer: 'Während' },
      { type: 'choice', prompt: 'Der Antrag muss ＿ eines Monats gestellt werden.', hint: 'dentro de', options: ['innerhalb', 'außerhalb', 'trotz', 'wegen'], answer: 'innerhalb' },
    ],
  },
  {
    id: 'de-adjektiv-stark',
    level: 'B1',
    title: 'Adjetivos sin artículo',
    summary: 'frisches Brot, mit großem Interesse, gute Kollegen.',
    pattern: 'sin artículo: el adjetivo toma la terminación del artículo (-er, -e, -es, -em…)',
    explanation: [
      'Cuando no hay artículo, el **adjetivo** muestra el caso con las terminaciones del artículo definido: **frischer** Kaffee (der), **frische** Milch (die), **frisches** Brot (das), **frische** Brötchen (pl.). En dativo: mit **heißem** Wasser, mit **guter** Laune.',
      'Excepción: genitivo masculino y neutro llevan **-en** (trotz **schlechten** Wetters). Es típico en avisos, menús y expresiones: Herzlichen Glückwunsch, Mit freundlichen Grüßen.',
    ],
    examples: [
      { text: 'Wir suchen erfahrene Mechaniker mit guten Deutschkenntnissen.', meaning: 'Buscamos mecánicos con experiencia y buenos conocimientos de alemán.' },
      { text: 'Bei schönem Wetter essen wir draußen.', meaning: 'Con buen tiempo comemos afuera.' },
      { text: 'Otto trinkt morgens starken Kaffee.', meaning: 'Otto toma café cargado en la mañana.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich trinke gern ＿ Tee.', hint: 'grün · der Tee · Akk.', options: ['grünen', 'grüner', 'grünes', 'grüne'], answer: 'grünen' },
      { type: 'choice', prompt: 'Mit ＿ Grüßen', hint: 'freundlich · Dat. pl.', options: ['freundlichen', 'freundliche', 'freundlicher', 'freundlichem'], answer: 'freundlichen' },
      { type: 'choice', prompt: '＿ Brot schmeckt am besten.', hint: 'frisch · das Brot', options: ['Frisches', 'Frischer', 'Frische', 'Frischen'], answer: 'Frisches' },
      { type: 'type', prompt: 'bei ＿ Wetter (schön, dativo)', answers: ['schönem'], german: true },
    ],
  },
  {
    id: 'de-n-deklination',
    level: 'B1',
    title: 'La n-Deklination',
    summary: 'der Kollege → den Kollegen, dem Kollegen.',
    pattern: 'masculinos en -e, -ist, -ent, -ant y algunos más: -(e)n en todos los casos menos nominativo',
    explanation: [
      'Algunos sustantivos **masculinos** agregan **-n / -en** en acusativo, dativo y genitivo: der Kollege → den Kolleg**en**, dem Kolleg**en**, des Kolleg**en**. Son sobre todo los que terminan en **-e** (Kunde, Junge, Name) y los de origen extranjero en **-ist, -ent, -ant** (Polizist, Student, Praktikant).',
      'Otros frecuentes: **Mensch, Herr** (den Herr**n**), **Nachbar** (den Nachbar**n**), **Bauer**. Ojo: es fácil equivocarse al escribir correos: «Sehr geehrter Herr Klein» pero «Ich habe Herr**n** Klein angerufen».',
    ],
    examples: [
      { text: 'Ich habe dem Kunden die Rechnung gegeben.', meaning: 'Le di la factura al cliente.' },
      { text: 'Kennst du den neuen Praktikanten?', meaning: '¿Conoces al nuevo practicante?' },
      { text: 'Bitte rufen Sie Herrn Braun an.', meaning: 'Por favor llame al señor Braun.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich helfe dem ＿.', hint: 'der Kunde', options: ['Kunden', 'Kunde', 'Kundes', 'Kund'], answer: 'Kunden' },
      { type: 'choice', prompt: 'Wir haben einen ＿ gefragt.', hint: 'der Polizist', options: ['Polizisten', 'Polizist', 'Polizists', 'Polizistes'], answer: 'Polizisten' },
      { type: 'choice', prompt: 'Ich habe ＿ Weber eine E-Mail geschrieben.', hint: 'der Herr · Dat.', options: ['Herrn', 'Herr', 'Herren', 'Herrs'], answer: 'Herrn' },
      { type: 'type', prompt: 'Ich kenne den ＿ nicht. (der Nachbar)', answers: ['Nachbarn'], german: true },
    ],
  },
  {
    id: 'de-verben-praep-2',
    level: 'B1',
    title: 'Más verbos con preposición',
    summary: 'sich kümmern um, sich gewöhnen an, teilnehmen an…',
    pattern: 'verbo + preposición fija + caso',
    explanation: [
      'En B1 se usan muchos verbos con preposición: **sich kümmern um** (ocuparse de), **sich gewöhnen an** (acostumbrarse a), **teilnehmen an** + Dat. (participar en), **sich bewerben um** (postular a), **sich beschweren über** (quejarse de), **abhängen von** (depender de), **sich verlassen auf** (confiar en), **gehören zu** (pertenecer a).',
      'Apréndelos con la preposición y el caso, como una sola unidad. En la sección Palabras de B1 hay un tema con estos verbos para repasarlos.',
    ],
    examples: [
      { text: 'Otto hat sich schnell an das Wetter in Deutschland gewöhnt.', meaning: 'Otto se acostumbró rápido al clima de Alemania.' },
      { text: 'Wer kümmert sich um die Kinder?', meaning: '¿Quién se ocupa de los niños?' },
      { text: 'Alle Mitarbeiter nehmen an der Schulung teil.', meaning: 'Todos los empleados participan en la capacitación.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich kümmere mich ＿ die Wohnung.', options: ['um', 'an', 'auf', 'für'], answer: 'um' },
      { type: 'choice', prompt: 'Hast du dich ＿ das Essen gewöhnt?', options: ['an', 'um', 'auf', 'über'], answer: 'an' },
      { type: 'choice', prompt: 'Otto nimmt ＿ einem Kurs teil.', options: ['an', 'in', 'bei', 'zu'], answer: 'an' },
      { type: 'choice', prompt: 'Das hängt ＿ Wetter ab.', options: ['vom', 'am', 'zum', 'beim'], answer: 'vom' },
    ],
  },
  {
    id: 'de-wo-da',
    level: 'B1',
    title: 'Worauf? – Darauf',
    summary: 'Worauf wartest du? – Ich warte darauf, dass…',
    pattern: 'cosas: wo(r)- / da(r)- + preposición · personas: preposición + pronombre',
    explanation: [
      'Para preguntar por una **cosa** con un verbo de preposición: **wo(r)** + preposición: **Worauf** wartest du? **Wofür** interessierst du dich? **Worüber** sprecht ihr? (se agrega **r** si la preposición empieza con vocal).',
      'Para responder o referirse a ella: **da(r)** + preposición: Ich warte **darauf**. Ich freue mich **darüber**. Con **personas** se usa preposición + pronombre: Auf **wen** wartest du? – Auf **ihn**.',
    ],
    examples: [
      { text: 'Worüber habt ihr gesprochen? – Über die neue Stelle.', meaning: '¿De qué hablaron? – Del nuevo puesto.' },
      { text: 'Ich freue mich darauf, dich zu sehen.', meaning: 'Me alegra (de antemano) verte.' },
      { text: 'An wen denkst du? – An meine Familie.', meaning: '¿En quién piensas? – En mi familia.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ wartest du? – Auf den Bus.', options: ['Worauf', 'Auf was', 'Wofür', 'Darauf'], answer: 'Worauf' },
      { type: 'choice', prompt: 'Interessierst du dich für Politik? – Nein, ＿ interessiere ich mich nicht.', options: ['dafür', 'darauf', 'wofür', 'für sie'], answer: 'dafür' },
      { type: 'choice', prompt: 'Auf ＿ wartest du? – Auf Hans.', options: ['wen', 'was', 'worauf', 'wem'], answer: 'wen' },
      { type: 'choice', prompt: '＿ sprecht ihr? – Über den Urlaub.', options: ['Worüber', 'Wovon', 'Darüber', 'Über wen'], answer: 'Worüber' },
    ],
  },
  {
    id: 'de-doppelkonnektoren',
    level: 'B1',
    title: 'Conectores dobles',
    summary: 'entweder … oder, sowohl … als auch, weder … noch.',
    pattern: 'entweder…oder · sowohl…als auch · weder…noch · nicht nur…sondern auch · zwar…aber',
    explanation: [
      'Conectores de dos partes: **entweder … oder** (o… o), **sowohl … als auch** (tanto… como), **weder … noch** (ni… ni), **nicht nur … sondern auch** (no solo… sino también), **zwar … aber** (es cierto que… pero).',
      'Ejemplos: **Entweder** du kommst mit, **oder** du bleibst hier. Otto spricht **sowohl** Spanisch **als auch** Deutsch. Ich habe **weder** Zeit **noch** Geld.',
    ],
    examples: [
      { text: 'Die Stelle ist zwar gut bezahlt, aber sehr weit weg.', meaning: 'Es cierto que el puesto está bien pagado, pero está muy lejos.' },
      { text: 'Hans kann nicht nur kochen, sondern auch backen.', meaning: 'Hans no solo sabe cocinar, sino también hornear.' },
      { text: 'Wir fahren entweder mit dem Zug oder mit dem Bus.', meaning: 'Vamos o en tren o en bus.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich habe ＿ Hunger noch Durst.', options: ['weder', 'entweder', 'sowohl', 'zwar'], answer: 'weder' },
      { type: 'choice', prompt: 'Otto spricht sowohl Spanisch ＿ Deutsch.', options: ['als auch', 'oder', 'noch', 'aber'], answer: 'als auch' },
      { type: 'choice', prompt: 'Die Wohnung ist ＿ schön, aber zu teuer.', options: ['zwar', 'weder', 'sowohl', 'entweder'], answer: 'zwar' },
      { type: 'choice', prompt: 'Er ist nicht nur Mechaniker, ＿ auch Musiker.', options: ['sondern', 'aber', 'oder', 'noch'], answer: 'sondern' },
    ],
  },
  {
    id: 'de-je-desto',
    level: 'B1',
    title: 'je … desto',
    summary: 'Je mehr ich übe, desto besser spreche ich.',
    pattern: 'Je + comparativo + … + VERBO, desto/umso + comparativo + VERBO + sujeto',
    explanation: [
      '**je … desto** (cuanto más… más) une dos comparativos. La parte con **je** es subordinada (verbo al final); la parte con **desto** (o **umso**) tiene el verbo justo después del comparativo.',
      '**Je** länger Otto in Deutschland **lebt**, **desto** besser **versteht** er die Leute. **Je** früher, **desto** besser (cuanto antes, mejor).',
    ],
    examples: [
      { text: 'Je mehr man liest, desto mehr Wörter lernt man.', meaning: 'Cuanto más se lee, más palabras se aprenden.' },
      { text: 'Je älter das Auto ist, desto teurer ist die Reparatur.', meaning: 'Cuanto más viejo es el auto, más cara es la reparación.' },
      { text: 'Je früher du kommst, umso besser.', meaning: 'Cuanto antes vengas, mejor.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Je mehr ich arbeite, ＿ müder bin ich.', options: ['desto', 'als', 'so', 'dann'], answer: 'desto' },
      { type: 'order', meaning: 'Cuanto antes, mejor.', answer: ['Je', 'früher', 'desto', 'besser'] },
      { type: 'choice', prompt: 'Je länger er wartet, desto ＿ wird er.', hint: 'nervös', options: ['nervöser', 'nervös', 'am nervösesten', 'mehr nervös'], answer: 'nervöser' },
      { type: 'meaning', text: 'Je mehr Leute kommen, desto lustiger wird die Party.', options: ['Cuanta más gente venga, más divertida será la fiesta.', 'Si viene poca gente, la fiesta es aburrida.', 'La fiesta es divertida aunque venga poca gente.', 'Viene más gente porque la fiesta es divertida.'], answer: 'Cuanta más gente venga, más divertida será la fiesta.' },
    ],
  },
]
