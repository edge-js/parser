/**
 * @module parser
 */

/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { EOL } from 'os'

/**
 * Buffer class to store compiled template lines and form a
 * callable function from it.
 */
export class EdgeBuffer {
  private _lines: string = ''
  private _indentSpaces: number = 2
  private _suffixList: string[] = []
  private _prefixList: string[] = []

  constructor (private outputVar: string = 'out') {
  }

  /**
   * Returns the number of spaces to the added to the current line for
   * pretty identation.
   */
  private _getSpaces (): string {
    return new Array(this._indentSpaces + 1).join(' ')
  }

  /**
   * Indent output by 2 spaces
   */
  public indent () {
    this._indentSpaces += 2
  }

  /**
   * Decrease output by 2 spaces
   */
  public dedent () {
    this._indentSpaces -= 2
  }

  /**
   * Writes raw text to the output
   */
  public writeRaw (text: string): void {
    text = text.replace(/[']/g, '\\\'')
    this.writeLine(`'${text}'`)
  }

  /**
   * Write a new line to the output
   */
  public writeLine (text: string): void {
    this._lines += `${EOL}${this._getSpaces()}${this.outputVar} += ${text};`
  }

  /**
   * Write a new statement. Statements are not written to the
   * output. `if (something) {` is a statement.
   */
  public writeStatement (text: string): void {
    this._lines += `${EOL}${this._getSpaces()}${text}`
  }

  /**
   * Write string as interpolation to the output
   */
  public writeInterpol (text: string): void {
    this._lines += `${EOL}${this._getSpaces()}${this.outputVar} += \`\${${text}}\`;`
  }

  /**
   * Wrap the final output with a suffix and prefix
   */
  public wrap (prefix: string, suffix: string): void {
    this._prefixList.push(prefix)
    this._suffixList.push(suffix)
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

    /**
     * Add prefix to the start of the template
     */
    this._prefixList.forEach((prefix) => {
      returnValue += `${EOL}${prefix}`
    })

    returnValue += `${EOL}  let ${this.outputVar} = '';`
    returnValue += `${this._lines}`
    returnValue += `${EOL}  return ${this.outputVar};`

    /**
     * Adding suffix before closing the template function
     */
    this._suffixList.forEach((suffix) => {
      returnValue += `${EOL}${suffix}`
    })

    /**
     * Conditional, when needs to be wrapped inside a function
     */
    returnValue += wrapAsFunction ? `${EOL}})(template, ctx)` : ''

    this._lines = ''
    this._indentSpaces = 2

    return returnValue
  }
}
