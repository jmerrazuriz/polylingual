import { allKana } from '../../courses/ja/kana.ts'
import { lessonsByScript } from '../../courses/ja/lessons.ts'
import type { KanaGroup, Script } from '../../courses/ja/types.ts'
import { currentStreak, type DailyRecord, longestStreak, type ProgressData, readingMastery } from './model.ts'

export type Achievement = {
  id: string
  icon: string
  title: string
  description: string
  /** Curso al que pertenece; sin curso, es un logro general (racha, objetivo, repasos). */
  course?: string
  check: (p: ProgressData, now: number) => boolean
}

const lessonsDone = (p: ProgressData, script: Script, group?: KanaGroup) =>
  lessonsByScript[script].filter((l) => !group || l.group === group).every((l) => p.lessons[l.id])

const masteredCount = (p: ProgressData) => allKana.filter((k) => readingMastery(p.kana[k.char]) === 'mastered').length

// Copia local de isDailyComplete (lib/daily importa contenido y crearía un ciclo).
const isDailyComplete = (r: DailyRecord) => r.steps.length > 0 && r.steps.every((s) => r.done.includes(s))

const streakAtLeast = (p: ProgressData, now: number, days: number) =>
  Math.max(currentStreak(p.activity, now), longestStreak(p.activity)) >= days

const germanGrammarDone = (p: ProgressData) => Object.keys(p.grammar).filter((id) => id.startsWith('de-')).length
const germanWordsInReview = (p: ProgressData) => new Set(Object.keys(p.cards).filter((id) => id.startsWith('dw-')).map((id) => id.split(':')[0])).size
const germanTextsRead = (p: ProgressData) => Object.keys(p.lessons).filter((id) => /^(lt|dt)-/.test(id)).length
const goethePassed = (p: ProgressData, level: string) => !!p.records[`goethe-${level}:aprobado`]

const frenchGrammarDone = (p: ProgressData) => Object.keys(p.grammar).filter((id) => id.startsWith('fr-')).length
const frenchWordsInReview = (p: ProgressData) => new Set(Object.keys(p.cards).filter((id) => id.startsWith('fw-')).map((id) => id.split(':')[0])).size
const frenchTextsRead = (p: ProgressData) => Object.keys(p.lessons).filter((id) => id.startsWith('ft-')).length
const delfPassed = (p: ProgressData, level: string) => !!p.records[`delf-${level}:aprobado`]

const frenchAchievements: Achievement[] = [
  { id: 'fr-premiere-lecon', course: 'fr', icon: '🥐', title: 'Premiers pas', description: 'Completa tu primera lección de gramática francesa.', check: (p) => frenchGrammarDone(p) > 0 },
  { id: 'fr-grammaire-30', course: 'fr', icon: '📘', title: 'Bases sólidas', description: 'Completa 30 lecciones de gramática francesa.', check: (p) => frenchGrammarDone(p) >= 30 },
  { id: 'fr-mots-100', course: 'fr', icon: '🗂️', title: '100 mots', description: 'Ten 100 palabras francesas en repaso.', check: (p) => frenchWordsInReview(p) >= 100 },
  { id: 'fr-mots-500', course: 'fr', icon: '📚', title: '500 mots', description: 'Ten 500 palabras francesas en repaso.', check: (p) => frenchWordsInReview(p) >= 500 },
  { id: 'fr-textes-10', course: 'fr', icon: '📖', title: 'Lectrice', description: 'Lee 10 episodios de Le chemin de Camila.', check: (p) => frenchTextsRead(p) >= 10 },
  { id: 'fr-delf-a1', course: 'fr', icon: '🎓', title: 'DELF A1', description: 'Aprueba el simulacro DELF A1.', check: (p) => delfPassed(p, 'a1') },
  { id: 'fr-delf-a2', course: 'fr', icon: '🏅', title: 'DELF A2', description: 'Aprueba el simulacro DELF A2, el nivel de la residencia plurianual.', check: (p) => delfPassed(p, 'a2') },
]

const germanAchievements: Achievement[] = [
  { id: 'de-erste-lektion', course: 'de', icon: '🥨', title: 'Erste Schritte', description: 'Completa tu primera lección de gramática alemana.', check: (p) => germanGrammarDone(p) > 0 },
  { id: 'de-grammatik-30', course: 'de', icon: '📗', title: 'Base sólida', description: 'Completa 30 lecciones de gramática alemana.', check: (p) => germanGrammarDone(p) >= 30 },
  { id: 'de-woerter-100', course: 'de', icon: '🗂️', title: '100 palabras', description: 'Ten 100 palabras alemanas en repaso.', check: (p) => germanWordsInReview(p) >= 100 },
  { id: 'de-woerter-500', course: 'de', icon: '📚', title: '500 palabras', description: 'Ten 500 palabras alemanas en repaso.', check: (p) => germanWordsInReview(p) >= 500 },
  { id: 'de-texte-10', course: 'de', icon: '📖', title: 'Lector', description: 'Lee 10 episodios de Ottos Weg.', check: (p) => germanTextsRead(p) >= 10 },
  { id: 'de-goethe-a1', course: 'de', icon: '🎓', title: 'Goethe A1', description: 'Aprueba el simulacro Goethe A1.', check: (p) => goethePassed(p, 'a1') },
  { id: 'de-goethe-b1', course: 'de', icon: '🏆', title: 'Goethe B1', description: 'Aprueba el simulacro Goethe B1.', check: (p) => goethePassed(p, 'b1') },
  { id: 'de-goethe-c1', course: 'de', icon: '👑', title: 'Goethe C1', description: 'Aprueba el simulacro Goethe C1.', check: (p) => goethePassed(p, 'c1') },
]

