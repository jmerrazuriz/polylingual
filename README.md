# Polylingual

Aplicación web para aprender idiomas. Primer curso: **japonés, Hiragana y Katakana**.

- Web: https://polylingual-f79bc.web.app
- Plan de desarrollo: [PLAN.md](PLAN.md)

## Desarrollo

```bash
npm install
npm run dev        # servidor local en http://localhost:5173
npm run lint       # revisión de código
npm test           # tests
npm run build      # compila a dist/
```

## Publicación

Cada `push` a `main` compila y publica automáticamente en Firebase Hosting (GitHub Actions).
Para publicar a mano:

```bash
npm run build
firebase deploy
```

## Créditos

- Datos de trazos: [KanjiVG](https://kanjivg.tagaini.net/) (CC BY-SA 3.0), a partir de la fase 1.
