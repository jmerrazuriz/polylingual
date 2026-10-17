import type { GrammarLesson } from '../grammar.ts'

// Gramática C1 del alemán, tercera parte (lecciones 155–165): escribir y hablar en registro
// académico y profesional: citar, resumir, matizar, refutar, moderar y dar coherencia al texto.

export const grammarC1c: GrammarLesson[] = [
  {
    id: 'de-zitieren',
    level: 'C1',
    title: 'Citar y parafrasear fuentes',
    summary: 'Wie Müller (2023) betont, … · Dem Bericht zufolge …',
    pattern: 'wie X betont / feststellt · nach Ansicht von X · X zufolge · laut X · Konjunktiv I',
    explanation: [
      'En un texto académico o un informe se marca siempre **de quién** es una idea. Fórmulas: **Wie** Müller **betont**, … · **Nach Ansicht** / **Auffassung von** Experten … · **Dem Bericht zufolge** … · **Laut** einer Studie … · **Der Autor vertritt die These**, dass … · **Es heißt**, dass …',
      'Para no confundir la idea ajena con la propia, se usa el **Konjunktiv I**: Die Studie kommt zu dem Ergebnis, dass Homeoffice die Produktivität **steigere**. Y para distanciarse: **angeblich** (supuestamente), **vermeintlich** (presunto), **sogenannt** (llamado así).',
    ],
    examples: [
      { text: 'Wie die Autorin hervorhebt, sei Bildung der Schlüssel zur Integration.', meaning: 'Como destaca la autora, la educación sería la clave para la integración.' },
      { text: 'Einer Umfrage des Verbands zufolge suchen 70 Prozent der Betriebe Personal.', meaning: 'Según una encuesta de la asociación, el 70 % de las empresas busca personal.' },
      { text: 'Der Autor vertritt die These, dass Elektroautos allein das Klima nicht retten.', meaning: 'El autor sostiene la tesis de que los autos eléctricos solos no salvan el clima.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Der Studie ＿ ist der Konsum gesunken.', options: ['zufolge', 'laut', 'nach', 'gemäß der'], answer: 'zufolge' },
      { type: 'choice', prompt: 'Der Autor ＿ die These, dass …', options: ['vertritt', 'nimmt', 'macht', 'stellt'], answer: 'vertritt' },
      { type: 'choice', prompt: 'Nach ＿ der Forscher ist das Risiko gering.', options: ['Ansicht', 'Meinung von', 'Sicht zu', 'Laut'], answer: 'Ansicht' },
      { type: 'meaning', text: 'Der angebliche Experte hatte keine Ausbildung.', options: ['El supuesto experto no tenía formación.', 'El experto tenía muy buena formación.', 'El experto formó a otros.', 'El verdadero experto no vino.'], answer: 'El supuesto experto no tenía formación.' },
    ],
  },
  {
    id: 'de-zusammenfassung',
    level: 'C1',
    title: 'Resumir un texto',
    summary: 'Der Text handelt von … · Abschließend kommt der Autor zu dem Schluss, …',
    pattern: 'tema → tesis → argumentos principales → conclusión (en presente y con palabras propias)',
    explanation: [
      'Un **resumen** (Zusammenfassung) presenta el texto de forma **objetiva**, en **presente** y sin opinión propia: **Der Text** «…» **von** X, **erschienen in** …, **handelt von** / **befasst sich mit** … · **Im Mittelpunkt steht** die Frage, … · **Der Autor geht davon aus, dass** …',
      'Para los argumentos: **Zunächst** legt er dar, … **Darüber hinaus** weist er darauf hin, … **Als Beispiel führt er an**, … Para cerrar: **Abschließend kommt er zu dem Schluss, dass** … Se usan palabras propias y el **discurso indirecto**, no citas largas.',
    ],
    examples: [
      { text: 'Der Artikel befasst sich mit den Folgen der Digitalisierung für das Handwerk.', meaning: 'El artículo trata de las consecuencias de la digitalización para los oficios.' },
      { text: 'Im Mittelpunkt steht die Frage, wie Betriebe Fachkräfte gewinnen können.', meaning: 'En el centro está la pregunta de cómo las empresas pueden conseguir trabajadores calificados.' },
      { text: 'Abschließend kommt die Autorin zu dem Schluss, dass Weiterbildung unverzichtbar sei.', meaning: 'Finalmente, la autora concluye que la formación continua es imprescindible.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Der Text ＿ sich mit dem Thema Wohnungsnot.', options: ['befasst', 'handelt', 'geht', 'spricht'], answer: 'befasst' },
      { type: 'choice', prompt: 'Der Text ＿ von den Problemen junger Familien.', options: ['handelt', 'befasst', 'beschäftigt', 'stellt'], answer: 'handelt' },
      { type: 'choice', prompt: 'Abschließend kommt er zu dem ＿, dass …', options: ['Schluss', 'Ende', 'Ergebnis von', 'Fazit zu'], answer: 'Schluss' },
      { type: 'choice', prompt: '¿Qué NO debe tener un resumen?', options: ['La opinión propia', 'El tema del texto', 'Los argumentos principales', 'La conclusión del autor'], answer: 'La opinión propia' },
    ],
  },
  {
    id: 'de-hypothesen',
    level: 'C1',
    title: 'Matizar: hipótesis y prudencia',
    summary: 'Es ist anzunehmen, dass … · Vieles spricht dafür, dass …',
    pattern: 'es ist anzunehmen / davon auszugehen · vermutlich · es spricht einiges dafür · scheinen',
    explanation: [
      'En lo académico y lo profesional conviene **no afirmar más de lo que se sabe**. Para hipótesis: **Es ist anzunehmen, dass** … · **Es ist davon auszugehen, dass** … · **Vieles / Einiges spricht dafür, dass** … · **Es liegt die Vermutung nahe, dass** … · **vermutlich**, **mutmaßlich**, **womöglich**.',
      'Para relativizar: **tendenziell** (en tendencia), **weitgehend** (en gran parte), **in der Regel** (por lo general), **unter Umständen** (eventualmente), **nicht zwingend** (no necesariamente): Mehr Geld führt **nicht zwingend** zu besseren Ergebnissen.',
    ],
    examples: [
      { text: 'Es ist davon auszugehen, dass die Preise weiter steigen.', meaning: 'Hay que suponer que los precios seguirán subiendo.' },
      { text: 'Vieles spricht dafür, dass der Schaden schon älter ist.', meaning: 'Muchas cosas indican que el daño ya es más antiguo.' },
      { text: 'Eine längere Ausbildung führt nicht zwingend zu einem höheren Gehalt.', meaning: 'Una formación más larga no lleva necesariamente a un sueldo más alto.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Es ist ＿, dass die Zahl der E-Autos steigt.', options: ['anzunehmen', 'annehmen', 'angenommen', 'zu annehmen'], answer: 'anzunehmen' },
      { type: 'choice', prompt: 'Einiges ＿ dafür, dass er recht hat.', options: ['spricht', 'sagt', 'liegt', 'geht'], answer: 'spricht' },
      { type: 'choice', prompt: 'Das ist ＿ richtig, aber nicht in allen Fällen.', hint: 'en gran parte', options: ['weitgehend', 'zwingend', 'mutmaßlich', 'keineswegs'], answer: 'weitgehend' },
      { type: 'meaning', text: 'Es liegt die Vermutung nahe, dass der Fehler im System liegt.', options: ['Es razonable suponer que el error está en el sistema.', 'Está demostrado que no hay error.', 'El error está cerca del sistema.', 'Nadie sospecha del sistema.'], answer: 'Es razonable suponer que el error está en el sistema.' },
    ],
  },
  {
    id: 'de-argument-entkraeften',
    level: 'C1',
    title: 'Rebatir un argumento',
    summary: 'Dem lässt sich entgegenhalten, dass …',
    pattern: 'reconocer (zwar / sicherlich) → limitar (doch / allerdings) → rebatir (dem lässt sich entgegenhalten)',
    explanation: [
      'En un texto de opinión C1 no basta con dar argumentos: hay que **rebatir** los contrarios. Primero se **reconoce** lo válido: **Zwar** ist es richtig, dass … / **Sicherlich** mag es stimmen, dass … / **Man kann nicht leugnen, dass** … Luego se **limita** y **rebate**: …, **doch** / **allerdings** wird dabei übersehen, dass …',
      'Fórmulas para rebatir: **Dem lässt sich entgegenhalten, dass** … · **Dieses Argument greift zu kurz, denn** … · **Dabei wird außer Acht gelassen, dass** … · **Das trifft nur bedingt zu.** · **Davon kann keine Rede sein.**',
    ],
    examples: [
      { text: 'Zwar sind Elektroautos teurer, doch die Betriebskosten sind deutlich niedriger.', meaning: 'Es cierto que los autos eléctricos son más caros, pero los costos de uso son claramente menores.' },
      { text: 'Dem lässt sich entgegenhalten, dass die Strompreise ebenfalls gestiegen sind.', meaning: 'A eso se puede objetar que los precios de la electricidad también subieron.' },
      { text: 'Dieses Argument greift zu kurz, denn es berücksichtigt die Herstellung nicht.', meaning: 'Este argumento se queda corto, porque no considera la fabricación.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ ist es richtig, dass …, doch …', options: ['Zwar', 'Obwohl', 'Trotzdem', 'Dennoch'], answer: 'Zwar' },
      { type: 'choice', prompt: 'Dem lässt sich ＿, dass die Kosten zu hoch sind.', options: ['entgegenhalten', 'entgegnen zu', 'gegenhalten', 'widersprochen'], answer: 'entgegenhalten' },
      { type: 'choice', prompt: 'Dieses Argument ＿ zu kurz.', options: ['greift', 'geht', 'kommt', 'liegt'], answer: 'greift' },
      { type: 'choice', prompt: 'Dabei wird außer ＿ gelassen, dass …', options: ['Acht', 'Sicht', 'Frage', 'Rede'], answer: 'Acht' },
    ],
  },
  {
    id: 'de-diskussion-c1',
    level: 'C1',
    title: 'Moderar y defenderse en una discusión',
    summary: 'Darf ich da kurz einhaken? · Lassen Sie mich bitte ausreden.',
    pattern: 'intervenir · mantener la palabra · volver al tema · resumir y cerrar',
    explanation: [
      'En el examen C1 y en reuniones hay que saber **tomar la palabra** (Darf ich da kurz **einhaken**? / Wenn ich dazu etwas **ergänzen** darf …), **mantenerla** (Lassen Sie mich bitte **ausreden**. / Ich bin gleich fertig.) y **reaccionar con matices** (Da muss ich Ihnen **teilweise** recht geben, aber … / Das sehe ich **etwas anders**).',
      'Para moderar: **Um auf** die Frage **zurückzukommen**, … · Wir **schweifen** etwas **ab**. · **Fassen wir zusammen**: … · **Halten wir fest**, dass … · Können wir uns **darauf einigen**, dass …?',
    ],
    examples: [
      { text: 'Darf ich da kurz einhaken? Ich habe dazu eine andere Erfahrung gemacht.', meaning: '¿Puedo intervenir un momento? Yo tuve otra experiencia al respecto.' },
      { text: 'Um auf Ihre Frage zurückzukommen: Die Kosten trägt der Arbeitgeber.', meaning: 'Para volver a su pregunta: los costos los asume el empleador.' },
      { text: 'Halten wir fest, dass alle eine flexiblere Lösung wollen.', meaning: 'Dejemos constancia de que todos quieren una solución más flexible.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Entschuldigung, lassen Sie mich bitte ＿.', options: ['ausreden', 'einhaken', 'abschweifen', 'festhalten'], answer: 'ausreden' },
      { type: 'choice', prompt: 'Ich glaube, wir ＿ vom Thema ab.', options: ['schweifen', 'kommen', 'halten', 'gehen weg'], answer: 'schweifen' },
      { type: 'choice', prompt: 'Können wir uns ＿ einigen, dass wir nächste Woche entscheiden?', options: ['darauf', 'damit', 'davon', 'dafür'], answer: 'darauf' },
      { type: 'choice', prompt: 'Para intervenir con cortesía:', options: ['Darf ich da kurz einhaken?', 'Seien Sie still!', 'Das ist Quatsch.', 'Jetzt rede ich.'], answer: 'Darf ich da kurz einhaken?' },
    ],
  },
  {
    id: 'de-geschaeftskorrespondenz',
    level: 'C1',
    title: 'Correspondencia profesional',
    summary: 'Bezug nehmend auf Ihr Schreiben … · Wir bedauern, Ihnen mitteilen zu müssen …',
    pattern: 'referencia → asunto → propuesta o respuesta → cierre (con fórmulas fijas)',
    explanation: [
      'Fórmulas de **apertura**: **Bezug nehmend auf** Ihr Schreiben vom … / **Mit Bezug auf** unser Telefonat … / **Wie** telefonisch **besprochen**, … Para **malas noticias**: **Wir bedauern, Ihnen mitteilen zu müssen**, dass … / **Leider sehen wir uns gezwungen**, …',
      'Para **pedir** con firmeza y cortesía: **Wir bitten Sie**, die Zahlung **umgehend** (de inmediato) zu veranlassen. / **Für eine baldige Rückmeldung wären wir Ihnen dankbar.** Para **cerrar**: **Für Rückfragen stehen wir Ihnen gern zur Verfügung.** · **Wir danken Ihnen für Ihr Verständnis.**',
    ],
    examples: [
      { text: 'Bezug nehmend auf Ihre Anfrage vom 12. Mai senden wir Ihnen unser Angebot.', meaning: 'En relación con su consulta del 12 de mayo, le enviamos nuestra oferta.' },
      { text: 'Wir bedauern, Ihnen mitteilen zu müssen, dass der Termin nicht eingehalten werden kann.', meaning: 'Lamentamos tener que comunicarle que no se podrá cumplir el plazo.' },
      { text: 'Für eine baldige Rückmeldung wären wir Ihnen sehr dankbar.', meaning: 'Le agradeceríamos mucho una pronta respuesta.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ nehmend auf Ihr Schreiben …', options: ['Bezug', 'Bezüglich', 'Betreff', 'Beziehung'], answer: 'Bezug' },
      { type: 'choice', prompt: 'Wir bedauern, Ihnen mitteilen zu ＿, dass …', options: ['müssen', 'sollen', 'können', 'wollen'], answer: 'müssen' },
      { type: 'choice', prompt: 'Bitte überweisen Sie den Betrag ＿.', hint: 'de inmediato (formal)', options: ['umgehend', 'irgendwann', 'eventuell', 'neulich'], answer: 'umgehend' },
      { type: 'choice', prompt: 'Para cerrar un correo formal:', options: ['Für Rückfragen stehen wir Ihnen gern zur Verfügung.', 'Meld dich mal!', 'Bis dann!', 'Tschüs und so.'], answer: 'Für Rückfragen stehen wir Ihnen gern zur Verfügung.' },
    ],
  },
  {
    id: 'de-reformulieren',
    level: 'C1',
    title: 'Reformular y precisar',
    summary: 'mit anderen Worten · genauer gesagt · und zwar',
    pattern: 'das heißt · mit anderen Worten · genauer gesagt · und zwar · beziehungsweise · sprich',
    explanation: [
      'Para **aclarar** lo dicho: **das heißt** (d. h., es decir), **mit anderen Worten** (en otras palabras), **anders ausgedrückt**, **sprich** (coloquial, o sea). Para **precisar**: **genauer gesagt**, **und zwar** (en concreto): Wir brauchen Hilfe, **und zwar** sofort.',
      'Para **corregirse**: **beziehungsweise** (bzw., o mejor dicho), **oder vielmehr**, **besser gesagt**. Para **ejemplificar**: **beispielsweise**, **etwa**, **wie zum Beispiel**, **darunter** (entre ellos).',
    ],
    examples: [
      { text: 'Die Kosten sind gestiegen, mit anderen Worten: Wir müssen sparen.', meaning: 'Los costos subieron; en otras palabras, tenemos que ahorrar.' },
      { text: 'Wir treffen uns am Montag, und zwar um neun Uhr.', meaning: 'Nos juntamos el lunes, en concreto a las nueve.' },
      { text: 'Der Termin ist am Dienstag beziehungsweise Mittwoch.', meaning: 'La cita es el martes, o mejor dicho el miércoles.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich komme morgen, ＿ gegen acht.', hint: 'en concreto', options: ['und zwar', 'beziehungsweise', 'mit anderen Worten', 'darunter'], answer: 'und zwar' },
      { type: 'choice', prompt: 'Er ist Mechatroniker, ＿ er repariert Autos und Elektronik.', options: ['das heißt', 'und zwar nicht', 'darunter', 'etwa'], answer: 'das heißt' },
      { type: 'choice', prompt: 'Viele Länder, ＿ Deutschland und Österreich, haben das Gesetz.', hint: 'entre ellos', options: ['darunter', 'sprich', 'und zwar', 'beziehungsweise'], answer: 'darunter' },
      { type: 'meaning', text: 'Das Projekt ist gescheitert, besser gesagt: Es wurde nie richtig begonnen.', options: ['El proyecto fracasó, o mejor dicho: nunca empezó de verdad.', 'El proyecto fue un éxito.', 'El proyecto va a empezar pronto.', 'El proyecto se repitió.'], answer: 'El proyecto fracasó, o mejor dicho: nunca empezó de verdad.' },
    ],
  },
  {
    id: 'de-komposita',
    level: 'C1',
    title: 'Palabras compuestas y la -s- de unión',
    summary: 'Arbeit + Platz → Arbeitsplatz',
    pattern: 'determinante + base (la base da el género) · -s- / -n- / -es- de unión',
    explanation: [
      'En los compuestos, la **última palabra** es la base y da el **género**: **der** Arbeits**platz**, **die** Haus**tür**, **das** Auto**dach**. La primera precisa el sentido: Dach**fenster** (ventana en el techo) ≠ Fenster**dach** (alero sobre la ventana).',
      'A menudo se agrega una **letra de unión**: **-s-** tras -ung, -heit, -keit, -ion, -tät, -schaft y muchas otras (Wohnung**s**markt, Gesundheit**s**system, Arbeit**s**zeit), **-n-** / **-en-** (Straße**n**bahn, Student**en**wohnheim), **-es-** (Tag**es**zeit). Siglas y palabras cortas: **Kfz** (Kraftfahrzeug), **TÜV**, **Azubi**, **Uni**, **Kita**.',
    ],
    examples: [
      { text: 'Der Wohnungsmarkt in München ist sehr angespannt.', meaning: 'El mercado de la vivienda en Múnich está muy tensionado.' },
      { text: 'Die Kfz-Versicherung muss vor der Zulassung abgeschlossen werden.', meaning: 'El seguro del auto debe contratarse antes de la inscripción.' },
      { text: 'Unsere Kita hat auch in den Ferien geöffnet.', meaning: 'Nuestra sala cuna también abre en vacaciones.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Haus + Tür → ＿ Haustür', options: ['die', 'das', 'der', 'den'], answer: 'die' },
      { type: 'choice', prompt: 'Gesundheit + System → das Gesundheit＿system', options: ['s', 'n', 'es', 'en'], answer: 's' },
      { type: 'choice', prompt: 'Straße + Bahn → die Straße＿bahn', options: ['n', 's', 'es', 'e'], answer: 'n' },
      { type: 'meaning', text: 'das Dachfenster', options: ['la ventana del techo', 'el techo de la ventana', 'el alero', 'la casa con ventana'], answer: 'la ventana del techo' },
    ],
  },
  {
    id: 'de-substantivierte-adjektive',
    level: 'C1',
    title: 'Adjetivos y participios como sustantivos',
    summary: 'der Angestellte, ein Angestellter, etwas Neues',
    pattern: 'artículo + ADJ con mayúscula y terminación de adjetivo · etwas / nichts / viel + ADJ-es',
    explanation: [
      'Un adjetivo o participio puede ser **sustantivo**: se escribe con mayúscula, pero **se declina como adjetivo**: **der** Angestellt**e** / **ein** Angestellt**er** / **die** Angestellt**en**. Igual: der/die **Deutsche**, der **Arbeitslose**, der **Verletzte**, der **Vorgesetzte** (superior), der **Bekannte**, der **Erwachsene**, der **Reisende**.',
      'Lo neutro abstracto: **das Wichtigste** (lo más importante), **das Gute daran** (lo bueno de eso). Tras **etwas, nichts, viel, wenig, alles**: etwas **Neues**, nichts **Besonderes**, viel **Gutes**, **alles Gute** (¡mucha suerte!). Ojo: **alles** + -**e**: alles Gut**e**.',
    ],
    examples: [
      { text: 'Alle Angestellten bekommen ein Weihnachtsgeld.', meaning: 'Todos los empleados reciben un aguinaldo de Navidad.' },
      { text: 'Mein Vorgesetzter ist ein Bekannter von Hans.', meaning: 'Mi superior es un conocido de Hans.' },
      { text: 'Das Wichtigste ist, dass niemand verletzt wurde.', meaning: 'Lo más importante es que nadie salió herido.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Er ist ein ＿ der Firma.', hint: 'angestellt', options: ['Angestellter', 'Angestellte', 'Angestellten', 'Angestellt'], answer: 'Angestellter' },
      { type: 'choice', prompt: 'Gibt es etwas ＿?', hint: 'neu', options: ['Neues', 'Neue', 'neues', 'Neuen'], answer: 'Neues' },
      { type: 'choice', prompt: 'Ich wünsche dir alles ＿!', options: ['Gute', 'Gutes', 'Guten', 'gut'], answer: 'Gute' },
      { type: 'choice', prompt: 'Die ＿ wurden ins Krankenhaus gebracht.', hint: 'verletzt, plural', options: ['Verletzten', 'Verletzte', 'Verletzter', 'Verletzt'], answer: 'Verletzten' },
    ],
  },
  {
    id: 'de-sprichwoerter',
    level: 'C1',
    title: 'Refranes y expresiones idiomáticas',
    summary: 'Aller Anfang ist schwer. · Übung macht den Meister.',
    pattern: 'refrán fijo · se cita entero, sin cambiar las palabras',
    explanation: [
      'Los refranes aparecen en conversaciones, titulares y textos de opinión. Algunos muy frecuentes: **Aller Anfang ist schwer** (todo comienzo es difícil). **Übung macht den Meister** (la práctica hace al maestro). **Ende gut, alles gut**. **Wer rastet, der rostet** (el que se detiene, se oxida). **Morgenstund hat Gold im Mund** (al que madruga…).',
      'Otros: **Der Apfel fällt nicht weit vom Stamm** (de tal palo, tal astilla). **Wo ein Wille ist, ist auch ein Weg**. **Viele Köche verderben den Brei** (muchas manos en un plato…). **Man soll den Tag nicht vor dem Abend loben** (no cantes victoria antes de tiempo). En un texto se introducen con: **Wie das Sprichwort sagt**, …',
    ],
    examples: [
      { text: 'Die ersten Monate in München waren hart – aller Anfang ist schwer.', meaning: 'Los primeros meses en Múnich fueron duros: todo comienzo es difícil.' },
      { text: 'Wie das Sprichwort sagt: Übung macht den Meister.', meaning: 'Como dice el refrán: la práctica hace al maestro.' },
      { text: 'Freu dich nicht zu früh. Man soll den Tag nicht vor dem Abend loben.', meaning: 'No te alegres tan pronto. No hay que cantar victoria antes de tiempo.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Übung macht den ＿.', options: ['Meister', 'Anfang', 'Weg', 'Stamm'], answer: 'Meister' },
      { type: 'choice', prompt: 'Wo ein Wille ist, ist auch ein ＿.', options: ['Weg', 'Meister', 'Ende', 'Abend'], answer: 'Weg' },
      { type: 'choice', prompt: 'Der Apfel fällt nicht weit vom ＿.', options: ['Stamm', 'Baum', 'Brei', 'Mund'], answer: 'Stamm' },
      { type: 'meaning', text: 'Viele Köche verderben den Brei.', options: ['Cuando muchos opinan, el resultado sale mal.', 'Hay que cocinar con muchos amigos.', 'La comida alemana es mala.', 'Los cocineros son muy buenos.'], answer: 'Cuando muchos opinan, el resultado sale mal.' },
    ],
  },
  {
    id: 'de-textverweise',
    level: 'C1',
    title: 'Dar coherencia: referencias en el texto',
    summary: 'Ersterer … Letzterer · dieser … jener · derselbe',
    pattern: 'dies- / jen- · der/die/das Erstere – Letztere · derselbe / der gleiche · dies / das',
    explanation: [
      'Un texto C1 evita repetir palabras usando **referencias**: **Ersterer / Letzterer** (el primero / el último de dos): Otto und Hans sind Freunde; **Letzterer** wohnt in Berlin. **dieser … jener** (este … aquel, formal). **Dies** / **Das** resume una idea entera: **Dies** zeigt, dass …',
      '**derselbe** (el mismo, idéntico) se escribe junto y se declina por las dos partes: **dieselbe** Frau, **demselben** Ergebnis. **der gleiche** = uno igual (del mismo tipo). También: **Ersteres** (lo primero), **besagt** (dicho, mencionado), **ebendies** (precisamente eso), **Ersteres … Letzteres**.',
    ],
    examples: [
      { text: 'Es gibt zwei Optionen: Reparatur oder Austausch. Letzterer ist teurer, aber sicherer.', meaning: 'Hay dos opciones: reparación o reemplazo. Esto último es más caro, pero más seguro.' },
      { text: 'Die Mieten steigen, die Löhne nicht. Dies führt zu sozialen Spannungen.', meaning: 'Los arriendos suben, los sueldos no. Esto lleva a tensiones sociales.' },
      { text: 'Wir arbeiten seit Jahren mit demselben Zulieferer.', meaning: 'Trabajamos hace años con el mismo proveedor.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Hans und Otto: ＿ ist Mechaniker (Otto, el segundo).', options: ['Letzterer', 'Ersterer', 'Dieser jener', 'Derselbe'], answer: 'Letzterer' },
      { type: 'choice', prompt: 'Wir wohnen im ＿ Haus wie früher.', hint: 'el mismo', options: ['selben', 'gleiche', 'derselbe', 'selbe'], answer: 'selben' },
      { type: 'choice', prompt: 'Die Preise sinken. ＿ freut die Kunden.', options: ['Dies', 'Dieser', 'Jener', 'Letzterer'], answer: 'Dies' },
      { type: 'choice', prompt: 'Sie trägt ＿ Kleid wie gestern (idéntico).', options: ['dasselbe', 'das gleiche wie', 'selbes', 'dieselbe'], answer: 'dasselbe' },
    ],
  },
]
