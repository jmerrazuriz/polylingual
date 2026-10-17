import type { GrammarLesson } from '../grammar.ts'

// Gramática B1 del alemán, primera parte (lecciones 61–72): el pasado completo, la pasiva y
// las oraciones de relativo. Ottos Weg: Otto se prepara para el B1 y para crecer en su trabajo.

export const grammarB1a: GrammarLesson[] = [
  {
    id: 'de-praeteritum',
    level: 'B1',
    title: 'El Präteritum',
    summary: 'Contar el pasado por escrito: arbeitete, fuhr, brachte.',
    pattern: 'débil: -te · fuerte: cambio de vocal · mixto: brachte, dachte, kannte',
    explanation: [
      'En textos escritos (noticias, informes, cuentos, currículum) el pasado se cuenta en **Präteritum**. Débiles: raíz + **-te** + terminación: ich arbeit**ete**, du arbeit**etest**, wir arbeit**eten**. Fuertes: cambian la vocal y no llevan -te: fahren → **fuhr**, schreiben → **schrieb**, finden → **fand**, bleiben → **blieb**.',
      'Mixtos: cambian la vocal **y** llevan -te: bringen → **brachte**, denken → **dachte**, kennen → **kannte**, wissen → **wusste**. En el Präteritum ich y er/sie/es son iguales: ich fuhr, er fuhr.',
    ],
    examples: [
      { text: 'Otto arbeitete zehn Jahre als Mechaniker in Chile.', meaning: 'Otto trabajó diez años como mecánico en Chile.' },
      { text: 'Nach dem Kurs schrieb er einen langen Brief an seine Familie.', meaning: 'Después del curso escribió una larga carta a su familia.' },
      { text: 'Hans dachte, dass Otto schon da war.', meaning: 'Hans pensaba que Otto ya estaba ahí.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Letztes Jahr ＿ Otto nach Deutschland.', hint: 'kommen', options: ['kam', 'kommte', 'kamte', 'kommt'], answer: 'kam' },
      { type: 'choice', prompt: 'Wir ＿ den ganzen Tag.', hint: 'arbeiten', options: ['arbeiteten', 'arbeitten', 'arbeiten', 'arbeitetet'], answer: 'arbeiteten' },
      { type: 'type', prompt: 'ich ＿ (bringen, Präteritum)', answers: ['brachte'], german: true },
      { type: 'type', prompt: 'er ＿ (schreiben, Präteritum)', answers: ['schrieb'], german: true },
      { type: 'choice', prompt: '¿Qué forma es correcta para «du» de «fahren» en Präteritum?', options: ['fuhrst', 'fahrtest', 'fuhrtest', 'fährst'], answer: 'fuhrst' },
    ],
  },
  {
    id: 'de-plusquamperfekt',
    level: 'B1',
    title: 'El Plusquamperfekt',
    summary: 'Lo que había pasado antes: Ich hatte schon gegessen.',
    pattern: 'hatte / war + participio al final',
    explanation: [
      'El **Plusquamperfekt** cuenta algo que pasó **antes** de otro momento del pasado. Se forma con el **Präteritum de haben o sein** + participio: Ich **hatte** schon **gegessen**, als Hans kam. Otto **war** schon **gegangen**.',
      'Se elige haben o sein igual que en el Perfekt. Es muy común con **nachdem**: Nachdem ich die Prüfung **bestanden hatte**, feierten wir.',
    ],
    examples: [
      { text: 'Als Otto ankam, hatte der Kurs schon begonnen.', meaning: 'Cuando Otto llegó, el curso ya había empezado.' },
      { text: 'Hans war schon nach Hause gegangen.', meaning: 'Hans ya se había ido a casa.' },
      { text: 'Ich hatte den Vertrag nicht genau gelesen.', meaning: 'No había leído bien el contrato.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Als ich anrief, ＿ Hans schon gegangen.', options: ['war', 'hatte', 'ist', 'hat'], answer: 'war' },
      { type: 'choice', prompt: 'Wir ＿ vorher viel gelernt.', options: ['hatten', 'waren', 'haben', 'sind'], answer: 'hatten' },
      { type: 'order', meaning: 'Ya había comido.', answer: ['Ich', 'hatte', 'schon', 'gegessen'] },
      { type: 'meaning', text: 'Der Zug war schon abgefahren.', options: ['El tren ya había partido.', 'El tren ya parte.', 'El tren partió temprano.', 'El tren todavía no parte.'], answer: 'El tren ya había partido.' },
    ],
  },
  {
    id: 'de-nachdem-bevor',
    level: 'B1',
    title: 'nachdem, bevor, während',
    summary: 'Ordenar acciones en el tiempo.',
    pattern: 'nachdem + Plusquamperfekt → Präteritum · bevor / während + verbo al final',
    explanation: [
      '**bevor** = antes de que: **Bevor** ich zur Arbeit fahre, frühstücke ich. **während** = mientras: **Während** Otto arbeitet, hört er Radio. Las dos llevan el verbo al final.',
      '**nachdem** = después de que. Ojo con los tiempos: la acción de nachdem va **un paso más atrás**: presente → Perfekt (Nachdem ich gegessen **habe**, gehe ich), pasado → Plusquamperfekt (Nachdem ich gegessen **hatte**, ging ich).',
    ],
    examples: [
      { text: 'Bevor Otto die Wohnung mietete, sah er sie zweimal an.', meaning: 'Antes de arrendar el departamento, Otto lo vio dos veces.' },
      { text: 'Nachdem er die Prüfung bestanden hatte, rief er seine Mutter an.', meaning: 'Después de aprobar el examen, llamó a su madre.' },
      { text: 'Während des Kurses darf man nicht telefonieren.', meaning: 'Durante el curso no se puede hablar por teléfono.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ ich ins Bett gehe, putze ich mir die Zähne.', hint: 'antes de', options: ['Bevor', 'Nachdem', 'Während', 'Als'], answer: 'Bevor' },
      { type: 'choice', prompt: 'Nachdem Hans gegessen ＿, ging er spazieren.', options: ['hatte', 'hat', 'war', 'ist'], answer: 'hatte' },
      { type: 'choice', prompt: '＿ Otto kocht, telefoniert er mit Hans.', hint: 'mientras', options: ['Während', 'Bevor', 'Nachdem', 'Seit'], answer: 'Während' },
      { type: 'order', meaning: 'Antes de salir, cierro las ventanas.', answer: ['Bevor', 'ich', 'gehe', 'schließe', 'ich', 'die', 'Fenster'] },
    ],
  },
  {
    id: 'de-als-wenn',
    level: 'B1',
    title: 'als o wenn: «cuando»',
    summary: 'Als ich Kind war… · Immer wenn es regnet…',
    pattern: 'als = una vez en el pasado · wenn = presente/futuro o «cada vez que»',
    explanation: [
      '**als** se usa para algo que pasó **una sola vez** o un período en el **pasado**: **Als** ich nach Deutschland kam, sprach ich kein Deutsch. **Als** ich Kind war, wohnte ich am Meer.',
      '**wenn** se usa para el **presente/futuro** y para cosas que se **repiten** (también en el pasado: «cada vez que»): **Wenn** ich Zeit habe, lese ich. **Immer wenn** es regnete, blieben wir zu Hause.',
    ],
    examples: [
      { text: 'Als Otto die erste Stelle bekam, war er sehr glücklich.', meaning: 'Cuando Otto consiguió su primer puesto, estaba muy feliz.' },
      { text: 'Wenn ich nach Hause komme, koche ich.', meaning: 'Cuando llego a casa, cocino.' },
      { text: 'Immer wenn wir uns trafen, sprachen wir Spanisch.', meaning: 'Cada vez que nos juntábamos, hablábamos español.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ ich 18 war, machte ich den Führerschein.', options: ['Als', 'Wenn', 'Wann', 'Ob'], answer: 'Als' },
      { type: 'choice', prompt: '＿ du Hilfe brauchst, ruf mich an.', options: ['Wenn', 'Als', 'Wann', 'Bevor'], answer: 'Wenn' },
      { type: 'choice', prompt: 'Immer ＿ Hans kam, brachte er Kuchen mit.', options: ['wenn', 'als', 'wann', 'ob'], answer: 'wenn' },
      { type: 'choice', prompt: '＿ beginnt der Kurs? – Um neun.', hint: 'pregunta', options: ['Wann', 'Wenn', 'Als', 'Ob'], answer: 'Wann' },
    ],
  },
  {
    id: 'de-passiv-praesens',
    level: 'B1',
    title: 'La pasiva en presente',
    summary: 'Das Auto wird repariert.',
    pattern: 'werden + participio al final · von + dativo (quién)',
    explanation: [
      'La **pasiva** pone el foco en la acción, no en quién la hace. Se forma con **werden** + participio: Das Auto **wird repariert** (el auto está siendo reparado / se repara). Ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
      'Si importa quién lo hace, se agrega **von** + dativo: Das Auto wird **von Otto** repariert. Es muy usada en avisos, instrucciones y noticias: Hier **wird** nicht **geraucht**.',
    ],
    examples: [
      { text: 'In der Werkstatt werden jeden Tag zwanzig Autos repariert.', meaning: 'En el taller se reparan veinte autos cada día.' },
      { text: 'Der Müll wird am Montag abgeholt.', meaning: 'La basura se retira el lunes.' },
      { text: 'Die Rechnung wird per E-Mail geschickt.', meaning: 'La factura se envía por correo electrónico.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das Paket ＿ morgen geliefert.', options: ['wird', 'werden', 'ist', 'hat'], answer: 'wird' },
      { type: 'choice', prompt: 'Die Fenster ＿ jede Woche geputzt.', options: ['werden', 'wird', 'sind', 'haben'], answer: 'werden' },
      { type: 'order', meaning: 'El auto es reparado por Otto.', answer: ['Das', 'Auto', 'wird', 'von', 'Otto', 'repariert'] },
      { type: 'meaning', text: 'Hier wird Deutsch gesprochen.', options: ['Aquí se habla alemán.', 'Aquí hablamos alemán.', 'Aquí se hablará alemán.', 'Aquí no se habla alemán.'], answer: 'Aquí se habla alemán.' },
    ],
  },
  {
    id: 'de-passiv-vergangenheit',
    level: 'B1',
    title: 'La pasiva en pasado',
    summary: 'wurde repariert · ist repariert worden.',
    pattern: 'Präteritum: wurde + participio · Perfekt: ist + participio + worden',
    explanation: [
      'Pasiva en **Präteritum**: **wurde** + participio: Das Haus **wurde** 1910 **gebaut**. Es la forma típica de las noticias y los textos.',
      'Pasiva en **Perfekt**: **sein** + participio + **worden** (no «geworden»): Das Auto **ist repariert worden**. Al hablar, muchos usan el Präteritum (wurde) porque es más corto.',
    ],
    examples: [
      { text: 'Der Unfall wurde sofort der Polizei gemeldet.', meaning: 'El accidente fue informado de inmediato a la policía.' },
      { text: 'Otto ist zum Chef der Werkstatt gewählt worden.', meaning: 'Otto fue elegido jefe del taller.' },
      { text: 'Die Brücke wurde letztes Jahr renoviert.', meaning: 'El puente fue renovado el año pasado.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das Rathaus ＿ im 19. Jahrhundert gebaut.', options: ['wurde', 'wird', 'würde', 'war'], answer: 'wurde' },
      { type: 'choice', prompt: 'Der Vertrag ist gestern unterschrieben ＿.', options: ['worden', 'geworden', 'wurde', 'werden'], answer: 'worden' },
      { type: 'choice', prompt: 'Die Briefe ＿ schon gestern geschickt.', options: ['wurden', 'wurde', 'werden', 'worden'], answer: 'wurden' },
      { type: 'meaning', text: 'Die Stelle wurde neu besetzt.', options: ['El puesto fue ocupado por otra persona.', 'El puesto está libre.', 'El puesto se va a ocupar.', 'El puesto fue eliminado.'], answer: 'El puesto fue ocupado por otra persona.' },
    ],
  },
  {
    id: 'de-passiv-modal',
    level: 'B1',
    title: 'Pasiva con modales',
    summary: 'Das Formular muss ausgefüllt werden.',
    pattern: 'modal + participio + werden (al final)',
    explanation: [
      'Con un modal, la pasiva termina en **participio + werden**: Das Formular **muss** bis Freitag **ausgefüllt werden** (el formulario tiene que llenarse antes del viernes). Hier **darf** nicht **geparkt werden**.',
      'En la subordinada, el modal va al final: …, weil das Auto heute noch repariert werden **muss**.',
    ],
    examples: [
      { text: 'Die Miete muss bis zum dritten des Monats überwiesen werden.', meaning: 'El arriendo tiene que transferirse antes del tercer día del mes.' },
      { text: 'Der Antrag kann auch online gestellt werden.', meaning: 'La solicitud también se puede hacer en línea.' },
      { text: 'In der Werkstatt dürfen keine Kinder mitgebracht werden.', meaning: 'En el taller no se pueden traer niños.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Der Müll muss getrennt ＿.', options: ['werden', 'wird', 'worden', 'wurde'], answer: 'werden' },
      { type: 'order', meaning: 'El formulario tiene que firmarse.', answer: ['Das', 'Formular', 'muss', 'unterschrieben', 'werden'] },
      { type: 'choice', prompt: 'Das Paket ＿ auch beim Nachbarn abgegeben werden.', hint: 'se puede', options: ['kann', 'wird', 'ist', 'hat'], answer: 'kann' },
      { type: 'meaning', text: 'Hier darf nicht geraucht werden.', options: ['Aquí no se puede fumar.', 'Aquí se fuma.', 'Aquí hay que fumar.', 'Aquí no se fumó.'], answer: 'Aquí no se puede fumar.' },
    ],
  },
  {
    id: 'de-relativ-1',
    level: 'B1',
    title: 'Oraciones de relativo (nominativo y acusativo)',
    summary: 'Der Kollege, der… · Das Auto, das ich repariere…',
    pattern: 'sustantivo, + der/die/das (según el papel en la relativa) + … + VERBO',
    explanation: [
      'La **oración de relativo** describe un sustantivo: Der Kollege, **der** neben mir arbeitet, kommt aus Polen. El pronombre relativo tiene el **género y número** del sustantivo, pero el **caso** según su papel **dentro** de la relativa. El verbo va al final.',
      'Nominativo: der, die, das, die (pl.). Acusativo: solo cambia el masculino: **den**. Das ist der Mann, **den** ich gestern getroffen habe.',
    ],
    examples: [
      { text: 'Das ist die Werkstatt, die Otto so gut gefällt.', meaning: 'Este es el taller que tanto le gusta a Otto.' },
      { text: 'Der Chef, den wir neu haben, ist sehr nett.', meaning: 'El jefe que tenemos nuevo es muy simpático.' },
      { text: 'Das Auto, das ich gekauft habe, war nicht teuer.', meaning: 'El auto que compré no era caro.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Der Mann, ＿ dort steht, ist mein Chef.', options: ['der', 'den', 'dem', 'das'], answer: 'der' },
      { type: 'choice', prompt: 'Die Wohnung, ＿ wir gesehen haben, ist zu teuer.', options: ['die', 'der', 'den', 'das'], answer: 'die' },
      { type: 'choice', prompt: 'Der Film, ＿ wir gestern gesehen haben, war gut.', options: ['den', 'der', 'dem', 'das'], answer: 'den' },
      { type: 'order', meaning: 'El libro que leo es interesante.', answer: ['Das', 'Buch', 'das', 'ich', 'lese', 'ist', 'interessant'] },
    ],
  },
  {
    id: 'de-relativ-2',
    level: 'B1',
    title: 'Relativo en dativo y con preposición',
    summary: 'Die Frau, der ich helfe… · Der Kollege, mit dem ich arbeite…',
    pattern: 'dativo: dem / der / dem / denen · preposición + relativo',
    explanation: [
      'En **dativo** los relativos son **dem** (m/n), **der** (f) y **denen** (plural): Die Kollegin, **der** ich geholfen habe… Die Leute, **denen** die Wohnung gehört…',
      'Si el verbo lleva preposición, la preposición va **delante** del relativo: Der Kollege, **mit dem** ich arbeite… Die Stadt, **in der** ich wohne… Das Thema, **über das** wir sprechen…',
    ],
    examples: [
      { text: 'Hans ist der Freund, dem ich alles erzähle.', meaning: 'Hans es el amigo al que le cuento todo.' },
      { text: 'Das ist die Firma, bei der Otto sich beworben hat.', meaning: 'Esa es la empresa a la que Otto postuló.' },
      { text: 'Die Nachbarn, denen ich geholfen habe, haben mich eingeladen.', meaning: 'Los vecinos a los que ayudé me invitaron.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Die Frau, ＿ ich die Blumen geschenkt habe, ist meine Nachbarin.', options: ['der', 'die', 'dem', 'denen'], answer: 'der' },
      { type: 'choice', prompt: 'Die Kinder, ＿ ich helfe, sind sehr nett.', options: ['denen', 'den', 'die', 'dem'], answer: 'denen' },
      { type: 'choice', prompt: 'Der Kollege, mit ＿ ich arbeite, kommt aus Polen.', options: ['dem', 'den', 'der', 'denen'], answer: 'dem' },
      { type: 'choice', prompt: 'Die Stadt, in ＿ ich wohne, ist sehr grün.', options: ['der', 'die', 'dem', 'das'], answer: 'der' },
    ],
  },
  {
    id: 'de-relativ-wo-was',
    level: 'B1',
    title: 'Relativos con wo y was',
    summary: 'Die Stadt, wo ich wohne · alles, was ich weiß.',
    pattern: 'lugar → wo · alles / etwas / nichts / das, was…',
    explanation: [
      'Para **lugares** se puede usar **wo**: Die Stadt, **wo** ich geboren bin… (= in der ich geboren bin).',
      'Después de **alles, etwas, nichts, vieles, das** y de un superlativo neutro se usa **was**: Das ist **alles, was** ich weiß. Es gibt **nichts, was** ich nicht esse. Das **Beste, was** mir passiert ist…',
    ],
    examples: [
      { text: 'Valparaíso ist die Stadt, wo Otto aufgewachsen ist.', meaning: 'Valparaíso es la ciudad donde creció Otto.' },
      { text: 'Alles, was du brauchst, findest du im Keller.', meaning: 'Todo lo que necesitas lo encuentras en el sótano.' },
      { text: 'Gibt es etwas, was ich für dich tun kann?', meaning: '¿Hay algo que pueda hacer por ti?' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Das ist alles, ＿ ich habe.', options: ['was', 'das', 'wo', 'der'], answer: 'was' },
      { type: 'choice', prompt: 'Berlin ist die Stadt, ＿ Otto jetzt lebt.', options: ['wo', 'was', 'wann', 'die'], answer: 'wo' },
      { type: 'choice', prompt: 'Es gibt nichts, ＿ Hans nicht reparieren kann.', options: ['was', 'das', 'wo', 'wer'], answer: 'was' },
      { type: 'meaning', text: 'Das ist das Beste, was ich je gegessen habe.', options: ['Es lo mejor que he comido jamás.', 'Esto es lo que comí ayer.', 'No me gustó lo que comí.', 'Es lo único que como.'], answer: 'Es lo mejor que he comido jamás.' },
    ],
  },
  {
    id: 'de-konj2-irreal',
    level: 'B1',
    title: 'Konjunktiv II: si tuviera…',
    summary: 'Wenn ich mehr Zeit hätte, würde ich…',
    pattern: 'Wenn + … + hätte/wäre/könnte, (dann) würde … + infinitivo',
    explanation: [
      'Para situaciones **irreales** o hipotéticas se usa el **Konjunktiv II**: **Wenn** ich mehr Geld **hätte**, **würde** ich ein Auto **kaufen**. Con haben, sein y los modales se usan sus formas propias (**hätte, wäre, könnte, müsste, dürfte**); con los demás verbos, **würde** + infinitivo.',
      'Algunos verbos fuertes frecuentes tienen forma propia en textos: käme, ginge, gäbe, wüsste. Al hablar, würde + infinitivo es lo más común.',
    ],
    examples: [
      { text: 'Wenn ich Zeit hätte, würde ich einen Tanzkurs machen.', meaning: 'Si tuviera tiempo, haría un curso de baile.' },
      { text: 'Wenn Otto in Chile wäre, würde er jetzt am Strand liegen.', meaning: 'Si Otto estuviera en Chile, ahora estaría en la playa.' },
      { text: 'An deiner Stelle würde ich das Angebot annehmen.', meaning: 'En tu lugar, aceptaría la oferta.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Wenn ich reich ＿, würde ich reisen.', options: ['wäre', 'war', 'bin', 'würde'], answer: 'wäre' },
      { type: 'choice', prompt: 'Wenn wir ein Auto ＿, könnten wir ans Meer fahren.', options: ['hätten', 'haben', 'hatten', 'würden'], answer: 'hätten' },
      { type: 'order', meaning: 'Si tuviera tiempo, te ayudaría.', answer: ['Wenn', 'ich', 'Zeit', 'hätte', 'würde', 'ich', 'dir', 'helfen'] },
      { type: 'meaning', text: 'Wenn es nicht regnen würde, könnten wir grillen.', options: ['Si no lloviera, podríamos hacer un asado.', 'Como llueve, hacemos un asado.', 'Aunque llueve, hacemos un asado.', 'Ayer no llovió y hicimos un asado.'], answer: 'Si no lloviera, podríamos hacer un asado.' },
    ],
  },
  {
    id: 'de-konj2-wunsch',
    level: 'B1',
    title: 'Deseos y el pasado irreal',
    summary: 'Wenn ich doch… · Ich hätte das gemacht.',
    pattern: 'Ich wünschte, … · Wenn … doch … · hätte / wäre + participio',
    explanation: [
      'Para **deseos** irreales: **Ich wünschte**, ich hätte mehr Zeit. **Wenn** ich **doch** besser Deutsch **sprechen könnte**! También con **gern**: Ich **würde gern** Medizin studieren.',
      'Para hablar de algo que **no pasó** en el pasado: **hätte / wäre + participio**: Wenn ich früher **aufgestanden wäre**, **hätte** ich den Bus nicht **verpasst** (si me hubiera levantado antes, no habría perdido el bus).',
    ],
    examples: [
      { text: 'Ich wünschte, meine Familie wäre hier.', meaning: 'Ojalá mi familia estuviera aquí.' },
      { text: 'Wenn ich das gewusst hätte, wäre ich nicht gekommen.', meaning: 'Si lo hubiera sabido, no habría venido.' },
      { text: 'Du hättest mich anrufen sollen!', meaning: '¡Me hubieras llamado!' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich wünschte, ich ＿ mehr Geld.', options: ['hätte', 'habe', 'hatte', 'würde'], answer: 'hätte' },
      { type: 'choice', prompt: 'Wenn ich das gewusst ＿, hätte ich dir geholfen.', options: ['hätte', 'wäre', 'habe', 'würde'], answer: 'hätte' },
      { type: 'choice', prompt: 'Wenn wir früher losgefahren ＿, wären wir pünktlich gewesen.', options: ['wären', 'hätten', 'sind', 'würden'], answer: 'wären' },
      { type: 'meaning', text: 'Ich hätte gern Medizin studiert.', options: ['Me habría gustado estudiar medicina.', 'Quiero estudiar medicina.', 'Estudié medicina.', 'Voy a estudiar medicina.'], answer: 'Me habría gustado estudiar medicina.' },
    ],
  },
]
