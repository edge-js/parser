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

import { EOL } from 'os'

export class EdgeBuffer {
  private lines: string = ''
  private indentSpaces: number = 2
  private suffixList: string[] = []
  private prefixList: string[] = []

  constructor (private outputVar: string = 'out') {
  }

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
    this.lines += `${EOL}${this.getSpace()}${this.outputVar} += '${text}'`
  }

  /**
   * Write a new line to the output
   */
  public writeLine (text: string): void {
    this.lines += `${EOL}${this.getSpace()}${this.outputVar} += ${text}`
  }

  /**
   * Write a new statement. Statements are not written to the
   * output. `if (something) {` is a statement.
   */
  public writeStatement (text: string): void {
    this.lines += `${EOL}${this.getSpace()}${text}`
  }

  /**
   * Write string as interpolation to the output
   */
  public writeInterpol (text: string): void {
    this.lines += `${EOL}${this.getSpace()}${this.outputVar} += \`\${${text}}\``
  }

  /**
   * Wrap the final output with a suffix and prefix
   */
  public wrap (suffix: string, prefix: string): void {
    this.suffixList.push(suffix)
    this.prefixList.push(prefix)
  }

  /**
   * Return all the lines from the buffer wrapped inside a self
   * invoked function.
   */
  public flush (wrapAsFunction: boolean = true) {
    /**
     * Conditional, when needs to be wrapped inside a function
     */
    let returnValue = wrapAsFunction ? '(function (template, ctx) {' : ''

    this.suffixList.forEach((suffix) => {
      returnValue += `${EOL}${suffix}`
    })

    returnValue += `${EOL}  let ${this.outputVar} = ''`
    returnValue += `${this.lines}`
    returnValue += `${EOL}  return ${this.outputVar}`

    /**
     * Conditional, when needs to be wrapped inside a function
     */
    this.prefixList.forEach((prefix) => {
      returnValue += `${EOL}${prefix}`
    })
    returnValue += wrapAsFunction ? `${EOL}})(template, ctx)` : ''

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
