import { describe, expect, it } from 'vitest'
import { expectedStrokes } from '../../lib/strokes/evaluate'
import { getStrokes, loadKanjiStrokes, strokesReady, subscribeStrokes } from './kana'

describe('trazos de kanji bajo demanda', () => {
  it('los kana están desde el principio; los kanji, después de cargarlos', async () => {
    expect(strokesReady(['か', 'カ', 'ー'])).toBe(true)
    expect(getStrokes('か')).toBeDefined()

    expect(strokesReady(['山'])).toBe(false)
    expect(getStrokes('山')).toBeUndefined()
    // Antes de cargar no se guarda un resultado vacío en la caché del evaluador.
    expect(expectedStrokes('山')).toEqual([])

    let notified = 0
    const stop = subscribeStrokes(() => notified++)
    await Promise.all([loadKanjiStrokes(['山']), loadKanjiStrokes(['山', 'か'])])
    stop()

    // Se carga una sola vez, y solo el nivel N5.
    expect(notified).toBe(1)
    expect(strokesReady(['山', 'か'])).toBe(true)
    expect(getStrokes('山')?.strokes).toHaveLength(3)
    expect(expectedStrokes('山')).toHaveLength(3)
    expect(strokesReady(['海'])).toBe(false)
    expect(strokesReady(['夢'])).toBe(false)

    await loadKanjiStrokes(['夢'])
    expect(strokesReady(['夢'])).toBe(true)
    expect(strokesReady(['海'])).toBe(false)
    await loadKanjiStrokes()
    expect(getStrokes('海')?.strokes.length).toBeGreaterThan(0)
  })
})
