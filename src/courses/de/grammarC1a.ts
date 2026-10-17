import type { GrammarLesson } from '../grammar.ts'

// Gramática C1 del alemán, primera parte (lecciones 131–142): discurso indirecto en todos los
// tiempos, pasiva avanzada, construcciones de participio y conectores del registro culto.

export const grammarC1a: GrammarLesson[] = [
  {
    id: 'de-konj1-zeiten',
    level: 'C1',
    title: 'Konjunktiv I en todos los tiempos',
    summary: 'Er sagt, er habe es gewusst / er werde kommen.',
    pattern: 'presente: er komme · pasado: er sei gekommen / er habe gemacht · futuro: er werde kommen',
    explanation: [
      'El discurso indirecto conserva el **tiempo** de lo que se dijo, no el del verbo introductorio. **Presente**: «Ich bin krank» → er sagte, er **sei** krank. **Pasado** (cualquier tiempo pasado del original): «Ich habe es gewusst / Ich wusste es» → er sagte, er **habe** es **gewusst**. **Futuro**: «Ich werde kommen» → er **werde** kommen.',
      'Si la forma del Konjunktiv I coincide con el indicativo (sobre todo en plural: sie **haben**), se usa el **Konjunktiv II**: Sie sagten, sie **hätten** keine Zeit. Las órdenes se reproducen con **sollen** y los ruegos con **mögen**: Er sagte, ich **solle** warten. Sie bat, man **möge** sie anrufen.',
    ],
    examples: [
      { text: 'Der Minister erklärte, die Reform sei notwendig gewesen.', meaning: 'El ministro explicó que la reforma había sido necesaria.' },
      { text: 'Die Firma teilte mit, sie werde 200 neue Stellen schaffen.', meaning: 'La empresa informó que crearía 200 nuevos puestos.' },
      { text: 'Die Kunden behaupten, sie hätten die Rechnung nie erhalten.', meaning: 'Los clientes afirman que nunca recibieron la factura.' },
    ],
    exercises: [
      { type: 'choice', prompt: '«Ich habe den Fehler gefunden.» → Er sagt, er ＿ den Fehler gefunden.', options: ['habe', 'hat', 'hätte gehabt', 'sei'], answer: 'habe' },
      { type: 'choice', prompt: '«Wir haben keine Zeit.» → Sie sagen, sie ＿ keine Zeit.', hint: 'el Konj. I coincide con el indicativo', options: ['hätten', 'haben', 'habe', 'hatten'], answer: 'hätten' },
      { type: 'choice', prompt: '«Ich werde pünktlich sein.» → Sie versprach, sie ＿ pünktlich sein.', options: ['werde', 'wird', 'würde werden', 'sei'], answer: 'werde' },
      { type: 'choice', prompt: '«Warten Sie hier!» → Er sagte, ich ＿ hier warten.', options: ['solle', 'müsse', 'werde', 'möge'], answer: 'solle' },
    ],
  },
  {
    id: 'de-redeeinleitung',
    level: 'C1',
    title: 'Verbos para introducir lo que alguien dice',
    summary: 'betonen, einräumen, bestreiten, bezweifeln…',
    pattern: 'VERBO introductorio + , dass … / + Konjunktiv I',
    explanation: [
      'En un resumen o en la prensa no se repite siempre «sagen»: el verbo introductorio muestra **la actitud** del hablante. **betonen / hervorheben** (recalcar), **einräumen / zugeben** (admitir), **bestreiten / abstreiten** (negar), **bezweifeln** (dudar), **behaupten** (afirmar, sin pruebas), **versichern** (asegurar), **warnen vor** (advertir), **fordern** (exigir), **vorschlagen** (proponer), **kritisieren**, **einwenden** (objetar).',
      'Con sustantivos: die **Behauptung**, dass… · der **Einwand**, dass… · die **Forderung** nach… · nach **Ansicht** / **Auffassung** von… · **wie** X **betont**, …',
    ],
    examples: [
      { text: 'Die Gewerkschaft fordert, dass die Löhne um fünf Prozent steigen.', meaning: 'El sindicato exige que los sueldos suban un cinco por ciento.' },
      { text: 'Der Chef räumte ein, dass er die Lage unterschätzt habe.', meaning: 'El jefe admitió que había subestimado la situación.' },
      { text: 'Der Angeklagte bestreitet, am Tatort gewesen zu sein.', meaning: 'El acusado niega haber estado en el lugar de los hechos.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Er gibt zu, dass er sich geirrt hat. = Er ＿, dass er sich geirrt hat.', options: ['räumt ein', 'bestreitet', 'fordert', 'warnt'], answer: 'räumt ein' },
      { type: 'choice', prompt: 'Sie sagt, das sei nicht wahr. = Sie ＿ das.', options: ['bestreitet', 'betont', 'gibt zu', 'schlägt vor'], answer: 'bestreitet' },
      { type: 'choice', prompt: 'Experten ＿ vor den Folgen des Klimawandels.', options: ['warnen', 'fordern', 'betonen', 'bezweifeln'], answer: 'warnen' },
      { type: 'meaning', text: 'Die Ministerin hob hervor, dass Bildung Priorität habe.', options: ['La ministra recalcó que la educación tenía prioridad.', 'La ministra negó que la educación fuera prioritaria.', 'La ministra dudó de la educación.', 'La ministra propuso recortar en educación.'], answer: 'La ministra recalcó que la educación tenía prioridad.' },
    ],
  },
  {
    id: 'de-passiv-unpersoenlich',
    level: 'C1',
    title: 'Pasiva impersonal y pasiva con dativo',
    summary: 'Hier wird nicht geraucht. · Mir wurde geholfen.',
    pattern: '(Es) wird + PARTICIPIO · DATIVO + wird + PARTICIPIO (sin sujeto)',
    explanation: [
      'La pasiva también existe **sin sujeto**, para decir que «se hace» algo en general: **Hier wird nicht geraucht** (aquí no se fuma). Am Wochenende **wird** gefeiert. Si nada ocupa la primera posición, entra **es**: **Es wird** gefeiert. Si otra parte va primero, **es** desaparece.',
      'Con verbos que rigen **dativo** (helfen, danken, gratulieren, widersprechen, kündigen), el dativo se mantiene y el verbo queda en singular: **Mir wurde geholfen** (me ayudaron). **Dem Mitarbeiter wurde gekündigt** (despidieron al empleado). Nunca: «Ich wurde geholfen».',
    ],
    examples: [
      { text: 'In der Werkstatt wird auch samstags gearbeitet.', meaning: 'En el taller también se trabaja los sábados.' },
      { text: 'Es wurde lange diskutiert, aber nichts entschieden.', meaning: 'Se discutió mucho, pero no se decidió nada.' },
      { text: 'Den Betroffenen wird schnell geholfen.', meaning: 'A los afectados se les ayuda rápido.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Man hilft mir. → ＿ wird geholfen.', options: ['Mir', 'Ich', 'Mich', 'Es mich'], answer: 'Mir' },
      { type: 'choice', prompt: 'Man tanzt bis Mitternacht. → ＿ wird bis Mitternacht getanzt.', options: ['Es', 'Man', 'Er', 'Das'], answer: 'Es' },
      { type: 'choice', prompt: 'Dem Kollegen ＿ fristlos gekündigt.', options: ['wurde', 'wurden', 'wurdet', 'ist'], answer: 'wurde' },
      { type: 'order', meaning: 'Aquí no se fuma.', answer: ['Hier', 'wird', 'nicht', 'geraucht'] },
    ],
  },
  {
    id: 'de-fvg-passiv',
    level: 'C1',
    title: 'Expresiones con verbo de sentido pasivo',
    summary: 'zur Anwendung kommen, Zustimmung finden, in Kritik geraten.',
    pattern: 'kommen / finden / erfahren / geraten / stehen + SUSTANTIVO = pasiva',
    explanation: [
      'Muchas expresiones fijas (Funktionsverbgefüge) tienen **sentido pasivo** y son típicas de textos formales: **zur Anwendung kommen** (= angewendet werden), **zur Sprache kommen** (= besprochen werden), **Zustimmung finden** (= akzeptiert werden), **Beachtung finden** (= beachtet werden), **Unterstützung erfahren** (= unterstützt werden), **in Kritik geraten** (= kritisiert werden), **zur Diskussion stehen** (= diskutiert werden), **in Vergessenheit geraten** (= vergessen werden).',
      'Las versiones **activas** usan otros verbos: zur Anwendung **bringen**, zur Sprache **bringen**, zur Diskussion **stellen**, unter Beweis **stellen** (demostrar), in Frage **stellen** (cuestionar).',
    ],
    examples: [
      { text: 'Das neue Verfahren kommt ab Januar zur Anwendung.', meaning: 'El nuevo procedimiento se aplica a partir de enero.' },
      { text: 'Der Vorschlag fand breite Zustimmung im Team.', meaning: 'La propuesta fue ampliamente aceptada en el equipo.' },
      { text: 'Der Konzern ist wegen der Abgaswerte in die Kritik geraten.', meaning: 'El grupo empresarial fue criticado por los valores de emisiones.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das Thema wurde besprochen. = Das Thema kam zur ＿.', options: ['Sprache', 'Anwendung', 'Diskussion', 'Verfügung'], answer: 'Sprache' },
      { type: 'choice', prompt: 'Die Idee wurde akzeptiert. = Die Idee fand ＿.', options: ['Zustimmung', 'Kritik', 'Anwendung', 'Ausdruck'], answer: 'Zustimmung' },
      { type: 'choice', prompt: 'Er hat seine Fähigkeiten gezeigt. = Er hat seine Fähigkeiten unter Beweis ＿.', options: ['gestellt', 'gebracht', 'gefunden', 'genommen'], answer: 'gestellt' },
      { type: 'meaning', text: 'Diese Tradition ist fast in Vergessenheit geraten.', options: ['Esta tradición casi se ha olvidado.', 'Esta tradición se celebra cada año.', 'Esta tradición es muy nueva.', 'Esta tradición fue prohibida.'], answer: 'Esta tradición casi se ha olvidado.' },
    ],
  },
  {
    id: 'de-partizipialsatz',
    level: 'C1',
    title: 'Oraciones de participio',
    summary: 'Am Bahnhof angekommen, rief er sofort an.',
    pattern: 'PARTICIPIO (+ complementos), oración principal',
    explanation: [
      'En textos cuidados, una subordinada se puede **acortar** con un participio al principio: **Am Bahnhof angekommen**, rief er sofort an (= Nachdem er angekommen war, …). **Von der Kritik überrascht**, schwieg der Minister (= Weil er überrascht war, …). El sujeto debe ser **el mismo** que el de la oración principal.',
      'Con **participio I** expresa simultaneidad: **Laut lachend** verließ sie den Raum. Hay fórmulas fijas muy frecuentes: **genau genommen** (en rigor), **anders gesagt**, **kurz gesagt**, **abgesehen davon**, **verglichen mit**, **ausgehend von**, **zusammengefasst**.',
    ],
    examples: [
      { text: 'In München angekommen, suchte Otto zuerst eine Wohnung.', meaning: 'Una vez llegado a Múnich, Otto buscó primero un departamento.' },
      { text: 'Verglichen mit Berlin, sind die Mieten hier deutlich höher.', meaning: 'Comparados con Berlín, los arriendos aquí son bastante más altos.' },
      { text: 'Genau genommen ist das kein Fehler, sondern eine Lücke im Vertrag.', meaning: 'En rigor, no es un error, sino un vacío en el contrato.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Nachdem er zu Hause angekommen war, … → Zu Hause ＿, …', options: ['angekommen', 'ankommend', 'anzukommen', 'angekommen sein'], answer: 'angekommen' },
      { type: 'choice', prompt: '＿ gesagt: Wir haben kein Geld mehr.', hint: 'en pocas palabras', options: ['Kurz', 'Genau', 'Abgesehen', 'Verglichen'], answer: 'Kurz' },
      { type: 'choice', prompt: '＿ davon ist der Preis zu hoch.', hint: 'aparte de eso', options: ['Abgesehen', 'Ausgehend', 'Verglichen', 'Zusammengefasst'], answer: 'Abgesehen' },
      { type: 'meaning', text: 'Vom Lärm geweckt, stand sie auf.', options: ['Despertada por el ruido, se levantó.', 'Hizo ruido al levantarse.', 'Se levantó para hacer ruido.', 'No la despertó el ruido.'], answer: 'Despertada por el ruido, se levantó.' },
    ],
  },
  {
    id: 'de-gerundiv',
    level: 'C1',
    title: 'zu + participio I: die zu lösende Aufgabe',
    summary: 'ein nicht zu unterschätzendes Problem',
    pattern: 'ARTÍCULO + zu + PARTICIPIO I + terminación + SUSTANTIVO',
    explanation: [
      '**zu + participio I** delante de un sustantivo expresa **lo que hay que hacer** o **lo que se puede hacer**: die **zu lösende** Aufgabe (= die Aufgabe, die gelöst werden muss), ein **nicht zu unterschätzendes** Problem (= un problema que no se puede subestimar). Es el equivalente adjetivo de **sein + zu**.',
      'En los verbos separables, **zu** va dentro: die **einzureichenden** Unterlagen, die **auszufüllenden** Formulare. Lleva las terminaciones normales del adjetivo.',
    ],
    examples: [
      { text: 'Die einzureichenden Unterlagen finden Sie auf unserer Website.', meaning: 'Los documentos que hay que presentar están en nuestro sitio web.' },
      { text: 'Das ist ein nicht zu unterschätzendes Risiko.', meaning: 'Es un riesgo que no hay que subestimar.' },
      { text: 'Die bis Freitag zu erledigenden Aufträge liegen auf dem Tisch.', meaning: 'Los encargos que hay que terminar para el viernes están sobre la mesa.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'die Rechnung, die bezahlt werden muss → die ＿ Rechnung', options: ['zu bezahlende', 'bezahlte', 'bezahlende', 'zu bezahlt'], answer: 'zu bezahlende' },
      { type: 'choice', prompt: 'die Formulare, die man ausfüllen muss → die ＿ Formulare', options: ['auszufüllenden', 'zu ausfüllenden', 'ausgefüllten', 'ausfüllenden'], answer: 'auszufüllenden' },
      { type: 'choice', prompt: 'ein Erfolg, den man nicht übersehen kann → ein nicht zu ＿ Erfolg', options: ['übersehender', 'übersehen', 'übersehenen', 'übersieht'], answer: 'übersehender' },
      { type: 'meaning', text: 'Die zu klärenden Fragen besprechen wir morgen.', options: ['Las preguntas que hay que aclarar las vemos mañana.', 'Las preguntas ya aclaradas las vemos mañana.', 'Mañana no hay preguntas.', 'Las preguntas claras son de mañana.'], answer: 'Las preguntas que hay que aclarar las vemos mañana.' },
    ],
  },
  {
    id: 'de-genitivattribut',
    level: 'C1',
    title: 'Cadenas de genitivo y aposiciones',
    summary: 'die Frage nach der Finanzierung des Projekts',
    pattern: 'SUSTANTIVO + genitivo / preposición + … · aposición en el mismo caso',
    explanation: [
      'El estilo formal acumula información en el **grupo nominal**: die Entscheidung **des Vorstands** über die Schließung **des Standorts**. Para no perderse, se lee de atrás hacia adelante: ¿qué se cierra? el sitio; ¿quién decide? la junta. Más de dos genitivos seguidos suena pesado: mejor cambiar uno por **von** o por una subordinada.',
      'La **aposición** explica un sustantivo y va en **el mismo caso**: Ich sprach mit Herrn Huber, **dem Leiter** der Abteilung (dativo). Das ist das Auto **meines Nachbarn**, **eines Ingenieurs** (genitivo).',
    ],
    examples: [
      { text: 'Die Kritik der Gewerkschaft an der Erhöhung der Arbeitszeit ist berechtigt.', meaning: 'La crítica del sindicato al aumento de la jornada laboral es justificada.' },
      { text: 'Wir haben mit Frau Bauer, der neuen Geschäftsführerin, gesprochen.', meaning: 'Hablamos con la señora Bauer, la nueva gerenta.' },
      { text: 'Die Ergebnisse der Untersuchung des Unfalls werden morgen veröffentlicht.', meaning: 'Los resultados de la investigación del accidente se publican mañana.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich habe mit Herrn Weber, ＿ Chef, telefoniert.', options: ['meinem', 'mein', 'meinen', 'meines'], answer: 'meinem' },
      { type: 'choice', prompt: 'Das ist das Büro von Frau Lang, ＿ Leiterin.', options: ['der', 'die', 'den', 'dem'], answer: 'der' },
      { type: 'choice', prompt: 'die Reparatur ＿ Motors', options: ['des', 'dem', 'den', 'der'], answer: 'des' },
      { type: 'meaning', text: 'die Senkung der Kosten der Produktion', options: ['la reducción de los costos de producción', 'la producción de costos bajos', 'el aumento de la producción', 'los costos de reducir la producción'], answer: 'la reducción de los costos de producción' },
    ],
  },
  {
    id: 'de-insofern',
    level: 'C1',
    title: 'Restringir: insofern, soweit, inwiefern',
    summary: 'Das stimmt insofern, als …',
    pattern: 'insofern / insoweit …, als … · soweit / sofern · inwiefern (¿en qué medida?)',
    explanation: [
      '**insofern …, als** restringe una afirmación: Das stimmt **insofern**, **als** die Kosten gestiegen sind (es cierto en la medida en que…). También junto: **insofern als**. **soweit** = «en la medida en que, hasta donde»: **Soweit** ich weiß, ist er im Urlaub.',
      '**inwiefern** e **inwieweit** preguntan por la medida: **Inwiefern** ist das ein Problem? (¿en qué sentido?). Fórmulas útiles: **in gewisser Hinsicht** (en cierto sentido), **in erster Linie** (sobre todo), **im Großen und Ganzen** (en general).',
    ],
    examples: [
      { text: 'Die Reform ist insofern sinnvoll, als sie die Bürokratie verringert.', meaning: 'La reforma tiene sentido en la medida en que reduce la burocracia.' },
      { text: 'Soweit ich informiert bin, beginnt das Projekt im Mai.', meaning: 'Hasta donde estoy informado, el proyecto empieza en mayo.' },
      { text: 'Es ist unklar, inwieweit die Maßnahmen wirken.', meaning: 'No está claro en qué medida funcionan las medidas.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Er hat insofern recht, ＿ das Budget begrenzt ist.', options: ['als', 'dass', 'wie', 'ob'], answer: 'als' },
      { type: 'choice', prompt: '＿ ich weiß, ist das Büro heute geschlossen.', hint: 'hasta donde', options: ['Soweit', 'Insofern', 'Inwiefern', 'Sobald'], answer: 'Soweit' },
      { type: 'choice', prompt: '＿ betrifft uns diese Änderung?', hint: '¿en qué medida?', options: ['Inwiefern', 'Soweit', 'Insofern', 'Sofern'], answer: 'Inwiefern' },
      { type: 'meaning', text: 'Im Großen und Ganzen bin ich zufrieden.', options: ['En general estoy satisfecho.', 'Estoy muy insatisfecho.', 'Estoy satisfecho con lo grande.', 'Nunca estoy satisfecho.'], answer: 'En general estoy satisfecho.' },
    ],
  },
  {
    id: 'de-ohne-dass',
    level: 'C1',
    title: 'ohne dass, anstatt dass, außer dass, nur dass',
    summary: 'Er ging, ohne dass jemand es merkte.',
    pattern: 'ohne / (an)statt / außer / nur + dass + … + VERBO',
    explanation: [
      'Cuando el sujeto **cambia**, «ohne … zu» y «statt … zu» pasan a **ohne dass** y **(an)statt dass**: Er ging, **ohne dass** jemand es **merkte** (sin que nadie lo notara). **Anstatt dass** die Firma investiert, spart sie (en vez de que…).',
      '**außer dass** = «excepto que», **nur dass** = «solo que»: Der Urlaub war schön, **nur dass** es oft geregnet hat. Con **ohne dass** se puede usar Konjunktiv II para algo que se esperaba: Er half, **ohne dass** man ihn darum gebeten **hätte**.',
    ],
    examples: [
      { text: 'Die Preise wurden erhöht, ohne dass die Kunden informiert wurden.', meaning: 'Se subieron los precios sin que se informara a los clientes.' },
      { text: 'Anstatt dass der Vermieter die Heizung repariert, schickt er nur E-Mails.', meaning: 'En vez de que el arrendador repare la calefacción, solo manda correos.' },
      { text: 'Die Wohnung ist perfekt, nur dass sie keinen Balkon hat.', meaning: 'El departamento es perfecto, solo que no tiene balcón.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Er hat das Auto genommen, ＿ ich es wusste.', options: ['ohne dass', 'ohne zu', 'statt zu', 'damit'], answer: 'ohne dass' },
      { type: 'choice', prompt: 'Sie ging, ohne sich ＿ verabschieden.', hint: 'mismo sujeto', options: ['zu', 'dass', 'um', 'ohne'], answer: 'zu' },
      { type: 'choice', prompt: 'Alles lief gut, ＿ dass der Zug Verspätung hatte.', hint: 'solo que', options: ['nur', 'ohne', 'statt', 'damit'], answer: 'nur' },
      { type: 'meaning', text: 'Ich weiß nichts über ihn, außer dass er aus Hamburg kommt.', options: ['No sé nada de él, excepto que es de Hamburgo.', 'Sé todo sobre él porque es de Hamburgo.', 'Él no sabe que yo soy de Hamburgo.', 'Viene de Hamburgo sin saberlo.'], answer: 'No sé nada de él, excepto que es de Hamburgo.' },
    ],
  },
  {
    id: 'de-konzessiv-c1',
    level: 'C1',
    title: 'Concesión culta: wenngleich, ungeachtet, so … auch',
    summary: 'Wie sehr er sich auch bemüht, …',
    pattern: 'wenngleich / obgleich · ungeachtet + Gen. · wie / so + ADJ + … auch · selbst wenn',
    explanation: [
      '**wenngleich** y **obgleich** = «aunque», más formales que obwohl: Das Projekt war erfolgreich, **wenngleich** teurer als geplant. **ungeachtet** + genitivo = «a pesar de»: **ungeachtet** der Kritik. **selbst wenn / auch wenn** = «aun si».',
      'Concesión generalizada (sin importar cuánto): **Wie sehr** er sich **auch** bemüht, er schafft es nicht. **So** schwierig es **auch** ist, … · **Was** er **auch** tut, … · **Wer** auch immer anruft, … La oración principal **no** invierte el orden: «Wie sehr er sich auch bemüht, er schafft…».',
    ],
    examples: [
      { text: 'Die Lösung ist gut, wenngleich nicht perfekt.', meaning: 'La solución es buena, aunque no perfecta.' },
      { text: 'Ungeachtet der hohen Kosten wurde das Projekt fortgesetzt.', meaning: 'A pesar de los altos costos, el proyecto continuó.' },
      { text: 'So schwierig die Lage auch ist, wir dürfen nicht aufgeben.', meaning: 'Por difícil que sea la situación, no podemos rendirnos.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Er kam mit, ＿ er müde war.', hint: 'aunque (formal)', options: ['obgleich', 'ungeachtet', 'sofern', 'insofern'], answer: 'obgleich' },
      { type: 'choice', prompt: '＿ der Warnungen fuhr er weiter.', options: ['Ungeachtet', 'Wenngleich', 'Obgleich', 'Selbst wenn'], answer: 'Ungeachtet' },
      { type: 'choice', prompt: 'Was du auch ＿, ich helfe dir.', options: ['entscheidest', 'entscheiden', 'entschieden', 'zu entscheiden'], answer: 'entscheidest' },
      { type: 'meaning', text: 'Selbst wenn es regnet, findet das Fest statt.', options: ['Aun si llueve, la fiesta se hace.', 'Si llueve, la fiesta se cancela.', 'Como llueve, no hay fiesta.', 'La fiesta es solo si llueve.'], answer: 'Aun si llueve, la fiesta se hace.' },
    ],
  },
  {
    id: 'de-konsekutiv-c1',
    level: 'C1',
    title: 'Consecuencias: derart … dass, folglich, mithin',
    summary: 'Er war derart müde, dass er einschlief.',
    pattern: 'so / derart + ADJ …, dass · folglich / demzufolge / infolgedessen / mithin',
    explanation: [
      'Para subrayar la intensidad: **so** / **derart** / **dermaßen** + adjetivo …, **dass**: Der Lärm war **derart** laut, **dass** niemand schlafen konnte. Con sustantivo: **solch** / **ein solcher** …, **dass**.',
      'Conectores de consecuencia en la oración principal (con inversión): **folglich**, **demzufolge**, **infolgedessen**, **somit**, **mithin** (muy formal): Die Nachfrage ist gesunken; **folglich** sinken die Preise.',
    ],
    examples: [
      { text: 'Die Verspätung war dermaßen lang, dass wir den Anschluss verpassten.', meaning: 'El retraso fue tan largo que perdimos la conexión.' },
      { text: 'Es gab einen solchen Andrang, dass die Tickets nach einer Stunde ausverkauft waren.', meaning: 'Hubo tal demanda que las entradas se agotaron en una hora.' },
      { text: 'Die Teile fehlen; infolgedessen verzögert sich die Reparatur.', meaning: 'Faltan los repuestos; como consecuencia, la reparación se retrasa.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Es war ＿ kalt, dass der See zufror.', options: ['derart', 'folglich', 'mithin', 'zumal'], answer: 'derart' },
      { type: 'choice', prompt: 'Die Kosten steigen; ＿ müssen wir sparen.', options: ['folglich', 'derart', 'obgleich', 'insofern'], answer: 'folglich' },
      { type: 'choice', prompt: 'Er hatte ＿ Angst, dass er nicht sprechen konnte.', options: ['solche', 'derart', 'folglich', 'somit'], answer: 'solche' },
      { type: 'order', meaning: 'Llovió tanto que la calle se inundó.', answer: ['Es', 'regnete', 'so', 'stark', 'dass', 'die', 'Straße', 'überflutet', 'wurde'] },
    ],
  },
  {
    id: 'de-zu-als-dass',
    level: 'C1',
    title: 'zu … als dass: demasiado como para',
    summary: 'Das Problem ist zu komplex, als dass man es schnell lösen könnte.',
    pattern: 'zu + ADJ …, als dass + … + Konjunktiv II · zu + ADJ, um … zu',
    explanation: [
      '**zu + adjetivo …, als dass** expresa que algo **no ocurre** por exceso: Das Problem ist **zu** komplex, **als dass** man es schnell lösen **könnte**. El verbo suele ir en **Konjunktiv II**, porque la consecuencia es irreal.',
      'Si el sujeto es el mismo, se usa **zu …, um … zu**: Er ist **zu** müde, **um** weiter**zu**arbeiten. Lo contrario: **genug / genügend …, um … zu** (suficiente para).',
    ],
    examples: [
      { text: 'Die Wohnung ist zu teuer, als dass wir sie uns leisten könnten.', meaning: 'El departamento es demasiado caro como para que podamos pagarlo.' },
      { text: 'Der Schaden ist zu groß, um ihn selbst zu reparieren.', meaning: 'El daño es demasiado grande para repararlo uno mismo.' },
      { text: 'Wir haben genug Erfahrung, um das Projekt zu leiten.', meaning: 'Tenemos suficiente experiencia para dirigir el proyecto.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Es ist zu spät, ＿ wir noch etwas ändern könnten.', options: ['als dass', 'um zu', 'sodass', 'damit'], answer: 'als dass' },
      { type: 'choice', prompt: 'Er ist zu jung, ＿ den Führerschein zu machen.', options: ['um', 'als dass', 'damit', 'dass'], answer: 'um' },
      { type: 'choice', prompt: 'Die Zeit ist zu knapp, als dass wir alles erledigen ＿.', options: ['könnten', 'können', 'konnten', 'zu können'], answer: 'könnten' },
      { type: 'meaning', text: 'Der Text ist zu lang, als dass man ihn in zehn Minuten lesen könnte.', options: ['El texto es demasiado largo como para leerlo en diez minutos.', 'El texto se lee en diez minutos.', 'El texto es corto y fácil.', 'Hay que leer el texto en diez minutos.'], answer: 'El texto es demasiado largo como para leerlo en diez minutos.' },
    ],
  },
]
