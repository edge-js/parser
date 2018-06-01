/**
 * @module Parser
 */

/*
* edge-lexer
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

class EdgeBuffer {
  private lines: string = ''
  private indentSpaces: number = 2

  /**
   * Indent output by 2 spaces
   */
  public indent () {
    this.indentSpaces += 2
  }

  /**
   * Decrease upcoming line indentation by
   * 2 spaces
   */
  public dedent () {
    this.indentSpaces -= 2
  }

  /**
   * Writes raw text to the output
   */
  public writeRaw (text: string): void {
    text = text.replace(/[']/g, '\\\'')
    this.lines += `\n${this.getSpace()}out += '${text}'`
  }

  /**
   * Write a new line to the output
   */
  public writeLine (text: string): void {
    this.lines += `\n${this.getSpace()}out += ${text}`
  }

  /**
   * Write a new statement. Statements are not written to the
   * output. `if (something) {` is a statement.
   */
  public writeStatement (text: string): void {
    this.lines += `\n${this.getSpace()}${text}`
  }

  /**
   * Write string as interpolation to the output
   */
  public writeInterpol (text: string): void {
    this.lines += `\n${this.getSpace()}out += \`\${${text}}\``
  }

  /**
   * Return all the lines from the buffer wrapped inside a self
   * invoked function.
   */
  public flush () {
    let returnValue = '(function (template, ctx) {'
    returnValue += `\n  let out = ''`
    returnValue += `${this.lines}`
    returnValue += '\n  return out'
    returnValue += '\n})(template, ctx)'

    /**
     * Reset internal props.
     */
    this.lines = ''
    this.indentSpaces = 2

    return returnValue
  }

  /**
   * Returns the number of spaces to the added to the current line for
   * pretty identation.
   */
  private getSpace (): string {
    let spaces = ''
    for (let i = 0; i < this.indentSpaces; i++) {
      spaces += ' '
    }
    return spaces
  }
}

export = EdgeBuffer
