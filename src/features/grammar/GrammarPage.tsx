import { Link } from "react-router";
import { grammarByCourse } from "../../courses/content";
import { useProgress } from "../../lib/progress/store";
import { useUnlockedGrammar } from "../../lib/progress/unlock";
import { LearnTabs } from "../learn/LearnTabs";

const cardClass =
  "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900";

const levelTitles: Record<string, string> = {
  N5: "Nivel N5 · básico",
  N4: "Nivel N4 · intermedio bajo",
  N3: "Nivel N3 · intermedio",
  A1: "Nivel A1 · principiante",
  A2: "Nivel A2 · elemental",
  B1: "Nivel B1 · intermedio",
};

/** Lista de lecciones de gramática del curso activo, agrupadas por nivel. */
export function GrammarPage() {
  const course = useProgress((s) => s.course);
  const results = useProgress((s) => s.grammar);
  const lessons = grammarByCourse[course] ?? [];
  const unlocked = useUnlockedGrammar(lessons.map((l) => l.id));
  const levels = [...new Set(lessons.map((l) => l.level ?? "N5"))];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Aprender</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gramática básica paso a paso: una explicación corta, ejemplos con
          audio y ejercicios para practicarla.
        </p>
      </header>

      <LearnTabs current="gramatica" />

      {course === "ja" && lessons.length > 0 && !unlocked.has(lessons[0].id) && (
        <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          🔒 La gramática se abre al completar los básicos del hiragana (hasta
          la lección «W y N»), porque los ejemplos están escritos en kana.
        </p>
      )}

      {levels.map((level) => (
        <section key={level} className="flex flex-col gap-2">
          <h2 className="text-sm font-extrabold text-slate-500 uppercase">
            {levelTitles[level] ?? level}
          </h2>
          <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {lessons.map((lesson, i) => {
              if ((lesson.level ?? "N5") !== level) return null;
              const result = results[lesson.id];
              const open = unlocked.has(lesson.id);
              const content = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-extrabold dark:bg-slate-800">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="block font-extrabold">{lesson.title}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {lesson.summary}
                    </span>
                  </span>
                  {result ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      ✓ {result.correct}/{result.total}
                    </span>
                  ) : open ? (
                    <span
                      className="text-slate-300 dark:text-slate-600"
                      aria-hidden
                    >
                      →
                    </span>
                  ) : (
                    <span aria-label="Bloqueada">🔒</span>
                  )}
                </>
              );
              return (
                <li key={lesson.id}>
                  {open ? (
                    <Link
                      to={`/gramatica/${lesson.id}`}
                      className={`${cardClass} transition hover:-translate-y-0.5 hover:shadow-md`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div
                      className={`${cardClass} opacity-50`}
                      title="Completa la lección anterior para abrirla"
                    >
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
