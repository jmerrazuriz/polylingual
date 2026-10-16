# Polylingual: plan de desarrollo

> **Polylingual** es una aplicación web para aprender idiomas. Su primer curso es **japonés: Hiragana y Katakana**.
>
> **Objetivo de la v1:** una aplicación **web** (se abre desde el navegador con una URL, sin instalar nada) para aprender a **reconocer (leer)** y **escribir** los 2 silabarios japoneses. Incluirá palabras de ejemplo, una tabla de consulta rápida, juegos de unir parejas y evaluación interactiva, y el progreso se sincronizará entre dispositivos.
> **Fuera de alcance en la v1:** evaluar la pronunciación del usuario (micrófono), instalación como app y publicación en tiendas.

---

## 1. Observaciones generales

| Tema | Decisión / observación |
|---|---|
| **Solo web** | Se entra con una URL (p. ej. `https://polylingual.web.app`, según disponibilidad) desde el navegador del teléfono, tablet o PC. No se instala. El diseño es **responsive**, pensado primero para el teléfono, y se adapta a pantallas grandes. |
| **Firebase** | **Auth** para el login, **Firestore** para el progreso y **Hosting** para publicar la web. El plan gratuito (Spark) alcanza de sobra. |
| **GitHub** | Guarda el código y despliega automáticamente con **GitHub Actions**: haces `git push` → se compila → se publica en Firebase Hosting. |
| **Mostrar pronunciación** | Romaji, una nota para hispanohablantes ("し = *shi*", "ふ entre *fu* y *ju*") y un botón de audio que usa la voz japonesa del navegador (Web Speech API, gratis). Si el dispositivo no tiene voz `ja-JP`, se oculta el botón. |
| **Evaluar la escritura** | Es la parte más difícil y la que más valor aporta. Ver sección 5. |
| **Consecuencias de no instalar** | Sin instalación no hay notificaciones push confiables (iPhone no las permite) ni uso sin conexión completo. Los recordatorios serán dentro de la app (racha y repasos pendientes al entrar). Se puede guardar en caché lo básico para que la página cargue rápido. |

---

## 2. Stack tecnológico

| Capa | Herramienta | Por qué |
|---|---|---|
| Lenguaje | **TypeScript** | Menos errores y autocompletado |
| Framework UI | **React + Vite** | Ecosistema grande y desarrollo rápido |
| Rutas | React Router | Secciones con URL propia (`/tabla`, `/juegos/parejas`…) |
| Estilos | Tailwind CSS | Diseño responsive rápido, modo oscuro sencillo |
| Animaciones | Framer Motion | Animaciones de los juegos y del feedback |
| Estado local | Zustand | Simple; guarda el progreso en el dispositivo y luego sincroniza |
| Backend | **Firebase** Auth + Firestore + Hosting | Cuenta multi-dispositivo sin servidor propio |
| Repetición espaciada | `ts-fsrs` (algoritmo FSRS) | El mismo tipo de algoritmo que usa Anki |
| Datos de trazos | **KanjiVG** (incluye kana) | Orden, dirección y forma de cada trazo |
| Tests | Vitest + Playwright | Lógica de evaluación y flujos principales |
| CI/CD | GitHub Actions | Publicación automática con cada push |

**Requisitos en tu PC:** Node.js LTS (**no está instalado** todavía), Git (ya instalado), VS Code, una cuenta de GitHub y una cuenta de Google para Firebase.

---

## 3. Secciones de la aplicación

```
Inicio (repasos de hoy, racha, progreso)
├─ Aprender       → lecciones por grupos + ficha de cada carácter
├─ Tabla rápida   → todos los caracteres de un vistazo
├─ Practicar
│   ├─ Lectura    → ejercicios de reconocimiento
│   └─ Escritura  → dibujar con el dedo / mouse
├─ Juegos
│   ├─ Parejas de caracteres  (kana ↔ romaji)
│   └─ Parejas de palabras    (palabra ↔ romaji / significado)
├─ Progreso       → estadísticas, logros
└─ Perfil         → cuenta, ajustes, créditos
```

---

## 4. Funcionalidades de la v1

### 4.1 Aprender (lecciones)
- **Desbloqueo progresivo** por grupos: vocales → K → S → T → N → H → M → Y → R → W/N → dakuten → combinados. Cada grupo se desbloquea al dominar el anterior (con opción de desbloquear todo manualmente).
- **Test de nivel inicial** opcional, para quien ya conoce parte del hiragana.
- Ficha de cada carácter:
  - Animación del **orden de trazos**, paso a paso, con número y flecha de dirección.
  - Romaji, nota de pronunciación en español y botón de audio.
  - **Mnemotecnia visual** en español (p. ej. "く parece un pico abierto: *ku*").
  - 2 a 4 **palabras de ejemplo** que solo usan caracteres ya aprendidos.
  - Su pareja en el otro silabario (か ↔ カ) y los caracteres con los que suele confundirse.
