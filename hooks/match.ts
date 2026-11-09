// Standalone 67, "6 7", "6-7", "six seven". Not 1967, 670, $67.50, file.ts:67, 1-67, or code.
const SRC = String.raw`(?<![\w$.:/#]|\d-)(?:67|6[ -]7|six[ -]seven)(?![\w%]|[.,]\d)`
const RE = new RegExp(SRC, 'i')

// Blank code out with spaces so indices stay put for the streaming tail.
export const stripCode = (t: string) =>
  t
    .replace(/```[\s\S]*?(?:```|$)/g, m => ' '.repeat(m.length))
    .replace(/`[^`\n]*`/g, m => ' '.repeat(m.length))

export const has67 = (t: string) => RE.test(stripCode(t))

// Streamed text: a match counts once something follows it (so "67" then "0" is not 67).
export class Tail {
  private text = ''
  private scanned = 0
  push(chunk: string): boolean {
    this.text += chunk
    const s = stripCode(this.text)
    const re = new RegExp(SRC, 'gi')
    re.lastIndex = this.scanned
    for (let m; (m = re.exec(s)); ) {
      const end = m.index + m[0].length
      if (end >= s.length) break
      this.scanned = end
      return true
    }
    return false
  }
}
