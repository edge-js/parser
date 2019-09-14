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
import { parse as acornParse } from 'acorn'
import { generate } from 'astring'
import { EdgeError } from 'edge-error'
import { LexerLoc } from 'edge-lexer/build/src/Contracts'
import { Tokenizer, TagToken, MustacheTypes, TagTypes } from 'edge-lexer'

import { EdgeBuffer } from '../EdgeBuffer'
import { getCallExpression } from '../utils'
import * as Expressions from '../Expressions'
import { ParseTagDefininationContract, AcornLoc, ParserToken } from '../Contracts'

/**
 * Edge parser converts template strings to an invokable function. This module
 * uses [edge-lexer](https://github.com/edge-js/lexer) to generate a list
 * of tokens and process them against [acorn](https://npm.im/acorn).
 *
 * Edge has concepts of Tags, which are not implemented by this module and must
 * be provided by the consumer.
 *
 * ```js
 * // Tags are optional
 * const tags = {}
 *
 * // File name is required for better error reporting
 * const options = { filename: 'welcome.edge' }
 *
 * const parser = new Parser(tags, options)
 * const template = require('fs').readFileSync('welcome.edge', 'utf-8')
 *
 * const fn = parser.parseTemplate(template)
 * console.log(fn)
 * ```
 */
export class Parser {
  private _acornArgs = {
    locations: true,
    ecmaVersion: 7,
  }

  /**
   * Each token that is processed by the parser can also define it's own
   * filename. This takes it possible to merge tokens of multiple source
   * files and have the filename as a context on the token.
   *
   * Once we find a custom filename on a token, then we will add that filename
   * to the stack and once we are done processing the token, we will remove
   * it from stack.
   */
  private _tokenFilesStack: string[] = []

  constructor (
    public tags: { [key: string]: ParseTagDefininationContract },
    public options: { filename: string },
  ) {}

  private _addFileNameToStack (filename?: string) {
    if (filename) {
      this._tokenFilesStack.push(filename)
    }
  }

  private _removeFromStack () {
    this._tokenFilesStack.pop()
  }

  private _getFileName () {
    return this._tokenFilesStack[this._tokenFilesStack.length - 1] || this.options.filename
  }

  /**
   * Patch the loc node of acorn. Acorn generates loc from the expression passed
   * to it, which means each expression passed to acorn will have lineno as `0`.
   *
   * However, we want to patch it to the it's origin line in the template body.
   */
  private _patchLoc (loc: AcornLoc, lexerLoc: LexerLoc): void {
    loc.start.line = (loc.start.line + lexerLoc.start.line) - 1
    loc.end.line = (loc.end.line + lexerLoc.start.line) - 1

    /**
     * Patch the column also, when it's the first line. The reason we do this, since
     * the first line in the actual edge file may contain the Javascript expression
     * at a different column all together
     */
    if (loc.start.line === 1) {
      loc.start.column = loc.start.column + lexerLoc.start.col
    }
  }

  /**
   * Process a given [edge-lexer](https://github.com/edge-js/lexer) token and
   * write it's output to the edge buffer.
   */
  public processLexerToken (token: ParserToken, buffer: EdgeBuffer): void {
    /**
     * Raw node
     */
    if (token.type === 'raw') {
      buffer.writeRaw(token.value)
      return
    }

    /**
     * New line node
     */
    if (token.type === 'newline') {
      buffer.writeRaw(EOL === '\n' ? '\\n' : '\\r\\n')
      return
    }

    /**
     * A block level token (AKA tag). The tag creator defines how to process the
     * tag contents and where to write it's output.
     */
    if (token.type === TagTypes.TAG) {
      this._addFileNameToStack(token.filename)
      this.tags[token.properties.name].compile(this, buffer, token as TagToken)
      this._removeFromStack()
      return
    }

    /**
     * A tag which is escaped, so we can write it as it is
     */
    if (token.type === TagTypes.ETAG) {
      this._addFileNameToStack(token.filename)

      /**
       * Since `jsArg` can span over multiple lines, we split it into multiple lines
       * and write one line at a time to maintain the original shape.
       */
      const lines = `@${token.properties.name}(${token.properties.jsArg})`.split('\n')
      lines.forEach((line) => buffer.writeRaw(line))

      /**
       * Process all inner children of the tag
       */
      token.children.forEach((child) => this.processLexerToken(child, buffer))

      /**
       * Close the tag
       */
      buffer.writeRaw(`@end${token.properties.name}`)
      this._removeFromStack()
      return
    }

    /**
     * Re-write the escaped mustache statements without processing them
     */
    if ([MustacheTypes.EMUSTACHE, MustacheTypes.ESMUSTACHE].indexOf(token.type) > -1) {
      const lines = token.type === MustacheTypes.EMUSTACHE
        ? `{{${token.properties.jsArg}}}`.split('\n')
        : `{{{${token.properties.jsArg}}}}`.split('\n')

      lines.forEach((line) => buffer.writeRaw(line))
      return
    }

    /**
     * Token is a mustache node and must be processed as a Javascript
     * expression
     */
    if ([MustacheTypes.SMUSTACHE, MustacheTypes.MUSTACHE].indexOf(token.type) > -1) {
      this._addFileNameToStack(token.filename)

      const node = this.generateEdgeExpression(token.properties.jsArg, token.loc)
      const expression = token.type === MustacheTypes.MUSTACHE
        ? getCallExpression([node], 'escape')
        : node

      /**
       * Template literal, so there is no need to wrap it inside another
       * template string
       */
      if (node.type === 'TemplateLiteral') {
        buffer.writeLine(this.stringifyExpression(expression))
      } else {
        buffer.writeInterpol(this.stringifyExpression(expression))
      }

      this._removeFromStack()
    }
  }