- Contenido: básicos (46), dakuten/handakuten (25), combinados/yōon (33) y, en katakana, los extendidos (ファ, ティ, ヴ…).
- **Notas para hispanohablantes**: la r japonesa (entre r y l), vocales largas (おばさん "tía" vs おばあさん "abuela"), consonante doble con っ, ん antes de b/p/m y el alargamiento ー en katakana.

### 4.2 Tabla rápida (consulta / recordatorio) ⭐ nuevo
Una sección siempre a mano para repasar de un vistazo.
- Cuadrícula **gojūon** clásica: filas por consonante (∅, K, S, T, N, H, M, Y, R, W, N) y columnas por vocal (a, i, u, e, o).
- **Pestañas:** Básicos · Dakuten/Handakuten · Combinados · Extendidos (katakana).
- **Selector:** Hiragana / Katakana / Ambos (lado a lado: か カ).
- **Interruptor "ocultar romaji"** para autoevaluarse: tocas una celda para ver la respuesta.
- **Tocar una celda:** reproduce el audio y abre una ventana breve con el orden de trazos animado y un enlace a la ficha completa.
- **Colores según tu dominio** (si iniciaste sesión): gris = no visto, amarillo = aprendiendo, verde = dominado. Se puede filtrar por "solo los que me cuestan".
- Botón flotante para abrirla desde cualquier sección, **excepto durante una evaluación**. Ahí se ofrece como "pista", que cuenta como respuesta fallida para la repetición espaciada.
- **Versión imprimible:** estilos de impresión para sacar la tabla en una hoja A4 o guardarla en PDF desde el navegador.
- Funciona sin cuenta (es contenido estático).

### 4.3 Practicar lectura
- Kana → elegir el romaji (opción múltiple).
- Romaji → elegir el kana (opción múltiple).
- Kana → **escribir** el romaji (sin pistas).
- Palabra → escribir su lectura (`ねこ` → `neko`) y ver su significado.
- **Pares confusos:** シ/ツ, ソ/ン, ぬ/め, わ/ね/れ, る/ろ, さ/ち, は/ほ, ク/タ, ウ/ワ, ー/一.
- Modo contrarreloj opcional.
- Acepta las variantes de romanización (`shi/si`, `tsu/tu`, `fu/hu`, `ji/zi`).

### 4.4 Practicar escritura
- Lienzo con cuadrícula guía; se dibuja con el dedo, un lápiz o el mouse.
- Tres niveles de ayuda: **calcar** (silueta visible) → **guía** (solo el primer trazo) → **de memoria**.
- Corrección **trazo a trazo**: cantidad, orden, dirección y forma.
- Feedback inmediato: el trazo correcto se pinta de verde; si falla, se anima el trazo esperado.
- Escribir una palabra completa a partir de su romaji o su significado.
- Modo "practicar libre" sin evaluación.

### 4.5 Juegos de unir parejas ⭐ nuevo

**Juego 1: Parejas de caracteres (kana ↔ sonido)**
- Dos columnas desordenadas: a la izquierda los kana (か, し, つ…) y a la derecha cómo se escriben en romaji (ka, shi, tsu…).
- Se toca un elemento de cada lado (o se arrastra uno sobre otro). Si es correcto, ambos se pintan de verde, suena el audio y desaparecen. Si es incorrecto, se sacuden en rojo y se cuenta como error.
- Rondas de 5 a 8 parejas. Al terminar una columna entran nuevas, hasta completar el grupo elegido.
- **Variantes:**
  - Kana ↔ romaji (base).
  - Hiragana ↔ katakana (あ ↔ ア).
  - Audio ↔ kana: se toca 🔊 en la derecha en vez de ver el romaji.
  - **Memoria** (cartas boca abajo): voltear dos cartas y encontrar la pareja.
- Se elige qué grupos entran en el juego (solo vocales, filas K+S, todo el hiragana…), con todo lo desbloqueado como opción por defecto.
- Puntaje: tiempo + errores, **combo** por aciertos seguidos y récord personal por grupo.
- Los pares confusos aparecen juntos a propósito en los niveles altos.

**Juego 2: Parejas de palabras**
- Lo mismo, pero con palabras completas:
  - Palabra en kana ↔ romaji (`さかな` ↔ `sakana`).
  - Palabra en kana ↔ **significado en español** (`さかな` ↔ "pez").
  - Katakana ↔ palabra original (`カメラ` ↔ "cámara"), muy motivador porque muchas palabras se parecen al español o al inglés.
