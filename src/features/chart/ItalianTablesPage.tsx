import { useRef, useState } from 'react'
import { ItalianKeys } from '../../components/UmlautKeys'
import { articulated, type Definite, join, type Noun, POSSESSIVES, quello, withDefinite, withIndefinite, withPartitive, withPossessive } from '../../courses/it/engine/articles'
import {
  agreementVariants,
  auxOf,
  gerundio,
  imperativo,
  imperativoNegativo,
  participle,
  persons,
  subjunctiveTenses,
  tenses,
  type TenseId,
  withChe,
  withSubject,
} from '../../courses/it/engine/conjugation'
import { numberReason, numberToWords, ordinal } from '../../courses/it/engine/numbers'
import { pluralReason } from '../../courses/it/engine/plurals'
import { combined, type Direct, enclitic, type Indirect } from '../../courses/it/engine/pronouns'
import { verbByInf, verbs } from '../../courses/it/verbs'
import { checkItalian, doublesHint, type ItalianCheck } from '../../lib/italianInput'

type Tab = 'articulos' | 'preposiciones' | 'plurales' | 'pronombres' | 'conjugacion' | 'numeros'

const tabs: { id: Tab; label: string }[] = [
  { id: 'articulos', label: 'Artículos' },
  { id: 'preposiciones', label: 'Preposiciones' },
  { id: 'plurales', label: 'Plurales' },
  { id: 'pronombres', label: 'Pronombres' },
  { id: 'conjugacion', label: 'Conjugación' },
  { id: 'numeros', label: 'Números' },
]

const genderColor = { m: 'text-sky-700 dark:text-sky-300', f: 'text-rose-700 dark:text-rose-300' }

/** Tablas de consulta del italiano: artículos, preposiciones articuladas, plurales, pronombres, conjugador y números. */
export function ItalianTablesPage() {
  const [tab, setTab] = useState<Tab>('articulos')
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Tablas de italiano</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Consulta rápida: artículos, preposiciones articuladas, plurales, pronombres, verbos y números. Colores: <span className={genderColor.m}>masculino</span> y{' '}
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
      {tab === 'preposiciones' && <PrepositionTables />}
      {tab === 'plurales' && <PluralTables />}
      {tab === 'pronombres' && <PronounTables />}
      {tab === 'conjugacion' && <ConjugationTables />}
      {tab === 'numeros' && <NumberTables />}
    </div>
  )
}

