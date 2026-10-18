// Marcas de formato de las explicaciones: **negrita** y *cursiva* (que puede llevar negritas adentro).

export const BOLD = /(\*\*[^*]+\*\*)/
export const ITALIC = /((?<!\*)\*(?=\*\*[^*]|[^*])(?:\*\*[^*]+\*\*|[^*])+?\*(?!\*))/

/** El texto sin las marcas, como se ve en pantalla. */
export const withoutMarks = (text: string) =>
  text
    .split(ITALIC)
    .map((part, i) => (i % 2 === 1 ? part.slice(1, -1) : part))
    .join('')
    .split(BOLD)
    .map((part) => (part.startsWith('**') && part.endsWith('**') ? part.slice(2, -2) : part))
    .join('')