- Solo aparecen palabras cuyos caracteres ya están desbloqueados.
- Temas opcionales: animales, comida, colores, números, saludos, países…

**Cómo afectan al progreso:** los aciertos y errores en los juegos alimentan la repetición espaciada de **lectura**, con menos peso que un ejercicio formal. Así jugar suma, pero no reemplaza la práctica.

### 4.6 Repetición espaciada (SRS)
- Cada carácter y cada palabra tienen **dos tarjetas independientes: lectura y escritura**.
- El algoritmo FSRS decide qué repasar cada día. La pantalla de inicio muestra "Tienes 12 repasos hoy".
- Las sesiones de repaso mezclan ejercicios de lectura, de escritura y mini-juegos.

### 4.7 Motivación
- **Racha diaria** y **objetivo diario** configurable (p. ej. 10 minutos o 20 repasos).
- **Logros** simples: "Vocales dominadas", "Hiragana básico completo", "10 juegos sin errores", "Racha de 7 días".
- Récords en los juegos.

### 4.8 Cuenta y progreso
- **Dos formas de iniciar sesión:**
  - **Google**, con un solo toque.
  - **Correo y contraseña**, con verificación del correo y la opción "olvidé mi contraseña" (ambas vienen incluidas en Firebase Auth).
- **Modo invitado sin memoria:**
  - Se entra con "Probar sin cuenta" y se puede usar **toda la app**: tabla, lecciones, práctica y juegos.
  - Nada se guarda: ni en Firestore ni en el navegador. El progreso vive solo en la memoria de la pestaña y se pierde al recargar o cerrar.
  - Como no hay progreso guardado, todo el contenido queda desbloqueado y no hay repasos de hoy, racha, logros ni récords.
  - Un aviso discreto lo recuerda: "Estás como invitado: tu progreso no se guardará".
  - Al terminar una sesión o un juego se ofrece **"Crear cuenta y guardar esta sesión"**, para no perder lo recién hecho si decide registrarse.
- Panel de progreso (solo con cuenta): % dominado por silabario y por habilidad, caracteres más difíciles, historial de sesiones y calendario de racha.

### 4.9 Ajustes y accesibilidad
- **Modo oscuro** y tamaño de letra ajustable.
- Botones grandes y buen contraste. Correcto/incorrecto se indica con color **y** con ícono (✓/✗), para no depender solo del color.
- Audio activado/desactivado y velocidad de la voz.
- Interfaz en español (preparada para traducir a otros idiomas).

---

## 5. Cómo evaluar la escritura (decisión técnica clave)

**Enfoque: comparación de trazos con los datos de KanjiVG**, sin inteligencia artificial.

1. KanjiVG describe cada carácter como una lista ordenada de trazos (curvas SVG).
2. Mientras el usuario dibuja, cada trazo se captura como una lista de puntos (eventos *pointer*: sirven para dedo, lápiz y mouse).
3. Al terminar cada trazo:
   - Se **remuestrea** a N puntos (p. ej. 32) y se normalizan la posición y la escala respecto al cuadro.
   - Se compara con el trazo esperado: punto inicial, punto final, dirección y distancia de forma (distancia media entre puntos / *Fréchet*).
   - Si queda dentro de la tolerancia es correcto. Si no, se marca el error y se muestra la pista.
4. Cada carácter recibe una puntuación de 0 a 5 según los errores, y esa puntuación alimenta la repetición espaciada.

**Ventajas:** es instantáneo, funciona en el navegador sin servidor, valida el **orden de trazos** (un reconocedor con IA no lo hace) y da un feedback concreto.

**Referencia:** la librería *Hanzi Writer* hace esto mismo para el chino. En la fase 4 se decide si conviene adaptarla con datos de kana o escribir un comparador propio (~300 líneas).

**Riesgo:** ajustar las tolerancias. Algunos kana tienen trazos que la gente suele unir (き, さ, ふ, や), así que habrá excepciones por carácter y pruebas con escritura real en el teléfono.

**Licencia:** KanjiVG es CC BY-SA 3.0, por lo que hay que darle atribución en la pantalla "Créditos".

---

## 6. Modelo de datos

### Contenido estático (va dentro de la web, NO en Firestore)
Así carga rápido y no gasta lecturas de Firestore.

```
src/content/
  kana.json        // id, char, romaji, variantes, script, grupo, fila, columna,
                   // notaES, mnemotecnia, confusiones[], trazos (de KanjiVG)
  words.json       // id, kana, romaji, significadoES, origen (para katakana),
                   // tema, kanaRequeridos[], nivel
  lessons.json     // orden de enseñanza y grupos desbloqueables
  achievements.json
```

