import { allKana } from '../../courses/ja/kana.ts'
import { lessonsByScript } from '../../courses/ja/lessons.ts'
import type { KanaGroup, Script } from '../../courses/ja/types.ts'
import { currentStreak, type DailyRecord, longestStreak, type ProgressData, readingMastery } from './model.ts'

export type Achievement = {
  id: string
  icon: string
  title: string
  description: string
  check: (p: ProgressData, now: number) => boolean
}

const lessonsDone = (p: ProgressData, script: Script, group?: KanaGroup) =>
  lessonsByScript[script].filter((l) => !group || l.group === group).every((l) => p.lessons[l.id])

const masteredCount = (p: ProgressData) => allKana.filter((k) => readingMastery(p.kana[k.char]) === 'mastered').length

// Copia local de isDailyComplete (lib/daily importa contenido y crearía un ciclo).
const isDailyComplete = (r: DailyRecord) => r.steps.length > 0 && r.steps.every((s) => r.done.includes(s))

const streakAtLeast = (p: ProgressData, now: number, days: number) =>
  Math.max(currentStreak(p.activity, now), longestStreak(p.activity)) >= days

export const achievements: Achievement[] = [
  { id: 'primera-leccion', icon: '🌱', title: 'Primer paso', description: 'Completa tu primera lección.', check: (p) => Object.keys(p.lessons).length > 0 },
  { id: 'vocales', icon: 'あ', title: 'Vocales', description: 'Completa la lección de vocales del hiragana.', check: (p) => !!p.lessons.vocales },
  { id: 'hiragana-basico', icon: '🌸', title: 'Hiragana básico', description: 'Completa las 10 lecciones básicas del hiragana.', check: (p) => lessonsDone(p, 'hiragana', 'basic') },
  { id: 'hiragana-completo', icon: '🎎', title: 'Hiragana completo', description: 'Completa todas las lecciones de hiragana.', check: (p) => lessonsDone(p, 'hiragana') },
  { id: 'katakana-basico', icon: '🗾', title: 'Katakana básico', description: 'Completa las 10 lecciones básicas del katakana.', check: (p) => lessonsDone(p, 'katakana', 'basic') },
  { id: 'katakana-completo', icon: '🏯', title: 'Katakana completo', description: 'Completa todas las lecciones de katakana.', check: (p) => lessonsDone(p, 'katakana') },
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
  { id: 'dominados-25', icon: '⭐', title: '25 dominados', description: 'Domina la lectura de 25 caracteres.', check: (p) => masteredCount(p) >= 25 },
  { id: 'dominados-100', icon: '🌟', title: '100 dominados', description: 'Domina la lectura de 100 caracteres.', check: (p) => masteredCount(p) >= 100 },
  {
    id: 'escritor-50',
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
    icon: '☀️',
    title: 'Buenos días',
    description: 'Completa tu primera lección del día.',
    check: (p) => Object.values(p.daily).some(isDailyComplete),
  },
  {
    id: 'diaria-7',
    icon: '🗓️',
    title: 'Semana completa',
    description: 'Completa 7 lecciones del día.',
    check: (p) => Object.values(p.daily).filter(isDailyComplete).length >= 7,
  },
  { id: 'primer-record', icon: '🏆', title: 'Récord', description: 'Consigue un récord en cualquier juego.', check: (p) => Object.keys(p.records).length > 0 },
]

/** Logros que se cumplen ahora y aún no están marcados. */
export function newAchievements(p: ProgressData, now: number): Achievement[] {
  return achievements.filter((a) => !(a.id in p.achievements) && a.check(p, now))
}