const cellClass = 'border-t border-slate-100 p-2 dark:border-slate-800'
const shown = (s: string) => s.replace(/'/g, '’')

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
                <th className={`${cellClass} text-sm`}>{shown(r[0])}</th>
                {r.slice(1).map((c, i) => (
                  <td key={i} lang="it" className={`${cellClass} font-bold`}>
                    {shown(c)}
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
  { word: 'libro', gender: 'm' },
  { word: 'studente', gender: 'm' },
  { word: 'zaino', gender: 'm' },
  { word: 'amico', gender: 'm' },
  { word: 'casa', gender: 'f' },
  { word: 'amica', gender: 'f' },
]

function ArticleTables() {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-extrabold">Artículos con ejemplos</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          El masculino cambia según cómo empieza la palabra: <i lang="it">il libro</i>, pero <b>lo / gli</b> ante <b>s + consonante, z, gn, ps, x, y</b> (
          <i lang="it">lo studente, gli zaini</i>) y <b>l’ / gli</b> ante vocal (<i lang="it">l’amico, gli amici</i>). <i lang="it">Un amico</i> va sin apóstrofo;{' '}
          <i lang="it">un’amica</i>, con apóstrofo.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-xl border-collapse overflow-hidden rounded-xl bg-white text-left dark:bg-slate-900">
            <thead>
              <tr className="bg-slate-100 text-xs uppercase dark:bg-slate-800">
                <th className="p-2">Palabra</th>
                <th className="p-2">Definido</th>
                <th className="p-2">Plural</th>
                <th className="p-2">Indefinido</th>
                <th className="p-2">Partitivo</th>
                <th className="p-2">Aquel</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((n) => (
                <tr key={n.word} lang="it" className={genderColor[n.gender]}>
                  <th className={`${cellClass} text-sm`}>
                    {n.word} ({n.gender === 'm' ? 'm.' : 'f.'})
                  </th>
                  <td className={`${cellClass} font-bold`}>{shown(withDefinite(n))}</td>
                  <td className={`${cellClass} font-bold`}>{shown(withDefinite(n, true))}</td>
                  <td className={`${cellClass} font-bold`}>{shown(withIndefinite(n))}</td>
                  <td className={`${cellClass} font-bold`}>{shown(withPartitive(n))}</td>
                  <td className={`${cellClass} font-bold`}>{shown(join(quello(n), n.word))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Table
        title="Posesivos"
        note="Llevan artículo (la mia casa), salvo con parientes en singular (mia madre, tuo fratello). «Loro» siempre lleva artículo: il loro padre."
        head={['Poseedor', 'masc.', 'fem.', 'plural', 'pariente']}
        rows={['io', 'tu', 'lui / lei', 'noi', 'voi', 'loro'].map((p, i) => [
          p,
          withPossessive(i, { word: 'libro', gender: 'm' }),
          withPossessive(i, { word: 'casa', gender: 'f' }),
          withPossessive(i, { word: 'amico', gender: 'm' }, true),
          withPossessive(i, { word: 'madre', gender: 'f', family: true }),
        ])}
      />
      <Table
        title="Formas del posesivo"
        head={['Poseedor', 'masc.', 'fem.', 'masc. pl.', 'fem. pl.']}
        rows={['io', 'tu', 'lui / lei / Lei', 'noi', 'voi', 'loro'].map((p, i) => [p, ...POSSESSIVES[i]])}
      />
    </div>
  )
}

const ARTICLES: Definite[] = ['il', 'lo', "l'", 'la', 'i', 'gli', 'le']

function PrepositionTables() {
  return (
    <div className="flex flex-col gap-6">
      <Table
        title="Preposiciones articuladas"
        note="di, a, da, in y su se funden con el artículo definido: del pane, allo stadio, dall’amico, nella borsa, sui tavoli. «Con» y «per» van separadas: con il treno, per la strada."
        head={['', ...ARTICLES.map(shown)]}
        rows={(['di', 'a', 'da', 'in', 'su'] as const).map((p) => [p, ...ARTICLES.map((a) => articulated(p, a))])}
      />
      <Table
        title="¿a, in o da?"
        head={['Uso', 'Ejemplo']}
        rows={[
          ['a + ciudad', 'Vivo a Bologna. Vado a Napoli.'],
          ['in + país, región, isla grande', 'Vivo in Italia, in Toscana, in Sicilia.'],
          ['in + muchos lugares sin artículo', 'in banca, in ufficio, in farmacia, in centro'],
          ['da + persona (a casa de, donde)', 'Vado dal medico. Ceniamo da Bruno.'],
          ['da + tiempo que sigue', 'Studio italiano da due mesi.'],
        ]}
      />
    </div>
  )
}

const pluralSamples: Noun[] = [
  { word: 'libro', gender: 'm' },
  { word: 'casa', gender: 'f' },
  { word: 'fiore', gender: 'm' },
  { word: 'chiave', gender: 'f' },
  { word: 'problema', gender: 'm' },
  { word: 'parco', gender: 'm' },
  { word: 'amico', gender: 'm' },
  { word: 'medico', gender: 'm' },
  { word: 'lago', gender: 'm' },
  { word: 'amica', gender: 'f' },
  { word: 'camicia', gender: 'f' },
  { word: 'arancia', gender: 'f' },
  { word: 'figlio', gender: 'm' },
  { word: 'città', gender: 'f' },
  { word: 'film', gender: 'm' },
  { word: 'crisi', gender: 'f' },
  { word: 'foto', gender: 'f', invariable: true },
  { word: 'uomo', gender: 'm', plural: 'uomini' },
  { word: 'uovo', gender: 'm', plural: 'uova', pluralGender: 'f' },
  { word: 'braccio', gender: 'm', plural: 'braccia', pluralGender: 'f' },
]

function PluralTables() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-extrabold">Cómo se forma el plural</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Regla básica: <b>-o → -i</b>, <b>-a → -e</b> (femenino), <b>-e → -i</b>. No cambian las palabras con tilde final, las que terminan en consonante y las abreviadas.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-xl border-collapse overflow-hidden rounded-xl bg-white text-left dark:bg-slate-900">
          <thead>
            <tr className="bg-slate-100 text-xs uppercase dark:bg-slate-800">
              <th className="p-2">Singular</th>
              <th className="p-2">Plural</th>
              <th className="p-2">Por qué</th>
            </tr>
          </thead>
          <tbody>
            {pluralSamples.map((n) => (
              <tr key={n.word} className={genderColor[n.gender]}>
                <th lang="it" className={`${cellClass} font-bold`}>
                  {shown(withDefinite(n))}
                </th>
                <td lang="it" className={`${cellClass} font-bold ${genderColor[n.pluralGender ?? n.gender]}`}>
                  {shown(withDefinite(n, true))}
                </td>
                <td className={`${cellClass} text-sm text-slate-600 dark:text-slate-300`}>{pluralReason(n)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Ojo: <span lang="it">l’uovo → le uova</span> y <span lang="it">il braccio → le braccia</span> cambian de género en plural. <span lang="it">Il dito → le dita</span>, <span lang="it">il labbro → le labbra</span> y <span lang="it">l’osso → le ossa</span> siguen el mismo modelo.
      </p>
    </div>
  )
}

const pronounRows = [
  ['io', 'mi', 'mi', 'mi', 'me'],
  ['tu', 'ti', 'ti', 'ti', 'te'],
  ['lui', 'lo', 'gli', 'si', 'lui'],
  ['lei', 'la', 'le', 'si', 'lei'],
  ['Lei (usted)', 'La', 'Le', 'si', 'Lei'],
  ['noi', 'ci', 'ci', 'ci', 'noi'],
  ['voi', 'vi', 'vi', 'vi', 'voi'],
  ['loro', 'li / le', 'gli (a loro)', 'si', 'loro'],
]

const INDIRECT: Indirect[] = ['mi', 'ti', 'gli', 'ci', 'vi', 'si']
const DIRECT: Direct[] = ['lo', 'la', 'li', 'le', 'ne']

function PronounTables() {
  return (
    <div className="flex flex-col gap-6">
      <Table
        title="Pronombres personales"
        note="«gli» es «a él» (y en el habla, «a ellos»); «le» es «a ella» y, con mayúscula, «a usted». Tónico, tras preposición o para insistir: «con me», «a te piace?»."
        head={['Sujeto', 'Directo', 'Indirecto', 'Reflexivo', 'Tónico']}
        rows={pronounRows}
      />
      <Table
        title="Pronombres combinados"
        note="Cuando van juntos, mi/ti/ci/vi/si pasan a me/te/ce/ve/se, y gli/le se funden con el directo: «Te lo dico», «Glielo porto», «Ce ne sono tre»."
        head={['', ...DIRECT]}
        rows={INDIRECT.map((i) => [i === 'gli' ? 'gli / le' : i, ...DIRECT.map((d) => combined(i, d))])}
      />
      <Table
        title="ci y ne"
        head={['Partícula', 'Reemplaza', 'Ejemplo']}
        rows={[
          ['ci', 'a / in + lugar, o a + cosa', 'Vai a Roma? — Sì, ci vado. · Ci penso io.'],
          ['ne', 'di + algo, o una cantidad', 'Quanti caffè bevi? — Ne bevo due. · Ne parliamo domani.'],
          ['c’è / ci sono', 'hay', 'C’è un bar qui vicino? · Ci sono tre camere.'],
        ]}
      />
      <Table
        title="Pronombres pegados al verbo"
        note="Con el imperativo, el infinitivo y el gerundio, el pronombre va al final. Tras di’, fa’, da’, sta’ y va’ la consonante se dobla (salvo con gli)."
        head={['Forma', 'Con pronombre']}
        rows={[
          ["di' + mi", enclitic("di'", 'mi')],
          ["fa' + lo", enclitic("fa'", 'lo')],
          ["da' + gli", enclitic("da'", 'gli')],
          ["da' + me lo", enclitic("da'", 'me lo')],
          ["va' + te ne", enclitic("va'", 'te ne')],
          ['vedere + lo', enclitic('vedere', 'lo')],
          ['parla + gli', enclitic('parla', 'gli')],
        ]}
      />
    </div>
  )
}

const tableTenses: TenseId[] = [
  'present',
  'passatoProssimo',
  'imperfetto',
  'progressivo',
  'futuro',
  'condizionale',
  'congiuntivo',
  'trapassatoProssimo',
  'futuroAnteriore',
  'condizionalePassato',
  'congiuntivoPassato',
  'congiuntivoImperfetto',
  'congiuntivoTrapassato',
  'passatoRemoto',
  'trapassatoRemoto',
]

function ConjugationTables() {
  const [inf, setInf] = useState('andare')
  const verb = verbByInf.get(inf)!
  const imp = imperativo(verb)
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
        <span className="font-bold">Imperativo (tu, Lei, noi, voi):</span> <span lang="it">{imp.map(shown).join(' · ')}</span> · <span className="font-bold">Negativo:</span>{' '}
        <span lang="it">{imperativoNegativo(verb)}</span> · <span className="font-bold">Participio:</span> <span lang="it">{participle(verb)}</span> ·{' '}
        <span className="font-bold">Gerundio:</span> <span lang="it">{gerundio(verb)}</span> · <span className="font-bold">Auxiliar:</span> <span lang="it">{auxOf(verb)}</span>
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tableTenses.map((id) => (
          <section key={id} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-1 text-sm font-extrabold uppercase text-slate-500">{tenses[id].name}</h2>
            <ul lang="it" className="flex flex-col">
              {tenses[id].forms(verb).map((f, i) => (
                <li key={i} className="font-bold">
                  {shown(subjunctiveTenses.includes(id) ? withChe(i, f) : withSubject(i, f))}
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
  const tense = pick(['present', 'passatoProssimo', 'imperfetto', 'futuro'] as const)
  const person = Math.floor(Math.random() * persons.length)
  return { verb, tense, person, answer: tenses[tense].forms(verb)[person] }
}

/** Práctica rápida: escribir una forma del verbo. Sin tildes cuenta como «casi»; las dobles, no. */
function ConjugationDrill() {
  const [q, setQ] = useState(newQuestion)
  const [value, setValue] = useState('')
  const [result, setResult] = useState<ItalianCheck | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const next = () => {
    setQ(newQuestion())
    setValue('')
    setResult(null)
  }
  // Con «essere» se acepta el participio en masculino o en femenino: «sono andato» o «sono andata».
  const answers = agreementVariants(q.answer)
  const wrong = result === 'wrong' || result === 'doubles'
  return (
    <section className="flex flex-col gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-extrabold">Ponte a prueba</h2>
      <p>
        <span lang="it" className="font-bold">
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
          else setResult(checkItalian(value, answers))
        }}
        className="flex flex-col gap-2"
      >
        <input
          ref={inputRef}
          lang="it"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={!!result}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Escribe la forma (sin el pronombre sujeto)"
          className="rounded-xl border border-slate-300 bg-white p-2.5 text-lg dark:border-slate-700 dark:bg-slate-950"
        />
        <ItalianKeys inputRef={inputRef} value={value} onChange={setValue} />
        {result && (
          <p
            role="status"
            className={`rounded-xl p-2.5 text-sm font-bold ${
              wrong ? 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200' : 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
            }`}
          >
            {result === 'ok' && '¡Correcto!'}
            {result === 'accents' && 'Casi: revisa las tildes.'}
            {result === 'doubles' && (doublesHint(value, answers.find((a) => doublesHint(value, a)) ?? answers[0]) ?? 'Revisa las consonantes dobles.')}
            {result === 'wrong' && 'No es correcto.'} Respuesta: <span lang="it">{shown(withSubject(q.person, q.answer))}</span>
          </p>
        )}
        <button type="submit" disabled={!result && !value.trim()} className="self-start rounded-full bg-ink px-5 py-2 font-bold text-white disabled:opacity-40">
          {result ? 'Siguiente' : 'Comprobar'}
        </button>
      </form>
    </section>
  )
}

const keyNumbers = [1, 11, 17, 21, 23, 28, 33, 48, 100, 101, 108, 180, 1000, 2000, 2026]

function NumberTables() {
  const [value, setValue] = useState('1984')
  const n = Number(value)
  const valid = value.trim() !== '' && Number.isInteger(n) && n >= 0 && n < 1e9
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-extrabold">Escribe un número</h2>
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, '').slice(0, 9))}
          aria-label="Número"
          className="w-40 rounded-xl border border-slate-300 bg-white p-2.5 text-lg dark:border-slate-700 dark:bg-slate-950"
        />
        {valid && (
          <>
            <p lang="it" className="text-xl font-extrabold break-all">
              {numberToWords(n)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{numberReason(n)}</p>
          </>
        )}
      </section>
      <Table
        title="Los que más cuestan"
        note="Las decenas pierden la vocal ante uno y otto (ventuno, trentotto) y tre lleva tilde al final de un compuesto (ventitré). Se escriben en una sola palabra: duemilaventisei."
        head={['Número', 'En letras', 'Ordinal']}
        rows={keyNumbers.map((x) => [String(x), numberToWords(x), x <= 1000 ? ordinal(x) : '—'])}
      />
    </div>
  )
}
