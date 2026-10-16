import { beforeEach, describe, expect, it } from 'vitest'
import { lessonsByScript } from '../../courses/ja/lessons'
import { buildPlacement, passedLessons } from '../placement'
import { achievements, newAchievements } from './achievements'
import { currentStreak, dayKey, daysBefore, emptyProgress, longestStreak, mergeProgress, parseProgress } from './model'
import { progressSnapshot, useProgress } from './store'

const t0 = new Date(2026, 9, 16, 18, 0).getTime()
const days = (...offsets: number[]) => Object.fromEntries(offsets.map((o) => [dayKey(daysBefore(t0, o)), 5]))

describe('racha', () => {
  it('cuenta días seguidos hasta hoy', () => {
    expect(currentStreak(days(0, 1, 2), t0)).toBe(3)
    expect(currentStreak(days(0, 2, 3), t0)).toBe(1)
  })

  it('sigue viva si hoy aún no se practicó, y se corta si se saltó un día', () => {
    expect(currentStreak(days(1, 2), t0)).toBe(2)
    expect(currentStreak(days(2, 3), t0)).toBe(0)
  })

  it('recuerda la racha más larga, también entre meses', () => {
    expect(longestStreak(days(0, 1, 5, 6, 7, 8))).toBe(4)
    const endOfMonth = { '2026-09-29': 1, '2026-09-30': 1, '2026-10-01': 1, '2026-10-03': 1 }
    expect(longestStreak(endOfMonth)).toBe(3)
  })
})

describe('actividad y ajustes en el progreso', () => {
  beforeEach(() => useProgress.getState().reset())

  it('cada respuesta suma a la actividad de hoy (los juegos, la mitad)', () => {
    const { recordReading, recordWriting } = useProgress.getState()
    recordReading('あ', true)
    recordReading('い', false, 0.5)
    recordWriting('う', 5)
    const today = Object.values(progressSnapshot().activity)
    expect(today).toEqual([2.5])
  })

  it('los ajustes se leen con valores seguros', () => {
    const parsed = parseProgress({ settings: { dailyGoal: 7, theme: 'neon', fontScale: 'large', audio: false, speechRate: 9 } })
    expect(parsed.settings).toEqual({ dailyGoal: 20, theme: 'system', fontScale: 'large', audio: false, speechRate: 0.8 })
  })

  it('al unir progresos suma la actividad y conserva la fecha más antigua de cada logro', () => {
    const a = { ...emptyProgress(), activity: { '2026-10-16': 4 }, achievements: { vocales: 200 } }
    const b = { ...emptyProgress(), activity: { '2026-10-16': 3, '2026-10-15': 1 }, achievements: { vocales: 100, 'racha-3': 300 } }
    const merged = mergeProgress(a, b)
    expect(merged.activity).toEqual({ '2026-10-16': 7, '2026-10-15': 1 })
    expect(merged.achievements).toEqual({ vocales: 100, 'racha-3': 300 })
  })
})

describe('logros', () => {
  it('los ids no se repiten', () => {
    expect(new Set(achievements.map((a) => a.id)).size).toBe(achievements.length)
  })

  it('detecta lecciones, racha y objetivo, y no repite los ya obtenidos', () => {
    const p = {
      ...emptyProgress(),
      lessons: { vocales: { correct: 5, total: 5 } },
      activity: days(0, 1, 2),
    }
    const ids = newAchievements(p, t0).map((a) => a.id)
    expect(ids).toEqual(expect.arrayContaining(['primera-leccion', 'vocales', 'racha-3']))
    expect(ids).not.toContain('objetivo')
    expect(newAchievements({ ...p, achievements: { vocales: 1 } }, t0).map((a) => a.id)).not.toContain('vocales')
  })

  it('el hiragana básico pide las 10 lecciones básicas', () => {
    const basic = Object.fromEntries(
      lessonsByScript.hiragana.filter((l) => l.group === 'basic').map((l) => [l.id, { correct: 1, total: 1 }]),
    )
    const ids = newAchievements({ ...emptyProgress(), lessons: basic }, t0).map((a) => a.id)
    expect(ids).toContain('hiragana-basico')
    expect(ids).not.toContain('hiragana-completo')
  })
})

describe('test de nivel', () => {
  it('pregunta 2 caracteres por lección básica y 1 por las demás', () => {
    const test = buildPlacement('hiragana')
    expect(test).toHaveLength(10 * 2 + 5 + 4)
    for (const q of test) {
      if (q.question.type !== 'kana-to-romaji') throw new Error('tipo inesperado')
      expect(lessonsByScript.hiragana.find((l) => l.id === q.lessonId)!.chars).toContain(q.question.kana.char)
      expect(q.question.options).toContain(q.question.kana.romaji)
    }
  })

  it('da por sabidas solo las lecciones con todo correcto', () => {
    expect(
      passedLessons([
        { lessonId: 'vocales', correct: true },
        { lessonId: 'vocales', correct: true },
        { lessonId: 'k', correct: true },
        { lessonId: 'k', correct: false },
        { lessonId: 's', correct: true },
      ]),
    ).toEqual(['vocales', 's'])
  })
})
