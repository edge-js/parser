/**
 * @module Parser
 */

/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as acorn from 'acorn'
import { generate } from 'astring'
import { EOL } from 'os'
import { Tokenizer } from 'edge-lexer'
import * as Contracts from 'edge-lexer/build/src/Contracts'
import { EdgeError } from 'edge-error'

import { EdgeBuffer } from '../EdgeBuffer'
import { getCallExpression } from '../utils'
import * as Expressions from '../Expressions'
import { ITag, ILoc } from '../Contracts'

type parserOptions = {
  filename: string,
}

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
  private acornArgs: object = {
    locations: true,
    ecmaVersion: 7,
  }

  constructor (public tags: { [key: string]: ITag }, public options: parserOptions) {
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
  public acornToEdgeExpression (statement: any): any {
    if (Expressions[statement.type]) {
      return Expressions[statement.type].toStatement(statement, this)
    }

    const { type, loc } = statement

    throw new EdgeError(`${type} is not supported`, 'UNALLOWED_EXPRESSION', {
      line: loc.start.line,
      col: loc.start.column,
      filename: this.options.filename,
    })
  }

  /**
   * Patch the loc node of acorn. Acorn generates loc from the expression passed
   * to it, which means each expression passed to acorn will have lineno as `0`.
   *
   * However, we want to patch it to the it's origin line in the template body.
   */
  public patchLoc (loc: ILoc, tokenLine: number): void {
    loc.start.line = (loc.start.line + tokenLine) - 1
    loc.end.line = (loc.end.line + tokenLine) - 1
  }

  /**
   * Converts the acorn statement to it's string representation.
   *
   * @example
   * ```js
   * const ast = acorn.parse('`Hello ${username}`', { locations: true })
   * const statement = parser.acornToEdgeExpression(ast.body[0])
   *
   * console.log(parser.statementToString(statement))
   * ```
   */
  public statementToString (statement: any): string {
    return generate(statement)
  }

  /**
   * Process ast tokens and write them to the buffer as string. The `wrapAsFunction`
   * defines, whether or not to wrap the output of template inside a scoped
   * function.
   *
   * @example
   * ```js
   * const fs = require('fs')
   * const template = fs.readFileSync('welcome.edge', 'utf-8')
   *
   * const tokens = parser.generateTokens(template)
   * parser.processTokens(tokens, false)
   * ```
   */
  public processTokens (tokens, wrapAsFunction: boolean = true): string {
    const buffer = new EdgeBuffer()
    tokens.forEach((token) => (this.processToken(token, buffer)))
    return buffer.flush(wrapAsFunction)
  }

  /**
   * Process a given [edge-lexer](https://github.com/edge-js/lexer) token and
   * write it's output to the edge buffer.
   */
  public processToken (token, buffer: EdgeBuffer): void {
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
    if (token.type === 'block') {
      this.tags[token.properties.name].compile(this, buffer, token as Contracts.IBlockNode)
      return
    }

    const mustacheToken = token as Contracts.IMustacheNode

    /**
     * Token is a mustache node, but is escaped
     */
    if (mustacheToken.properties.name === Contracts.MustacheType.EMUSTACHE) {
      buffer.writeLine(`\`{{${mustacheToken.properties.jsArg}}}\``)
      return
    }

    /**
     * Token is a safe mustache node, but is escaped
     */
    if (mustacheToken.properties.name === Contracts.MustacheType.ESMUSTACHE) {
      buffer.writeLine(`\`{{{${mustacheToken.properties.jsArg}}}}\``)
      return
    }

    /**
     * Token is a mustache node and must be processed as a Javascript
     * expression
     */
    if (mustacheToken.type === 'mustache') {
      const node = this.parseJsString(mustacheToken.properties.jsArg, mustacheToken.lineno)

      /**
       * If not safe mustache node, then wrap it inside `escape` call
       */
      if (mustacheToken.properties.name === Contracts.MustacheType.MUSTACHE) {
        buffer.writeInterpol(this.statementToString(getCallExpression([node], 'escape')))
        return
      }

      /**
       * Template literal, so there is no need to wrap it inside another
       * template string
       */
      if (node.type === 'TemplateLiteral') {
        buffer.writeLine(this.statementToString(node))
        return
      }

      buffer.writeInterpol(this.statementToString(node))
    }
  }

  /**
   * Generates the ast of a string using Acorn. This method has handful of
   * conveniences over using `acorn.parse` directly.
   *
   * 1. It will patch the `loc` node of acorn to match the lineno within the template
   *    body.
   * 2. Patches the `loc` in acorn exceptions.
   *
   * @example
   * ```
   * parse.generateAst('`Hello ${username}`', 1)
   * ```
   */
  public generateAst (arg: string, lineno: number): any {
    try {
      const ast = acorn.parse(arg, Object.assign(this.acornArgs, {
        onToken: (token) => {
          this.patchLoc(token.loc, lineno)
        },
      }))

      return ast
    } catch (error) {
      throw new EdgeError(error.message.replace(/\(\d+:\d+\)/, ''), 'E_ACORN_ERROR', {
        line: (error.loc.line + lineno) - 1,
        col: error.loc.column,
        filename: this.options.filename,
      })
    }
  }

  /**
   * Generate lexer tokens for a given template string.
   *
   * @example
   * ```js
   * parse.generateTokens('Hello {{ username }}')
   * ```
   */
  public generateTokens (template: string): Contracts.INode[] {
    const tokenizer = new Tokenizer(template, this.tags, this.options)
    tokenizer.parse()

    return tokenizer.tokens
  }

  /**
   * Parses a string by generating it's AST using `acorn` and then processing
   * the statement using [[acornToEdgeExpression]] method.
   *
   * As a **tag creator**, this is the method you will need most of the time, unless
   * you want todo use [[generateAst]] and [[acornToEdgeExpression]] seperately for some
   * advanced use cases.
   */
  public parseJsString (arg: string, lineno: number): any {
    const ast = this.generateAst(arg, lineno)
    return this.acornToEdgeExpression(ast.body[0])
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
  public parseTemplate (template: string): string {
    const tokens = this.generateTokens(template)
    return this.processTokens(tokens)
  }
}
