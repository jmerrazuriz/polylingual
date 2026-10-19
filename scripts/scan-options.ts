// Busca preguntas de alternativas con pistas obvias: la respuesta es la única con números o
// es mucho más larga que las demás. Uso: npx tsx scripts/scan-options.ts
import { grammarByCourse } from '../src/courses/content.ts'
import { germanTexts } from '../src/courses/de/texts.ts'
import { frenchTexts } from '../src/courses/fr/texts.ts'
import { italianTexts } from '../src/courses/it/texts.ts'
import type { GrammarExercise } from '../src/courses/grammar.ts'
import { looksNumeric } from '../src/lib/distractors.ts'
import { readingTexts } from '../src/lib/readings.ts'

type Found = { where: string; prompt: string; answer: string; options: string[]; why: string }
const found: Found[] = []

function check(where: string, e: GrammarExercise) {
  if (e.type !== 'choice' && e.type !== 'meaning') return
  const options = e.options
  const others = options.filter((o) => o !== e.answer)
  const prompt = e.type === 'choice' ? e.prompt : e.text
  const numeric = (o: string) => looksNumeric(o) || /\d/.test(o)
  if (numeric(e.answer) && others.filter(numeric).length === 0) found.push({ where, prompt, answer: e.answer, options, why: 'única con número' })
  if (!numeric(e.answer) && others.length >= 2 && others.filter(numeric).length === others.length) found.push({ where, prompt, answer: e.answer, options, why: 'única sin número' })
  const maxOther = Math.max(...others.map((o) => o.length))
  if (e.answer.length >= 25 && e.answer.length > maxOther * 1.8) found.push({ where, prompt, answer: e.answer, options, why: 'mucho más larga' })
}

for (const [course, lessons] of Object.entries(grammarByCourse)) for (const g of lessons) for (const e of g.exercises) check(`${course}:gramática:${g.id}`, e)
for (const t of readingTexts) for (const e of t.questions ?? []) check(`ja:lectura:${t.id}`, e)
for (const t of germanTexts) for (const e of t.questions) check(`de:texto:${t.id}`, e)
for (const t of frenchTexts) for (const e of t.questions) check(`fr:texto:${t.id}`, e)
for (const t of italianTexts) for (const e of t.questions) check(`it:texto:${t.id}`, e)

for (const f of found) console.log(`${f.why.padEnd(16)} ${f.where}\n   ${f.prompt}\n   ✔ ${f.answer}\n   ✘ ${f.options.filter((o) => o !== f.answer).join(' | ')}`)
console.log(`\n${found.length} preguntas para revisar`)