export const achievements: Achievement[] = [
  { id: 'primera-leccion', icon: '🌱', title: 'Primer paso', description: 'Completa tu primera lección.', check: (p) => Object.keys(p.lessons).length > 0 },
  { id: 'vocales', course: 'ja', icon: 'あ', title: 'Vocales', description: 'Completa la lección de vocales del hiragana.', check: (p) => !!p.lessons.vocales },
  { id: 'hiragana-basico', course: 'ja', icon: '🌸', title: 'Hiragana básico', description: 'Completa las 10 lecciones básicas del hiragana.', check: (p) => lessonsDone(p, 'hiragana', 'basic') },
  { id: 'hiragana-completo', course: 'ja', icon: '🎎', title: 'Hiragana completo', description: 'Completa todas las lecciones de hiragana.', check: (p) => lessonsDone(p, 'hiragana') },
  { id: 'katakana-basico', course: 'ja', icon: '🗾', title: 'Katakana básico', description: 'Completa las 10 lecciones básicas del katakana.', check: (p) => lessonsDone(p, 'katakana', 'basic') },
  { id: 'katakana-completo', course: 'ja', icon: '🏯', title: 'Katakana completo', description: 'Completa todas las lecciones de katakana.', check: (p) => lessonsDone(p, 'katakana') },
  { id: 'racha-3', icon: '🔥', title: 'En marcha', description: 'Practica 3 días seguidos.', check: (p, now) => streakAtLeast(p, now, 3) },
  { id: 'racha-7', icon: '📅', title: 'Una semana', description: 'Practica 7 días seguidos.', check: (p, now) => streakAtLeast(p, now, 7) },
  { id: 'racha-30', icon: '🏅', title: 'Un mes', description: 'Practica 30 días seguidos.', check: (p, now) => streakAtLeast(p, now, 30) },
  {
    id: 'objetivo',
    icon: '🎯',
    title: 'Objetivo cumplido',
    description: 'Cumple tu objetivo diario.',
    check: (p) => Object.values(p.activity).some((n) => n >= p.settings.dailyGoal),
  },
  { id: 'dominados-25', course: 'ja', icon: '⭐', title: '25 dominados', description: 'Domina la lectura de 25 caracteres.', check: (p) => masteredCount(p) >= 25 },
  { id: 'dominados-100', course: 'ja', icon: '🌟', title: '100 dominados', description: 'Domina la lectura de 100 caracteres.', check: (p) => masteredCount(p) >= 100 },
  {
    id: 'escritor-50',
    course: 'ja',
    icon: '✍️',
    title: 'Buena mano',
    description: 'Escribe 50 caracteres en el lienzo.',
    check: (p) => Object.values(p.kana).reduce((n, s) => n + s.writeCount, 0) >= 50,
  },
  {
    id: 'repasos-100',
    icon: '🔁',
    title: 'Constancia',
    description: 'Haz 100 repasos de tarjetas.',
    check: (p) => Object.values(p.cards).reduce((n, c) => n + c.reps, 0) >= 100,
  },
  {
    id: 'diaria-1',
    course: 'ja',
    icon: '☀️',
    title: 'Buenos días',
    description: 'Completa tu primera lección del día.',
    check: (p) => Object.values(p.daily).some(isDailyComplete),
  },
  {
    id: 'diaria-7',
    course: 'ja',
    icon: '🗓️',
    title: 'Semana completa',
    description: 'Completa 7 lecciones del día.',
    check: (p) => Object.values(p.daily).filter(isDailyComplete).length >= 7,
  },
  { id: 'primer-record', icon: '🏆', title: 'Récord', description: 'Consigue un récord en cualquier juego.', check: (p) => Object.keys(p.records).length > 0 },
  ...germanAchievements,
  ...frenchAchievements,
]

/** Logros que se muestran en un curso: los generales y los de ese idioma. */
export const achievementsOf = (course: string) => achievements.filter((a) => !a.course || a.course === course)

/** Logros que se cumplen ahora y aún no están marcados. */
export function newAchievements(p: ProgressData, now: number): Achievement[] {
  return achievements.filter((a) => !(a.id in p.achievements) && a.check(p, now))
}
