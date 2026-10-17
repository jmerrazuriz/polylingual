import type { GrammarLesson } from '../grammar.ts'

// Gramática B2 del alemán, primera parte (lecciones 96–107): discurso indirecto, pasiva y sus
// alternativas, participios como adjetivo y modales subjetivos. Ottos Weg: Otto dirige un
// taller en Múnich.

export const grammarB2a: GrammarLesson[] = [
  {
    id: 'de-konj1',
    level: 'B2',
    title: 'Konjunktiv I: lo que otros dicen',
    summary: 'Der Chef sagt, er sei zufrieden.',
    pattern: 'er/sie/es: raíz + -e (er habe, er komme) · sein: er sei',
    explanation: [
      'El **Konjunktiv I** se usa en el **discurso indirecto**, sobre todo en noticias e informes: muestra que se reproduce lo que **otra persona** dijo, sin afirmarlo. Se forma con la raíz del infinitivo + terminación: er **habe**, er **komme**, er **müsse**, er **könne**. El verbo **sein** es irregular: ich sei, du sei(e)st, er **sei**, wir seien, sie **seien**.',
      'En la práctica se usa casi solo en **3.ª persona singular**: Der Minister sagte, die Lage **sei** schwierig. Er **habe** keine Zeit. Man **müsse** schnell handeln.',
    ],
    examples: [
      { text: 'Der Kunde behauptet, das Auto sei schon vorher kaputt gewesen.', meaning: 'El cliente afirma que el auto ya estaba malo antes.' },
      { text: 'Die Firma erklärte, sie habe keine Fehler gemacht.', meaning: 'La empresa declaró que no había cometido errores.' },
      { text: 'Laut Zeitung werde die Miete weiter steigen.', meaning: 'Según el diario, el arriendo seguirá subiendo.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Er sagt, er ＿ krank.', hint: 'sein, Konj. I', options: ['sei', 'ist', 'wäre', 'sein'], answer: 'sei' },
      { type: 'choice', prompt: 'Die Chefin meint, das Team ＿ gute Arbeit geleistet.', hint: 'haben, Konj. I', options: ['habe', 'hat', 'hätte', 'haben'], answer: 'habe' },
      { type: 'type', prompt: 'er ＿ (kommen, Konjunktiv I)', answers: ['komme'], german: true },
      { type: 'meaning', text: 'Der Sprecher sagte, die Firma müsse sparen.', options: ['El vocero dijo que la empresa tenía que ahorrar.', 'La empresa ahorra porque el vocero lo dijo.', 'El vocero quiere ahorrar.', 'La empresa no tiene que ahorrar.'], answer: 'El vocero dijo que la empresa tenía que ahorrar.' },
    ],
  },
  {
    id: 'de-indirekte-rede',
    level: 'B2',
    title: 'El discurso indirecto en la práctica',
    summary: 'Cuándo se usa el Konjunktiv II y cómo se dice el pasado.',
    pattern: 'pasado: er habe/sei + participio · si Konj. I = indicativo → Konj. II',
    explanation: [
      'Si la forma del Konjunktiv I es **igual al indicativo** (sobre todo en plural: sie haben), se usa el **Konjunktiv II**: Die Mitarbeiter sagen, sie **hätten** zu viel Arbeit. O **würde** + infinitivo: sie **würden** mehr Zeit brauchen.',
      'Para el **pasado**: **habe / sei + participio**: Er sagte, er **habe** den Kunden **angerufen**. Sie erklärte, sie **sei** zu spät **gekommen**. Preguntas: con **ob** o la palabra interrogativa: Er fragt, **ob** ich Zeit **habe**. Órdenes: con **sollen**: Sie sagt, ich **solle** warten.',
    ],
    examples: [
      { text: 'Die Kollegen sagen, sie hätten keine Zeit für ein Meeting.', meaning: 'Los colegas dicen que no tienen tiempo para una reunión.' },
      { text: 'Otto erzählte, er sei in Valparaíso aufgewachsen.', meaning: 'Otto contó que había crecido en Valparaíso.' },
      { text: 'Der Kunde fragte, wann das Auto fertig sei.', meaning: 'El cliente preguntó cuándo estaría listo el auto.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Die Arbeiter sagen, sie ＿ mehr Geld.', hint: 'brauchen (plural → Konj. II)', options: ['bräuchten', 'brauchen', 'brauche', 'brauchten'], answer: 'bräuchten' },
      { type: 'choice', prompt: 'Er sagte, er ＿ gestern im Büro gewesen.', options: ['sei', 'habe', 'ist', 'war'], answer: 'sei' },
      { type: 'choice', prompt: 'Sie fragt, ＿ ich morgen komme.', options: ['ob', 'dass', 'wenn', 'was'], answer: 'ob' },
      { type: 'choice', prompt: 'Der Arzt sagt, ich ＿ mich ausruhen.', hint: 'orden indirecta', options: ['solle', 'soll', 'sollte', 'sollen'], answer: 'solle' },
    ],
  },
  {
    id: 'de-passiv-ersatz',
    level: 'B2',
    title: 'Alternativas a la pasiva',
    summary: 'lässt sich reparieren · ist reparierbar · ist zu reparieren.',
    pattern: 'sich lassen + infinitivo · adjetivo en -bar · sein + zu + infinitivo · man',
    explanation: [
      'Para expresar **posibilidad** sin pasiva: **sich lassen** + infinitivo (Das Problem **lässt sich lösen**), adjetivo en **-bar** (Das Problem ist **lösbar**) o **sein + zu** (Das Problem **ist** leicht **zu lösen**). Las tres significan «se puede resolver».',
      '**sein + zu** también expresa **obligación** en textos oficiales: Die Miete **ist** bis zum 3. **zu zahlen** (hay que pagar). Y **man** + activa: **Man** kann das Problem lösen.',
    ],
    examples: [
      { text: 'Der Motor lässt sich nicht mehr reparieren.', meaning: 'El motor ya no se puede reparar.' },
      { text: 'Diese Aufgabe ist in einer Stunde machbar.', meaning: 'Esta tarea se puede hacer en una hora.' },
      { text: 'Das Formular ist vollständig auszufüllen.', meaning: 'El formulario debe llenarse completo.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das Fenster ＿ sich nicht öffnen.', options: ['lässt', 'kann', 'ist', 'wird'], answer: 'lässt' },
      { type: 'choice', prompt: 'Die Schrift ist kaum ＿.', hint: 'se puede leer', options: ['lesbar', 'lesend', 'gelesen', 'lesen'], answer: 'lesbar' },
      { type: 'choice', prompt: 'Die Rechnung ist innerhalb von 14 Tagen ＿ bezahlen.', options: ['zu', 'um', '—', 'zum'], answer: 'zu' },
      { type: 'choice', prompt: '«Das Problem lässt sich lösen» significa…', options: ['Das Problem kann gelöst werden.', 'Das Problem muss gelöst werden.', 'Das Problem ist gelöst worden.', 'Das Problem wird nie gelöst.'], answer: 'Das Problem kann gelöst werden.' },
    ],
  },
  {
    id: 'de-zustandspassiv',
    level: 'B2',
    title: 'Pasiva de proceso y de estado',
    summary: 'Die Tür wird geschlossen ↔ die Tür ist geschlossen.',
    pattern: 'proceso: werden + participio · estado (resultado): sein + participio',
    explanation: [
      'La **pasiva de proceso** (werden) describe la acción: Die Werkstatt **wird** um 18 Uhr **geschlossen** (alguien la cierra). La **pasiva de estado** (sein) describe el **resultado**: Die Werkstatt **ist** jetzt **geschlossen** (está cerrada).',
      'Es frecuente en avisos: Heute **geschlossen**. Das Auto **ist repariert**. En pasado: Die Tür **war** verschlossen (estaba cerrada con llave).',
    ],
    examples: [
      { text: 'Das Auto wird gerade repariert.', meaning: 'El auto está siendo reparado ahora.' },
      { text: 'Das Auto ist schon repariert.', meaning: 'El auto ya está reparado.' },
      { text: 'Als ich ankam, war der Laden schon geschlossen.', meaning: 'Cuando llegué, la tienda ya estaba cerrada.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Keine Sorge, der Vertrag ＿ schon unterschrieben.', hint: 'resultado', options: ['ist', 'wird', 'hat', 'wurde'], answer: 'ist' },
      { type: 'choice', prompt: 'Der Müll ＿ jeden Montag abgeholt.', hint: 'proceso', options: ['wird', 'ist', 'hat', 'sei'], answer: 'wird' },
      { type: 'meaning', text: 'Die Straße ist gesperrt.', options: ['La calle está cerrada.', 'La calle se está cerrando.', 'La calle se cerrará.', 'La calle no está cerrada.'], answer: 'La calle está cerrada.' },
      { type: 'choice', prompt: '«Das Geschäft ist heute geschlossen» describe…', options: ['un estado', 'una acción en curso', 'una orden', 'un deseo'], answer: 'un estado' },
    ],
  },
  {
    id: 'de-passiv-zeiten',
    level: 'B2',
    title: 'La pasiva en todos los tiempos',
    summary: 'ist gebaut worden · war gebaut worden · wird gebaut werden.',
    pattern: 'Perfekt: ist + part. + worden · Plusq.: war + part. + worden · Futur: wird + part. + werden',
    explanation: [
      'Resumen: Präsens **wird gebaut** · Präteritum **wurde gebaut** · Perfekt **ist gebaut worden** · Plusquamperfekt **war gebaut worden** · Futur **wird gebaut werden**.',
      'En la **subordinada** el verbo conjugado va al final: …, weil das Haus 1910 **gebaut worden ist**. …, dass die Werkstatt erweitert **werden muss**. En el Perfekt se usa **worden** (no geworden).',
    ],
    examples: [
      { text: 'Die neue Halle ist letztes Jahr gebaut worden.', meaning: 'La nave nueva fue construida el año pasado.' },
      { text: 'Bevor Otto kam, war die Werkstatt schon renoviert worden.', meaning: 'Antes de que llegara Otto, el taller ya había sido renovado.' },
      { text: 'Die Ergebnisse werden nächste Woche veröffentlicht werden.', meaning: 'Los resultados serán publicados la próxima semana.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das Gesetz ist im Mai beschlossen ＿.', options: ['worden', 'geworden', 'werden', 'wurde'], answer: 'worden' },
      { type: 'choice', prompt: 'Ich weiß, dass der Fehler schon korrigiert worden ＿.', options: ['ist', 'wird', 'hat', 'war ist'], answer: 'ist' },
      { type: 'choice', prompt: 'Futur pasivo: Die Brücke ＿ 2030 fertiggestellt werden.', options: ['wird', 'ist', 'wurde', 'würde'], answer: 'wird' },
      { type: 'order', meaning: 'El auto ya había sido vendido.', answer: ['Das', 'Auto', 'war', 'schon', 'verkauft', 'worden'] },
    ],
  },
  {
    id: 'de-partizip1',
    level: 'B2',
    title: 'Participio I como adjetivo',
    summary: 'die steigenden Preise, ein schlafendes Kind.',
    pattern: 'infinitivo + d + terminación del adjetivo → steigend → die steigenden Preise',
    explanation: [
      'El **participio I** = infinitivo + **d**: steigen → steigen**d**, schlafen → schlafen**d**. Describe una acción **en curso** y **activa**: die **steigenden** Mieten (los arriendos que suben). Delante de un sustantivo lleva las terminaciones normales del adjetivo.',
      'Es muy frecuente en textos escritos y en el examen: die **wachsende** Zahl, ein **überzeugendes** Argument, die **folgenden** Punkte. También como adverbio: Er antwortete **lächelnd**.',
    ],
    examples: [
      { text: 'Die steigenden Energiepreise sind für viele Familien ein Problem.', meaning: 'Los precios de la energía en alza son un problema para muchas familias.' },
      { text: 'Bitte beachten Sie die folgenden Hinweise.', meaning: 'Por favor tenga en cuenta las siguientes indicaciones.' },
      { text: 'Das ist ein überzeugendes Angebot.', meaning: 'Es una oferta convincente.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'die ＿ Kosten (steigen)', options: ['steigenden', 'gestiegenen', 'steigende', 'gestiegen'], answer: 'steigenden' },
      { type: 'choice', prompt: 'ein ＿ Kind (schlafen)', options: ['schlafendes', 'geschlafenes', 'schlafende', 'schlafen'], answer: 'schlafendes' },
      { type: 'type', prompt: 'Participio I de «folgen»', answers: ['folgend'], german: true },
      { type: 'meaning', text: 'die wachsende Zahl der Elektroautos', options: ['el número creciente de autos eléctricos', 'el número de autos eléctricos que creció', 'pocos autos eléctricos', 'los autos eléctricos que crecen solos'], answer: 'el número creciente de autos eléctricos' },
    ],
  },
  {
    id: 'de-partizip2',
    level: 'B2',
    title: 'Participio II como adjetivo',
    summary: 'das reparierte Auto, die gestiegenen Preise.',
    pattern: 'participio II + terminación del adjetivo → das reparierte Auto',
    explanation: [
      'El **participio II** como adjetivo describe algo **terminado** o **pasivo**: das **reparierte** Auto (el auto que fue reparado), die **gestiegenen** Preise (los precios que subieron).',
      'Compara: die **steigenden** Preise (siguen subiendo) / die **gestiegenen** Preise (ya subieron). Muy usado en avisos y formularios: das **ausgefüllte** Formular, die **beigefügten** Unterlagen, das **gewünschte** Produkt.',
    ],
    examples: [
      { text: 'Bitte schicken Sie uns das ausgefüllte Formular zurück.', meaning: 'Por favor envíenos el formulario llenado.' },
      { text: 'Die gestohlenen Werkzeuge wurden gefunden.', meaning: 'Las herramientas robadas fueron encontradas.' },
      { text: 'Im Anhang finden Sie die gewünschten Informationen.', meaning: 'En el adjunto encuentra la información solicitada.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'das ＿ Auto (reparieren, ya terminado)', options: ['reparierte', 'reparierende', 'reparieren', 'repariertes'], answer: 'reparierte' },
      { type: 'choice', prompt: 'die ＿ Unterlagen (beifügen)', options: ['beigefügten', 'beifügenden', 'beigefügt', 'beifügten'], answer: 'beigefügten' },
      { type: 'choice', prompt: '«die gesunkenen Preise» significa…', options: ['los precios que bajaron', 'los precios que están bajando', 'los precios que bajarán', 'los precios bajos de siempre'], answer: 'los precios que bajaron' },
      { type: 'type', prompt: 'ein ＿ Brief (schreiben, participio II, nominativo)', answers: ['geschriebener'], german: true },
    ],
  },
  {
    id: 'de-partizip-erweitert',
    level: 'B2',
    title: 'Atributos de participio extendidos',
    summary: 'die seit Jahren steigenden Mieten.',
    pattern: 'artículo + (complementos) + participio + sustantivo',
    explanation: [
      'En textos formales, entre el **artículo** y el **sustantivo** puede ir un grupo largo: die **seit Jahren steigenden** Mieten (los arriendos que suben desde hace años). Para entenderlos, busca el artículo, salta al sustantivo y lee lo de en medio como una oración de relativo.',
      'die **im letzten Jahr von der Regierung beschlossenen** Gesetze = die Gesetze, **die** im letzten Jahr von der Regierung **beschlossen wurden**.',
    ],
    examples: [
      { text: 'Die von Otto reparierten Autos sind alle abgeholt worden.', meaning: 'Los autos reparados por Otto ya fueron retirados todos.' },
      { text: 'Der seit Montag streikende Betrieb hat neue Gespräche angeboten.', meaning: 'La empresa en huelga desde el lunes ofreció nuevas conversaciones.' },
      { text: 'Die im Vertrag genannten Bedingungen gelten ab Juni.', meaning: 'Las condiciones mencionadas en el contrato rigen desde junio.' },
    ],
    exercises: [
      { type: 'choice', prompt: '«die von vielen Menschen genutzte App» significa…', options: ['la app que usa mucha gente', 'la app que usa a la gente', 'la app que muchos usarán', 'la app que nadie usa'], answer: 'la app que usa mucha gente' },
      { type: 'choice', prompt: '«der seit Stunden wartende Kunde» significa…', options: ['el cliente que espera desde hace horas', 'el cliente que esperó una hora', 'el cliente que hará esperar', 'el cliente sin paciencia'], answer: 'el cliente que espera desde hace horas' },
      { type: 'choice', prompt: '¿Qué relativa equivale a «die gestern gelieferten Teile»?', options: ['die Teile, die gestern geliefert wurden', 'die Teile, die gestern liefern', 'die Teile, die morgen geliefert werden', 'die Teile, die man liefern muss'], answer: 'die Teile, die gestern geliefert wurden' },
      { type: 'meaning', text: 'die stark gestiegenen Energiepreise', options: ['los precios de la energía que subieron mucho', 'los precios de la energía que bajaron mucho', 'la energía que sube', 'los precios estables'], answer: 'los precios de la energía que subieron mucho' },
    ],
  },
  {
    id: 'de-modal-subjektiv',
    level: 'B2',
    title: 'Modales subjetivos',
    summary: 'Er soll reich sein · er muss krank sein · er dürfte zu Hause sein.',
    pattern: 'muss (seguro) · dürfte (probable) · kann (posible) · soll (dicen que) · will (él afirma)',
    explanation: [
      'Los modales también expresan **qué tan seguro** está quien habla: **muss** = casi seguro (Er **muss** krank sein), **dürfte** = probable (Er **dürfte** im Büro sein), **kann / könnte** = posible (Das **könnte** stimmen).',
      '**sollen** = «se dice que» (información de otros): Der neue Chef **soll** sehr streng sein. **wollen** = «él afirma» (con duda): Er **will** das Auto nicht gesehen haben. Para el pasado: modal + participio + haben/sein.',
    ],
    examples: [
      { text: 'Das Licht ist an. Otto muss noch in der Werkstatt sein.', meaning: 'La luz está encendida. Otto tiene que estar todavía en el taller.' },
      { text: 'Die neue Kollegin soll aus Brasilien kommen.', meaning: 'Dicen que la nueva colega es de Brasil.' },
      { text: 'Der Kunde will nichts von dem Schaden gewusst haben.', meaning: 'El cliente afirma no haber sabido nada del daño.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Er hat seit Tagen nicht geschlafen. Er ＿ sehr müde sein.', hint: 'casi seguro', options: ['muss', 'soll', 'will', 'darf'], answer: 'muss' },
      { type: 'choice', prompt: 'In der Zeitung steht, der Minister ＿ zurücktreten.', hint: 'se dice que', options: ['soll', 'will', 'muss', 'kann'], answer: 'soll' },
      { type: 'choice', prompt: 'Es ist 9 Uhr. Sie ＿ schon im Büro sein.', hint: 'probable', options: ['dürfte', 'darf', 'soll', 'will'], answer: 'dürfte' },
      { type: 'meaning', text: 'Er will den Unfall nicht verursacht haben.', options: ['Él afirma no haber causado el accidente.', 'Él no quiere causar un accidente.', 'Dicen que causó el accidente.', 'Seguro causó el accidente.'], answer: 'Él afirma no haber causado el accidente.' },
    ],
  },
  {
    id: 'de-futur2',
    level: 'B2',
    title: 'Futur II',
    summary: 'Bis Freitag werden wir fertig sein · er wird es vergessen haben.',
    pattern: 'werden + participio + haben/sein (al final)',
    explanation: [
      'El **Futur II** describe algo que **habrá terminado** en un momento futuro: Bis Freitag **werden** wir das Projekt **abgeschlossen haben** (para el viernes habremos terminado el proyecto).',
      'Se usa sobre todo para **suposiciones sobre el pasado**: Er ist nicht gekommen. Er **wird** den Termin **vergessen haben** (seguramente olvidó la cita).',
    ],
    examples: [
      { text: 'Bis Ende des Jahres wird Otto die Meisterprüfung bestanden haben.', meaning: 'Para fin de año Otto habrá aprobado el examen de maestro.' },
      { text: 'Sie wird den Zug verpasst haben.', meaning: 'Seguramente perdió el tren.' },
      { text: 'In zehn Jahren werden viele Autos elektrisch fahren.', meaning: 'En diez años muchos autos serán eléctricos.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Bis morgen ＿ ich den Bericht geschrieben haben.', options: ['werde', 'habe', 'würde', 'wurde'], answer: 'werde' },
      { type: 'choice', prompt: 'Hans antwortet nicht. Er wird schon ＿ sein.', hint: 'einschlafen', options: ['eingeschlafen', 'einschlafen', 'eingeschlafen haben', 'schläft'], answer: 'eingeschlafen' },
      { type: 'meaning', text: 'Er wird sich verfahren haben.', options: ['Seguramente se perdió (manejando).', 'Mañana se va a perder (manejando).', 'No se perdió, llegó a tiempo.', 'Se perdería si fuera manejando.'], answer: 'Seguramente se perdió (manejando).' },
      { type: 'order', meaning: 'Para el lunes habremos hecho todo.', answer: ['Bis', 'Montag', 'werden', 'wir', 'alles', 'erledigt', 'haben'] },
    ],
  },
  {
    id: 'de-konj2-modal-vergangenheit',
    level: 'B2',
    title: 'Habría tenido que: hätte … machen müssen',
    summary: 'Ich hätte früher anrufen sollen.',
    pattern: 'hätte + infinitivo + modal en infinitivo (doble infinitivo)',
    explanation: [
      'Para hablar de lo que **habría debido o podido** pasar se usa **hätte** + infinitivo + **modal en infinitivo**: Ich **hätte** dich **anrufen sollen** (debería haberte llamado). Wir **hätten** früher **losfahren müssen**. Das **hätte** schlimmer **sein können**.',
      'En la subordinada, **hätte** va **antes** de los dos infinitivos: …, dass ich dich **hätte anrufen sollen**.',
    ],
    examples: [
      { text: 'Du hättest mir das früher sagen sollen!', meaning: '¡Me lo hubieras dicho antes!' },
      { text: 'Wir hätten den Auftrag annehmen können.', meaning: 'Podríamos haber aceptado el encargo.' },
      { text: 'Ich weiß, dass ich besser hätte aufpassen müssen.', meaning: 'Sé que debería haber prestado más atención.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich ＿ mehr lernen sollen.', options: ['hätte', 'habe', 'wäre', 'hatte'], answer: 'hätte' },
      { type: 'choice', prompt: 'Das hätte nicht ＿ dürfen.', hint: 'passieren', options: ['passieren', 'passiert', 'zu passieren', 'passierte'], answer: 'passieren' },
      { type: 'order', meaning: 'Deberías haberme llamado.', answer: ['Du', 'hättest', 'mich', 'anrufen', 'sollen'] },
      { type: 'meaning', text: 'Wir hätten den Bus nehmen können.', options: ['Podríamos haber tomado el bus.', 'Tomamos el bus.', 'Tenemos que tomar el bus.', 'No pudimos tomar el bus.'], answer: 'Podríamos haber tomado el bus.' },
    ],
  },
  {
    id: 'de-nomen-verb',
    level: 'B2',
    title: 'Combinaciones de sustantivo y verbo',
    summary: 'eine Entscheidung treffen, in Frage kommen, zur Verfügung stehen.',
    pattern: 'sustantivo + verbo «vacío» = un significado (Funktionsverbgefüge)',
    explanation: [
      'En el alemán formal muchas acciones se expresan con un **sustantivo + verbo**: **eine Entscheidung treffen** (= entscheiden), **eine Frage stellen** (= fragen), **Kritik üben** (= kritisieren), **in Frage kommen** (ser una opción), **zur Verfügung stehen** (estar disponible), **in Kraft treten** (entrar en vigor).',
      'Se aprenden como bloques: el verbo no se puede cambiar (no se dice «eine Entscheidung machen»). En la sección Palabras de B2 hay un tema para repasarlas.',
    ],
    examples: [
      { text: 'Der Chef muss bis Freitag eine Entscheidung treffen.', meaning: 'El jefe tiene que tomar una decisión antes del viernes.' },
      { text: 'Für weitere Fragen stehe ich Ihnen gern zur Verfügung.', meaning: 'Quedo a su disposición para más preguntas.' },
      { text: 'Das neue Gesetz tritt im Januar in Kraft.', meaning: 'La nueva ley entra en vigor en enero.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'eine Entscheidung ＿', options: ['treffen', 'machen', 'nehmen', 'geben'], answer: 'treffen' },
      { type: 'choice', prompt: 'Darf ich Ihnen eine Frage ＿?', options: ['stellen', 'machen', 'fragen', 'setzen'], answer: 'stellen' },
      { type: 'choice', prompt: 'Diese Lösung kommt für uns nicht in ＿.', options: ['Frage', 'Kraft', 'Ordnung', 'Betracht'], answer: 'Frage' },
      { type: 'choice', prompt: 'Das Gesetz tritt am 1. Mai in ＿.', options: ['Kraft', 'Frage', 'Verfügung', 'Ordnung'], answer: 'Kraft' },
    ],
  },
]
