import { useRef, useState } from 'react'
import { FrenchKeys } from '../../components/UmlautKeys'
import { contract, definiteArticle, demonstrative, indefiniteArticle, type Noun, partitiveArticle, possessive } from '../../courses/fr/engine/articles'
import { imperatif, participePresent, participle, persons, tenses, type TenseId, withSubject } from '../../courses/fr/engine/conjugation'
import { numberReason, numberToWords, type NumberVariant, ordinal } from '../../courses/fr/engine/numbers'
import { elides } from '../../courses/fr/engine/phonetics'
import { verbByInf, verbs } from '../../courses/fr/verbs'
import { checkFrench, type FrenchCheck } from '../../lib/frenchInput'

type Tab = 'articulos' | 'pronombres' | 'conjugacion' | 'numeros'

const tabs: { id: Tab; label: string }[] = [
  { id: 'articulos', label: 'Artículos' },
  { id: 'pronombres', label: 'Pronombres' },
  { id: 'conjugacion', label: 'Conjugación' },
  { id: 'numeros', label: 'Números' },
]

const genderColor = { m: 'text-sky-700 dark:text-sky-300', f: 'text-rose-700 dark:text-rose-300' }

/** Tablas de consulta del francés: artículos y contracciones, pronombres, conjugador y números. */
export function FrenchTablesPage() {
  const [tab, setTab] = useState<Tab>('articulos')
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Tablas de francés</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Consulta rápida: artículos, contracciones, pronombres, verbos y números. Colores: <span className={genderColor.m}>masculino</span> y{' '}
          <span className={genderColor.f}>femenino</span>.
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
      {tab === 'pronombres' && <PronounTables />}
      {tab === 'conjugacion' && <ConjugationTables />}
      {tab === 'numeros' && <NumberTables />}
    </div>
  )
}

const cellClass = 'border-t border-slate-100 p-2 dark:border-slate-800'

