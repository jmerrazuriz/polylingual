import type { GrammarLesson } from '../grammar.ts'

// Gramática B2 del alemán, segunda parte (lecciones 108–119): conectores avanzados,
// preposiciones formales, relativos especiales y orden de las palabras.

export const grammarB2b: GrammarLesson[] = [
  {
    id: 'de-falls-sofern',
    level: 'B2',
    title: 'Condiciones: falls, sofern, vorausgesetzt',
    summary: 'Falls du Hilfe brauchst… · sofern das möglich ist…',
    pattern: 'falls / sofern / vorausgesetzt, (dass) + … + VERBO · es sei denn',
    explanation: [
      '**falls** (en caso de que) y **sofern** (siempre que) son más formales que **wenn**: **Falls** der Termin nicht passt, rufen Sie uns an. Wir liefern morgen, **sofern** die Teile da sind. **vorausgesetzt, (dass)** = «a condición de que».',
      '**es sei denn** = «a menos que», sin subordinada: Wir fangen um acht an, **es sei denn**, es gibt Stau. También se puede empezar con el **verbo**: **Sollten** Sie Fragen haben, melden Sie sich (si tuviera preguntas…).',
    ],
    examples: [
      { text: 'Falls das Auto heute nicht fertig wird, bekommen Sie einen Ersatzwagen.', meaning: 'En caso de que el auto no esté listo hoy, recibirá un auto de reemplazo.' },
      { text: 'Ich komme mit, vorausgesetzt, dass ich früher Feierabend habe.', meaning: 'Voy, a condición de que salga antes del trabajo.' },
      { text: 'Sollten Sie Fragen haben, stehe ich Ihnen gern zur Verfügung.', meaning: 'Si tuviera preguntas, quedo a su disposición.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ es regnet, findet das Fest im Saal statt.', hint: 'en caso de que', options: ['Falls', 'Obwohl', 'Damit', 'Nachdem'], answer: 'Falls' },
      { type: 'choice', prompt: 'Wir fahren morgen los, es sei ＿, das Wetter ist schlecht.', options: ['denn', 'dass', 'wenn', 'falls'], answer: 'denn' },
      { type: 'choice', prompt: '＿ Sie Probleme haben, rufen Sie an.', hint: 'si tuviera…', options: ['Sollten', 'Sollen', 'Wenn', 'Damit'], answer: 'Sollten' },
      { type: 'meaning', text: 'Wir nehmen den Auftrag an, sofern der Preis stimmt.', options: ['Aceptamos el encargo siempre que el precio sea correcto.', 'Rechazamos el encargo por el precio.', 'El precio cambió después del encargo.', 'Aceptamos el encargo aunque el precio sea malo.'], answer: 'Aceptamos el encargo siempre que el precio sea correcto.' },
    ],
  },
  {
    id: 'de-indem',
    level: 'B2',
    title: 'Cómo: indem, dadurch dass',
    summary: 'Man spart Geld, indem man weniger Auto fährt.',
    pattern: '…, indem + … + VERBO · dadurch …, dass …',
    explanation: [
      '**indem** explica **cómo** se logra algo (el medio): Man lernt eine Sprache am besten, **indem** man viel **spricht** (hablando mucho). Responde a la pregunta **Wie?**',
      '**dadurch, dass** es parecido, pero subraya la causa: Otto hat viel gelernt, **dadurch, dass** er mit Kollegen gesprochen hat. Con sustantivo: **durch** + acusativo: **durch** viel Übung.',
    ],
    examples: [
      { text: 'Die Werkstatt spart Energie, indem sie Solarstrom nutzt.', meaning: 'El taller ahorra energía usando electricidad solar.' },
      { text: 'Otto hat sein Deutsch verbessert, indem er jeden Tag Nachrichten gehört hat.', meaning: 'Otto mejoró su alemán escuchando noticias cada día.' },
      { text: 'Durch regelmäßiges Training wird man fitter.', meaning: 'Con entrenamiento regular uno se pone en mejor forma.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Man kann Fehler vermeiden, ＿ man die Anleitung liest.', options: ['indem', 'damit', 'obwohl', 'sodass'], answer: 'indem' },
      { type: 'choice', prompt: 'Wie hast du so schnell Deutsch gelernt? – ＿ ich viel gelesen habe.', options: ['Indem', 'Damit', 'Weil dass', 'Ohne'], answer: 'Indem' },
      { type: 'choice', prompt: '＿ regelmäßige Pausen arbeitet man konzentrierter.', options: ['Durch', 'Indem', 'Mit dem', 'Damit'], answer: 'Durch' },
      { type: 'order', meaning: 'Ahorra dinero cocinando en casa.', answer: ['Er', 'spart', 'Geld', 'indem', 'er', 'zu', 'Hause', 'kocht'] },
    ],
  },
  {
    id: 'de-adversativ',
    level: 'B2',
    title: 'Contrastes: während, wohingegen, zumal',
    summary: 'Hans liebt Fußball, während Otto lieber schwimmt.',
    pattern: 'während / wohingegen (contraste) · zumal (sobre todo porque)',
    explanation: [
      '**während** también contrasta dos cosas (= «mientras que»): Hans liebt Fußball, **während** Otto lieber schwimmt. **wohingegen** es igual, pero más formal y solo contrastivo.',
      '**zumal** agrega una razón extra que refuerza lo dicho: Ich nehme die Stelle nicht, **zumal** sie schlecht bezahlt ist (sobre todo porque está mal pagada). **dagegen** e **hingegen** contrastan en la oración principal: Berlin ist groß, München **dagegen** ist teurer.',
    ],
    examples: [
      { text: 'In Berlin sind die Mieten gestiegen, während sie in kleinen Städten stabil geblieben sind.', meaning: 'En Berlín los arriendos subieron, mientras que en las ciudades pequeñas se mantuvieron estables.' },
      { text: 'Otto bleibt lieber zu Hause, zumal es draußen sehr kalt ist.', meaning: 'Otto prefiere quedarse en casa, sobre todo porque afuera hace mucho frío.' },
      { text: 'Die alte Werkstatt war klein. Die neue dagegen hat sechs Hebebühnen.', meaning: 'El taller antiguo era pequeño. El nuevo, en cambio, tiene seis elevadores.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich trinke Kaffee, ＿ mein Mann nur Tee trinkt.', hint: 'mientras que', options: ['während', 'zumal', 'obwohl', 'damit'], answer: 'während' },
      { type: 'choice', prompt: 'Wir sollten jetzt gehen, ＿ der letzte Bus bald fährt.', hint: 'sobre todo porque', options: ['zumal', 'während', 'wohingegen', 'falls'], answer: 'zumal' },
      { type: 'choice', prompt: 'Der Norden ist flach, der Süden ＿ ist bergig.', options: ['dagegen', 'zumal', 'indem', 'obwohl'], answer: 'dagegen' },
      { type: 'meaning', text: 'Er arbeitet viel, wohingegen sein Kollege oft Pause macht.', options: ['Él trabaja mucho, mientras que su colega hace pausas a menudo.', 'Él trabaja mucho porque su colega descansa.', 'Ambos trabajan mucho.', 'Él descansa mientras su colega trabaja.'], answer: 'Él trabaja mucho, mientras que su colega hace pausas a menudo.' },
    ],
  },
  {
    id: 'de-als-ob',
    level: 'B2',
    title: 'Como si: als ob, als wenn',
    summary: 'Er tut so, als ob er nichts wüsste.',
    pattern: 'als ob / als wenn + … + Konj. II al final · als + Konj. II directo',
    explanation: [
      '**als ob** y **als wenn** (como si) comparan con algo **irreal** y llevan **Konjunktiv II**: Er tut so, **als ob** er krank **wäre**. Es sieht so aus, **als wenn** es gleich regnen **würde**.',
      'Variante formal: **als** + verbo directamente: Er tut so, **als wäre** er krank. Para el pasado: als ob + **hätte/wäre + participio**: Sie sah aus, **als ob** sie nicht geschlafen **hätte**.',
    ],
    examples: [
      { text: 'Der Kunde tut so, als ob er die Rechnung nie bekommen hätte.', meaning: 'El cliente hace como si nunca hubiera recibido la factura.' },
      { text: 'Du siehst aus, als wärst du müde.', meaning: 'Pareces cansado (como si estuvieras cansado).' },
      { text: 'Es fühlt sich an, als wäre ich schon immer hier gewesen.', meaning: 'Se siente como si siempre hubiera estado aquí.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Er tut so, als ob er alles ＿.', hint: 'wissen', options: ['wüsste', 'weiß', 'wusste', 'wisse'], answer: 'wüsste' },
      { type: 'choice', prompt: 'Sie spricht Deutsch, als ＿ sie in Berlin geboren.', options: ['wäre', 'sei', 'ist', 'war'], answer: 'wäre' },
      { type: 'choice', prompt: 'Es sieht aus, als ob es gleich regnen ＿.', options: ['würde', 'wird', 'wurde', 'werde'], answer: 'würde' },
      { type: 'meaning', text: 'Er tut so, als hätte er mich nicht gesehen.', options: ['Hace como si no me hubiera visto.', 'No me vio.', 'Me vio y me saludó.', 'Va a hacer como que no me ve.'], answer: 'Hace como si no me hubiera visto.' },
    ],
  },
  {
    id: 'de-genitiv-praep-2',
    level: 'B2',
    title: 'Preposiciones formales con genitivo',
    summary: 'aufgrund, angesichts, infolge, bezüglich, mithilfe.',
    pattern: 'aufgrund · angesichts · infolge · bezüglich · hinsichtlich · mithilfe · anstelle + GENITIVO',
    explanation: [
      'En textos oficiales y noticias aparecen preposiciones con **genitivo**: **aufgrund** (debido a), **angesichts** (ante, en vista de), **infolge** (a consecuencia de), **bezüglich / hinsichtlich** (respecto a), **mithilfe** (con ayuda de), **anstelle** (en lugar de), **innerhalb / außerhalb** (dentro / fuera de).',
      'En correos formales: **Bezüglich Ihrer Anfrage** teile ich Ihnen mit… **Aufgrund der hohen Nachfrage** sind die Teile ausverkauft.',
    ],
    examples: [
      { text: 'Aufgrund eines technischen Problems fällt der Zug aus.', meaning: 'Debido a un problema técnico, el tren se cancela.' },
      { text: 'Angesichts der steigenden Kosten müssen wir die Preise erhöhen.', meaning: 'Ante el aumento de los costos, tenemos que subir los precios.' },
      { text: 'Bezüglich Ihrer Bewerbung möchten wir Sie zu einem Gespräch einladen.', meaning: 'Respecto a su postulación, quisiéramos invitarlo a una entrevista.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ des Streiks bleiben die Geschäfte geschlossen.', hint: 'debido a', options: ['Aufgrund', 'Bezüglich', 'Mithilfe', 'Anstelle'], answer: 'Aufgrund' },
      { type: 'choice', prompt: '＿ Ihrer Frage kann ich Ihnen Folgendes sagen.', hint: 'respecto a', options: ['Bezüglich', 'Infolge', 'Angesichts', 'Trotz'], answer: 'Bezüglich' },
      { type: 'choice', prompt: 'Die Reparatur gelang ＿ einer neuen Software.', hint: 'con ayuda de', options: ['mithilfe', 'infolge', 'aufgrund', 'angesichts'], answer: 'mithilfe' },
      { type: 'choice', prompt: '＿ des Unfalls kam es zu langen Staus.', hint: 'a consecuencia de', options: ['Infolge', 'Bezüglich', 'Anstelle', 'Innerhalb'], answer: 'Infolge' },
    ],
  },
  {
    id: 'de-praep-dativ-b2',
    level: 'B2',
    title: 'laut, gemäß, gegenüber, entsprechend',
    summary: 'Laut Vertrag… · Dem Chef gegenüber…',
    pattern: 'laut · gemäß · entsprechend · gegenüber · zufolge + DATIVO',
    explanation: [
      'Preposiciones formales con **dativo**: **laut** (según: **laut** Vertrag, **laut** dem Bericht), **gemäß** y **entsprechend** (conforme a), **gegenüber** (frente a, respecto a una persona) y **zufolge** (según, va **después**: dem Bericht **zufolge**).',
      '**gegenüber** con pronombre va detrás: **mir gegenüber** war er immer freundlich. Con lugares: Das Café liegt **gegenüber** dem Bahnhof / dem Bahnhof gegenüber.',
    ],
    examples: [
      { text: 'Laut Wetterbericht wird es morgen schneien.', meaning: 'Según el pronóstico, mañana va a nevar.' },
      { text: 'Gemäß Paragraf 5 ist die Miete im Voraus zu zahlen.', meaning: 'Conforme al artículo 5, el arriendo se paga por adelantado.' },
      { text: 'Den Kunden gegenüber muss man immer höflich sein.', meaning: 'Con los clientes hay que ser siempre cortés.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ Statistik sind die Preise gestiegen.', hint: 'según', options: ['Laut', 'Wegen', 'Trotz', 'Statt'], answer: 'Laut' },
      { type: 'choice', prompt: 'Dem Bericht ＿ gibt es zu wenig Fachkräfte.', options: ['zufolge', 'laut', 'gemäß', 'gegenüber'], answer: 'zufolge' },
      { type: 'choice', prompt: 'Die Apotheke liegt dem Rathaus ＿.', options: ['gegenüber', 'zufolge', 'entlang', 'gemäß'], answer: 'gegenüber' },
      { type: 'choice', prompt: '¿Qué caso lleva «laut»?', options: ['Dativo (o genitivo)', 'Solo acusativo', 'Nominativo', 'Ninguno'], answer: 'Dativo (o genitivo)' },
    ],
  },
  {
    id: 'de-relativ-wer',
    level: 'B2',
    title: 'Relativos generales: wer, was',
    summary: 'Wer viel arbeitet, braucht Pausen.',
    pattern: 'Wer …, (der) … · Was …, (das) …',
    explanation: [
      '**wer** = «quien» en general (cualquier persona): **Wer** pünktlich ist, bekommt einen Platz. Si el caso de la oración principal es otro, se agrega el demostrativo: **Wer** zu spät kommt, **den** bestraft das Leben. **Wem** das nicht gefällt, **der** kann gehen.',
      '**was** = «lo que»: **Was** du heute kannst besorgen, das verschiebe nicht auf morgen. **Was** mich stört, ist der Lärm.',
    ],
    examples: [
      { text: 'Wer Fragen hat, kann sich an die Rezeption wenden.', meaning: 'Quien tenga preguntas puede dirigirse a la recepción.' },
      { text: 'Was Otto an seiner Arbeit liebt, ist der Kontakt mit Kunden.', meaning: 'Lo que Otto ama de su trabajo es el contacto con los clientes.' },
      { text: 'Wem die Arbeit zu viel ist, der sollte mit dem Chef sprechen.', meaning: 'A quien el trabajo le resulte demasiado, debería hablar con el jefe.' },
    ],
    exercises: [
      { type: 'choice', prompt: '＿ Hunger hat, kann in die Kantine gehen.', options: ['Wer', 'Der', 'Was', 'Wen'], answer: 'Wer' },
      { type: 'choice', prompt: '＿ mich ärgert, ist die Unpünktlichkeit.', options: ['Was', 'Wer', 'Das', 'Wem'], answer: 'Was' },
      { type: 'choice', prompt: 'Wer zu spät kommt, ＿ wartet niemand.', hint: 'por ese (warten auf)', options: ['auf den', 'der', 'dem', 'wen'], answer: 'auf den' },
      { type: 'meaning', text: 'Wer A sagt, muss auch B sagen.', options: ['Quien empieza algo tiene que terminarlo.', 'Hay que aprender el alfabeto.', 'Quien habla mucho se equivoca.', 'A y B son iguales.'], answer: 'Quien empieza algo tiene que terminarlo.' },
    ],
  },
  {
    id: 'de-relativ-genitiv',
    level: 'B2',
    title: 'Relativo en genitivo: dessen, deren',
    summary: 'Der Kollege, dessen Auto kaputt ist…',
    pattern: 'masculino/neutro → dessen · femenino/plural → deren (+ sustantivo sin artículo)',
    explanation: [
      'Para «cuyo/cuya» se usa **dessen** (si el antecedente es masculino o neutro) y **deren** (femenino o plural): Der Kunde, **dessen** Auto wir reparieren… Die Firma, **deren** Chef ich kenne… Die Nachbarn, **deren** Kinder…',
      'El sustantivo que sigue va **sin artículo**: dessen Auto (no «dessen das Auto»). Si lleva adjetivo, toma la terminación fuerte: die Frau, **deren** neu**es** Auto…',
    ],
    examples: [
      { text: 'Das ist der Kunde, dessen Rechnung noch offen ist.', meaning: 'Ese es el cliente cuya factura todavía está pendiente.' },
      { text: 'Die Kollegin, deren Sohn in Chile studiert, spricht gut Spanisch.', meaning: 'La colega cuyo hijo estudia en Chile habla bien español.' },
      { text: 'Die Mieter, deren Wohnungen renoviert werden, bekommen eine Entschädigung.', meaning: 'Los arrendatarios cuyos departamentos se renuevan reciben una compensación.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Der Mann, ＿ Frau Ärztin ist, wohnt neben uns.', options: ['dessen', 'deren', 'dem', 'den'], answer: 'dessen' },
      { type: 'choice', prompt: 'Die Firma, ＿ Produkte wir verkaufen, kommt aus Japan.', options: ['deren', 'dessen', 'die', 'der'], answer: 'deren' },
      { type: 'choice', prompt: 'Das Kind, ＿ Mutter krank ist, bleibt bei uns.', options: ['dessen', 'deren', 'das', 'dem'], answer: 'dessen' },
      { type: 'choice', prompt: 'Die Studenten, ＿ Prüfung morgen ist, lernen viel.', options: ['deren', 'dessen', 'die', 'denen'], answer: 'deren' },
    ],
  },
  {
    id: 'de-es-korrelat',
    level: 'B2',
    title: 'darauf, dass… / es ist wichtig, dass…',
    summary: 'Ich freue mich darauf, dass du kommst.',
    pattern: 'da(r)- + preposición + , dass / zu … · es + , dass …',
    explanation: [
      'Si un verbo con preposición tiene una **oración** como complemento, se anticipa con **da(r)- + preposición**: Ich freue mich **darauf**, **dass** du kommst. Wir warten **darauf**, **dass** die Teile geliefert werden. Er besteht **darauf**, sofort bezahlt **zu** werden.',
      'Con verbos y expresiones sin preposición, se anticipa con **es**: **Es** ist wichtig, **dass** alle pünktlich sind. Ich finde **es** gut, **dass**… Si la subordinada va primero, **es** desaparece: Dass alle pünktlich sind, ist wichtig.',
    ],
    examples: [
      { text: 'Otto achtet darauf, dass alle Mitarbeiter Schutzbrillen tragen.', meaning: 'Otto se preocupa de que todos los trabajadores usen lentes de seguridad.' },
      { text: 'Ich habe nicht damit gerechnet, dass es so teuer wird.', meaning: 'No contaba con que fuera a ser tan caro.' },
      { text: 'Es ist nicht leicht, in München eine Wohnung zu finden.', meaning: 'No es fácil encontrar departamento en Múnich.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich freue mich ＿, dass ihr kommt.', options: ['darauf', 'dafür', 'davon', 'damit'], answer: 'darauf' },
      { type: 'choice', prompt: 'Er erinnert sich ＿, dass er hier schon war.', options: ['daran', 'darauf', 'dafür', 'darüber'], answer: 'daran' },
      { type: 'choice', prompt: '＿ ist wichtig, dass wir pünktlich sind.', options: ['Es', 'Das', 'Da', 'Dass'], answer: 'Es' },
      { type: 'choice', prompt: 'Wir haben uns ＿ beschwert, dass es so laut war.', options: ['darüber', 'darauf', 'daran', 'dafür'], answer: 'darüber' },
    ],
  },
  {
    id: 'de-satzstellung',
    level: 'B2',
    title: 'El orden en el medio de la oración',
    summary: 'TeKaMoLo y la posición de los pronombres.',
    pattern: 'pronombres primero · luego: Temporal – Kausal – Modal – Lokal',
    explanation: [
      'Entre el verbo conjugado y el final de la oración, los **pronombres** van primero (acusativo antes que dativo: Ich gebe **es ihm**). Después, los complementos suelen seguir el orden **TeKaMoLo**: **Te**mporal (wann?), **Ka**usal (warum?), **Mo**dal (wie?), **Lo**kal (wo?): Ich fahre **morgen wegen des Termins mit dem Zug nach München**.',
      'Sustantivos: el **dativo** suele ir antes que el **acusativo**: Ich gebe **dem Kunden die Rechnung**. Lo que se quiere destacar puede ir al principio de la oración (posición 1).',
    ],
    examples: [
      { text: 'Otto ist gestern wegen eines Notfalls mit dem Taxi zur Werkstatt gefahren.', meaning: 'Otto fue ayer en taxi al taller por una emergencia.' },
      { text: 'Ich habe es ihm schon erklärt.', meaning: 'Ya se lo expliqué.' },
      { text: 'Der Chef hat dem neuen Kollegen die Werkstatt gezeigt.', meaning: 'El jefe le mostró el taller al nuevo colega.' },
    ],
    exercises: [
      { type: 'order', meaning: 'Mañana voy en tren a Berlín.', answer: ['Ich', 'fahre', 'morgen', 'mit', 'dem', 'Zug', 'nach', 'Berlin'] },
      { type: 'order', meaning: 'Se lo doy (a él).', answer: ['Ich', 'gebe', 'es', 'ihm'] },
      { type: 'choice', prompt: '¿Qué orden es el habitual?', options: ['Wir treffen uns heute wegen des Projekts im Büro.', 'Wir treffen uns im Büro wegen des Projekts heute.', 'Wir treffen uns wegen des Projekts im Büro heute.', 'Wir treffen im Büro uns heute.'], answer: 'Wir treffen uns heute wegen des Projekts im Büro.' },
      { type: 'choice', prompt: 'Ich schicke ＿ morgen.', options: ['sie Ihnen', 'Ihnen sie', 'sie zu Ihnen', 'Ihnen es'], answer: 'sie Ihnen' },
    ],
  },
  {
    id: 'de-negation',
    level: 'B2',
    title: 'La negación en detalle',
    summary: 'nicht…sondern, keineswegs, nirgends, weder…noch.',
    pattern: 'nicht ante lo negado · nie / nirgends / niemand / keineswegs / gar nicht',
    explanation: [
      '**nicht** niega la oración entera (va al final o antes de la última parte: Ich habe ihn **nicht** gesehen) o una parte concreta (va justo antes: **Nicht** Otto, sondern Hans hat angerufen). Con **sondern** se corrige.',
      'Otras negaciones: **nie / niemals** (nunca), **nirgends / nirgendwo** (en ninguna parte), **niemand** (nadie), **nichts** (nada), **keineswegs / auf keinen Fall** (de ninguna manera), **gar nicht / überhaupt nicht** (para nada), **kaum** (casi no).',
    ],
    examples: [
      { text: 'Das Problem liegt nicht am Motor, sondern an der Elektronik.', meaning: 'El problema no está en el motor, sino en la electrónica.' },
      { text: 'Ich habe den Schlüssel nirgends gefunden.', meaning: 'No encontré la llave en ninguna parte.' },
      { text: 'Das ist keineswegs selbstverständlich.', meaning: 'Eso no es para nada evidente.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Ich habe ＿ Zeit noch Lust.', options: ['weder', 'nicht', 'kein', 'nie'], answer: 'weder' },
      { type: 'choice', prompt: 'Er war ＿ in Spanien – nicht ein einziges Mal.', hint: 'nunca', options: ['noch nie', 'nirgends', 'kaum', 'niemand'], answer: 'noch nie' },
      { type: 'choice', prompt: 'Das ist nicht mein Auto, ＿ das von Hans.', options: ['sondern', 'aber', 'oder', 'denn'], answer: 'sondern' },
      { type: 'choice', prompt: 'Ich konnte ＿ schlafen, es war so laut.', hint: 'casi no', options: ['kaum', 'nirgends', 'keineswegs', 'niemand'], answer: 'kaum' },
    ],
  },
  {
    id: 'de-je-nachdem',
    level: 'B2',
    title: 'je nachdem, ob / wie / wann',
    summary: 'Je nachdem, wie das Wetter ist, …',
    pattern: 'je nachdem, ob / W-Wort + … + VERBO',
    explanation: [
      '**je nachdem** = «según, dependiendo de»: **Je nachdem, wie** viel Zeit ich habe, komme ich mit oder nicht. **Je nachdem, ob** das Teil da ist, dauert die Reparatur ein oder zwei Tage.',
      'También como respuesta corta: Kommst du morgen? – **Je nachdem** (depende). La idea es parecida a **abhängen von**: Das **hängt davon ab**, ob…',
    ],
    examples: [
      { text: 'Je nachdem, wann die Teile kommen, ist das Auto Montag oder Dienstag fertig.', meaning: 'Según cuándo lleguen los repuestos, el auto estará listo el lunes o el martes.' },
      { text: 'Das hängt davon ab, wie viel es kostet.', meaning: 'Eso depende de cuánto cueste.' },
      { text: 'Fährst du mit dem Rad? – Je nachdem.', meaning: '¿Vas en bicicleta? – Depende.' },
    ],
    exercises: [
      { type: 'choice', prompt: 'Je nachdem, ＿ es regnet, gehen wir spazieren oder ins Kino.', options: ['ob', 'dass', 'wenn', 'falls'], answer: 'ob' },
      { type: 'choice', prompt: 'Das hängt ＿ ab, wie viel Zeit wir haben.', options: ['davon', 'darauf', 'daran', 'damit'], answer: 'davon' },
      { type: 'meaning', text: 'Je nachdem, wie es dir geht, kannst du morgen arbeiten.', options: ['Según cómo te sientas, puedes trabajar mañana.', 'Mañana tienes que trabajar.', 'No importa cómo te sientas.', 'Si trabajas mañana, te sentirás bien.'], answer: 'Según cómo te sientas, puedes trabajar mañana.' },
      { type: 'choice', prompt: 'Kommst du heute Abend? – ＿.', hint: 'depende', options: ['Je nachdem', 'Nachdem', 'Je desto', 'Trotzdem'], answer: 'Je nachdem' },
    ],
  },
]
