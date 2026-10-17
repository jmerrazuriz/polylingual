import type { GrammarLesson } from '../grammar.ts'

// Gramática C1 del alemán, segunda parte (lecciones 143–154): modalidad, orden de las palabras,
// prefijos, rección culta y partículas.

export const grammarC1b: GrammarLesson[] = [
  {
    id: 'de-modal-subjektiv-perfekt',
    level: 'C1',
    title: 'Suposiciones sobre el pasado con modales',
    summary: 'Er muss es vergessen haben. · Sie soll reich gewesen sein.',
    pattern: 'MODAL + PARTICIPIO + haben / sein',
    explanation: [
      'Los modales subjetivos (B2) también hablan del **pasado** con el infinitivo perfecto: **muss** … **vergessen haben** (seguro que lo olvidó), **dürfte** … **gewesen sein** (probablemente fue), **kann** … **passiert sein** (puede que haya pasado), **kann nicht** … **gesehen haben** (es imposible que lo haya visto).',
      'Para lo que dicen otros: **soll** … **gewesen sein** (dicen que fue), y para lo que alguien dice de sí mismo y uno duda: **will** … **gesehen haben** (dice haberlo visto). Ojo: «Er hat es vergessen müssen» es otra cosa (tuvo que olvidarlo, objetivo).',
    ],
    examples: [
      { text: 'Der Kunde muss den Termin vergessen haben.', meaning: 'Seguro que el cliente olvidó la cita.' },
      { text: 'Der Unfall soll durch einen Reifenschaden verursacht worden sein.', meaning: 'Dicen que el accidente fue causado por un neumático dañado.' },
      { text: 'Er will den Täter genau gesehen haben.', meaning: 'Él asegura haber visto bien al culpable (pero lo dudo).' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich bin mir sicher, dass sie den Zug verpasst hat. = Sie ＿ den Zug verpasst haben.', options: ['muss', 'soll', 'will', 'darf'], answer: 'muss' },
      { type: 'choice', prompt: 'Man sagt, dass er früher Profi war. = Er ＿ früher Profi gewesen sein.', options: ['soll', 'will', 'muss', 'kann'], answer: 'soll' },
      { type: 'choice', prompt: 'Das ist unmöglich! Er ＿ das nicht gesagt haben.', options: ['kann', 'soll', 'dürfte', 'will'], answer: 'kann' },
      { type: 'choice', prompt: 'Wahrscheinlich war es ein Missverständnis. = Es ＿ ein Missverständnis gewesen sein.', options: ['dürfte', 'will', 'soll', 'muss nicht'], answer: 'dürfte' },
    ],
  },
  {
    id: 'de-modalitaetsverben',
    level: 'C1',
    title: 'scheinen, drohen, pflegen, vermögen + zu',
    summary: 'Das Projekt droht zu scheitern.',
    pattern: 'scheinen / drohen / versprechen / pflegen / vermögen / wissen + zu + INFINITIVO',
    explanation: [
      'Algunos verbos funcionan como modales con **zu + infinitivo** y matizan la oración: **scheinen zu** (parecer): Er **scheint** krank **zu** sein. **drohen zu** (amenazar con, estar a punto de algo malo): Das Projekt **droht zu** scheitern. **versprechen zu** (prometer, augurar): Der Abend **verspricht**, spannend **zu** werden.',
      '**pflegen zu** = soler (formal): Er **pflegt** früh aufzustehen. **vermögen zu** = ser capaz de (formal). **wissen zu** = saber hacer algo: Sie **weiß** sich **zu** helfen. Con pasado: Er scheint den Termin vergessen **zu haben**.',
    ],
    examples: [
      { text: 'Die Verhandlungen drohen zu scheitern.', meaning: 'Las negociaciones amenazan con fracasar.' },
      { text: 'Der neue Mitarbeiter scheint sich gut eingearbeitet zu haben.', meaning: 'El nuevo empleado parece haberse adaptado bien.' },
      { text: 'Hans pflegt sonntags lange zu frühstücken.', meaning: 'Hans suele tomar un desayuno largo los domingos.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Es sieht so aus, als ob er müde ist. = Er ＿ müde zu sein.', options: ['scheint', 'droht', 'pflegt', 'weiß'], answer: 'scheint' },
      { type: 'choice', prompt: 'Die Brücke ＿ einzustürzen.', hint: 'amenaza con', options: ['droht', 'pflegt', 'verspricht', 'vermag'], answer: 'droht' },
      { type: 'choice', prompt: 'Sie ＿ in jeder Situation zu helfen.', hint: 'sabe arreglárselas', options: ['weiß sich', 'scheint sich', 'droht sich', 'pflegt sich'], answer: 'weiß sich' },
      { type: 'meaning', text: 'Das Spiel verspricht, spannend zu werden.', options: ['El partido promete ser emocionante.', 'El partido fue aburrido.', 'Prometieron ir al partido.', 'El partido no se juega.'], answer: 'El partido promete ser emocionante.' },
    ],
  },
  {
    id: 'de-konj2-formen',
    level: 'C1',
    title: 'Konjunktiv II: formas propias',
    summary: 'käme, ginge, wüsste, bräuchte, stünde',
    pattern: 'raíz del Präteritum + -e (+ umlaut) · würde + infinitivo en el habla',
    explanation: [
      'En lo hablado casi todo va con **würde**, pero en textos cultos se usan las **formas propias** de los verbos fuertes y frecuentes: kommen → **käme**, gehen → **ginge**, wissen → **wüsste**, finden → **fände**, geben → **gäbe**, lassen → **ließe**, bleiben → **bliebe**, brauchen → **bräuchte**, stehen → **stünde** (o stände).',
      'Las formas débiles coinciden con el Präteritum (er machte), por eso con ellas se prefiere **würde**. Con **haben, sein, werden** y los **modales** siempre se usa la forma propia: hätte, wäre, würde, könnte, müsste, dürfte, sollte, wollte.',
    ],
    examples: [
      { text: 'Wenn ich das wüsste, wäre ich klüger.', meaning: 'Si lo supiera, sería más inteligente.' },
      { text: 'Es gäbe weniger Staus, wenn mehr Leute Rad führen.', meaning: 'Habría menos tacos si más gente anduviera en bicicleta.' },
      { text: 'Ich fände es besser, wenn wir das Thema vertagten.', meaning: 'Me parecería mejor que posterguemos el tema.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'kommen → er ＿ (Konj. II)', options: ['käme', 'kam', 'kämme', 'komme'], answer: 'käme' },
      { type: 'choice', prompt: 'Wenn er Zeit hätte, ＿ er mit.', hint: 'gehen', options: ['ginge', 'ging', 'gehe', 'gang'], answer: 'ginge' },
      { type: 'choice', prompt: 'Es ＿ keine Probleme, wenn alle mitmachen würden.', hint: 'geben', options: ['gäbe', 'gab', 'gebe', 'gibt'], answer: 'gäbe' },
      { type: 'choice', prompt: '¿Con qué verbo se prefiere «würde» en vez de la forma propia?', options: ['machen', 'sein', 'haben', 'können'], answer: 'machen' },
    ],
  },
  {
    id: 'de-vorfeld-nachfeld',
    level: 'C1',
    title: 'Primera posición y lo que va tras el verbo final',
    summary: 'Ausklammerung: Ich habe ihn gesehen gestern im Park.',
    pattern: 'Vorfeld (lo destacado) · verbo · campo medio · verbo final · Nachfeld',
    explanation: [
      'La **primera posición** (Vorfeld) sirve para **conectar** con lo anterior o **destacar**: **Diesen Fehler** hätte ich nie gemacht. **Dabei** ist das ganz einfach. En textos, suele ir ahí lo que ya se conoce (tema), y al final lo nuevo.',
      'Algunas partes pueden ir **después** del verbo final (**Nachfeld**, Ausklammerung): comparaciones con **als/wie** (Er ist schneller gefahren **als erlaubt**), subordinadas y, en lo hablado, complementos largos: Wir haben uns getroffen **vor dem Bahnhof**. Así la oración se vuelve más fácil de seguir.',
    ],
    examples: [
      { text: 'Gerade das hat mich am meisten überrascht.', meaning: 'Precisamente eso es lo que más me sorprendió.' },
      { text: 'Die Reparatur hat länger gedauert als geplant.', meaning: 'La reparación duró más de lo planeado.' },
      { text: 'Wir haben angefangen mit einer kurzen Vorstellungsrunde.', meaning: 'Empezamos con una breve ronda de presentaciones.' },
    ],
    exercises: [
      { type: 'choice', prompt: '¿Qué oración destaca «diesen Vorschlag»?', options: ['Diesen Vorschlag finde ich ausgezeichnet.', 'Ich finde ausgezeichnet diesen Vorschlag.', 'Ich diesen Vorschlag finde ausgezeichnet.', 'Finde ich diesen Vorschlag ausgezeichnet.'], answer: 'Diesen Vorschlag finde ich ausgezeichnet.' },
      { type: 'choice', prompt: '¿Qué se pone normalmente tras el verbo final?', options: ['Una comparación con «als»', 'El sujeto', 'El pronombre «es»', 'El verbo conjugado'], answer: 'Una comparación con «als»' },
      { type: 'order', meaning: 'Trabajó más de lo necesario.', answer: ['Er', 'hat', 'mehr', 'gearbeitet', 'als', 'nötig'] },
      { type: 'order', meaning: 'Justamente esa pregunta no la puedo responder.', answer: ['Gerade', 'diese', 'Frage', 'kann', 'ich', 'nicht', 'beantworten'] },
    ],
  },
  {
    id: 'de-es-funktionen',
    level: 'C1',
    title: 'Los usos de «es»',
    summary: 'Es klingelt. · Es handelt sich um… · Es kommt darauf an.',
    pattern: 'es impersonal · es en la primera posición · es + expresiones fijas',
    explanation: [
      '**es** puede ser sujeto **impersonal** (fenómenos, ruidos, sensaciones): **Es** regnet. **Es** klingelt. **Es** riecht nach Benzin. Y aparece en **expresiones fijas**: **es gibt** (hay), **es geht um** (se trata de), **es handelt sich um** (se trata de, formal), **es kommt auf** … **an** (depende de), **es fehlt an** (falta), **es liegt an** (se debe a).',
      'Como **relleno de la primera posición**, **es** desaparece si otra parte ocupa ese lugar: **Es** kamen viele Gäste → Gestern kamen viele Gäste. Aquí el verbo concuerda con el sujeto real (kamen, plural).',
    ],
    examples: [
      { text: 'Bei dem Fehler handelt es sich um ein Softwareproblem.', meaning: 'En cuanto a la falla, se trata de un problema de software.' },
      { text: 'Es fehlt an qualifizierten Mechanikern.', meaning: 'Faltan mecánicos calificados.' },
      { text: 'Es liegt nicht an dir, sondern an der Technik.', meaning: 'No es por tu culpa, sino por la técnica.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Es kommt ＿ an, wie viel Zeit wir haben.', options: ['darauf', 'davon', 'daran', 'damit'], answer: 'darauf' },
      { type: 'choice', prompt: 'Es ＿ sich um ein Missverständnis.', options: ['handelt', 'geht', 'gibt', 'liegt'], answer: 'handelt' },
      { type: 'choice', prompt: 'Es ＿ viele Leute zur Versammlung.', hint: 'el sujeto real es plural', options: ['kamen', 'kam', 'kommt', 'gekommen'], answer: 'kamen' },
      { type: 'choice', prompt: 'Woran ＿ es, dass der Motor nicht anspringt?', options: ['liegt', 'fehlt', 'handelt', 'gibt'], answer: 'liegt' },
    ],
  },
  {
    id: 'de-praefix-trennbar',
    level: 'C1',
    title: 'Prefijos dobles: um-, über-, durch-, unter-',
    summary: 'umfahren (atropellar) ↔ umfahren (rodear)',
    pattern: 'separable (acento en el prefijo): ˈumfahren · inseparable (acento en el verbo): umˈfahren',
    explanation: [
      'Los prefijos **durch-, über-, um-, unter-, wieder-** pueden ser **separables** o **inseparables**, y cambia el significado. **Separable** (sentido concreto, acento en el prefijo): Er **fährt** den Radfahrer **um** (lo atropella) → hat ihn **umgefahren**. **Inseparable** (sentido figurado, acento en la raíz): Er **umfährt** den Stau (lo rodea) → hat ihn **umfahren**.',
      'Otros pares: **übersetzen** (traducir, insep.) / **übersetzen** (cruzar en barco, sep.); **unterhalten** (entretener, insep.) / **unterhalten** (sostener debajo, sep.); **wiederholen** (repetir, insep.) / **wiederholen** (ir a buscar de nuevo, sep.); **durchsetzen** (imponer, sep.); **übernehmen** (asumir, insep.).',
    ],
    examples: [
      { text: 'Kannst du diesen Brief ins Spanische übersetzen?', meaning: '¿Puedes traducir esta carta al español?' },
      { text: 'Wir haben den Stau großräumig umfahren.', meaning: 'Rodeamos el taco por una ruta amplia.' },
      { text: 'Otto hat die Leitung der Werkstatt übernommen.', meaning: 'Otto asumió la dirección del taller.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Sie hat den Text ins Deutsche ＿.', options: ['übersetzt', 'übergesetzt', 'geübersetzt', 'übersetzen'], answer: 'übersetzt' },
      { type: 'choice', prompt: 'Der Fahrer hat das Schild ＿ (lo derribó).', options: ['umgefahren', 'umfahren', 'geumfahren', 'umfährt'], answer: 'umgefahren' },
      { type: 'choice', prompt: 'Könnten Sie das bitte ＿?', hint: 'repetir', options: ['wiederholen', 'wieder holen', 'holen wieder', 'gewiederholt'], answer: 'wiederholen' },
      { type: 'choice', prompt: 'Er hat sich mit seiner Idee ＿.', hint: 'imponerse', options: ['durchgesetzt', 'durchsetzt', 'gedurchsetzt', 'durchsetzen'], answer: 'durchgesetzt' },
    ],
  },
  {
    id: 'de-praefixe-bedeutung',
    level: 'C1',
    title: 'Qué aportan be-, ver-, er-, zer-, ent-',
    summary: 'arbeiten → bearbeiten, verarbeiten, erarbeiten',
    pattern: 'be- (transitivo) · ver- (cambio, error) · er- (lograr) · zer- (romper) · ent- (quitar)',
    explanation: [
      'Los prefijos inseparables cambian el sentido de forma bastante regular: **be-** vuelve transitivo (antworten auf → **be**antworten + Akk.), **ver-** indica cambio, consumo o error (**ver**schlafen = quedarse dormido, **sich ver**fahren = perderse en auto), **er-** indica lograr algo (**er**arbeiten, **er**reichen), **zer-** destruir (**zer**brechen, **zer**stören), **ent-** quitar o separarse (**ent**fernen, **ent**laden).',
      'Con un mismo verbo base: **arbeiten** → **be**arbeiten (tramitar), **ver**arbeiten (procesar), **er**arbeiten (elaborar). **kaufen** → **ver**kaufen. **sprechen** → **ver**sprechen (prometer), **sich ver**sprechen (equivocarse al hablar), **be**sprechen (conversar sobre).',
    ],
    examples: [
      { text: 'Ihr Antrag wird gerade bearbeitet.', meaning: 'Su solicitud se está tramitando.' },
      { text: 'Ich habe mich auf dem Weg zum Kunden verfahren.', meaning: 'Me perdí (en auto) camino donde el cliente.' },
      { text: 'Bitte entfernen Sie die alte Batterie fachgerecht.', meaning: 'Por favor, retire la batería antigua de forma profesional.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich habe heute ＿ und kam zu spät.', hint: 'quedarse dormido', options: ['verschlafen', 'beschlafen', 'erschlafen', 'zerschlafen'], answer: 'verschlafen' },
      { type: 'choice', prompt: 'Er hat auf die Frage geantwortet. = Er hat die Frage ＿.', options: ['beantwortet', 'verantwortet', 'erantwortet', 'entantwortet'], answer: 'beantwortet' },
      { type: 'choice', prompt: 'Das Glas ist auf den Boden gefallen und ＿.', options: ['zerbrochen', 'verbrochen', 'erbrochen', 'bebrochen'], answer: 'zerbrochen' },
      { type: 'choice', prompt: 'Wir haben das Ziel ＿.', hint: 'alcanzar', options: ['erreicht', 'verreicht', 'bereicht', 'zerreicht'], answer: 'erreicht' },
    ],
  },
  {
    id: 'de-verben-genitiv',
    level: 'C1',
    title: 'Verbos con genitivo',
    summary: 'Das bedarf einer Erklärung.',
    pattern: 'bedürfen · sich bedienen · gedenken · sich enthalten · beschuldigen / anklagen + GENITIVO',
    explanation: [
      'Unos pocos verbos cultos rigen **genitivo**: **bedürfen** (necesitar): Das **bedarf einer** Erklärung. **sich bedienen** (servirse de): Er **bediente sich eines** Tricks. **gedenken** (conmemorar): Wir **gedenken der** Opfer. **sich enthalten** (abstenerse): Sie **enthielt sich der** Stimme.',
      'En el lenguaje jurídico: jemanden **eines** Verbrechens **beschuldigen / anklagen / überführen**. Otros: **sich vergewissern** (asegurarse), **sich annehmen** (hacerse cargo), **sich erfreuen** (gozar de): Das Restaurant **erfreut sich großer** Beliebtheit.',
    ],
    examples: [
      { text: 'Diese Entscheidung bedarf der Zustimmung des Betriebsrats.', meaning: 'Esta decisión necesita la aprobación del comité de empresa.' },
      { text: 'Bitte vergewissern Sie sich, dass das Fahrzeug spannungsfrei ist.', meaning: 'Por favor, asegúrese de que el vehículo esté sin tensión.' },
      { text: 'Er wurde des Betrugs beschuldigt.', meaning: 'Fue acusado de fraude.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das bedarf ＿ Prüfung.', options: ['einer genauen', 'eine genaue', 'einer genaue', 'einem genauen'], answer: 'einer genauen' },
      { type: 'choice', prompt: 'Am 9. November gedenkt man ＿ Opfer.', options: ['der', 'die', 'den', 'dem'], answer: 'der' },
      { type: 'choice', prompt: 'Drei Abgeordnete enthielten sich ＿ Stimme.', options: ['der', 'die', 'den', 'des'], answer: 'der' },
      { type: 'meaning', text: 'Die Stadt erfreut sich großer Beliebtheit bei Touristen.', options: ['La ciudad goza de gran popularidad entre los turistas.', 'La ciudad se alegra por los turistas.', 'Los turistas no quieren la ciudad.', 'La ciudad tiene muchos turistas tristes.'], answer: 'La ciudad goza de gran popularidad entre los turistas.' },
    ],
  },
  {
    id: 'de-adjektiv-kasus',
    level: 'C1',
    title: 'Adjetivos con dativo o genitivo',
    summary: 'Er ist seinem Vater ähnlich. · sich einer Sache bewusst sein',
    pattern: 'DATIVO + ähnlich / bekannt / fremd / überlegen · GENITIVO + bewusst / fähig / sicher / schuldig',
    explanation: [
      'Algunos adjetivos rigen **dativo** (sin preposición): jemandem **ähnlich** (parecido a), **bekannt** (conocido para), **fremd** (ajeno), **dankbar** (agradecido), **überlegen / unterlegen** (superior / inferior), **treu** (fiel), **nützlich** (útil), **peinlich** (vergonzoso): Das ist **mir** peinlich.',
      'Otros, en registro culto, rigen **genitivo**: sich **einer Sache bewusst** sein (ser consciente de), **einer Sache fähig** (capaz de), **sich einer Sache sicher** sein (estar seguro de), **einer Sache schuldig** (culpable de), **einer Sache müde / überdrüssig** (harto de).',
    ],
    examples: [
      { text: 'Die neue Software ist der alten weit überlegen.', meaning: 'El nuevo software es muy superior al antiguo.' },
      { text: 'Wir sind uns des Risikos bewusst.', meaning: 'Somos conscientes del riesgo.' },
      { text: 'Die Situation war ihm sichtlich peinlich.', meaning: 'La situación le resultaba visiblemente incómoda.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das Kind ist ＿ Mutter sehr ähnlich.', options: ['seiner', 'seine', 'seinen', 'seines'], answer: 'seiner' },
      { type: 'choice', prompt: 'Ich bin mir ＿ Verantwortung bewusst.', options: ['meiner', 'meine', 'meinem', 'mein'], answer: 'meiner' },
      { type: 'choice', prompt: 'Diese Stadt ist ＿ noch fremd.', options: ['mir', 'mich', 'meiner', 'ich'], answer: 'mir' },
      { type: 'choice', prompt: 'Bist du dir ＿ sicher?', options: ['dessen', 'das', 'dem', 'den'], answer: 'dessen' },
    ],
  },
  {
    id: 'de-irgend',
    level: 'C1',
    title: 'irgend-: irgendwer, irgendwann, irgendwie',
    summary: 'Irgendwie schaffen wir das schon.',
    pattern: 'irgend + wer / was / wo / wann / wie / ein',
    explanation: [
      '**irgend-** expresa algo **indeterminado** («algún, cualquier»): **irgendwer** / **irgendjemand** (alguien), **irgendwas** / **irgendetwas** (algo), **irgendwo** (en algún lugar), **irgendwann** (algún día), **irgendwie** (de alguna manera), **irgendein / irgendeine** (algún/a), **irgendwelche** (algunos).',
      'Con **nicht** forma negaciones enfáticas: **nicht irgendwer** (no cualquiera): Er ist **nicht irgendein** Mechaniker, er ist Meister. **irgendwie** también expresa duda o vaguedad: Das ist **irgendwie** komisch.',
    ],
    examples: [
      { text: 'Irgendwo muss der Schlüssel doch sein!', meaning: '¡La llave tiene que estar en algún lado!' },
      { text: 'Irgendwann möchte ich eine eigene Werkstatt haben.', meaning: 'Algún día quiero tener mi propio taller.' },
      { text: 'Hat irgendjemand meine Brille gesehen?', meaning: '¿Alguien ha visto mis lentes?' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ werden wir uns wiedersehen.', hint: 'algún día', options: ['Irgendwann', 'Irgendwo', 'Irgendwer', 'Irgendwie'], answer: 'Irgendwann' },
      { type: 'choice', prompt: 'Gib mir ＿ Buch, egal welches.', options: ['irgendein', 'irgendwer', 'irgendwo', 'irgendwelche'], answer: 'irgendein' },
      { type: 'choice', prompt: 'Das schaffen wir ＿.', hint: 'de alguna manera', options: ['irgendwie', 'irgendwann', 'irgendwas', 'irgendwer'], answer: 'irgendwie' },
      { type: 'meaning', text: 'Sie ist nicht irgendeine Kollegin, sie ist meine beste Freundin.', options: ['No es una colega cualquiera, es mi mejor amiga.', 'No es ninguna colega.', 'Es una colega como todas.', 'No conozco a esa colega.'], answer: 'No es una colega cualquiera, es mi mejor amiga.' },
    ],
  },
  {
    id: 'de-fokuspartikeln',
    level: 'C1',
    title: 'Partículas de foco: sogar, erst, lediglich, ausgerechnet',
    summary: 'Erst gestern hat er angerufen.',
    pattern: 'sogar / selbst · nur / lediglich / bloß · erst / schon · ausgerechnet / gerade · auch',
    explanation: [
      'Estas partículas van **justo antes** de lo que destacan y cambian el sentido: **sogar / selbst** (incluso): **Sogar** der Chef hat geholfen. **lediglich** (solamente, formal) = nur. **erst** (recién, más tarde de lo esperado) ↔ **schon** (ya, antes de lo esperado): Er kam **erst** um zehn. Er kam **schon** um sieben.',
      '**ausgerechnet** (justamente, con fastidio): **Ausgerechnet** heute streikt die Bahn! **gerade** (precisamente). La posición importa: **Nur** Otto hat das gewusst (nadie más) ≠ Otto hat das **nur** gewusst (solo lo sabía, no hizo nada).',
    ],
    examples: [
      { text: 'Die Reparatur dauert lediglich eine Stunde.', meaning: 'La reparación dura solamente una hora.' },
      { text: 'Ausgerechnet am Wochenende ist die Heizung kaputtgegangen.', meaning: 'Justamente el fin de semana se echó a perder la calefacción.' },
      { text: 'Selbst Experten waren von dem Ergebnis überrascht.', meaning: 'Incluso los expertos se sorprendieron por el resultado.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich habe ＿ um Mitternacht gegessen – sehr spät!', options: ['erst', 'schon', 'sogar', 'lediglich'], answer: 'erst' },
      { type: 'choice', prompt: '＿ heute, wo ich keine Zeit habe, kommt der Besuch!', hint: 'con fastidio', options: ['Ausgerechnet', 'Lediglich', 'Erst', 'Sogar'], answer: 'Ausgerechnet' },
      { type: 'choice', prompt: 'Es kostet ＿ fünf Euro, nicht mehr.', options: ['lediglich', 'sogar', 'ausgerechnet', 'erst recht'], answer: 'lediglich' },
      { type: 'choice', prompt: 'Alle kamen, ＿ meine Oma, die nie ausgeht.', hint: 'incluso', options: ['sogar', 'erst', 'lediglich', 'bloß'], answer: 'sogar' },
    ],
  },
  {
    id: 'de-modalpartikeln-2',
    level: 'C1',
    title: 'Más partículas: bloß, etwa, ruhig, eigentlich, überhaupt',
    summary: 'Sei bloß vorsichtig! · Du kannst ruhig fragen.',
    pattern: 'bloß / nur (advertencia) · etwa (sospecha) · ruhig (permiso) · eigentlich · überhaupt',
    explanation: [
      '**bloß / nur** en órdenes y deseos dan urgencia: Sei **bloß** vorsichtig! Wenn ich **nur** mehr Zeit hätte! **etwa** en preguntas muestra que uno espera un «no»: Hast du **etwa** mein Auto genommen? **ruhig** da permiso o tranquiliza: Du kannst **ruhig** fragen (pregunta nomás).',
      '**eigentlich** suaviza o cambia de tema (Was machst du **eigentlich** beruflich?). **überhaupt** refuerza preguntas y negaciones: Hast du **überhaupt** Zeit? Das ist **überhaupt** kein Problem. **einfach** subraya lo simple o lo inevitable: Das ist **einfach** zu teuer.',
    ],
    examples: [
      { text: 'Komm bloß nicht zu spät, der Chef ist heute schlecht gelaunt.', meaning: 'Ni se te ocurra llegar tarde, el jefe está de mal humor hoy.' },
      { text: 'Bist du etwa schon fertig?', meaning: '¿No me digas que ya terminaste?' },
      { text: 'Sie können ruhig hereinkommen, ich bin gleich so weit.', meaning: 'Pase nomás, ya casi estoy listo.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Du darfst ＿ mein Fahrrad nehmen, ich brauche es nicht.', hint: 'permiso', options: ['ruhig', 'etwa', 'bloß', 'überhaupt'], answer: 'ruhig' },
      { type: 'choice', prompt: 'Hast du ＿ vergessen, dass heute mein Geburtstag ist?', hint: 'sospecha', options: ['etwa', 'ruhig', 'einfach', 'bloß'], answer: 'etwa' },
      { type: 'choice', prompt: 'Wie spät ist es ＿?', hint: 'cambiar de tema', options: ['eigentlich', 'ruhig', 'bloß', 'etwa'], answer: 'eigentlich' },
      { type: 'choice', prompt: 'Das ist ＿ kein Problem!', hint: 'para nada', options: ['überhaupt', 'etwa', 'ruhig', 'eigentlich'], answer: 'überhaupt' },
    ],
  },
]