- `fila` y `columna` permiten dibujar la **tabla rápida** directamente desde los datos.
- `kanaRequeridos` permite filtrar las palabras disponibles para cada usuario en los **juegos de palabras**.
- Palabras: una lista curada de ~200 a 300 palabras comunes (≈100 en hiragana y ≈100 a 200 en katakana), agrupadas por tema. Se puede apoyar en JMdict (licencia EDRDG, requiere atribución).

### Datos del usuario (Firestore)
```
users/{uid}
  displayName, createdAt
  settings   { tema, tamañoLetra, audio, velocidadVoz, objetivoDiario }
  streak     { actual, maxima, ultimoDia }
  unlocked   [ "hira_vocales", "hira_k", ... ]
  achievements [ "vocales_dominadas", ... ]

users/{uid}/cards/{itemId_skill}       // "hira_ka_write", "word_neko_read"
  due, stability, difficulty, reps, lapses, lastReview, state

users/{uid}/games/{gameId_grupo}       // "pairs-kana_hira_k"
  bestScore, bestTimeSec, plays

users/{uid}/sessions/{sessionId}       // historial para estadísticas
  date, mode, correct, total, durationSec
```

- **Reglas de seguridad** (imprescindibles): cada usuario solo puede leer y escribir bajo `users/{su_uid}`.
- **Invitados:** usan el mismo store (Zustand), pero **sin persistencia ni sincronización**. Todo el código de progreso pasa por una capa `progressRepository` con dos implementaciones, `FirestoreRepository` y `MemoryRepository`, de modo que las pantallas no distinguen entre ambos modos.
- **Sincronización:** el progreso se guarda primero en el dispositivo (caché de Firestore) y las escrituras se envían **en lote al terminar cada sesión o juego**, no con cada respuesta. Así se respeta el límite gratuito de 20.000 escrituras al día.

---

## 7. Estructura del proyecto

```
app_idiomas/
├─ .github/workflows/deploy.yml   # build + test + deploy a Firebase Hosting
├─ public/                         # favicon, imágenes
├─ scripts/                        # conversión de KanjiVG → kana.json
├─ src/
│  ├─ content/                     # JSON de kana, palabras, lecciones y logros
│  ├─ features/
│  │  ├─ home/                     # inicio: repasos de hoy, racha
│  │  ├─ learn/                    # lecciones y ficha de carácter
│  │  ├─ chart/                    # tabla rápida (+ estilos de impresión)
│  │  ├─ practice-reading/         # ejercicios de lectura
│  │  ├─ practice-writing/         # lienzo + evaluador de trazos
│  │  ├─ games/
│  │  │  ├─ pairs/                 # motor genérico de "unir parejas"
│  │  │  ├─ pairs-kana/            # configuración: kana ↔ romaji/audio/katakana
│  │  │  ├─ pairs-words/           # configuración: palabra ↔ romaji/significado
│  │  │  └─ memory/                # cartas boca abajo
│  │  ├─ progress/                 # estadísticas y logros
│  │  └─ auth/                     # login y perfil
│  ├─ lib/
│  │  ├─ strokes/                  # remuestreo, normalización, comparación
│  │  ├─ srs/                      # wrapper de ts-fsrs
│  │  ├─ audio/                    # Web Speech API
│  │  └─ firebase/                 # init, auth, sync
│  ├─ components/                  # UI reutilizable (StrokeAnimation, KanaCell…)
│  └─ App.tsx
├─ firestore.rules
├─ firebase.json
└─ PLAN.md
```

> El juego de parejas se programa **una sola vez** como motor genérico que recibe una lista de pares `{izquierda, derecha}`. Los juegos de caracteres y de palabras solo cambian los datos que le entregan, y así cualquier variante nueva (p. ej. kanji ↔ significado en el futuro) sale casi gratis.

---

## 8. Hoja de ruta por fases

