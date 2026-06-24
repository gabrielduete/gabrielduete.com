const DEFAULT_MAX = 1500

function splitLongSection(section: string, maxChars: number): string[] {
  if (section.length <= maxChars) return [section]

  const paragraphs = section.split(/\n{2,}/)
  const out: string[] = []
  let buffer = ''

  for (const para of paragraphs) {
    if (buffer && buffer.length + para.length + 2 > maxChars) {
      out.push(buffer.trim())
      buffer = ''
    }

    // If a single paragraph is longer than maxChars, split it on word boundaries
    if (para.length > maxChars) {
      if (buffer.trim()) {
        out.push(buffer.trim())
        buffer = ''
      }

      const words = para.split(/\s+/)
      let wordBuffer = ''
      for (const word of words) {
        if (wordBuffer && wordBuffer.length + word.length + 1 > maxChars) {
          out.push(wordBuffer.trim())
          wordBuffer = ''
        }
        wordBuffer += (wordBuffer ? ' ' : '') + word
      }
      if (wordBuffer.trim()) out.push(wordBuffer.trim())
    } else {
      buffer += (buffer ? '\n\n' : '') + para
    }
  }
  if (buffer.trim()) out.push(buffer.trim())
  return out
}

export function chunkMarkdown(content: string, maxChars = DEFAULT_MAX): string[] {
  // Split before any line starting with one or two '#'
  const sections = content
    .split(/\n(?=#{1,2}\s)/)
    .map(s => s.trim())
    .filter(Boolean)

  const source = sections.length > 0 ? sections : [content.trim()].filter(Boolean)

  return source.flatMap(section => splitLongSection(section, maxChars))
}
