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
 * Buffer class to construct template
 */
export class EdgeBuffer {
  private options = {
    outputVar: 'out',
    fileNameVar: 'edge_filename',
    lineVar: 'edge_debug_line',
  }

  /**
   * Indentation level
   */
  private indentation = 0

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
   * A boolean to track if teardown has been performed or
   * not. This is done to ensure that multiple calls to
   * `flush` method doesn't change the outpt
   */
  private teardownPerformed = false

  constructor (
    private filename: string,
    private wrapInsideFunction: boolean,
    options?: { outputVar?: string, fileNameVar?: string, lineVar?: string }
  ) {
    Object.assign(this.options, options)
    this.setup()
  }

  /**
   * Setup template with initial set of lines
   */
  private setup () {
    /**
     * Output closure function when [[wrapInsideFunction]] is true
     */
    if (this.wrapInsideFunction) {
      this.buffer.push(`${this.getWhitespace()}(function (template, ctx) {`)
      this.indent()
    }

    /**
     * Define output variable
     */
    this.buffer.push(`${this.getWhitespace()}let ${this.options.outputVar} = '';`)

    /**
     * Define line number variable
     */
    this.buffer.push(`${this.getWhitespace()}let ${this.options.lineVar} = ${this.currentLineNumber};`)

    /**
     * Define filename variable
     */
    this.buffer.push(`${this.getWhitespace()}let ${this.options.fileNameVar} = '${this.currentFileName}';`)

    /**
     * Write try block
     */
    this.buffer.push(`${this.getWhitespace()}try {`)
    this.indent()
  }

  /**
   * Tear down template by writing final set of lines
   */
  private teardown () {
    if (this.teardownPerformed) {
      return
    }

    this.teardownPerformed = true

    /**
     * Close try and catch block
     */
    this.dedent()
    this.buffer.push(`${this.getWhitespace()}} catch (error) {`)

    /**
     * Write catch block
     */
    this.indent()
    this.buffer.push(`${this.getWhitespace()}ctx.reThrow(error, ${this.options.fileNameVar}, ${this.options.lineVar});`)

    /**
     * End catch block
     */
    this.dedent()
    this.buffer.push(`${this.getWhitespace()}}`)

    /**
     * Return output variable
     */
    this.buffer.push(`${this.getWhitespace()}return ${this.options.outputVar};`)

    /**
     * End closure function when [[wrapInsideFunction]] is true
     */
    if (this.wrapInsideFunction) {
      this.dedent()
      this.buffer.push(`${this.getWhitespace()}})(template, ctx)`)
    }
  }

  /**
   * Returns whitespace for given indentation number
   */
  private getWhitespace (indentation: number = this.indentation) {
    indentation = indentation < 0 ? 0 : indentation
    return new Array(indentation + 1).join(' ')
  }

  /**
   * Update the filename at runtime
   */
  private updateFileName (filename: string) {
    if (this.currentFileName !== filename) {
      this.currentFileName = filename
      this.buffer.push(`${this.getWhitespace()}${this.options.fileNameVar} = '${filename}';`)
    }
  }

  /**
   * Update the line number at runtime
   */
  private updateLineNumber (lineNumber: number) {
    if (this.currentLineNumber !== lineNumber) {
      this.currentLineNumber = lineNumber
      this.buffer.push(`${this.getWhitespace()}${this.options.lineVar} = ${lineNumber};`)
    }
  }

  /**
   * Indent upcoming lines by two spaces
   */
  public indent () {
    this.indentation += 2
  }

  /**
   * Dedent upcoming lines by two spaces
   */
  public dedent () {
    this.indentation -= 2
  }

  /**
   * Write raw text to the output variable
   */
  public outputRaw (text: string) {
    text = text.replace(/[']/g, '\\\'')
    this.buffer.push(`${this.getWhitespace()}${this.options.outputVar} += '${text}';`)
  }

  /**
   * Write JS expression to the output variable
   */
  public outputExpression (text: string, filename: string, lineNumber: number, wrapInsideBackTicks: boolean) {
    this.updateFileName(filename)
    this.updateLineNumber(lineNumber)
    text = wrapInsideBackTicks ? `\`\${${text}}\`` : text
    this.buffer.push(`${this.getWhitespace()}${this.options.outputVar} += ${text};`)
  }

  /**
   * Write JS expression
   */
  public writeExpression (text: string, filename: string, lineNumber: number) {
    this.updateFileName(filename)
    this.updateLineNumber(lineNumber)
    this.buffer.push(`${this.getWhitespace()}${text};`)
  }

  /**
   * Write JS statement. Statements are not suffixed with a semi-colon. It
   * means, they can be used for writing `if/else` statements.
   */
  public writeStatement (text: string, filename: string, lineNumber: number) {
    this.updateFileName(filename)
    this.updateLineNumber(lineNumber)
    this.buffer.push(`${this.getWhitespace()}${text}`)
  }

  /**
   * Return template as a string
   */
  public flush (): string {
    this.teardown()
    return this.buffer.join(EOL)
  }
}
