import type { GrammarLesson } from '../grammar.ts'

// Gramática B2 del alemán, tercera parte (lecciones 120–130): estilo nominal, formación de
// palabras, rección de adjetivos y sustantivos, partículas y textos argumentativos.

export const grammarB2c: GrammarLesson[] = [
  {
    id: 'de-nominalisierung',
    level: 'B2',
    title: 'Estilo nominal: de verbo a sustantivo',
    summary: 'Nachdem er angekommen war… → Nach seiner Ankunft…',
    pattern: 'subordinada → preposición + sustantivo · weil → wegen · wenn → bei · bevor → vor',
    explanation: [
      'Los textos oficiales y las noticias prefieren el **estilo nominal**: en vez de una subordinada se usa **preposición + sustantivo**. **Weil** es regnet → **wegen** des Regens. **Wenn** man ankommt → **bei** der Ankunft. **Bevor** man abfährt → **vor** der Abfahrt. **Nachdem** er gegangen war → **nach** seinem Weggang. **Obwohl** es kalt ist → **trotz** der Kälte.',
      'El sujeto pasa a genitivo o a posesivo: **Der Chef** entscheidet → die Entscheidung **des Chefs** / **seine** Entscheidung. El complemento suele ir con **von** o en genitivo: Man repariert **das Auto** → die Reparatur **des Autos**.',
    ],
    examples: [
      { text: 'Nach der Reparatur wurde das Auto gewaschen.', meaning: 'Después de la reparación, se lavó el auto.' },
      { text: 'Wegen der Baustelle ist die Straße gesperrt.', meaning: 'Por las obras, la calle está cerrada.' },
      { text: 'Bei Fragen wenden Sie sich bitte an die Personalabteilung.', meaning: 'Si tiene preguntas, diríjase por favor al departamento de personal.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Weil es stark schneite, … → ＿ des starken Schneefalls …', options: ['Wegen', 'Trotz', 'Bei', 'Vor'], answer: 'Wegen' },
      { type: 'choice', prompt: 'Bevor Sie abreisen, … → ＿ Ihrer Abreise …', options: ['Vor', 'Nach', 'Bei', 'Seit'], answer: 'Vor' },
      { type: 'choice', prompt: 'Obwohl es regnete, … → ＿ des Regens …', options: ['Trotz', 'Wegen', 'Während', 'Bei'], answer: 'Trotz' },
      { type: 'choice', prompt: 'Man prüft die Bremsen. → die ＿ der Bremsen', options: ['Prüfung', 'Prüfen', 'Prüfer', 'Prüfheit'], answer: 'Prüfung' },
    ],
  },
  {
    id: 'de-verbalisierung',
    level: 'B2',
    title: 'Al revés: de sustantivo a subordinada',
    summary: 'Bei schlechtem Wetter… → Wenn das Wetter schlecht ist…',
    pattern: 'preposición + sustantivo → conector + sujeto + … + VERBO',
    explanation: [
      'Para entender un texto formal (o para hablar de forma natural) conviene **deshacer** el estilo nominal: **Bei** schlechtem Wetter → **Wenn** das Wetter schlecht **ist**. **Durch** tägliches Üben → **Indem** man täglich **übt**. **Zur** Verbesserung der Qualität → **Um** die Qualität **zu** verbessern.',
      'Pares útiles: **während** (gen.) → während · **seit** → seit(dem) · **bis zu** → bis · **ohne** → ohne dass · **statt** → statt dass / statt … zu · **zwecks / zur** → um … zu / damit.',
    ],
    examples: [
      { text: 'Zur Vermeidung von Unfällen tragen alle Schutzkleidung. → Damit es keine Unfälle gibt, …', meaning: 'Para evitar accidentes, todos usan ropa de protección.' },
      { text: 'Seit seiner Ankunft in München lernt Otto Bairisch. → Seit er in München angekommen ist, …', meaning: 'Desde que llegó a Múnich, Otto aprende bávaro.' },
      { text: 'Ohne Termin keine Reparatur. → Wenn man keinen Termin hat, …', meaning: 'Sin cita no hay reparación.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Bei Regen fällt das Fest aus. → ＿ es regnet, fällt das Fest aus.', options: ['Wenn', 'Weil', 'Obwohl', 'Damit'], answer: 'Wenn' },
      { type: 'choice', prompt: 'Trotz der Kosten kaufen wir die Maschine. → ＿ sie viel kostet, …', options: ['Obwohl', 'Weil', 'Indem', 'Sodass'], answer: 'Obwohl' },
      { type: 'choice', prompt: 'Zur Verbesserung des Service … → ＿ den Service zu verbessern, …', options: ['Um', 'Damit', 'Indem', 'Ohne'], answer: 'Um' },
      { type: 'meaning', text: 'Nach Abschluss der Ausbildung bekam er eine feste Stelle.', options: ['Después de terminar la formación, consiguió un puesto fijo.', 'Antes de la formación tenía un puesto fijo.', 'Durante la formación perdió su puesto.', 'Sin formación no consiguió puesto.'], answer: 'Después de terminar la formación, consiguió un puesto fijo.' },
    ],
  },
  {
    id: 'de-wortbildung-2',
    level: 'B2',
    title: 'Formar palabras: un-, miss-, -los, -bar, -lich',
    summary: 'unmöglich, Missverständnis, arbeitslos, machbar.',
    pattern: 'un- / miss- (negación) · -los (sin) · -bar (se puede) · -lich / -ig / -isch (adjetivos)',
    explanation: [
      'Prefijos de **negación**: **un**- (möglich → **un**möglich, freundlich → **un**freundlich), **miss**- (verstehen → **miss**verstehen, Erfolg → **Miss**erfolg), **in**-/**il**- en palabras latinas (**in**akzeptabel, **il**legal).',
      'Sufijos de **adjetivo**: **-los** = sin (arbeits**los**, kosten**los**), **-bar** = que se puede (mach**bar**, les**bar**, trink**bar**), **-lich** (verständ**lich**, täg**lich**), **-ig** (wind**ig**, heut**ig**), **-isch** (prakt**isch**, techn**isch**), **-voll** = lleno de (sinn**voll**, wert**voll**), **-frei** = libre de (alkohol**frei**).',
    ],
    examples: [
      { text: 'Das ist leider nicht machbar – das Teil ist nicht lieferbar.', meaning: 'Lamentablemente eso no se puede hacer: el repuesto no está disponible.' },
      { text: 'Es gab ein Missverständnis wegen des Termins.', meaning: 'Hubo un malentendido por la cita.' },
      { text: 'Die Beratung ist kostenlos und unverbindlich.', meaning: 'La asesoría es gratis y sin compromiso.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Man kann das Wasser trinken. → Das Wasser ist ＿.', options: ['trinkbar', 'trinklos', 'untrinkbar', 'trinklich'], answer: 'trinkbar' },
      { type: 'choice', prompt: 'Er hat keine Arbeit. → Er ist ＿.', options: ['arbeitslos', 'arbeitsbar', 'unarbeit', 'arbeitlich'], answer: 'arbeitslos' },
      { type: 'choice', prompt: 'Das ist nicht möglich. → Das ist ＿.', options: ['unmöglich', 'missmöglich', 'möglichlos', 'inmöglich'], answer: 'unmöglich' },
      { type: 'choice', prompt: 'Ich habe dich falsch verstanden. → Ich habe dich ＿.', options: ['missverstanden', 'unverstanden', 'verstandlos', 'umverstanden'], answer: 'missverstanden' },
    ],
  },
  {
    id: 'de-adjektiv-praep',
    level: 'B2',
    title: 'Adjetivos con preposición',
    summary: 'stolz auf, zufrieden mit, abhängig von.',
    pattern: 'ADJETIVO + preposición fija (+ caso) · darauf / damit, dass …',
    explanation: [
      'Como los verbos, muchos adjetivos llevan una **preposición fija**: **stolz auf** (+Akk.), **zufrieden mit** (+Dat.), **abhängig von** (+Dat.), **interessiert an** (+Dat.), **verantwortlich für** (+Akk.), **bekannt für**, **begeistert von**, **gespannt auf**, **verheiratet mit**, **überzeugt von**, **froh über**, **bereit zu**.',
      'Con una oración, se anticipa con **da(r)-**: Ich bin **stolz darauf**, **dass** ich die Prüfung bestanden habe. Wir sind **bereit dazu**, Überstunden **zu** machen.',
    ],
    examples: [
      { text: 'Otto ist verantwortlich für sechs Mitarbeiter.', meaning: 'Otto es responsable de seis trabajadores.' },
      { text: 'Die Kunden sind sehr zufrieden mit unserem Service.', meaning: 'Los clientes están muy satisfechos con nuestro servicio.' },
      { text: 'Ich bin gespannt darauf, wie die neue Werkstatt aussieht.', meaning: 'Tengo curiosidad por ver cómo es el nuevo taller.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Hans ist stolz ＿ seinen Sohn.', options: ['auf', 'über', 'mit', 'von'], answer: 'auf' },
      { type: 'choice', prompt: 'Der Preis ist abhängig ＿ der Qualität.', options: ['von', 'mit', 'an', 'für'], answer: 'von' },
      { type: 'choice', prompt: 'Sind Sie interessiert ＿ einer Weiterbildung?', options: ['an', 'für', 'auf', 'über'], answer: 'an' },
      { type: 'choice', prompt: 'München ist bekannt ＿ das Oktoberfest.', options: ['für', 'von', 'mit', 'auf'], answer: 'für' },
    ],
  },
  {
    id: 'de-nomen-praep',
    level: 'B2',
    title: 'Sustantivos con preposición',
    summary: 'die Angst vor, das Interesse an, die Frage nach.',
    pattern: 'SUSTANTIVO + preposición fija (muchas veces la misma del verbo)',
    explanation: [
      'Los sustantivos que vienen de verbos suelen conservar la preposición: sich interessieren **für** → aber das Interesse **an**! Hay que aprender cada uno: die **Angst vor** (+Dat.), das **Interesse an** (+Dat.), die **Frage nach**, die **Bitte um**, der **Wunsch nach**, die **Erinnerung an**, die **Lust auf**, die **Teilnahme an**, der **Bedarf an**, die **Kritik an**, der **Grund für**, die **Voraussetzung für**.',
      'Son clave en correos formales: **Vielen Dank für** Ihre Nachricht. **Mit Bezug auf** Ihr Schreiben… **Auf Ihre Bitte um** Rückruf antworte ich…',
    ],
    examples: [
      { text: 'Es gibt einen großen Bedarf an Fachkräften.', meaning: 'Hay una gran necesidad de trabajadores calificados.' },
      { text: 'Viele Menschen haben Angst vor dem Zahnarzt.', meaning: 'Mucha gente le tiene miedo al dentista.' },
      { text: 'Die Teilnahme an dem Kurs ist kostenlos.', meaning: 'La participación en el curso es gratis.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Hast du Lust ＿ einen Spaziergang?', options: ['auf', 'an', 'für', 'nach'], answer: 'auf' },
      { type: 'choice', prompt: 'Ich habe eine Frage ＿ dem Preis.', options: ['nach', 'über', 'an', 'von'], answer: 'nach' },
      { type: 'choice', prompt: 'Das Interesse ＿ Elektroautos wächst.', options: ['an', 'für', 'auf', 'über'], answer: 'an' },
      { type: 'choice', prompt: 'Vielen Dank ＿ Ihre schnelle Antwort.', options: ['für', 'auf', 'an', 'über'], answer: 'für' },
    ],
  },
  {
    id: 'de-infinitiv-perfekt',
    level: 'B2',
    title: 'Infinitivo perfecto: gemacht zu haben',
    summary: 'Ich bin froh, die Prüfung bestanden zu haben.',
    pattern: 'PARTICIPIO + zu haben / zu sein',
    explanation: [
      'Si la acción del infinitivo con **zu** ocurrió **antes**, se usa el **infinitivo perfecto**: participio + **zu haben** / **zu sein**: Ich bin froh, die Prüfung **bestanden zu haben**. Er bedauert, nicht früher **gekommen zu sein**.',
      'Aparece también con verbos modales para suposiciones sobre el pasado: Er **muss** den Termin **vergessen haben** (seguro que olvidó la cita). Sie **soll** in Chile **gewesen sein** (dicen que estuvo en Chile).',
    ],
    examples: [
      { text: 'Otto ist stolz darauf, die Meisterprüfung bestanden zu haben.', meaning: 'Otto está orgulloso de haber aprobado el examen de maestro.' },
      { text: 'Ich erinnere mich, dich schon einmal gesehen zu haben.', meaning: 'Recuerdo haberte visto antes.' },
      { text: 'Der Kunde behauptet, das Auto pünktlich abgeholt zu haben.', meaning: 'El cliente afirma haber retirado el auto puntualmente.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Es tut mir leid, dich nicht angerufen zu ＿.', options: ['haben', 'sein', 'werden', 'hätten'], answer: 'haben' },
      { type: 'choice', prompt: 'Er ist froh, nach Deutschland gekommen zu ＿.', options: ['sein', 'haben', 'werden', 'wäre'], answer: 'sein' },
      { type: 'choice', prompt: 'Sie ist nicht da. Sie muss den Zug ＿ haben.', options: ['verpasst', 'verpassen', 'zu verpassen', 'verpasste'], answer: 'verpasst' },
      { type: 'order', meaning: 'Estoy feliz de haberte conocido.', answer: ['Ich', 'bin', 'froh', 'dich', 'kennengelernt', 'zu', 'haben'] },
    ],
  },
  {
    id: 'de-sein-haben-zu',
    level: 'B2',
    title: 'Es ist zu tun / Sie haben zu zahlen',
    summary: 'Die Miete ist bis zum 3. zu zahlen.',
    pattern: 'sein + zu + INFINITIVO (= se debe / se puede) · haben + zu + INFINITIVO (= tener que)',
    explanation: [
      '**sein + zu + infinitivo** es un pasivo con idea de **obligación** o **posibilidad**: Die Miete **ist** bis zum 3. **zu zahlen** (= muss gezahlt werden). Das Problem **ist** leicht **zu lösen** (= kann gelöst werden).',
      '**haben + zu + infinitivo** = «tener que», típico en reglamentos: Sie **haben** die Schutzbrille **zu tragen**. Ich **habe** noch viel **zu tun**. Es más duro que müssen: suena a orden.',
    ],
    examples: [
      { text: 'Das Formular ist vollständig auszufüllen.', meaning: 'El formulario debe completarse entero.' },
      { text: 'Der Schaden war nicht zu übersehen.', meaning: 'El daño no se podía pasar por alto.' },
      { text: 'Alle Mitarbeiter haben die Sicherheitsregeln zu beachten.', meaning: 'Todos los trabajadores tienen que respetar las normas de seguridad.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Die Rechnung muss sofort bezahlt werden. → Die Rechnung ist sofort ＿.', options: ['zu bezahlen', 'bezahlt', 'bezahlen', 'zu bezahlt'], answer: 'zu bezahlen' },
      { type: 'choice', prompt: 'Das kann man nicht ändern. → Das ist nicht zu ＿.', options: ['ändern', 'geändert', 'änderen', 'ändert'], answer: 'ändern' },
      { type: 'choice', prompt: 'Sie müssen pünktlich sein. → Sie ＿ pünktlich zu sein.', options: ['haben', 'sind', 'werden', 'müssen'], answer: 'haben' },
      { type: 'meaning', text: 'Der Fehler ist leicht zu finden.', options: ['El error se encuentra fácilmente.', 'El error es difícil de encontrar.', 'Hay que buscar el error.', 'Encontramos el error ayer.'], answer: 'El error se encuentra fácilmente.' },
    ],
  },
  {
    id: 'de-modalpartikeln',
    level: 'B2',
    title: 'Partículas: doch, ja, mal, eben, halt',
    summary: 'Komm doch mal vorbei! · Das ist halt so.',
    pattern: 'doch · ja · mal · eben / halt · denn · wohl · schon',
    explanation: [
      'Las **partículas modales** no cambian el significado, sino el **tono**. **doch** suaviza o insiste (Komm **doch** mit! = ¡ven, anda!). **ja** marca algo sabido o sorpresa (Das ist **ja** toll!). **mal** hace más amable una petición (Kannst du **mal** helfen?). **denn** en preguntas suena interesado (Wo warst du **denn**?).',
      '**eben** y **halt** (más del sur, típico de Múnich) expresan resignación: Das ist **halt** so (así es nomás). **wohl** = probablemente (Er ist **wohl** krank). **schon** tranquiliza (Das klappt **schon**).',
    ],
    examples: [
      { text: 'Setzen Sie sich doch!', meaning: '¡Siéntese, por favor!' },
      { text: 'Du bist ja schon da!', meaning: '¡Ah, ya llegaste!' },
      { text: 'Die Teile kommen erst morgen. Das ist halt so.', meaning: 'Los repuestos llegan recién mañana. Así es nomás.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Kannst du ＿ das Fenster aufmachen?', hint: 'petición amable', options: ['mal', 'ja', 'halt', 'wohl'], answer: 'mal' },
      { type: 'choice', prompt: 'Was ist ＿ los?', hint: 'pregunta con interés', options: ['denn', 'mal', 'eben', 'doch'], answer: 'denn' },
      { type: 'choice', prompt: 'Keine Sorge, das schaffst du ＿.', hint: 'tranquilizar', options: ['schon', 'denn', 'mal', 'ja'], answer: 'schon' },
      { type: 'meaning', text: 'Er ist wohl noch im Büro.', options: ['Probablemente todavía está en la oficina.', 'Seguro que ya salió de la oficina.', 'Está bien en la oficina.', 'Todavía quiere ir a la oficina.'], answer: 'Probablemente todavía está en la oficina.' },
    ],
  },
  {
    id: 'de-grafik',
    level: 'B2',
    title: 'Describir gráficos y estadísticas',
    summary: 'Die Zahl ist um 20 % gestiegen.',
    pattern: 'steigen / sinken / zunehmen / abnehmen + um (diferencia) / auf (valor final)',
    explanation: [
      'Para presentar datos: Die Grafik **zeigt** / **stellt** … **dar**. **Laut** der Statistik… Para los cambios: **steigen** / **zunehmen** / **sich erhöhen** (subir), **sinken** / **abnehmen** / **zurückgehen** (bajar), **gleich bleiben** (mantenerse).',
      'Ojo con las preposiciones: **um** = la diferencia (Die Preise sind **um** 5 % gestiegen), **auf** = el valor final (… **auf** 3 Euro gestiegen), **von … auf** (de … a). Para comparar: **im Vergleich zu**, **mehr als die Hälfte**, **jeder Dritte**, **der größte Anteil**.',
    ],
    examples: [
      { text: 'Die Zahl der Elektroautos ist im letzten Jahr um 30 Prozent gestiegen.', meaning: 'El número de autos eléctricos subió un 30 por ciento el año pasado.' },
      { text: 'Die Arbeitslosigkeit ist von 6 auf 5 Prozent gesunken.', meaning: 'El desempleo bajó del 6 al 5 por ciento.' },
      { text: 'Mehr als die Hälfte der Befragten arbeitet im Homeoffice.', meaning: 'Más de la mitad de los encuestados trabaja desde casa.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Der Preis ist ＿ 10 % gestiegen (la diferencia).', options: ['um', 'auf', 'bei', 'zu'], answer: 'um' },
      { type: 'choice', prompt: 'Die Miete ist von 800 ＿ 950 Euro gestiegen.', options: ['auf', 'um', 'bis', 'nach'], answer: 'auf' },
      { type: 'choice', prompt: 'Die Zahl der Raucher ist ＿.', hint: 'bajó', options: ['zurückgegangen', 'zugenommen', 'gestiegen', 'gewachsen'], answer: 'zurückgegangen' },
      { type: 'meaning', text: 'Jeder dritte Deutsche fährt mit dem Rad zur Arbeit.', options: ['Uno de cada tres alemanes va al trabajo en bicicleta.', 'Tres alemanes van en bicicleta.', 'Los alemanes van al trabajo tres veces en bicicleta.', 'El tercer alemán va en bicicleta.'], answer: 'Uno de cada tres alemanes va al trabajo en bicicleta.' },
    ],
  },
  {
    id: 'de-eroerterung',
    level: 'B2',
    title: 'Argumentar: el texto de opinión',
    summary: 'Befürworter meinen… Kritiker wenden ein…',
    pattern: 'Einleitung → Pro → Contra → eigene Meinung → Schluss',
    explanation: [
      'Un **texto argumentativo** (Erörterung) en B2 sigue este orden: **introducción** (Das Thema … wird heute viel diskutiert), **argumentos a favor** (Befürworter **meinen** / **Ein wichtiges Argument dafür ist**…), **en contra** (Kritiker **wenden ein**, dass… / **Dagegen spricht**…), **opinión propia** (**Ich bin der Ansicht**…) y **conclusión** (**Alles in allem** / **Abschließend lässt sich sagen**…).',
      'Para conectar: **zum einen … zum anderen**, **hinzu kommt, dass**, **nicht zuletzt**, **einerseits … andererseits**, **zwar … aber**. Para relativizar: **Es ist fraglich, ob**… **Man darf nicht vergessen, dass**…',
    ],
    examples: [
      { text: 'Befürworter des Tempolimits meinen, dass es weniger Unfälle gäbe.', meaning: 'Los partidarios del límite de velocidad opinan que habría menos accidentes.' },
      { text: 'Kritiker wenden ein, dass die Kosten zu hoch seien.', meaning: 'Los críticos objetan que los costos serían demasiado altos.' },
      { text: 'Alles in allem überwiegen meiner Meinung nach die Vorteile.', meaning: 'En resumen, en mi opinión predominan las ventajas.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Kritiker wenden ＿, dass das zu teuer ist.', options: ['ein', 'an', 'aus', 'vor'], answer: 'ein' },
      { type: 'choice', prompt: '＿ in allem halte ich die Idee für gut.', options: ['Alles', 'Alle', 'Allem', 'Allen'], answer: 'Alles' },
      { type: 'choice', prompt: 'Zum einen spart man Zeit, zum ＿ ist es billiger.', options: ['anderen', 'zweiten', 'anderem', 'letzt'], answer: 'anderen' },
      { type: 'choice', prompt: '¿Qué parte va al final del texto?', options: ['Abschließend lässt sich sagen, dass …', 'Das Thema wird heute viel diskutiert.', 'Befürworter meinen, dass …', 'Ein Argument dafür ist …'], answer: 'Abschließend lässt sich sagen, dass …' },
    ],
  },
  {
    id: 'de-register',
    level: 'B2',
    title: 'Formal e informal: elegir el registro',
    summary: 'Kriegst du das hin? ↔ Wäre es Ihnen möglich…?',
    pattern: 'coloquial ↔ neutro ↔ formal (verbo, pronombre, estructura)',
    explanation: [
      'El mismo mensaje cambia según con quién se hable. **Coloquial**: Kriegst du das bis morgen hin? **Neutro**: Schaffst du das bis morgen? **Formal**: Wäre es Ihnen möglich, das bis morgen zu erledigen?',
      'Pares típicos: kriegen → **bekommen / erhalten**, gucken → **sehen / betrachten**, kaputt → **defekt**, Bescheid sagen → **mitteilen / informieren**, klar → **selbstverständlich**, Tschüs → **Mit freundlichen Grüßen**. En lo formal se usan Konjunktiv II, pasivo y estilo nominal.',
    ],
    examples: [
      { text: 'Sag mir Bescheid, wenn du fertig bist. ↔ Bitte teilen Sie mir mit, sobald Sie fertig sind.', meaning: 'Avísame cuando termines. ↔ Le ruego me informe en cuanto haya terminado.' },
      { text: 'Die Kiste ist kaputt. ↔ Das Fahrzeug ist defekt.', meaning: 'El cacharro está roto. ↔ El vehículo está averiado.' },
      { text: 'Hast du die Mail gekriegt? ↔ Haben Sie meine E-Mail erhalten?', meaning: '¿Te llegó el mail? ↔ ¿Recibió usted mi correo?' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Forma formal de «Hast du das gekriegt?»', options: ['Haben Sie das erhalten?', 'Hast du das bekommt?', 'Kriegen Sie das?', 'Hast du das erhalten, ne?'], answer: 'Haben Sie das erhalten?' },
      { type: 'choice', prompt: 'Forma formal de «kaputt»:', options: ['defekt', 'hin', 'futsch', 'im Eimer'], answer: 'defekt' },
      { type: 'choice', prompt: '«Bescheid sagen» en un correo formal:', options: ['mitteilen', 'quatschen', 'labern', 'melden, ne'], answer: 'mitteilen' },
      { type: 'meaning', text: 'Wäre es Ihnen möglich, morgen früher zu kommen?', options: ['¿Le sería posible venir mañana más temprano?', '¿Puedes venir mañana?', 'Mañana tiene que venir temprano.', '¿Por qué vino tan temprano?'], answer: '¿Le sería posible venir mañana más temprano?' },
    ],
  },
]
