/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EOL } from 'node:os'
// @ts-ignore untyped module
import stringify from 'js-stringify'

/**
 * Buffer class to construct template
 */
export class EdgeBuffer {
  #outputFileAndLineNumber = true
  #outputOutVariable = true
  #outputReturnStatement = true
  #wrapInsideTryCatch = true

  #options = {
    outputVar: '',
    rethrowCallPath: '',
    fileNameVar: '$filename',
    lineVar: '$lineNumber',
  }

  /**
   * Prefixes and suffix to wrap the final output
   */
  #prefix: string[] = []
  #suffix: string[] = []

  /**
   * Collected lines
   */
  #buffer: string[] = []

  /**
   * Current runtime line number
   */
  #currentLineNumber = 1

  #filename: string

  /**
   * Current runtime filename
   */
  #currentFileName: string

  /**
   * Cached compiled output. Once this value is set, the `flush`
   * method will become a noop
   */
  #compiledOutput: string | undefined

  /**
   * Exposing output variable name
   */
  outputVariableName: string

  constructor(
    filename: string,
    options: { outputVar: string; rethrowCallPath: string | [string, string] }
  ) {
    this.#filename = filename
    this.#currentFileName = this.#filename
    this.outputVariableName = options.outputVar
    this.#options.outputVar = options.outputVar
    this.#options.rethrowCallPath = Array.isArray(options.rethrowCallPath)
      ? options.rethrowCallPath.join('.')
      : options.rethrowCallPath
  }

  /**
   * Creates a new buffer instance by merging the options from the existing one
   */
  create(
    filename: string,
    options: { outputVar?: string; rethrowCallPath?: string | [string, string] }
  ) {
    return new EdgeBuffer(filename, Object.assign({}, this.#options, options))
  }

  /**
   * Returns the size of buffer text
   */
  get size() {
    return this.#buffer.length
  }

  /**
   * Setup template with initial set of lines
   */
  #setup(buffer: string[]) {
    /**
     * Define output variable
     */
    this.#outputOutVariable && buffer.push(`let ${this.outputVariableName} = "";`)

    /**
     * Define line number variable
     */
    this.#outputFileAndLineNumber && buffer.push(`let ${this.#options.lineVar} = 1;`)

    /**
     * Define filename variable
     */
    this.#outputFileAndLineNumber &&
      buffer.push(`let ${this.#options.fileNameVar} = ${stringify(this.#filename)};`)

    /**
     * Write try block
     */
    this.#wrapInsideTryCatch && buffer.push('try {')
  }

  /**
   * Tear down template by writing final set of lines
   */
  #teardown(buffer: string[]) {
    if (this.#wrapInsideTryCatch) {
      /**
       * Close try and catch block
       */
      buffer.push('} catch (error) {')

      /**
       * Write catch block
       */
      buffer.push(
        `${this.#options.rethrowCallPath}(error, ${this.#options.fileNameVar}, ${
          this.#options.lineVar
        });`
      )

      /**
       * End catch block
       */
      buffer.push('}')
    }

    /**
     * Return output variable
     */
    this.#outputReturnStatement && buffer.push(`return ${this.outputVariableName};`)
  }

  /**
   * Update the filename at runtime
   */
  #updateFileName(filename: string) {
    if (this.#currentFileName !== filename) {
      this.#currentFileName = filename
      this.#buffer.push(`${this.#options.fileNameVar} = ${stringify(filename)};`)
    }
  }

  /**
   * Update the line number at runtime
   */
  #updateLineNumber(lineNumber: number) {
    if (lineNumber > 0 && this.#currentLineNumber !== lineNumber) {
      this.#currentLineNumber = lineNumber
      this.#buffer.push(`${this.#options.lineVar} = ${lineNumber};`)
    }
  }

  /**
   * Write raw text to the output variable
   */
  outputRaw(text: string): this {
    this.#buffer.push(`${this.outputVariableName} += ${stringify(text)};`)
    return this
  }

  /**
   * Write JS expression to the output variable
   */
  outputExpression(
    text: string,
    filename: string,
    lineNumber: number,
    templateLiteral: boolean
  ): this {
    this.#updateFileName(filename)
    this.#updateLineNumber(lineNumber)
    text = templateLiteral ? `\`\${${text}}\`` : text
    this.#buffer.push(`${this.outputVariableName} += ${text};`)
    return this
  }

  /**
   * Write JS expression
   */
  writeExpression(text: string, filename: string, lineNumber: number): this {
    this.#updateFileName(filename)
    this.#updateLineNumber(lineNumber)
    this.#buffer.push(`${text};`)
    return this
  }

  /**
   * Write JS statement. Statements are not suffixed with a semi-colon. It
   * means, they can be used for writing `if/else` statements.
   */
  writeStatement(text: string, filename: string, lineNumber: number): this {
    this.#updateFileName(filename)
    this.#updateLineNumber(lineNumber)
    this.#buffer.push(`${text}`)
    return this
  }

  /**
   * Wrap template with a custom prefix and suffix
   */
  wrap(prefix: string, suffix: string): this {
    this.#prefix.push(prefix)
    this.#suffix.push(suffix)
    return this
  }

  /**
   * Disable instantiation of the file and the line number variables.
   */
  disableFileAndLineVariables(): this {
    this.#outputFileAndLineNumber = false
    return this
  }

  /**
   * Disable instantiation of the out variable.
   */
  disableOutVariable(): this {
    this.#outputOutVariable = false
    return this
  }

  /**
   * Disable outputting the return statement
   */
  disableReturnStatement(): this {
    this.#outputReturnStatement = false
    return this
  }

  /**
   * Disable wrapping buffer output inside try/catch.
   */
  disableTryCatchBlock(): this {
    this.#wrapInsideTryCatch = false
    return this
  }

  /**
   * Return template as a string
   */
  flush(): string {
    if (this.#compiledOutput !== undefined) {
      return this.#compiledOutput
    }

    let buffer: string[] = []

    /**
     * Write prefixes
     */
    this.#prefix.forEach((text) => text.split(EOL).forEach((line) => buffer.push(`${line}`)))

    /**
     * Write setup code
     */
    this.#setup(buffer)

    /**
     * Copy template contents
     */
    buffer = buffer.concat(this.#buffer)

    /**
     * Write teardown code
     */
    this.#teardown(buffer)

    /**
     * Write prefixes
     */
    this.#suffix.forEach((text) => text.split(EOL).forEach((line) => buffer.push(`${line}`)))

    this.#compiledOutput = buffer.join(EOL)
    return this.#compiledOutput
  }
}
