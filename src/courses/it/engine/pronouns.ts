// Pronombres átonos del italiano y sus combinaciones. Cuando van juntos, el indirecto pasa a
// me/te/se/ce/ve y «gli»/«le» se funden con el directo: me lo, te ne, glielo, gliene.

export const SUBJECT = ['io', 'tu', 'lui / lei', 'noi', 'voi', 'loro'] as const
export const REFLEXIVE = ['mi', 'ti', 'si', 'ci', 'vi', 'si'] as const

export type Indirect = 'mi' | 'ti' | 'gli' | 'le' | 'Le' | 'ci' | 'vi' | 'si'
export type Direct = 'lo' | 'la' | 'li' | 'le' | 'ne'

/** Indirecto + directo antes del verbo: «me lo», «glielo», «ce ne», «se la». */
export function combined(indirect: Indirect, direct: Direct): string {
  if (indirect === 'gli' || indirect === 'le') return `glie${direct}`
  if (indirect === 'Le') return `Glie${direct}`
  return `${indirect.slice(0, -1)}e ${direct}`
}

/**
 * Pronombres pegados al final (imperativo, infinitivo, gerundio): «dimmi», «fallo», «dagli»,
 * «dammelo». Tras los imperativos de una sílaba (di', fa', da', sta', va') la consonante se
 * dobla, salvo con «gli».
 */
export function enclitic(base: string, pronouns: string): string {
  const p = pronouns.replace(/\s+/g, '')
  if (base.endsWith("'")) {
    const b = base.slice(0, -1)
    return p.startsWith('gli') ? b + p : b + p[0] + p
  }
  // El infinitivo pierde la -e: «vederlo», «darglielo».
  if (/[aei]re$/.test(base)) return base.slice(0, -1) + p
  return base + p
}
