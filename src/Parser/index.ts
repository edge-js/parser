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

import { EdgeBuffer } from '../EdgeBuffer'
import { getCallExpression } from '../utils'
import * as Expressions from '../Expressions'
import { UnAllowedExpressionException } from '../Exceptions'
import { ITag } from '../Contracts'

export class Parser {
  private acornArgs: object = {
    locations: true,
    ecmaVersion: 7,
  }

  constructor (public tags: { [key: string]: ITag }) {
  }

  /**
   * Parses a given acorn statement.
   */
  public parseStatement (statement: any): any {
    if (Expressions[statement.type]) {
      return Expressions[statement.type].toStatement(statement, this)
    }

    const { type, loc } = statement
    throw UnAllowedExpressionException.invoke(type, loc.start.line, loc.end.column)
  }

  /**
   * Converts a given acorn statement node to it's string
   * representation
   */
  public statementToString (statement: any): string {
    return generate(statement)
  }

  /**
   * Parses the `jsArg` property of a token and also patches
   * the lineno in the errors raised by acorn (if any)
   */
  public parseJsArg (arg: string, lineno: number): any {
    try {
      const ast = acorn.parse(arg, this.acornArgs)
      return this.parseStatement(ast.body[0])
    } catch (error) {
      error.message = error.message.replace(/\(\d+:\d+\)/, '')
      error.loc.line = (lineno + error.loc.line) - 1
      throw error
    }
  }

  /**
   * Parses the template string to a function string, which
   * can be invoked using `new Function` keyword.
   */
  public parseTemplate (template: string): string {
    const buffer = new EdgeBuffer()
    const tokenizer = new Tokenizer(template, this.tags)
    tokenizer.parse()

    tokenizer.tokens.forEach((token) => {
      this.processToken(token, buffer)
    })

    return buffer.flush()
  }

  /**
   * Process a token and writes the output to the buffer instance
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
     * A block level token (AKA tag)
     */
    if (token.type === 'block') {
      const tagInstance = new this.tags[token.properties.name]()
      tagInstance.compile(this, buffer, token as Contracts.IBlockNode)
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
      const node = this.parseJsArg(mustacheToken.properties.jsArg, mustacheToken.lineno)

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
}
