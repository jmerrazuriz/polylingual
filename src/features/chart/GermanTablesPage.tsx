import { useRef, useState } from 'react'
import { UmlautKeys } from '../../components/UmlautKeys'
import { type Forms, futur1, imperativ, konjunktiv2, perfekt, persons, praeteritum, present, type Verb } from '../../courses/de/engine/conjugation'
import {
  adjectiveEndings,
  type AdjectiveKind,
  caseNames,
  cases,
  definite,
  determiner,
  personalPronouns,
  type Slot,
  slotNames,
  slots,
} from '../../courses/de/engine/declension'
import { verbByInf, verbs } from '../../courses/de/verbs'
import { checkGerman, type GermanCheck } from '../../lib/germanInput'

type Tab = 'articulos' | 'pronombres' | 'adjetivos' | 'conjugacion'

const tabs: { id: Tab; label: string }[] = [
  { id: 'articulos', label: 'Artículos' },
  { id: 'pronombres', label: 'Pronombres' },
  { id: 'adjetivos', label: 'Adjetivos' },
  { id: 'conjugacion', label: 'Conjugación' },
]

/** Color de cada género (opcional en el curso, siempre en la tabla). */
const slotColor: Record<Slot, string> = {
  m: 'text-sky-700 dark:text-sky-300',
  f: 'text-rose-700 dark:text-rose-300',
  n: 'text-emerald-700 dark:text-emerald-300',
  pl: 'text-amber-700 dark:text-amber-300',
}

/** Tablas de consulta del alemán: artículos, pronombres, terminaciones del adjetivo y conjugación. */
export function GermanTablesPage() {
  const [tab, setTab] = useState<Tab>('articulos')
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Tablas de alemán</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Consulta rápida de la gramática: géneros, casos, terminaciones y verbos. Colores: <span className={slotColor.m}>masculino</span>,{' '}
          <span className={slotColor.f}>femenino</span>, <span className={slotColor.n}>neutro</span> y <span className={slotColor.pl}>plural</span>.
        </p>
      </header>
      <nav aria-label="Tablas" className="-mx-4 overflow-x-auto px-4">
        <div className="flex w-max rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={t.id === tab ? 'page' : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold whitespace-nowrap ${
                t.id === tab ? 'bg-white text-ink shadow-sm dark:bg-slate-950 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>
      {tab === 'articulos' && <ArticleTables />}
      {tab === 'pronombres' && <PronounTable />}
      {tab === 'adjetivos' && <AdjectiveTables />}
      {tab === 'conjugacion' && <ConjugationTable />}
    </div>
  )
}