/** Tabla simple: encabezados y filas de texto. La primera columna va como encabezado de fila. */
function Table({ title, note, head, rows }: { title: string; note?: string; head: string[]; rows: string[][] }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-extrabold">{title}</h2>
      {note && <p className="text-sm text-slate-500 dark:text-slate-400">{note}</p>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse overflow-hidden rounded-xl bg-white text-left dark:bg-slate-900">
          <thead>
            <tr className="bg-slate-100 text-xs uppercase dark:bg-slate-800">
              {head.map((h) => (
                <th key={h} className="p-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.join('|')}>
                <th className={`${cellClass} text-sm`}>{r[0]}</th>
                {r.slice(1).map((c, i) => (
                  <td key={i} lang="fr" className={`${cellClass} font-bold`}>
                    {c}
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

const samples: Noun[] = [
  { word: 'livre', gender: 'm' },
  { word: 'maison', gender: 'f' },
  { word: 'ami', gender: 'm' },
  { word: 'école', gender: 'f' },
  { word: 'hôpital', gender: 'm' },
  { word: 'héros', gender: 'm' },
]

const withArt = (art: string, word: string) => (art.endsWith("'") ? `${art.slice(0, -1)}’${word}` : `${art} ${word}`)

function ArticleTables() {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-extrabold">Artículos con ejemplos</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Delante de vocal o de <b>h muda</b> se elide: <i lang="fr">l’école, l’hôpital, cet ami, mon amie</i>. Con <b>h aspirada</b> no:{' '}
          <i lang="fr">le héros</i>.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-xl border-collapse overflow-hidden rounded-xl bg-white text-left dark:bg-slate-900">
            <thead>
              <tr className="bg-slate-100 text-xs uppercase dark:bg-slate-800">
                <th className="p-2">Palabra</th>
                <th className="p-2">Definido</th>
                <th className="p-2">Indefinido</th>
                <th className="p-2">Partitivo</th>
                <th className="p-2">Demostrativo</th>
                <th className="p-2">Mi / tu</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((n) => (
                <tr key={n.word} lang="fr" className={genderColor[n.gender]}>
                  <th className={`${cellClass} text-sm`}>
                    {n.word} ({n.gender === 'm' ? 'm.' : 'f.'})
                  </th>
                  <td className={`${cellClass} font-bold`}>{withArt(definiteArticle(n), n.word)}</td>
                  <td className={`${cellClass} font-bold`}>{withArt(indefiniteArticle(n), n.word)}</td>
                  <td className={`${cellClass} font-bold`}>{withArt(partitiveArticle(n), n.word)}</td>
                  <td className={`${cellClass} font-bold`}>{withArt(demonstrative(n), n.word)}</td>
                  <td className={`${cellClass} font-bold`}>
                    {withArt(possessive(0, n), n.word)} · {withArt(possessive(1, n), n.word)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Table
        title="Contracciones con à y de"
        note="«à» y «de» se funden con «le» y «les». Con «la» y «l’» no cambian."
        head={['Artículo', 'à +', 'de +']}
        rows={['le', 'la', "l'", 'les'].map((a) => [a, contract('à', a).replace("à l'", 'à l’'), contract('de', a).replace("de l'", 'de l’')])}
      />
      <Table
        title="Posesivos"
        note="Concuerdan con lo poseído, no con el poseedor: «sa mère» es «su madre» (de él o de ella)."
        head={['Poseedor', 'masc.', 'fem.', 'plural']}
        rows={['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'].map((p, i) => [
          p,
          possessive(i, { word: 'livre', gender: 'm' }),
          possessive(i, { word: 'maison', gender: 'f' }),
          possessive(i, { word: 'livres', gender: 'm' }, true),
        ])}
      />
    </div>
  )
}

const pronounRows = [
  ['je', 'me (m’)', 'me (m’)', 'moi', 'me (m’)'],
  ['tu', 'te (t’)', 'te (t’)', 'toi', 'te (t’)'],
  ['il', 'le (l’)', 'lui', 'lui', 'se (s’)'],
  ['elle', 'la (l’)', 'lui', 'elle', 'se (s’)'],
  ['nous', 'nous', 'nous', 'nous', 'nous'],
  ['vous', 'vous', 'vous', 'vous', 'vous'],
  ['ils', 'les', 'leur', 'eux', 'se (s’)'],
  ['elles', 'les', 'leur', 'elles', 'se (s’)'],
]

function PronounTables() {
  return (
    <div className="flex flex-col gap-6">
      <Table
        title="Pronombres personales"
        note="Directo (COD): «je le vois». Indirecto (COI, con à): «je lui parle». Tónico, tras preposición o para insistir: «avec moi», «moi, je…»."
        head={['Sujeto', 'Directo', 'Indirecto', 'Tónico', 'Reflexivo']}
        rows={pronounRows}
      />
      <Table
        title="y · en · on"
        head={['Pronombre', 'Reemplaza', 'Ejemplo']}
        rows={[
          ['y', 'à + lugar o cosa', 'Je vais à Lyon → J’y vais.'],
          ['en', 'de + cosa, cantidad', 'Je veux du pain → J’en veux.'],
          ['on', '«nosotros» hablado o impersonal', 'On y va ? · Ici, on parle français.'],
        ]}
      />
      <Table
        title="Orden delante del verbo"
        note="Cuando hay dos pronombres, siguen este orden: «Il me le donne», «Je le lui donne», «Il y en a»."
        head={['1', '2', '3', '4', '5']}
        rows={[['me, te, se, nous, vous', 'le, la, les', 'lui, leur', 'y', 'en']]}
      />
    </div>
  )
}

const tableTenses: TenseId[] = ['present', 'passeCompose', 'imparfait', 'futurProche', 'futur', 'conditionnel', 'subjonctif', 'plusQueParfait']

/** «que je parle», «qu’il parle», «que j’aime». */
const withQue = (i: number, form: string) => {
  const s = withSubject(i, form)
  return elides(s) ? `qu’${s}` : `que ${s}`
}

const shown = (s: string) => s.replace(/'/g, '’')

function ConjugationTables() {
  const [inf, setInf] = useState('aller')
  const verb = verbByInf.get(inf)!
  const imp = imperatif(verb)
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
      <p className="text-sm">
        <span className="font-bold">Imperativo:</span> <span lang="fr">{imp.map(shown).join(' · ')}</span> · <span className="font-bold">Participio:</span>{' '}
        <span lang="fr">{participle(verb)}</span> · <span className="font-bold">Gerundio:</span> <span lang="fr">en {participePresent(verb)}</span>
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tableTenses.map((id) => (
          <section key={id} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-1 text-sm font-extrabold uppercase text-slate-500">{tenses[id].name}</h2>
            <ul lang="fr" className="flex flex-col">
              {tenses[id].forms(verb).map((f, i) => (
                <li key={i} className="font-bold">
                  {shown(id === 'subjonctif' ? withQue(i, f) : withSubject(i, f))}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <ConjugationDrill />
    </div>
  )
}

const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]

function newQuestion() {
  const verb = pick(verbs)
  const tense = pick(['present', 'passeCompose', 'imparfait', 'futur'] as const)
  const person = Math.floor(Math.random() * persons.length)
  return { verb, tense, person, answer: tenses[tense].forms(verb)[person] }
}

/** Práctica rápida: escribir una forma del verbo. Sin acentos cuenta como «casi». */
function ConjugationDrill() {
  const [q, setQ] = useState(newQuestion)
  const [value, setValue] = useState('')
  const [result, setResult] = useState<FrenchCheck | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const next = () => {
    setQ(newQuestion())
    setValue('')
    setResult(null)
  }
  // En passé composé con être, se acepta la forma sin concordancia o con ella.
  const answers = [q.answer, q.answer.replace(/\(e\)s?$/, ''), q.answer.replace(/\(e\)/, 'e').replace(/\(e\)s$/, 'es')]
  return (
    <section className="flex flex-col gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-extrabold">Ponte a prueba</h2>
      <p>
        <span lang="fr" className="font-bold">
          {persons[q.person]} · {q.verb.inf}
        </span>{' '}
        <span className="text-sm text-slate-500">
          ({q.verb.meaning}) · {tenses[q.tense].name}
        </span>
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (result) next()
          else setResult(checkFrench(value, answers))
        }}
        className="flex flex-col gap-2"
      >
        <input
          ref={inputRef}
          lang="fr"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={!!result}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Escribe la forma (sin el pronombre sujeto)"
          className="rounded-xl border border-slate-300 bg-white p-2.5 text-lg dark:border-slate-700 dark:bg-slate-950"
        />
        <FrenchKeys inputRef={inputRef} value={value} onChange={setValue} />
        {result && (
          <p
            role="status"
            className={`rounded-xl p-2.5 text-sm font-bold ${
              result === 'wrong' ? 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200' : 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
            }`}
          >
            {result === 'ok' && '¡Correcto!'}
            {result === 'accents' && 'Casi: revisa los acentos.'}
            {result === 'wrong' && 'No es correcto.'} Respuesta: <span lang="fr">{shown(withSubject(q.person, q.answer))}</span>
          </p>
        )}
        <button type="submit" disabled={!result && !value.trim()} className="self-start rounded-full bg-ink px-5 py-2 font-bold text-white disabled:opacity-40">
          {result ? 'Siguiente' : 'Comprobar'}
        </button>
      </form>
    </section>
  )
}

const keyNumbers = [1, 16, 17, 21, 22, 70, 71, 77, 80, 81, 90, 99, 100, 200, 201, 1000, 2026]

function NumberTables() {
  const [value, setValue] = useState('1984')
  const [variant, setVariant] = useState<NumberVariant>('france')
  const n = Number(value)
  const valid = value.trim() !== '' && Number.isInteger(n) && n >= 0 && n < 1e9
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-extrabold">Escribe un número</h2>
        <div className="flex flex-wrap gap-2">
          <input
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, '').slice(0, 9))}
            aria-label="Número"
            className="w-40 rounded-xl border border-slate-300 bg-white p-2.5 text-lg dark:border-slate-700 dark:bg-slate-950"
          />
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as NumberVariant)}
            aria-label="Variante"
            className="rounded-xl border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="france">Francia</option>
            <option value="belgique">Bélgica</option>
            <option value="suisse">Suiza</option>
          </select>
        </div>
        {valid && (
          <>
            <p lang="fr" className="text-xl font-extrabold">
              {numberToWords(n, variant)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{numberReason(n)}</p>
          </>
        )}
      </section>
      <Table
        title="Los que más cuestan"
        note="En Francia 70, 80 y 90 se cuentan con veintes: 80 = «cuatro veintes». En Bélgica y Suiza se dice septante y nonante (y huitante en parte de Suiza)."
        head={['Número', 'En letras', 'Ordinal']}
        rows={keyNumbers.map((x) => [String(x), numberToWords(x), ordinal(x)])}
      />
    </div>
  )
}