| Fase | Entregable | Hecho cuando… |
|---|---|---|
| **0. Preparación** | Node.js, repo en GitHub, proyecto Vite+React+TS+Tailwind, proyecto Firebase y primer deploy automático | La página de bienvenida se ve en `https://<proyecto>.web.app` desde el teléfono |
| **1. Contenido hiragana + tabla rápida** | Script KanjiVG → JSON, `kana.json` (hiragana), palabras en hiragana y la **tabla rápida** | Se consulta todo el hiragana en la tabla, con audio y trazos animados |
| **2. Aprender** | Lecciones por grupos, ficha de carácter, mnemotecnias y palabras de ejemplo | Se puede recorrer la lección de vocales completa |
| **3. Lectura + juego de parejas de caracteres** | Ejercicios de lectura, pares confusos y **Juego 1** (kana ↔ romaji, audio ↔ kana, memoria) | Una sesión de 10 preguntas y una partida de parejas funcionan de punta a punta |
| **4. Escritura** | Lienzo, evaluador trazo a trazo y 3 niveles de ayuda | あ, き, さ y ふ escritos con el dedo se evalúan bien; los tests del comparador pasan |
| **5. Cuentas y modo invitado** | Login con Google y con correo/contraseña, modo invitado sin memoria, Firestore y reglas de seguridad | El progreso hecho en el teléfono aparece en el PC, y el invitado pierde todo al recargar |
| **6. SRS + juego de palabras** | FSRS, "repasos de hoy", **Juego 2** (palabras) y desbloqueo progresivo | La app decide qué repasar y los juegos usan solo lo aprendido |
| **7. Katakana** | Datos de katakana (básicos, dakuten, combinados, extendidos), palabras en katakana, selector Hiragana/Katakana/Ambos en la tabla y variante de juego hiragana ↔ katakana | Todo lo anterior funciona igual con katakana. En esta fase se agregan sobre todo datos, no código nuevo |
| **8. Motivación y pulido** | Racha, objetivo diario, logros, panel de progreso, test de nivel, modo oscuro, accesibilidad e impresión de la tabla | Recorrido completo probado en Android, iPhone y PC |

**Avance:**
- ✅ Fase 0 lista: proyecto base, Firebase y publicación automática.
- ✅ Fase 1 lista: 104 hiragana con trazos de KanjiVG, 150 palabras y la tabla rápida con ficha, audio y animación. Quedan pendientes los colores por dominio (fase 5) y la versión imprimible (fase 8).
- ✅ Fase 2 lista: 19 lecciones (10 básicas, 5 de dakuten, 4 de combinados). Cada una tiene introducción, ficha por carácter con mnemotecnia, palabras que ya se pueden leer y un repaso final. El avance vive solo en memoria hasta la fase 5. El desbloqueo progresivo y el test de nivel siguen en las fases 6 y 8.
- ✅ Fase 3 lista: práctica de lectura con 4 tipos de ejercicio (kana → romaji, romaji → kana, escribir romaji y leer palabras), variantes de romanización aceptadas, contrarreloj y resultados con errores. 13 grupos de pares confusos con su clave. Juegos de parejas (romaji, audio) y memoria, con combos y récords. Los récords viven en memoria hasta la fase 5; que los pares confusos aparezcan juntos en los juegos queda para más adelante.
- ✅ Fase 4 lista: lienzo de escritura (dedo, lápiz o mouse) con corrección trazo a trazo según KanjiVG: forma, posición, dirección, orden, cerrado/abierto (゜ vs ゛) y dos trazos unidos aceptados. Niveles calcar, guía y de memoria, más modo libre. Pista automática tras 2 errores; pedir pista cuenta como error. Se puede escribir caracteres sueltos o palabras completas, con puntuación de 1 a 5 ★. Hay 22 tests del comparador, incluidos todos los hiragana y los pares confusos. Falta ajustar las tolerancias con escritura real en el teléfono.
- ✅ Fase 5 lista:
  - **Acceso:** login con Google o con correo y contraseña (verificación de correo, reenviar, «olvidé mi contraseña»).
  - **Invitado:** cualquiera sin sesión es invitado sin memoria, con un aviso discreto y «Crear cuenta y guardar esta sesión» en cada pantalla de resultados. Al cerrar sesión se vuelve a ser invitado.
  - **Datos:** el progreso (lecciones, récords y estadísticas de lectura y escritura por carácter) vive en un solo documento `users/{uid}`. Se guarda agrupado 2 s después del último cambio, se actualiza en vivo entre dispositivos y al entrar se une con lo hecho como invitado.
  - **Reglas de Firestore:** solo el dueño con correo verificado, con el formato del documento validado.
  - **Tabla:** se colorea por dominio de lectura (80 % de aciertos con al menos 5 respuestas).
  - **Cambio respecto del modelo de datos de la sección 6:** un solo documento por usuario en vez de subcolecciones. Cuesta 1 lectura al entrar, y las tarjetas del SRS (fase 6) caben en el mismo documento.
- ✅ Fase 6 lista:
  - **Repetición espaciada:** FSRS (`ts-fsrs`) con dos tarjetas por carácter, lectura y escritura. Completar una lección agrega sus caracteres. Los ejercicios y repasos reprograman las tarjetas: acierto = Good, error = Again; en escritura, 4–5 ★ = Good, 3 = Hard y 1–2 = Again. Los juegos solo suman a las estadísticas.
  - **Repasos:** el inicio muestra los pendientes, o el próximo repaso y la siguiente lección. `/repasar` hace hasta 20 tarjetas: primero lectura y después escritura de memoria.
  - **Desbloqueo progresivo:** cada lección se abre al completar la anterior, con la opción «desbloquear todas». Los invitados tienen todo abierto. Los selectores de práctica y juegos solo ofrecen lo desbloqueado.
  - **Juego 2:** parejas de palabras con su lectura o con su significado (12 palabras por partida, al azar entre las que se pueden leer). El motor de parejas ahora es genérico.
  - **Pendiente:** tarjetas SRS para palabras (por ahora solo caracteres), temas de palabras en los juegos y que los pares confusos aparezcan juntos en los juegos.