function CaseTable({ title, note, cell }: { title: string; note?: string; cell: (c: (typeof cases)[number], s: Slot) => string }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-extrabold">{title}</h2>
      {note && <p className="text-sm text-slate-500 dark:text-slate-400">{note}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-md border-collapse overflow-hidden rounded-xl bg-white text-center dark:bg-slate-900">
          <thead>
            <tr className="bg-slate-100 text-xs uppercase dark:bg-slate-800">
              <th className="p-2 text-left">Caso</th>
              {slots.map((s) => (
                <th key={s} className={`p-2 ${slotColor[s]}`}>
                  {slotNames[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c} className="border-t border-slate-100 dark:border-slate-800">
                <th className="p-2 text-left text-sm">{caseNames[c]}</th>
                {slots.map((s) => (
                  <td key={s} lang="de" className={`p-2 font-bold ${slotColor[s]}`}>
                    {cell(c, s)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ArticleTables() {
  return (
    <div className="flex flex-col gap-6">
      <CaseTable title="Artículo definido" cell={(c, s) => definite[c][s]} />
      <CaseTable title="Artículo indefinido" note="«Ein» no tiene plural: se dice «Kinder» (unos niños)." cell={(c, s) => determiner({ kind: 'indef' }, c, s) ?? '—'} />
      <CaseTable
        title="Negativo «kein» y posesivos"
        note="Los posesivos (mein, dein, sein, ihr, unser, euer, Ihr) llevan las mismas terminaciones que «kein»."
        cell={(c, s) => determiner({ kind: 'ein-word', stem: 'kein' }, c, s)!}
      />
    </div>
  )
}

function PronounTable() {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-extrabold">Pronombres personales</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-md border-collapse rounded-xl bg-white text-center dark:bg-slate-900">
          <thead>
            <tr className="bg-slate-100 text-xs uppercase dark:bg-slate-800">
              <th className="p-2 text-left">Persona</th>
              <th className="p-2">Nominativo</th>
              <th className="p-2">Acusativo</th>
              <th className="p-2">Dativo</th>
            </tr>
          </thead>
          <tbody>
            {personalPronouns.map((p) => (
              <tr key={p.person} className="border-t border-slate-100 dark:border-slate-800">
                <th className="p-2 text-left text-sm">{p.person}</th>
                <td lang="de" className="p-2 font-bold">
                  {p.nom}
                </td>
                <td lang="de" className="p-2 font-bold">
                  {p.akk}
                </td>
                <td lang="de" className="p-2 font-bold">
                  {p.dat}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const adjectiveInfo: Record<AdjectiveKind, { title: string; note: string }> = {
  weak: { title: 'Después de der, die, das (débil)', note: 'der große Tisch · mit dem großen Tisch' },
  mixed: { title: 'Después de ein, kein, mein… (mixta)', note: 'ein großer Tisch · mit einem großen Tisch' },
  strong: { title: 'Sin artículo (fuerte)', note: 'großer Hunger · mit großem Interesse' },
}

function AdjectiveTables() {
  return (
    <div className="flex flex-col gap-6">
      {(['weak', 'mixed', 'strong'] as const).map((k) => (
        <CaseTable key={k} title={adjectiveInfo[k].title} note={adjectiveInfo[k].note} cell={(c, s) => `-${adjectiveEndings[k][c][s]}`} />
      ))}
    </div>
  )
}

const tenses: { id: string; label: string; forms: (v: Verb) => Forms }[] = [
  { id: 'praesens', label: 'Presente (Präsens)', forms: present },
  { id: 'perfekt', label: 'Pasado hablado (Perfekt)', forms: perfekt },
  { id: 'praeteritum', label: 'Pasado escrito (Präteritum)', forms: praeteritum },
  { id: 'futur', label: 'Futuro (Futur I)', forms: futur1 },
  { id: 'konj2', label: 'Condicional (Konjunktiv II)', forms: konjunktiv2 },
]

function ConjugationTable() {
  const [inf, setInf] = useState('fahren')
  const verb = verbByInf.get(inf)!
  const imp = imperativ(verb)
  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-1 text-sm font-bold">
        Verbo
        <select value={inf} onChange={(e) => setInf(e.target.value)} className="rounded-xl border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
          {verbs.map((v) => (
            <option key={v.inf} value={v.inf}>
              {v.inf} · {v.meaning}
            </option>
          ))}
        </select>
      </label>
      <div className="overflow-x-auto">
        <table className="w-full min-w-xl border-collapse rounded-xl bg-white text-left dark:bg-slate-900">
          <thead>
            <tr className="bg-slate-100 text-xs uppercase dark:bg-slate-800">
              <th className="p-2">Persona</th>
              {tenses.map((t) => (
                <th key={t.id} className="p-2">
                  {t.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {persons.map((p, i) => (
              <tr key={p} className="border-t border-slate-100 dark:border-slate-800">
                <th lang="de" className="p-2 text-sm">
                  {p}
                </th>
                {tenses.map((t) => (
                  <td key={t.id} lang="de" className="p-2 font-bold">
                    {t.forms(verb)[i]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm">
        <span className="font-bold">Imperativo:</span>{' '}
        {imp ? (
          <span lang="de">
            {imp[0]}! · {imp[1]}! · {imp[2]}!
          </span>
        ) : (
          'los verbos modales no tienen imperativo.'
        )}
      </p>
      <ConjugationDrill />
    </div>
  )
}

const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]

function newQuestion() {
  const verb = pick(verbs)
  const tense = pick(tenses.slice(0, 3))
  const person = Math.floor(Math.random() * persons.length)
  return { verb, tense, person, answer: tense.forms(verb)[person] }
}

/** Práctica rápida: escribir una forma del verbo. Acepta ae/oe/ue y ss. */
function ConjugationDrill() {
  const [q, setQ] = useState(newQuestion)
  const [value, setValue] = useState('')
  const [result, setResult] = useState<GermanCheck | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const next = () => {
    setQ(newQuestion())
    setValue('')
    setResult(null)
  }
  return (
    <section className="flex flex-col gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-extrabold">Ponte a prueba</h2>
      <p>
        <span lang="de" className="font-bold">
          {persons[q.person]} · {q.verb.inf}
        </span>{' '}
        <span className="text-sm text-slate-500">({q.verb.meaning}) · {q.tense.label}</span>
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (result) next()
          else setResult(checkGerman(value, q.answer))
        }}
        className="flex flex-col gap-2"
      >
        <input
          ref={inputRef}
          lang="de"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={!!result}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Escribe la forma"
          className="rounded-xl border border-slate-300 bg-white p-2.5 text-lg dark:border-slate-700 dark:bg-slate-950"
        />
        <UmlautKeys inputRef={inputRef} value={value} onChange={setValue} />
        {result && (
          <p
            role="status"
            className={`rounded-xl p-2.5 text-sm font-bold ${
              result === 'wrong' ? 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200' : 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
            }`}
          >
            {result === 'ok' && '¡Correcto!'}
            {result === 'case' && 'Casi: revisa las mayúsculas.'}
            {result === 'wrong' && 'No es correcto.'} Respuesta: <span lang="de">{q.answer}</span>
          </p>
        )}
        <button type="submit" disabled={!result && !value.trim()} className="self-start rounded-full bg-ink px-5 py-2 font-bold text-white disabled:opacity-40">
          {result ? 'Siguiente' : 'Comprobar'}
        </button>
      </form>
    </section>
  )
}
