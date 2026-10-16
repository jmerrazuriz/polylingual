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
- ✅ Fase 1 lista: 104 hiragana con trazos de KanjiVG, 150 palabras y la tabla rápida con ficha, audio y animación. La ficha cubre parte de la fase 2. Quedan pendientes los colores por dominio (fase 5) y la versión imprimible (fase 8).

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