- ✅ Fase 7 lista:
  - **Caracteres:** 123 katakana (46 básicos, 25 dakuten, 33 combinados y 19 extendidos como ファ, ティ, ウィ, ヴ…) con trazos de KanjiVG, incluidos los pequeños y ー.
  - **Ayudas:** mnemotecnias propias para los 46 básicos; las notas de pronunciación se comparten con el hiragana.
  - **Lecciones:** 22 lecciones de katakana, que se abren al completar los básicos del hiragana.
  - **Palabras:** 98 palabras en katakana (comida, casa, ropa, lugares, ocio y países).
  - **Romaji:** ー alarga la vocal y se aceptan «koohii», «kohi» y «kōhī».
  - **Pares confusos:** 10 grupos de katakana (シ/ツ, ソ/ン…).
  - **Tabla:** selector Hiragana / Katakana / Ambos y pestaña de extendidos. La ficha muestra la pareja en el otro silabario.
  - **Juego:** hiragana ↔ katakana.
- ✅ Fase 8 lista:
  - **Motivación:** racha diaria (con mejor racha), objetivo diario de 10, 20 o 40 respuestas, 15 logros con aviso al obtenerlos y panel `/progreso` (calendario de 12 semanas, estadísticas por silabario, los caracteres que más cuestan y logros).
  - **Test de nivel:** en `/test-de-nivel`, por silabario, marca como completadas las lecciones que ya se dominan.
  - **Ajustes** (también para invitados): tema claro, oscuro o del sistema; letra grande; audio y velocidad de la voz.
  - **Accesibilidad:** enlace «Saltar al contenido», foco visible, `lang="ja"` en los kana y avisos con `aria-live`.
  - **Impresión:** la tabla imprime todos los grupos del silabario elegido en A4.

**Las 8 fases de la v1 están completas.**

### v2: lección del día, repasos, gramática y cursos
- ✅ **Cursos (multi-idioma):**
  - Registro en `src/courses/index.ts` con japonés disponible e italiano, alemán y francés como «Próximamente».
  - Selector en `/cursos` y la bandera del curso en la cabecera.
  - Cada curso declara sus secciones. El contenido japonés vive en `src/courses/ja/` y los tipos de gramática (`src/courses/grammar.ts`) sirven para cualquier idioma.
- ✅ **Progreso por curso:**
  - Firestore guarda `{ settings, activity, achievements, course, courses: { ja: … } }`. La racha y los ajustes son globales; las lecciones, tarjetas y estadísticas van por curso.
  - Se lee el formato anterior, así que lo guardado antes queda como progreso de japonés.
- ✅ **Lección del día (`/hoy`):** se arma una vez por día con repasos vencidos (hasta 8) o puntos débiles, algo nuevo (la siguiente lección), la siguiente gramática y un mini juego. Es la tarjeta principal del inicio, avisa al completarla y tiene 2 logros nuevos.
- ✅ **Lecciones de repaso:**
  - **Por unidad:** al final de cada bloque de lecciones; mezcla lectura, palabras y escritura, y se aprueba con 80 %.
  - **De puntos débiles (`/repaso/debiles`):** lo que más se falla al leer o escribir.
- ✅ **Gramática (`/gramatica`, pestaña en Aprender):**
  - 11 lecciones en kana: です, は, か, の, これ/それ/あれ, も, を + ます, に/へ, で, adjetivos い/な y あります/います.
  - Cada una tiene explicación, ejemplos con romaji y audio, y ejercicios de completar, significado y ordenar palabras.
  - Se abre tras los básicos del hiragana.
- ✅ **Recorrido (portada de Aprender):** 14 unidades en orden recomendado que mezclan kana, gramática, contadores y kanji. Son 46 paradas de 1 a 3 lecciones, cada unidad de kana cierra con su repaso, y la parada actual se marca con «¡Sigue aquí!». Al tocar una parada se ven sus lecciones para empezar o repetir. La lección del día toma de aquí la siguiente lección.
- ✅ **Lecciones ilimitadas:**
  - **Lección extra (`/extra`):** se arma al azar con todo lo aprendido (kana, palabras, gramática, contadores y kanji) y se puede pedir otra sin fin.
  - Cualquier lección completada se puede repetir.
