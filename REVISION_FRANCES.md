# Revisión externa del curso de francés (F7)

El curso *Le chemin de Camila* (A1 → C2) se escribió sin un hablante nativo. Esta guía prepara su revisión por un **hablante nativo de Francia** o un **profesor/a de FLE** que lea español (las explicaciones están en español).

## Material para la revisión

- **Página de revisión publicada** (https://claude.ai/artifact/6hAiwREpU1KquvFSUqCboD, privada: hay que compartirla con la persona que revisa desde el menú *Compartir*): muestra todo el contenido por nivel y sección, con buscador. En cada frase, palabra o ejercicio se puede **comentar** (si la persona tiene acceso a comentarios en claude.ai) o **anotar** (las notas quedan en su navegador y se copian todas con un botón para enviarlas por correo).
- `revision/vocabulario.csv`: las 7.766 palabras en una planilla (Excel o Google Sheets), con columnas para marcar «correcto», la corrección y un comentario.
- `revision/datos.json`: el mismo contenido en datos (lo usa la página).

Para regenerar ambos después de cambiar el curso (y volver a publicar la página `revision/revision-frances.html` con el nuevo `datos.json`):

```bash
npx tsx scripts/export-review.ts
```

## Alcance y orden

| Fase | Niveles | Contenido | Tiempo estimado |
|---|---|---|---|
| **1** | A1–B1 | 98 lecciones de gramática, 2.392 palabras, 48 textos | 12–16 h |
| 2 | B2–C1 | 70 lecciones, 3.315 palabras, 32 textos | 12–16 h |
| 3 | C2 | 30 lecciones, 2.059 palabras, 16 textos | 6–8 h |

Se empieza por la **fase 1**: es lo que más estudiantes van a ver y donde un error se aprende para siempre.

## Qué revisar, por prioridad

1. **Errores de francés** (lo más importante):
   - ortografía y acentos;
   - género, artículo, elisión y h aspirada (*le héros*, *l’hôpital*);
   - plurales irregulares y femeninos;
   - concordancias y conjugaciones;
   - tipografía francesa: espacio antes de `: ; ! ?` y dentro de `« »`.
2. **Ejercicios**:
   - hay una sola respuesta correcta;
   - las opciones incorrectas son realmente incorrectas (y no solo menos frecuentes);
   - la explicación y el «por qué no» de cada opción son exactos.
3. **Naturalidad y registro**: ¿un francés lo diría así? ¿El registro (familiar, corriente, culto) es el adecuado para la situación? Base: francés de Francia.
4. **Traducciones al español**: que el sentido sea exacto. El español es **chileno a propósito** (*pega, polola, cachar, auto, celular*): no hay que corregirlo hacia el español de España.
5. **Contenido cultural y de examen**: trámites (prefectura, *titre de séjour*, *carte Vitale*), formato y duración de las pruebas DELF/DALF, datos sobre Francia.

**No hace falta revisar** el diseño de la app ni el estilo del español.

## Zonas de riesgo conocidas

Donde más probablemente hay errores:
- **Expresiones idiomáticas, refranes y colocaciones** (B2–C2): ¿siguen en uso? ¿El significado es exacto?
- **Variedades** (C1–C2): Quebec, Bélgica, Suiza, África, argot y verlan.
- **Ejercicios con matices**: subjuntivo frente a indicativo (*après que*, *le fait que*), *ne* expletivo, concordancia del participio, adjetivo verbal frente a participio presente.
- **Textos largos** de B2–C2: naturalidad y coherencia de registro.
- **Explicaciones gramaticales**: algunas simplifican a propósito; señalar solo lo que sea falso o engañoso.

## Cómo reportar

Cada elemento tiene un **ID** (por ejemplo `fr-etre`, `fr-etre · ejercicio 3`, `fw-école`, `ft-a1-arrivee · línea 4`). Cada observación lleva:

- el **ID**;
- el **problema** en una frase;
- la **corrección propuesta**;
- la **gravedad**:
  - **Error**: está mal y enseña algo falso;
  - **Mejora**: es correcto pero poco natural o mejorable;
  - **Duda**: no está seguro/a, pero le llama la atención.

Formas de enviarlo:
- **en la página**, con «Comentar»; Claude puede leer los comentarios directamente;
- **en la página**, con «Anotar» y luego «Copiar todas las notas», pegadas en un correo;
- **en la planilla** `vocabulario.csv`, para el vocabulario.

## Después de la revisión

1. Se reúnen las observaciones (comentarios de la página, notas por correo, planilla).
2. Claude aplica las correcciones en el código, ajusta las explicaciones y los ejercicios afectados y corre los tests y el escaneo de opciones.
3. Se despliega y se marca la fase como revisada en `PLAN_FRANCES.md`.

## Mensaje para la persona que revisa (en francés)

> Bonjour,
>
> Je développe *Polylingual*, une application gratuite pour apprendre le français destinée aux hispanophones (de A1 à C2, format DELF/DALF). Le contenu a été rédigé sans locuteur natif, et j’aimerais le faire relire.
>
> La page de relecture présente tout le contenu par niveau : grammaire (explications en espagnol, exemples et exercices en français), vocabulaire et textes. Pour chaque phrase, mot ou exercice, vous pouvez laisser un commentaire ou une note, avec l’identifiant de l’élément, le problème, la correction proposée et la gravité (erreur, amélioration, doute).
>
> L’essentiel : les erreurs de français (orthographe, accords, genre, conjugaison, typographie), les exercices qui auraient plusieurs bonnes réponses, et les phrases peu naturelles. Les traductions sont volontairement en espagnol du Chili.
>
> Je propose de commencer par les niveaux A1 à B1 (environ 12 à 16 heures).
>
> Merci beaucoup !
