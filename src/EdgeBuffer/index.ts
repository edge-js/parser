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
    fileNameVar: 'ctx.$filename',
    lineVar: 'ctx.$lineNumber',
  }

  private prefix: string[] = []
  private suffix: string[] = []

  /**
   * Indentation level
   */
  private indentation = this.wrapInsideFunction ? 4 : 2

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
    options?: { outputVar?: string, fileNameVar?: string, lineVar?: string }
  ) {
    Object.assign(this.options, options)
  }

  /**
   * Setup template with initial set of lines
   */
  private setup (buffer: string[]) {
    let indentation = this.prefix.length * 2

    /**
     * Output closure function when [[wrapInsideFunction]] is true
     */
    if (this.wrapInsideFunction) {
      buffer.push(`${this.getWhitespace(indentation)}(function (template, ctx) {`)
      indentation += 2
    }

    /**
     * Define output variable
     */
    buffer.push(`${this.getWhitespace(indentation)}let ${this.options.outputVar} = '';`)

    /**
     * Define line number variable
     */
    buffer.push(`${this.getWhitespace(indentation)}${this.options.lineVar} = 1;`)

    /**
     * Define filename variable
     */
    buffer.push(`${this.getWhitespace(indentation)}${this.options.fileNameVar} = '${this.filename}';`)

    /**
     * Write try block
     */
    buffer.push(`${this.getWhitespace(indentation)}try {`)
  }

  /**
   * Tear down template by writing final set of lines
   */
  private teardown (buffer: string[]) {
    let indentation = this.prefix.length * 2
    indentation += this.wrapInsideFunction ? 2 : 0

    /**
     * Close try and catch block
     */
    buffer.push(`${this.getWhitespace(indentation)}} catch (error) {`)

    /**
     * Write catch block
     */
    indentation += 2
    buffer.push(
      `${this.getWhitespace(indentation)}ctx.reThrow(error);`,
    )

    /**
     * End catch block
     */
    indentation -= 2
    buffer.push(`${this.getWhitespace(indentation)}}`)

    /**
     * Return output variable
     */
    buffer.push(`${this.getWhitespace(indentation)}return ${this.options.outputVar};`)

    /**
     * End closure function when [[wrapInsideFunction]] is true
     */
    if (this.wrapInsideFunction) {
      indentation -= 2
      buffer.push(`${this.getWhitespace(indentation)}})(template, ctx)`)
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
  public outputExpression (
    text: string,
    filename: string,
    lineNumber: number,
    wrapInsideBackTicks: boolean,
  ) {
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
   * Wrap template with a custom prefix and suffix
   */
  public wrap (prefix: string, suffix: string): void {
    this.indent()
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

    let indentation = 0
    let buffer: string[] = []

    this.prefix.forEach((text) => {
      text.split(EOL).forEach((line) => {
        buffer.push(`${this.getWhitespace(indentation)}${line}`)
      })
      indentation += 2
    })

    this.setup(buffer)
    buffer = buffer.concat(this.buffer)
    this.teardown(buffer)

    this.suffix.forEach((text) => {
      indentation -= 2
      text.split(EOL).forEach((line) => {
        buffer.push(`${this.getWhitespace(indentation)}${line}`)
      })
    })

    this.compiledOutput = buffer.join(EOL)
    return this.compiledOutput
  }
}