- ✅ **Números y contadores (`/contadores`):**
  - 9 lecciones: números del 1 al 10 y grandes, つ, 人, 本, 枚, 匹, 個, 冊, 台, 杯, 時, 分, 月, 日, 歳, 回 y 円.
  - Cada contador explica para qué se usa y muestra su tabla del 1 al 10 con las lecturas especiales en rojo, ejemplos con audio y ejercicios (lectura, qué contador usar, significado).
  - Un test revisa que cada lectura regular sea número + contador y que las especiales estén marcadas.
  - Se abre al terminar el hiragana.
- ✅ **Kanji (`/kanji`):**
  - 106 kanji del nivel N5 en 20 lecciones (números, tiempo, personas, naturaleza y lugares, adjetivos, verbos, cuerpo, cosas, ciudad y trabajo), con trazos de KanjiVG.
  - Cada kanji tiene significado, lecturas on y kun con romaji, 2 palabras de ejemplo, ejercicios de significado y lectura, y escritura calcando.
  - Se abre al terminar los básicos del katakana.
- ✅ **Repasos SRS de kanji:**
  - Completar una lección de kanji crea tarjetas de lectura y de escritura para sus kanji.
  - En `/repasar`, la lección del día y el repaso de puntos débiles, la lectura se pregunta como significado o lectura de una palabra de ejemplo, y la escritura se pide a partir del significado.
  - La sesión mixta ahora tiene tres fases: lectura de kana, ejercicios y escritura.
  - Quien ya había completado lecciones de kanji recibe sus tarjetas automáticamente al abrir la app.
  - El panel de progreso muestra los kanji (lecciones, dominados y en repaso) y los incluye en «los que más te cuestan».
  - **Pendiente:** nivel N4.