  /**
   * Generate lexer tokens for a given template string.
   *
   * @example
   * ```js
   * parse.generateLexerTokens('Hello {{ username }}')
   * ```
   */
  public generateLexerTokens (template: string): ParserToken[] {
    const tokenizer = new Tokenizer(template, this.tags, this.options)
    tokenizer.parse()

    return tokenizer.tokens
  }

  /**
   * Parses an acorn statement further to make it work with Edge eco-system. Since
   * Acorn is a pure Javascript parser, we need to modify it's expressions to
   * make them work properly with Edge.
   *
   * Also this method will raise an exception, if the expression is not one of
   * the [whitelisted expressions](/README.md#supported-expressions).
   *
   * @example
   * ```js
   * const ast = acorn.parse('`Hello ${username}`', { locations: true })
   * console.log(parser.acornToEdgeExpression(ast.body[0]))
   * ```
   */
  public acornToEdgeExpression (expression: any): any {
    if (Expressions[expression.type]) {
      return Expressions[expression.type].toStatement(expression, this)
    }

    const { type, loc } = expression

    throw new EdgeError(`${type} is not supported`, 'E_UNALLOWED_EXPRESSION', {
      line: loc.start.line,
      col: loc.start.column,
      filename: this._getFileName(),
    })
  }

  /**
   * Converts the acorn statement to it's string representation.
   *
   * @example
   * ```js
   * const ast = acorn.parse('`Hello ${username}`', { locations: true })
   * const statement = parser.stringifyExpression(ast.body[0])
   *
   * console.log(parser.stringifyExpression(statement))
   * ```
   */
  public stringifyExpression (expression: any): string {
    return generate(expression)
  }

  /**
   * Generates the ast of a string using Acorn. This method has handful of
   * conveniences over using `acorn.parse` directly.
   *
   * 1. It will patch the `loc` node of acorn to match the lineno within the template
   *    body.
   * 2. Patches the `loc` in acorn exceptions.
   * 3. Returns the first expression in the Node.body
   *
   * @example
   * ```
   * const expression = parse.generateAcornExpression('`Hello ${username}`', 1)
   * console.log(expression.type)
   * ```
   */
  public generateAcornExpression (arg: string, lexerLoc: LexerLoc): any {
    try {
      const ast = acornParse(arg, Object.assign(this._acornArgs, {
        onToken: (token) => {
          this._patchLoc(token.loc, lexerLoc)
        },
      }))

      return ast['body'][0]
    } catch (error) {
      /**
       * The error loc is not passed via `onToken` event, so need
       * to patch is here seperately
       */
      const line = (error.loc.line + lexerLoc.start.line) - 1
      const col = error.loc.line === 1 ? error.loc.column + lexerLoc.start.col : error.loc.column

      throw new EdgeError(error.message.replace(/\(\d+:\d+\)/, ''), 'E_ACORN_ERROR', {
        line,
        col,
        filename: this._getFileName(),
      })
    }
  }

  /**
   * Parses a string by generating it's AST using `acorn` and then processing
   * the statement using [[acornToEdgeExpression]] method.
   *
   * As a **tag creator**, this is the method you will need most of the time, unless
   * you want todo use [[generateAcornExpression]] and [[acornToEdgeExpression]] seperately
   * for some advanced use cases.
   */
  public generateEdgeExpression (jsArg: string, loc: LexerLoc): any {
    return this.acornToEdgeExpression(this.generateAcornExpression(jsArg, loc))
  }

  /**
   * Parse the entire template to a top-level invokable function string.
   *
   * ```js
   * const fs = require('fs')
   * const template = fs.readFileSync('welcome.edge', 'utf-8')
   *
   * const parser = new Parser({}, { filename: 'welcome.edge' })
   * const fn = parser.parseTemplate(template)
   *
   * console.log(fn)
   * ```
   */
  public parseTemplate (template: string, wrapAsFunction = true): string {
    const buffer = new EdgeBuffer()

    const tokens = this.generateLexerTokens(template)
    tokens.forEach((token) => (this.processLexerToken(token, buffer)))

    return buffer.flush(wrapAsFunction)
  }
}
