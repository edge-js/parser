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
  private outputFileAndLineNumber = true
  private outputOutVariable = true

  private options = {
    outputVar: 'out',
    fileNameVar: '$filename',
    lineVar: '$lineNumber',
  }

  /**
   * Prefixes and suffix to wrap the final output
   */
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

  constructor (private filename: string, options?: { outputVar?: string }) {
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
     * Define output variable
     */
    this.outputOutVariable && buffer.push(`let ${this.options.outputVar} = "";`)

    /**
     * Define line number variable
     */
    this.outputFileAndLineNumber && buffer.push(`let ${this.options.lineVar} = 1;`)

    /**
     * Define filename variable
     */
    this.outputFileAndLineNumber && buffer.push(`let ${this.options.fileNameVar} = ${stringify(this.filename)};`)

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
    buffer.push(`ctx.reThrow(error, ${this.options.fileNameVar}, ${this.options.lineVar});`)

    /**
     * End catch block
     */
    buffer.push('}')

    /**
     * Return output variable
     */
    buffer.push(`return ${this.options.outputVar};`)
  }

  /**
   * Update the filename at runtime
   */
  private updateFileName (filename: string) {
    if (this.currentFileName !== filename) {
      this.currentFileName = filename
      this.buffer.push(`${this.options.fileNameVar} = ${stringify(filename)};`)
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
  public outputRaw (text: string): this {
    this.buffer.push(`${this.options.outputVar} += ${stringify(text)};`)
    return this
  }

  /**
   * Write JS expression to the output variable
   */
  public outputExpression (text: string, filename: string, lineNumber: number, templateLiteral: boolean): this {
    this.updateFileName(filename)
    this.updateLineNumber(lineNumber)
    text = templateLiteral ? `\`\${${text}}\`` : text
    this.buffer.push(`${this.options.outputVar} += ${text};`)
    return this
  }

  /**
   * Write JS expression
   */
  public writeExpression (text: string, filename: string, lineNumber: number): this {
    this.updateFileName(filename)
    this.updateLineNumber(lineNumber)
    this.buffer.push(`${text};`)
    return this
  }

  /**
   * Write JS statement. Statements are not suffixed with a semi-colon. It
   * means, they can be used for writing `if/else` statements.
   */
  public writeStatement (text: string, filename: string, lineNumber: number): this {
    this.updateFileName(filename)
    this.updateLineNumber(lineNumber)
    this.buffer.push(`${text}`)
    return this
  }

  /**
   * Wrap template with a custom prefix and suffix
   */
  public wrap (prefix: string, suffix: string): this {
    this.prefix.push(prefix)
    this.suffix.push(suffix)
    return this
  }

  /**
   * Disable instantiation of the file and the line number variables.
   */
  public disableFileAndLineVariables (): this {
    this.outputFileAndLineNumber = false
    return this
  }

  /**
   * Disable instantiation of the out variable.
   */
  public disableOutVariable (): this {
    this.outputOutVariable = false
    return this
  }

  /**
   * Return template as a string
   */
  public flush (): string {
    if (this.compiledOutput !== undefined) {
      return this.compiledOutput
    }

    let buffer: string[] = []

    /**
     * Write prefixes
     */
    this.prefix.forEach((text) => text.split(EOL).forEach((line) => (buffer.push(`${line}`))))

    /**
     * Write setup code
     */
    this.setup(buffer)

    /**
     * Copy template contents
     */
    buffer = buffer.concat(this.buffer)

    /**
     * Write teardown code
     */
    this.teardown(buffer)

    /**
     * Write prefixes
     */
    this.suffix.forEach((text) => text.split(EOL).forEach((line) => buffer.push(`${line}`)))

    this.compiledOutput = buffer.join(EOL)
    return this.compiledOutput
  }
}