### Etapa A: completar el N5 (ver ANALISIS_N3.md)
- ✅ **Entrada en kana (`src/lib/kanaInput.ts`, `KanaInput`):**
  - Se escribe en romaji y se convierte en hiragana al escribir, como un teclado japonés (nn/n' = ん, consonante doble = っ, «-» = ー). También acepta el teclado japonés.
  - Al corregir, hiragana y katakana dan igual, y ー también vale escrito como vocal.
- ✅ **Motor de conjugación (`src/lib/conjugation.ts`):**
  - Verbos de los grupos 1 y 2 e irregulares (する, くる y compuestos), en 18 formas: las N5 (ます, ません, ました, ませんでした, ましょう, ない, た, なかった, て, たい) y las N4 (potencial, volitiva, imperativa, ば, たら, pasiva, causativa).
  - Adjetivos い (incluido いい → よかった) y な.
  - Excepciones cubiertas: いく → いって, ある → ない.
- ✅ **Vocabulario N5 (`src/courses/ja/vocab.ts`):**
  - 903 palabras, juntando las 250 de antes con el vocabulario N5, cada una con clase gramatical y grupo en los verbos. Son 141 verbos, 65 adjetivos い y 33 な.
  - Se reparten en 86 lecciones en hiragana (se abren tras los combinados) y 11 en katakana (se abren tras los extendidos). Los temas van intercalados.
  - Pestaña **Vocabulario** (`/vocabulario`) con fichas de 5 palabras (audio, romaji, clase, forma ます).
- ✅ **SRS de palabras:**
  - Cada palabra tiene tarjetas `w-<id>`: leer (reconocer el significado o elegir la palabra) y escribir (escribirla en kana).
  - Entran a `/repasar`, la lección del día, los puntos débiles y la lección extra.
- ✅ **Práctica de conjugación (`/conjugacion`):** se eligen las formas (N5 y N4) y los tipos de palabra, y se escribe cada forma en kana. Al corregir se explica la regla aplicada. Por defecto usa solo las palabras de las lecciones ya hechas.
- ✅ **Gramática N5 completa:**
  - 27 lecciones nuevas, 38 en total: ここ/そこ, ね/よ, grupos de verbos, が, と/や, に (tiempo), から/まで, ましょう, たい/ほしい, forma て, てください, ています, てもいい/てはいけません, forma ない, forma た y たことがある, habla informal, adjetivos en pasado y con くて/で, なる, comparaciones, から (porque)/が (pero), なにか/なにも, 〜にいく, まえに/てから/あとで, もう/まだ, でしょう y のがすき.
  - Nuevo tipo de ejercicio **«type»**: escribir la respuesta. En japonés se escribe en kana.
- ✅ **Recorrido:** 27 unidades y 95 paradas. Las unidades de vocabulario y de gramática IV–VII se intercalan con kana, contadores y kanji. La lección del día también puede proponer vocabulario.
- ✅ **Test de nivelación del recorrido (`/nivelacion`):**
  - Quien no ha empezado el recorrido ve, al comienzo de Aprender, la opción de hacer el test o empezar de cero.
  - Son 8 bloques de 8 preguntas, de dificultad creciente (hiragana → final del N5), que mezclan kana, vocabulario, gramática, contadores y kanji. Se puede responder «No lo sé».
  - Cada bloque aprobado con 80 % completa sus unidades del recorrido. El test termina en el primer bloque no aprobado, o cuando la persona decide parar entre bloques.
  - También está en el **perfil**, para quien vuelve después de un tiempo: empieza en el primer bloque que le falta y solo agrega progreso.
  - Lo desbloqueado entra a los repasos como «ya sabido»: el primer repaso se reparte en los próximos días, sin juntarse todo hoy.
- **Pendiente para cerrar la etapa A:** 20 lecturas cortas, 20 diálogos con preguntas y un simulacro N5.
- **Riesgo:** todas las tarjetas viven en un solo documento de Firestore (máximo 1 MB). Con ~900 palabras van unas 2.600 tarjetas, lo que todavía cabe. Antes de la etapa B (~1.500 palabras) hay que pasar las tarjetas a una subcolección o compactarlas.
- **Para agregar un idioma:** crear `src/courses/<id>/` con su contenido, registrar la gramática en `src/courses/content.ts`, cambiar su `status` a `available` y darle sus secciones. Las lecciones de vocabulario para idiomas sin silabario propio son lo siguiente a diseñar. Quedan como ideas para después (sección 9): tarjetas SRS de palabras, temas de palabras en los juegos, pares confusos juntos en los juegos, kanji, frases con furigana y evaluación de pronunciación.

**Hiragana primero:** las fases 1 a 6 se construyen solo con hiragana. El código se escribe desde el principio para cualquier silabario (el campo `script` en los datos), así que katakana entra en la fase 7 casi solo como contenido.

La fase 5 (cuentas) puede adelantarse si quieres probar entre dispositivos desde temprano.

---

## 9. Ideas para después de la v1
- Kanji: KanjiVG ya los incluye y el mismo evaluador de trazos sirve.
- Frases cortas con furigana.
- Ranking semanal entre amigos en los juegos.
- Evaluación de pronunciación con micrófono.
- Otros idiomas o alfabetos (hangul coreano, cirílico), reutilizando la tabla, los juegos y el SRS.

---

## 10. Riesgos y cómo mitigarlos

| Riesgo | Mitigación |
|---|---|
| El evaluador de escritura es demasiado estricto o permisivo | Tolerancias configurables por carácter, pruebas con varias personas y modo "practicar libre" |
| No hay voz japonesa en algunos navegadores o teléfonos | Detectar si existe la voz `ja-JP`; si no, ocultar el botón (o usar audios pregrabados más adelante) |
| Dibujar en el teléfono hace scroll o zoom en vez de trazar | Usar `touch-action: none` en el lienzo y probar temprano en Android e iPhone |
| Arrastrar en el juego de parejas es incómodo en pantallas chicas | Interacción principal por **toques** (tocar uno y luego el otro); el arrastre es opcional |
| Superar la cuota gratis de Firestore | Contenido estático en la web, escrituras en lote y solo los datos del usuario en Firestore |
| La configuración de Firebase queda visible en el código web | Es normal y no es secreta. La seguridad depende de las **reglas de Firestore** y de restringir la API key a tu dominio |
| Licencias de datos (KanjiVG, JMdict) | Pantalla de créditos con atribución y datos derivados bajo CC BY-SA |

---

## 11. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Plataforma | Solo web, sin instalación |
| Login | Google + correo/contraseña |
| Invitado | Modo invitado **sin memoria**: acceso completo, nada se guarda |
| Orden del contenido | Hiragana primero; katakana en la fase 7 |
| Nombre | **Polylingual** |

> El nombre encaja con la arquitectura multi-idioma: el japonés es el primer "curso" (`ja-kana`), y la tabla, los juegos y el SRS servirán para los idiomas siguientes.

---

## 12. Primeros pasos (fase 0)

1. Instalar **Node.js LTS** desde nodejs.org.
2. Crear un repositorio en GitHub llamado `polylingual`.
3. Crear un proyecto en la consola de Firebase llamado **Polylingual**. Si el ID `polylingual` ya está tomado, Firebase propone otro (p. ej. `polylingual-app`), y ese ID define la URL `https://<id>.web.app`.
4. En Firebase, activar Authentication con los proveedores **Google** y **Correo/contraseña**, además de Firestore y Hosting.
5. Con eso listo, inicializo el proyecto (Vite + React + TS + Tailwind), lo conecto a Firebase y dejo configurada la publicación automática desde GitHub.
