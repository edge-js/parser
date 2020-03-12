/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { EOL } from 'os'
import stringify from 'js-stringify'

/**
 * Buffer class to construct template
 */
export class EdgeBuffer {
  private options = {
    outputVar: 'out',
    fileNameVar: 'ctx.$filename',
    lineVar: 'ctx.$lineNumber',
  }

  private prefix: string[] = []
  private suffix: string[] = []

  /**
   * Collected lines
   */
  private buffer: string[] = []

  /**
   * Current runtime line number
   */
  private currentLineNumber = 1

  /**
   * Current runtime filename
   */
  private currentFileName = this.filename

  /**
   * Cached compiled output. Once this value is set, the `flush`
   * method will become a noop
   */
  private compiledOutput: string | undefined

  constructor (
    private filename: string,
    private wrapInsideFunction: boolean,
    options?: { outputVar?: string }
  ) {
    Object.assign(this.options, options)
  }

  /**
   * Returns the size of buffer text
   */
  public get size () {
    return this.buffer.length
  }

  /**
   * Setup template with initial set of lines
   */
  private setup (buffer: string[]) {
    /**
     * Output closure function when [[wrapInsideFunction]] is true
     */
    if (this.wrapInsideFunction) {
      buffer.push('return (function (template, ctx) {')
    }

    /**
     * Define output variable
     */
    buffer.push(`let ${this.options.outputVar} = '';`)

    if (this.wrapInsideFunction) {
      /**
       * Define line number variable
       */
      buffer.push(`${this.options.lineVar} = 1;`)

      /**
       * Define filename variable
       */
      buffer.push(`${this.options.fileNameVar} = '${this.filename}';`)
    }

    /**
     * Write try block
     */
    buffer.push('try {')
  }

  /**
   * Tear down template by writing final set of lines
   */
  private teardown (buffer: string[]) {
    /**
     * Close try and catch block
     */
    buffer.push('} catch (error) {')

    /**
     * Write catch block
     */
    buffer.push('ctx.reThrow(error);')

    /**
     * End catch block
     */
    buffer.push('}')

    /**
     * Return output variable
     */
    buffer.push(`return ${this.options.outputVar};`)

    /**
     * End closure function when [[wrapInsideFunction]] is true
     */
    if (this.wrapInsideFunction) {
      buffer.push('})(template, ctx)')
    }
  }

  /**
   * Update the filename at runtime
   */
  private updateFileName (filename: string) {
    if (this.currentFileName !== filename) {
      this.currentFileName = filename
      this.buffer.push(`${this.options.fileNameVar} = '${filename}';`)
    }
  }

  /**
   * Update the line number at runtime
   */
  private updateLineNumber (lineNumber: number) {
    if (lineNumber > 0 && this.currentLineNumber !== lineNumber) {
      this.currentLineNumber = lineNumber
      this.buffer.push(`${this.options.lineVar} = ${lineNumber};`)
    }
  }

  /**
   * Write raw text to the output variable
   */
  public outputRaw (text: string) {
    this.buffer.push(`${this.options.outputVar} += ${stringify(text)};`)
  }

  /**
   * Write JS expression to the output variable
   */
  public outputExpression (
    text: string,
    filename: string,
    lineNumber: number,
    wrapInsideBackTicks: boolean,
  ) {
    this.updateFileName(filename)
    this.updateLineNumber(lineNumber)
    text = wrapInsideBackTicks ? `\`\${${text}}\`` : text
    this.buffer.push(`${this.options.outputVar} += ${text};`)
  }

  /**
   * Write JS expression
   */
  public writeExpression (text: string, filename: string, lineNumber: number) {
    this.updateFileName(filename)
    this.updateLineNumber(lineNumber)
    this.buffer.push(`${text};`)
  }

  /**
   * Write JS statement. Statements are not suffixed with a semi-colon. It
   * means, they can be used for writing `if/else` statements.
   */
  public writeStatement (text: string, filename: string, lineNumber: number) {
    this.updateFileName(filename)
    this.updateLineNumber(lineNumber)
    this.buffer.push(`${text}`)
  }

  /**
   * Wrap template with a custom prefix and suffix
   */
  public wrap (prefix: string, suffix: string): void {
    this.prefix.push(prefix)
    this.suffix.push(suffix)
  }

  /**
   * Return template as a string
   */
  public flush (): string {
    if (this.compiledOutput !== undefined) {
      return this.compiledOutput
    }

    let buffer: string[] = []

    this.prefix.forEach((text) => {
      text.split(EOL).forEach((line) => (buffer.push(`${line}`)))
    })

    this.setup(buffer)
    buffer = buffer.concat(this.buffer)
    this.teardown(buffer)

    this.suffix.forEach((text) => {
      text.split(EOL).forEach((line) => buffer.push(`${line}`))
    })

    this.compiledOutput = buffer.join(EOL)
    return this.compiledOutput
  }
}
