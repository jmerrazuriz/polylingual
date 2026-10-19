// Exporta el contenido de un curso europeo para la revisión externa (ver REVISION_FRANCES.md):
// gramática, vocabulario y textos por nivel, con las respuestas y explicaciones de cada ejercicio.
// Uso: npx tsx scripts/export-review.ts [fr|it]
//   fr (por defecto) → revision/datos.json y revision/vocabulario.csv
//   it → revision/italiano/datos.json y revision/italiano/vocabulario.csv
import { mkdirSync, writeFileSync } from 'node:fs'
import type { EuroCourse, EuroWord } from '../src/courses/euro.ts'
import type { GrammarExercise } from '../src/courses/grammar.ts'
import { frenchCourse } from '../src/courses/fr/course.ts'
import { frenchVocab } from '../src/courses/fr/vocab.ts'
import { italianCourse } from '../src/courses/it/course.ts'
import { italianVocab } from '../src/courses/it/vocab.ts'

const courseId = process.argv[2] ?? 'fr'
const sources: Record<string, { course: EuroCourse; vocab: EuroWord[]; dir: string }> = {
  fr: { course: frenchCourse, vocab: frenchVocab, dir: 'revision' },
  it: { course: italianCourse, vocab: italianVocab, dir: 'revision/italiano' },
}
const source = sources[courseId]
if (!source) throw new Error(`Curso sin exportación: ${courseId}`)
const { course, vocab, dir } = source

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
const pos: Record<string, string> = { noun: 'sustantivo', verb: 'verbo', adj: 'adjetivo', adv: 'adverbio', phrase: 'expresión' }

/** Un ejercicio en forma legible: enunciado, opciones, respuesta, explicación y por qué no las otras. */
function exercise(e: GrammarExercise) {
  switch (e.type) {
    case 'choice':
      return { kind: e.format === 'paraphrase' ? 'paráfrasis' : 'opción', prompt: e.prompt, hint: e.hint, options: e.options, answer: e.answer, explanation: e.explanation, whyWrong: e.whyWrong }
    case 'meaning':
      return { kind: 'significado', prompt: e.text, options: e.options, answer: e.answer, explanation: e.explanation, whyWrong: e.whyWrong }
    case 'order':
      return { kind: 'ordenar', prompt: e.meaning, answer: e.answer.join(' '), explanation: e.explanation }
    case 'type':
      return { kind: 'escribir', prompt: e.prompt, hint: e.hint, answer: e.answers.join(' · '), explanation: e.explanation }
  }
}

const themeTitle = new Map(course.themes.map((t) => [t.id, t.title]))

const data = {
  course: course.id,
  generated: new Date().toISOString().slice(0, 10),
  levels: levels
    .map((level) => ({
      level,
      grammar: course.grammar
        .filter((g) => g.level === level)
        .map((g) => ({ id: g.id, title: g.title, summary: g.summary, pattern: g.pattern, explanation: g.explanation, examples: g.examples.map((x) => ({ text: x.text, meaning: x.meaning })), exercises: g.exercises.map(exercise) })),
      vocab: [...new Set(vocab.filter((w) => w.level === level).map((w) => w.theme))].map((theme) => ({
        id: theme,
        title: themeTitle.get(theme) ?? theme,
        words: vocab.filter((w) => w.level === level && w.theme === theme).map((w) => ({ id: w.id, line: course.nounLine(w), pos: pos[w.pos], meaning: w.meaning })),
      })),
      texts: course.texts
        .filter((t) => t.level === level)
        .map((t) => ({
          id: t.id,
          title: t.title,
          kind: t.kind === 'reading' ? 'lectura' : 'diálogo',
          context: t.context,
          lines: t.lines,
          questions: t.questions.map(exercise),
        })),
    }))
    .filter((l) => l.grammar.length || l.vocab.length || l.texts.length),
}

mkdirSync(dir, { recursive: true })
writeFileSync(`${dir}/datos.json`, JSON.stringify(data))

const csv = (s: string) => `"${s.replace(/"/g, '""')}"`
const rows = ['nivel,tema,id,ficha,clase,significado,correcto (sí/no),corrección,comentario']
for (const w of vocab) rows.push([w.level, themeTitle.get(w.theme) ?? w.theme, w.id, course.nounLine(w), pos[w.pos], w.meaning, '', '', ''].map((x) => csv(String(x))).join(','))
writeFileSync(`${dir}/vocabulario.csv`, '﻿' + rows.join('\n'))

for (const l of data.levels) console.log(l.level, `${l.grammar.length} lecciones`, `${l.vocab.reduce((n, t) => n + t.words.length, 0)} palabras`, `${l.texts.length} textos`)
