import type { GrammarLesson } from '../grammar.ts'

// Gramática C2 del alemán, primera parte (lecciones 166–180): sintaxis compleja, el Konjunktiv
// en la literatura, construcciones cultas y matices de estilo.

export const grammarC2a: GrammarLesson[] = [
  {
    id: 'de-konj1-optativ',
    level: 'C2',
    title: 'Konjunktiv I para deseos y fórmulas',
    summary: 'Es lebe die Freiheit! · Man nehme 200 g Mehl.',
    pattern: 'Konjunktiv I en oración principal = deseo, instrucción o suposición',
    explanation: [
      'Fuera del discurso indirecto, el **Konjunktiv I** sobrevive en **fórmulas fijas** de deseo: **Es lebe** die Freiheit! **Gott sei Dank!** **Er ruhe in Frieden.** **Möge** es dir gut gehen! **Dem sei, wie ihm wolle** (sea como sea).',
      'También en **instrucciones** impersonales (recetas antiguas, textos técnicos y matemáticos): **Man nehme** 200 g Mehl. **Es sei** x eine gerade Zahl (sea x un número par). **Gesetzt sei**, … Y en fórmulas concesivas: **sei es** …, **sei es** … (ya sea…, ya sea…), **komme, was wolle** (pase lo que pase).',
    ],
    examples: [
      { text: 'Man nehme drei Eier und schlage sie schaumig.', meaning: 'Tómense tres huevos y bátanse hasta que estén espumosos.' },
      { text: 'Komme, was wolle: Wir halten an unserem Plan fest.', meaning: 'Pase lo que pase, mantenemos nuestro plan.' },
      { text: 'Sei es aus Bequemlichkeit, sei es aus Angst – niemand widersprach.', meaning: 'Ya sea por comodidad, ya sea por miedo, nadie contradijo.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Es ＿ die Republik!', hint: 'viva…', options: ['lebe', 'lebt', 'lebte', 'würde leben'], answer: 'lebe' },
      { type: 'choice', prompt: '＿ es dir an nichts fehlen!', hint: 'que no te falte nada (deseo)', options: ['Möge', 'Mag', 'Möchte', 'Müsse'], answer: 'Möge' },
      { type: 'choice', prompt: 'Man ＿ eine Prise Salz hinzu.', hint: 'receta', options: ['gebe', 'gibt', 'gäbe', 'geben'], answer: 'gebe' },
      { type: 'meaning', text: 'Dem sei, wie ihm wolle – wir fangen morgen an.', options: ['Sea como sea, empezamos mañana.', 'Él quiere empezar mañana.', 'No queremos empezar.', 'Mañana él decide.'], answer: 'Sea como sea, empezamos mañana.' },
    ],
  },
  {
    id: 'de-redewiedergabe-c2',
    level: 'C2',
    title: 'Matices del discurso indirecto',
    summary: 'Er sagte, er sei krank / er wäre krank (lo dudo).',
    pattern: 'Konj. I = neutral · Konj. II = duda o distancia · indicativo = el hablante lo da por cierto',
    explanation: [
      'En C2 el **modo** del discurso indirecto también transmite **la postura** de quien informa. **Konjunktiv I** es neutro: Er sagte, er **sei** krank. **Konjunktiv II** (cuando el I existe) puede sugerir **duda**: Er sagte, er **wäre** krank (pero no le creo). El **indicativo** indica que se da por cierto: Er sagte, dass er krank **ist**.',
      'Las **preguntas** indirectas van con **ob** o la palabra interrogativa: Sie fragte, **ob** er **komme** / **wann** er **komme**. Las **órdenes** con **sollen** y los ruegos con **mögen**: Er sagte, sie **solle** sofort kommen. Man bat, er **möge** sich gedulden. En textos largos, el Konjunktiv I basta para mantener la cita sin repetir «er sagte».',
    ],
    examples: [
      { text: 'Der Zeuge erklärte, er habe nichts gesehen. Er sei erst später gekommen.', meaning: 'El testigo declaró que no había visto nada. Que había llegado recién después.' },
      { text: 'Sie behauptet, sie hätte die Rechnung längst bezahlt – aber auf dem Konto ist nichts.', meaning: 'Ella afirma que ya habría pagado la factura hace rato, pero en la cuenta no hay nada.' },
      { text: 'Der Kunde ließ ausrichten, man möge ihn zurückrufen.', meaning: 'El cliente dejó dicho que por favor lo llamaran.' },
    ],
    exercises: [
      { type: 'choice', prompt: '«Kommst du morgen?» → Sie fragte, ＿ er morgen komme.', options: ['ob', 'dass', 'wenn', 'was'], answer: 'ob' },
      { type: 'choice', prompt: '«Bitte warten Sie!» → Er bat, man ＿ warten.', options: ['möge', 'solle', 'werde', 'müsse'], answer: 'möge' },
      { type: 'choice', prompt: '¿Qué versión sugiere que el periodista duda?', options: ['Er sagte, er wäre unschuldig.', 'Er sagte, er sei unschuldig.', 'Er sagte, dass er unschuldig ist.', 'Er ist unschuldig.'], answer: 'Er sagte, er wäre unschuldig.' },
      { type: 'choice', prompt: '«Ruf sofort an!» → Sie sagte, ich ＿ sofort anrufen.', options: ['solle', 'möge', 'wolle', 'dürfe'], answer: 'solle' },
    ],
  },
  {
    id: 'de-ersatzinfinitiv',
    level: 'C2',
    title: 'El doble infinitivo: hätte machen sollen',
    summary: 'Er hat nicht kommen können. · …, dass er es hätte wissen müssen.',
    pattern: 'haben + INFINITIVO + MODAL (en vez del participio) · en subordinada: haben va antes',
    explanation: [
      'Con un **modal** (o **lassen**, **sehen**, **hören**, **brauchen**) más otro infinitivo, el Perfekt no usa el participio, sino el **infinitivo** (Ersatzinfinitiv): Er **hat** nicht **kommen können** (no «gekonnt»). Ich **habe** das Auto **reparieren lassen**. Du **hättest** früher **anrufen sollen**.',
      'En una **subordinada**, el auxiliar **no** va al final, sino **delante** del bloque de infinitivos: …, weil er nicht **hat kommen können**. …, dass ich es **hätte wissen müssen**. Es una de las estructuras más difíciles del alemán escrito.',
    ],
    examples: [
      { text: 'Ich hätte den Fehler früher bemerken müssen.', meaning: 'Tendría que haber notado el error antes.' },
      { text: 'Es tut mir leid, dass ich gestern nicht habe kommen können.', meaning: 'Siento no haber podido venir ayer.' },
      { text: 'Otto hat die Bremsen von einem Kollegen prüfen lassen.', meaning: 'Otto hizo revisar los frenos a un colega.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Er hat das Problem nicht lösen ＿.', options: ['können', 'gekonnt', 'kann', 'konnte'], answer: 'können' },
      { type: 'choice', prompt: 'Ich weiß, dass ich mehr ＿ lernen sollen.', options: ['hätte', 'gehabt', 'habe gehabt', 'hatte gehabt'], answer: 'hätte' },
      { type: 'choice', prompt: '¿Qué subordinada es correcta?', options: ['…, weil sie nicht hat bleiben dürfen.', '…, weil sie nicht bleiben dürfen hat.', '…, weil sie nicht bleiben gedurft hat.', '…, weil sie hat nicht bleiben dürfen.'], answer: '…, weil sie nicht hat bleiben dürfen.' },
      { type: 'order', meaning: 'Tendrías que haberme llamado.', answer: ['Du', 'hättest', 'mich', 'anrufen', 'sollen'] },
    ],
  },
  {
    id: 'de-wahrnehmungsverben',
    level: 'C2',
    title: 'sehen, hören, lassen + infinitivo',
    summary: 'Ich sah ihn kommen. · Sie ließ ihn warten.',
    pattern: 'sehen / hören / fühlen / spüren / lassen + ACUSATIVO + INFINITIVO (sin zu)',
    explanation: [
      'Los verbos de **percepción** (sehen, hören, fühlen, spüren) y **lassen** llevan un **infinitivo sin zu**: Ich **sah** ihn **kommen**. Wir **hörten** die Kinder **lachen**. Sie **ließ** ihn lange **warten**. En Perfekt aparece el doble infinitivo: Ich **habe** ihn **kommen sehen**.',
      '**lassen** tiene varios sentidos: **permitir** (Lass mich ausreden!), **encargar** (Ich lasse das Auto reparieren), **dejar** (Lass das Licht an!) y, con **sich**, **posibilidad pasiva**: Das **lässt sich** leicht **erklären** (se puede explicar).',
    ],
    examples: [
      { text: 'Ich habe die Gefahr kommen sehen, aber niemand hat mir zugehört.', meaning: 'Vi venir el peligro, pero nadie me escuchó.' },
      { text: 'Man hörte den Motor ungleichmäßig laufen.', meaning: 'Se oía el motor funcionar de forma irregular.' },
      { text: 'Diese Entwicklung lässt sich kaum aufhalten.', meaning: 'Este desarrollo apenas se puede detener.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich höre jemanden ＿.', options: ['singen', 'zu singen', 'gesungen', 'singt'], answer: 'singen' },
      { type: 'choice', prompt: 'Wir haben ihn nicht weggehen ＿.', options: ['sehen', 'gesehen', 'zu sehen', 'sah'], answer: 'sehen' },
      { type: 'choice', prompt: 'Das Fenster lässt sich nicht ＿.', options: ['öffnen', 'zu öffnen', 'geöffnet', 'öffnet'], answer: 'öffnen' },
      { type: 'meaning', text: 'Sie ließ sich die Haare schneiden.', options: ['Se hizo cortar el pelo.', 'Se cortó el pelo ella misma.', 'No dejó que le cortaran el pelo.', 'Le cortó el pelo a otra persona.'], answer: 'Se hizo cortar el pelo.' },
    ],
  },
  {
    id: 'de-uneingeleitete-saetze',
    level: 'C2',
    title: 'Condiciones sin «wenn» y otras inversiones',
    summary: 'Hätte ich das gewusst, … · Kaum war er da, als …',
    pattern: 'VERBO al inicio = condición · kaum …, als / da · so … auch',
    explanation: [
      'Una condición puede formarse **sin wenn**, poniendo el verbo **primero**: **Hätte** ich das gewusst, wäre ich gekommen. **Sollte** es regnen, bleiben wir zu Hause. **Ist** die Batterie leer, startet der Motor nicht. La oración principal suele empezar con **so** o **dann** opcional.',
      'Otras construcciones con orden marcado: **Kaum** hatte er sich gesetzt, **als** das Telefon klingelte (apenas…, cuando…). Concesión literaria: **Ist** die Lage **auch** schwierig, so … (por difícil que sea). Comparación: **Je** länger, **desto** besser.',
    ],
    examples: [
      { text: 'Wäre der Zahnriemen rechtzeitig gewechselt worden, hätte es keinen Motorschaden gegeben.', meaning: 'Si la correa de distribución se hubiera cambiado a tiempo, no habría habido daño en el motor.' },
      { text: 'Kaum hatte Otto die Werkstatt eröffnet, als die ersten Kunden kamen.', meaning: 'Apenas Otto abrió el taller, llegaron los primeros clientes.' },
      { text: 'Ist der Weg auch steinig, so lohnt er sich doch.', meaning: 'Por difícil que sea el camino, vale la pena.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ ich mehr Zeit gehabt, hätte ich dir geholfen.', options: ['Hätte', 'Wenn', 'Hatte', 'Habe'], answer: 'Hätte' },
      { type: 'choice', prompt: 'Kaum war sie eingeschlafen, ＿ der Wecker klingelte.', options: ['als', 'wenn', 'dass', 'wie'], answer: 'als' },
      { type: 'choice', prompt: '＿ Sie Fragen haben, wenden Sie sich an uns.', options: ['Sollten', 'Würden', 'Wenn', 'Hätten'], answer: 'Sollten' },
      { type: 'meaning', text: 'Wäre ich an deiner Stelle, würde ich kündigen.', options: ['Si yo estuviera en tu lugar, renunciaría.', 'Estoy en tu lugar y renuncio.', 'No quiero estar en tu lugar.', 'Tú renunciaste en mi lugar.'], answer: 'Si yo estuviera en tu lugar, renunciaría.' },
    ],
  },
  {
    id: 'de-erlebte-rede',
    level: 'C2',
    title: 'El estilo indirecto libre',
    summary: 'Morgen würde er es ihr sagen. Morgen ganz bestimmt.',
    pattern: 'pensamientos del personaje en 3.ª persona + Präteritum / würde, sin verbo introductorio',
    explanation: [
      'En la **literatura**, los pensamientos de un personaje suelen aparecer sin «er dachte, dass»: es la **erlebte Rede** (estilo indirecto libre). Se usa la **3.ª persona** y el **Präteritum**, pero con el tono y las preguntas del personaje: Er sah auf die Uhr. **Wo blieb sie nur? Hatte sie ihn etwa vergessen?**',
      'El futuro del personaje se expresa con **würde**: **Morgen würde er es ihr sagen.** Las partículas (doch, nur, etwa) y las preguntas indican que habla la mente del personaje, no el narrador. Distinguirlo del **monólogo interior** (1.ª persona, presente) es clave para interpretar textos.',
    ],
    examples: [
      { text: 'Sie stand am Fenster. Warum rief er nicht an? Er hatte es doch versprochen.', meaning: 'Estaba junto a la ventana. ¿Por qué no llamaba? Lo había prometido.' },
      { text: 'Morgen würde alles anders werden. Morgen ganz bestimmt.', meaning: 'Mañana todo iba a ser distinto. Mañana, seguro.' },
      { text: 'Er packte den Koffer. Sollte er wirklich gehen? Was würden die anderen denken?', meaning: 'Hizo la maleta. ¿Debía irse realmente? ¿Qué pensarían los demás?' },
    ],
    exercises: [
      { type: 'choice', prompt: '¿Qué oración está en estilo indirecto libre?', options: ['War das wirklich alles gewesen?', 'Er dachte: „Ist das alles?“', 'Er fragte, ob das alles sei.', 'Ich frage mich, ob das alles ist.'], answer: 'War das wirklich alles gewesen?' },
      { type: 'choice', prompt: 'En estilo indirecto libre, el futuro del personaje se expresa con…', options: ['würde + infinitivo', 'werden en presente', 'Konjunktiv I', 'Perfekt'], answer: 'würde + infinitivo' },
      { type: 'choice', prompt: '«Ich werde morgen kündigen», dachte er. → Morgen ＿ er kündigen.', options: ['würde', 'wird', 'werde', 'wurde'], answer: 'würde' },
      { type: 'meaning', text: 'Er wartete. Wo blieb sie nur?', options: ['Esperaba. ¿Dónde se habría metido ella?', 'Ella lo esperaba a él.', 'Él sabía dónde estaba ella.', 'Ella se quedó en casa.'], answer: 'Esperaba. ¿Dónde se habría metido ella?' },
    ],
  },
  {
    id: 'de-tempus-stil',
    level: 'C2',
    title: 'Los tiempos como recurso de estilo',
    summary: 'Präteritum narrativo, presente histórico y Perfekt hablado',
    pattern: 'Präteritum = narrar · Perfekt = conversar · presente histórico = dramatizar',
    explanation: [
      'Elegir el tiempo verbal es una decisión de **estilo**. El **Präteritum** es el tiempo de la **narración** escrita (novelas, informes, noticias). El **Perfekt** domina en lo **hablado** y en el sur. El **presente histórico** acerca y dramatiza: **1989. Die Mauer fällt. Menschen liegen sich in den Armen.**',
      'El **Plusquamperfekt** marca lo anterior dentro de la narración y a menudo **abre un recuerdo**, después se vuelve al Präteritum. El **Futur II** permite proyectar: In zehn Jahren **wird** sich die Branche völlig **verändert haben**. Mezclar tiempos sin motivo es un error de estilo frecuente.',
    ],
    examples: [
      { text: '1871. In Versailles wird das Deutsche Kaiserreich gegründet.', meaning: '1871. En Versalles se funda el Imperio alemán.' },
      { text: 'Er hatte diesen Ort seit Jahrzehnten nicht betreten. Nun stand er wieder vor dem Tor.', meaning: 'No había pisado ese lugar en décadas. Ahora estaba otra vez frente al portón.' },
      { text: 'Gestern hab ich den Hans getroffen, und der hat mir erzählt, dass …', meaning: 'Ayer me encontré con Hans y me contó que…' },
    ],
    exercises: [
      { type: 'choice', prompt: '¿Qué tiempo es el habitual en una novela?', options: ['Präteritum', 'Perfekt', 'Futur I', 'Plusquamperfekt'], answer: 'Präteritum' },
      { type: 'choice', prompt: '«1989. Die Mauer fällt.» – ¿Qué recurso es?', options: ['Presente histórico', 'Futuro', 'Perfekt hablado', 'Konjunktiv'], answer: 'Presente histórico' },
      { type: 'choice', prompt: '«Bis 2040 wird sich die Branche verändert haben.» ¿Qué tiempo es?', options: ['Futur II', 'Präteritum', 'Plusquamperfekt', 'Presente'], answer: 'Futur II' },
      { type: 'meaning', text: 'Sie hatte den Brief nie geöffnet. Jetzt lag er vor ihr.', options: ['Nunca había abierto la carta. Ahora estaba frente a ella.', 'Abrió la carta y la dejó frente a ella.', 'La carta nunca llegó. Ahora la esperaba.', 'Ella escribió una carta y ahora la leía.'], answer: 'Nunca había abierto la carta. Ahora estaba frente a ella.' },
    ],
  },
  {
    id: 'de-attribut-komplex',
    level: 'C2',
    title: 'Atributos muy extensos',
    summary: 'die von der Regierung im letzten Jahr beschlossene Reform',
    pattern: 'ARTÍCULO … (complementos) … PARTICIPIO + terminación + SUSTANTIVO',
    explanation: [
      'En textos jurídicos, científicos y periodísticos, un atributo puede llegar a tener **muchas palabras** entre el artículo y el sustantivo: **die** von der Regierung im vergangenen Jahr gegen den Widerstand der Opposition **beschlossene Reform**. Truco de lectura: buscar el **artículo**, saltar al **sustantivo** y luego leer el participio y sus complementos hacia atrás.',
      'Para escribir con claridad, a menudo conviene **deshacerlo** en una relativa: die Reform, **die** die Regierung im vergangenen Jahr gegen den Widerstand der Opposition **beschlossen hat**. A nivel C2 hay que poder hacer las dos transformaciones.',
    ],
    examples: [
      { text: 'Die seit Jahren von Umweltverbänden geforderte Maßnahme tritt endlich in Kraft.', meaning: 'La medida que las asociaciones ecologistas exigen hace años por fin entra en vigor.' },
      { text: 'Der in München ansässige und auf Elektroautos spezialisierte Betrieb sucht Mechatroniker.', meaning: 'La empresa establecida en Múnich y especializada en autos eléctricos busca mecatrónicos.' },
      { text: 'Die bis zum Ende des Monats einzureichenden Unterlagen liegen bei.', meaning: 'Se adjuntan los documentos que hay que presentar hasta fin de mes.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'die vom Chef gestern unterschriebene Vollmacht = die Vollmacht, die …', options: ['der Chef gestern unterschrieben hat', 'den Chef gestern unterschreibt', 'gestern der Chef unterschreiben wird', 'vom Chef unterschreibt'], answer: 'der Chef gestern unterschrieben hat' },
      { type: 'choice', prompt: 'das Auto, das seit Wochen in der Garage steht → das seit Wochen in der Garage ＿ Auto', options: ['stehende', 'gestandene', 'zu stehende', 'steht'], answer: 'stehende' },
      { type: 'choice', prompt: 'In «die von vielen Kunden gelobte Werkstatt», ¿cuál es el sustantivo principal?', options: ['Werkstatt', 'Kunden', 'vielen', 'gelobte'], answer: 'Werkstatt' },
      { type: 'meaning', text: 'die von der Bevölkerung kaum wahrgenommene Veränderung', options: ['el cambio que la población apenas percibe', 'la población que cambia mucho', 'el cambio muy visible para todos', 'la percepción de la población'], answer: 'el cambio que la población apenas percibe' },
    ],
  },
  {
    id: 'de-konditional-c2',
    level: 'C2',
    title: 'Condiciones cultas: gesetzt den Fall, andernfalls',
    summary: 'Gesetzt den Fall, dass … · im Falle eines Falles',
    pattern: 'gesetzt den Fall · angenommen · vorausgesetzt · im Falle + Gen. · andernfalls / sonst',
    explanation: [
      'Además de wenn y falls, el registro culto tiene: **gesetzt den Fall, (dass)** (suponiendo que), **angenommen, (dass)**, **unter der Voraussetzung, dass**, **im Falle** + genitivo (**im Falle** eines Unfalls), **bei** + sustantivo (**bei** Nichtgefallen: si no le gusta).',
      'Para la alternativa: **andernfalls**, **ansonsten**, **sonst** (de lo contrario). Y la condición negativa: **es sei denn**, **außer wenn**. En contratos: **sofern nicht anders vereinbart** (salvo acuerdo en contrario).',
    ],
    examples: [
      { text: 'Gesetzt den Fall, der Kunde zahlt nicht – wer haftet dann?', meaning: 'Suponiendo que el cliente no pague, ¿quién responde entonces?' },
      { text: 'Bei Nichtgefallen erhalten Sie Ihr Geld zurück.', meaning: 'Si no le gusta, le devolvemos su dinero.' },
      { text: 'Bitte bestätigen Sie den Termin bis Freitag, andernfalls vergeben wir ihn neu.', meaning: 'Por favor confirme la cita hasta el viernes; de lo contrario, la asignamos de nuevo.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ den Fall, wir gewinnen – was machen wir mit dem Geld?', options: ['Gesetzt', 'Angenommen', 'Andernfalls', 'Vorausgesetzt'], answer: 'Gesetzt' },
      { type: 'choice', prompt: 'Zahlen Sie bis Montag, ＿ entstehen Mahngebühren.', options: ['andernfalls', 'gesetzt', 'sofern', 'angenommen'], answer: 'andernfalls' },
      { type: 'choice', prompt: '＿ Falle eines Brandes benutzen Sie die Treppe.', options: ['Im', 'Bei dem', 'Wenn', 'Falls'], answer: 'Im' },
      { type: 'meaning', text: 'Sofern nicht anders vereinbart, gilt die gesetzliche Kündigungsfrist.', options: ['Salvo acuerdo en contrario, rige el plazo legal de preaviso.', 'No hay plazo de preaviso.', 'El plazo se acuerda siempre aparte.', 'La ley no dice nada sobre el preaviso.'], answer: 'Salvo acuerdo en contrario, rige el plazo legal de preaviso.' },
    ],
  },
  {
    id: 'de-praep-c2',
    level: 'C2',
    title: 'Preposiciones raras y formales',
    summary: 'mangels, mittels, seitens, kraft, zwecks, zugunsten',
    pattern: 'mangels · mittels · seitens · kraft · zwecks · anlässlich · zugunsten · zulasten · unweit + GENITIVO',
    explanation: [
      'El alemán administrativo y jurídico usa preposiciones poco frecuentes, casi todas con **genitivo**: **mangels** (por falta de), **mittels** (mediante), **seitens** (por parte de), **kraft** (en virtud de), **zwecks** (con el fin de), **anlässlich** (con motivo de), **zugunsten / zulasten** (a favor / a cargo de), **unweit** (no lejos de), **inmitten** (en medio de), **abzüglich / zuzüglich** (menos / más).',
      'Muchas pueden reemplazarse por una forma más simple: mangels Beweisen → **weil es keine Beweise gab**; zwecks Prüfung → **um zu prüfen**. Reconocerlas es esencial; usarlas, solo en registro formal.',
    ],
    examples: [
      { text: 'Das Verfahren wurde mangels Beweisen eingestellt.', meaning: 'El proceso se archivó por falta de pruebas.' },
      { text: 'Der Preis versteht sich zuzüglich Mehrwertsteuer.', meaning: 'El precio se entiende más IVA.' },
      { text: 'Anlässlich des zehnjährigen Jubiläums lädt die Werkstatt zum Tag der offenen Tür.', meaning: 'Con motivo del décimo aniversario, el taller invita a una jornada de puertas abiertas.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ Interesse wurde der Kurs abgesagt.', hint: 'por falta de', options: ['Mangels', 'Mittels', 'Seitens', 'Kraft'], answer: 'Mangels' },
      { type: 'choice', prompt: 'Die Daten werden ＿ eines Sensors erfasst.', hint: 'mediante', options: ['mittels', 'mangels', 'zwecks', 'unweit'], answer: 'mittels' },
      { type: 'choice', prompt: '＿ der Geschäftsführung gibt es keine Einwände.', hint: 'por parte de', options: ['Seitens', 'Zugunsten', 'Anlässlich', 'Kraft'], answer: 'Seitens' },
      { type: 'choice', prompt: 'Der Betrag beträgt 500 Euro ＿ Rabatt.', hint: 'menos', options: ['abzüglich', 'zuzüglich', 'zugunsten', 'inmitten'], answer: 'abzüglich' },
    ],
  },
  {
    id: 'de-ellipse',
    level: 'C2',
    title: 'Elipsis: titulares, avisos y habla rápida',
    summary: 'Kanzler unter Druck. · Komme gleich. · Alles klar?',
    pattern: 'se omite lo que el contexto aclara: artículo, verbo, sujeto',
    explanation: [
      'Los **titulares** omiten artículos y verbos: **Kanzler unter Druck.** **Bahn: Streik ab Montag.** **Mehr Geld für Pflegekräfte.** Los **avisos** usan infinitivos y participios: **Rauchen verboten.** **Bitte nicht stören.** **Frisch gestrichen!**',
      'En el **habla** y los mensajes se omite el sujeto o el verbo: **Komme gleich.** **Bin unterwegs.** **Schon gehört?** **Keine Ahnung.** **Na, alles gut?** Entender la elipsis es necesario para la audición C2, donde se habla rápido y con frases incompletas.',
    ],
    examples: [
      { text: 'Autobauer kündigt Stellenabbau an – Gewerkschaft empört.', meaning: 'Fabricante de autos anuncia recortes de puestos; el sindicato, indignado.' },
      { text: 'Bin gleich da, steh noch im Stau.', meaning: 'Llego al tiro, todavía estoy en el taco.' },
      { text: 'Betreten der Baustelle verboten!', meaning: '¡Prohibido entrar a la obra!' },
    ],
    exercises: [
      { type: 'choice', prompt: '«Bin gleich da.» – ¿Qué se omitió?', options: ['El sujeto «ich»', 'El verbo', 'El artículo', 'Nada'], answer: 'El sujeto «ich»' },
      { type: 'choice', prompt: 'Titular típico:', options: ['Mieten steigen weiter', 'Die Mieten sind weiter gestiegen, wie man hört.', 'Es ist so, dass die Mieten steigen.', 'Ich glaube, die Mieten steigen.'], answer: 'Mieten steigen weiter' },
      { type: 'meaning', text: 'Schon gehört? Der Chef hört auf.', options: ['¿Ya supiste? El jefe se retira.', 'El jefe no escucha.', '¿Escuchaste al jefe hablar?', 'El jefe ya escuchó.'], answer: '¿Ya supiste? El jefe se retira.' },
      { type: 'meaning', text: 'Frisch gestrichen!', options: ['¡Recién pintado!', '¡Recién cocinado!', '¡Recién borrado!', '¡Recién llegado!'], answer: '¡Recién pintado!' },
    ],
  },
  {
    id: 'de-ironie',
    level: 'C2',
    title: 'Ironía, atenuación y lo que no se dice',
    summary: 'Na, das hast du ja toll hingekriegt!',
    pattern: 'elogio con tono contrario · understatement · Konjunktiv II irónico',
    explanation: [
      'La **ironía** dice lo contrario de lo que quiere decir, y se reconoce por el **contexto** y el tono: **Na, das hast du ja toll hingekriegt!** (tras un error). **Super, wieder Stau.** Las partículas **ja**, **ja wohl** y **na** suelen marcarla.',
      'El **understatement** (atenuación) es muy alemán: **nicht ganz unproblematisch** (= muy problemático), **nicht gerade billig** (= carísimo), **suboptimal** (= malo). El **Konjunktiv II** también sirve para ironizar: **Das hätten wir also auch geschafft.** (por fin, después de tanto). **Das wäre ja noch schöner!** (¡ni hablar!).',
    ],
    examples: [
      { text: 'Die Lösung ist, sagen wir, nicht ganz ausgereift.', meaning: 'La solución, digamos, no está del todo madura (es mala).' },
      { text: 'Das wäre ja noch schöner, wenn ich jetzt auch noch bezahlen müsste!', meaning: '¡Sería el colmo que ahora encima tuviera que pagar yo!' },
      { text: 'Na prima, der Drucker streikt schon wieder.', meaning: 'Genial, la impresora otra vez no funciona.' },
    ],
    exercises: [
      { type: 'choice', prompt: '«Das Hotel war nicht gerade billig.» significa…', options: ['Era caro', 'Era barato', 'Era gratis', 'No tenía precio'], answer: 'Era caro' },
      { type: 'choice', prompt: '«Na toll, jetzt regnet es auch noch.» expresa…', options: ['Fastidio irónico', 'Alegría sincera', 'Sorpresa positiva', 'Indiferencia'], answer: 'Fastidio irónico' },
      { type: 'choice', prompt: '«suboptimal» en boca de un jefe alemán suele significar…', options: ['Malo', 'Excelente', 'Perfecto', 'Mejorable en un 1 %'], answer: 'Malo' },
      { type: 'meaning', text: 'Das hätten wir also auch geschafft.', options: ['Bueno, por fin eso también está hecho.', 'No lo logramos.', 'Lo habríamos logrado si…', 'Tenemos que lograrlo.'], answer: 'Bueno, por fin eso también está hecho.' },
    ],
  },
  {
    id: 'de-partikeln-kombination',
    level: 'C2',
    title: 'Combinaciones de partículas',
    summary: 'Komm doch mal her! · Das ist ja wohl die Höhe!',
    pattern: 'orden habitual: ja > denn > doch > eben/halt > wohl > mal',
    explanation: [
      'Las partículas se **combinan** y matizan juntas: **doch mal** (petición amable pero insistente: Komm **doch mal** her!), **ja wohl** (indignación: Das ist **ja wohl** die Höhe!), **denn eigentlich** (curiosidad: Was machst du **denn eigentlich** hier?), **halt einfach** (resignación: Das ist **halt einfach** so).',
      'El orden suele ser fijo: **ja** antes de **doch**, **doch** antes de **mal**: Das ist **ja doch** nicht so schlimm. Ruf **doch mal** an! **Mal eben** = rapidito: Kannst du **mal eben** helfen? Usarlas bien es lo que más acerca al habla nativa.',
    ],
    examples: [
      { text: 'Das kannst du doch nicht einfach so machen!', meaning: '¡No puedes hacer eso así nomás!' },
      { text: 'Wo warst du denn eigentlich die ganze Zeit?', meaning: '¿Y dónde estuviste todo este tiempo, eh?' },
      { text: 'Kannst du mal eben die Tür aufhalten?', meaning: '¿Me puedes sujetar la puerta un segundo?' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Komm ＿ her, ich zeig dir was!', options: ['doch mal', 'mal doch', 'ja denn', 'wohl ja'], answer: 'doch mal' },
      { type: 'choice', prompt: 'Das ist ＿ die Höhe!', hint: 'indignación', options: ['ja wohl', 'wohl ja', 'mal doch', 'denn mal'], answer: 'ja wohl' },
      { type: 'choice', prompt: 'Was willst du ＿ eigentlich?', options: ['denn', 'mal', 'halt', 'eben'], answer: 'denn' },
      { type: 'meaning', text: 'Das ist halt einfach so.', options: ['Así es nomás, no hay nada que hacer.', 'Es muy fácil, lo hace cualquiera.', 'No es así, hay que verlo de nuevo.', 'Hay que cambiarlo, así no sirve.'], answer: 'Así es nomás, no hay nada que hacer.' },
    ],
  },
  {
    id: 'de-thema-rhema',
    level: 'C2',
    title: 'Información conocida y nueva en el texto',
    summary: 'Lo conocido va antes; lo nuevo, al final.',
    pattern: 'tema (conocido) → rema (nuevo) · evitar oraciones encajonadas',
    explanation: [
      'Un texto fluido avanza de lo **conocido** (tema) a lo **nuevo** (rema). Lo nuevo de una oración suele ser el tema de la siguiente: Otto eröffnete **eine Werkstatt**. **Diese Werkstatt** spezialisierte sich bald auf **Elektroautos**. **Solche Fahrzeuge** …',
      'También se evitan las **oraciones encajonadas** (Schachtelsätze), con varias subordinadas metidas una dentro de otra: es mejor dividirlas o pasar partes al **Nachfeld**. Y los pronombres y las expresiones de referencia (dies, Letzteres) reemplazan la repetición.',
    ],
    examples: [
      { text: 'Die Firma entwickelte einen neuen Akku. Dieser Akku lädt in zehn Minuten.', meaning: 'La empresa desarrolló una batería nueva. Esta batería se carga en diez minutos.' },
      { text: 'Die Werkstatt liegt am Stadtrand. Dort gibt es genug Parkplätze für die Kunden.', meaning: 'El taller queda en las afueras. Ahí hay suficientes estacionamientos para los clientes.' },
      { text: 'Neu ist dabei vor allem eines: der Preis.', meaning: 'Lo nuevo en esto es sobre todo una cosa: el precio.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Otto kaufte eine Hebebühne. ＿ kostete 8.000 Euro.', options: ['Sie', 'Eine Hebebühne', 'Es', 'Dort'], answer: 'Sie' },
      { type: 'choice', prompt: '¿Qué versión es más clara?', options: ['Der Kunde ist da, der angerufen hat.', 'Der Kunde, der, als es regnete, weil das Auto kaputt war, anrief, ist da.', 'Da ist der, der angerufen, Kunde hat.', 'Der angerufen habende Kunde ist da.'], answer: 'Der Kunde ist da, der angerufen hat.' },
      { type: 'choice', prompt: 'En un texto bien construido, lo nuevo suele ir…', options: ['Al final de la oración', 'Siempre al principio', 'Entre paréntesis', 'En una nota al pie'], answer: 'Al final de la oración' },
      { type: 'meaning', text: 'Entscheidend ist dabei eines: das Vertrauen der Kunden.', options: ['Lo decisivo es una cosa: la confianza de los clientes.', 'Los clientes deciden todo.', 'No hay confianza en los clientes.', 'Hay que decidir por los clientes.'], answer: 'Lo decisivo es una cosa: la confianza de los clientes.' },
    ],
  },
  {
    id: 'de-final-c2',
    level: 'C2',
    title: 'Finalidad culta: zwecks, um … willen, auf dass',
    summary: 'um des lieben Friedens willen',
    pattern: 'zwecks + Gen. · zum Zwecke + Gen. · um … willen · auf dass (arcaico) · im Interesse + Gen.',
    explanation: [
      'Para expresar **finalidad** en registro culto: **zwecks** + genitivo (zwecks Klärung = para aclarar), **zum Zwecke** + genitivo, **im Interesse** + genitivo, **um** + genitivo + **willen** (por amor a, por el bien de): **um des lieben Friedens willen** (para no pelear), **um Himmels willen!** (¡por Dios!).',
      '**auf dass** es arcaico o bíblico (para que): …, **auf dass** es euch wohlergehe. Aparece en citas, discursos solemnes y con ironía. En el uso normal: **damit** y **um … zu**.',
    ],
    examples: [
      { text: 'Um des lieben Friedens willen habe ich nichts gesagt.', meaning: 'Para no pelear, no dije nada.' },
      { text: 'Zwecks Terminvereinbarung rufen Sie uns bitte an.', meaning: 'Para concertar una cita, llámenos por favor.' },
      { text: 'Im Interesse aller Beteiligten sollten wir eine Lösung finden.', meaning: 'En interés de todos los involucrados, deberíamos encontrar una solución.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Um ＿ willen, was ist passiert?', hint: '¡por Dios!', options: ['Himmels', 'Himmel', 'den Himmel', 'des Himmel'], answer: 'Himmels' },
      { type: 'choice', prompt: '＿ Überprüfung Ihrer Angaben benötigen wir Ihren Ausweis.', options: ['Zwecks', 'Damit', 'Um', 'Auf dass'], answer: 'Zwecks' },
      { type: 'choice', prompt: 'Er gab nach, um des Friedens ＿.', options: ['willen', 'wegen', 'halber', 'zuliebe'], answer: 'willen' },
      { type: 'meaning', text: 'Im Interesse der Sicherheit ist das Rauchen untersagt.', options: ['Por razones de seguridad, está prohibido fumar.', 'Fumar es seguro.', 'Está permitido fumar con seguridad.', 'La seguridad fuma.'], answer: 'Por razones de seguridad, está prohibido fumar.' },
    ],
  },
]
