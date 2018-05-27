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

import Tokenizer = require('edge-lexer')
import Contracts = require('edge-lexer/build/Contracts')
import * as acorn from 'acorn'
import { generate } from 'astring'

import { IParser } from '../Contracts'
import EdgeBuffer from '../EdgeBuffer'
import { getCallExpression } from '../utils'
import Expressions = require('../Expressions')
import { UnAllowedExpressionException } from '../Exceptions'

export default class Parser implements IParser {
  private parseInvoked: boolean = false

  constructor (public tags: object) {
  }

  /**
   * Parses a given acorn statement.
   */
  public parseStatement (statement: any) {
    if (Expressions[statement.type]) {
      return Expressions[statement.type].toStatement(statement, this)
    }

    const { type, loc } = statement
    throw UnAllowedExpressionException.invoke(type, loc.line, loc.col)
  }

  /**
   * Converts a given acorn statement node to it's string
   * representation
   */
  public statementToString (statement: any): string {
    const parsed = this.parseStatement(statement)
    return generate(parsed)
  }

  /**
   * Parses the template string to a function string, which
   * can be invoked using `new Function` keyword.
   */
  public parseTemplate (template: string): string {
    const buffer = new EdgeBuffer()

    this.parse(template, (node) => {
      if (typeof(node) === 'string') {
        buffer.writeLine(node)
        return
      }

      if (node.type === 'TemplateLiteral') {
        buffer.writeLine(generate(node))
        return
      }

      buffer.writeInterpol(generate(node))
    })

    return buffer.flush()
  }

  /**
   * Normalizes jsArg by removing newlines from starting and end.
   * It is done to get right line numbers when parsing the
   * arg.
   */
  private normalizeJsArg (arg: string): string {
    return arg.replace(/^\n|\n$/g, '')
  }

  /**
   * Returns a boolean telling if a token type is escaped and
   * hence not be processed
   */
  private isEscaped (type: Contracts.MustacheType): boolean {
    return [Contracts.MustacheType.EMUSTACHE, Contracts.MustacheType.ESMUSTACHE].indexOf(type) > -1
  }

  /**
   * Parses template into tokens and then each token is processed
   * with acorn.
   *
   * This method will invoke the callback for each token and the
   * entire process is synchrohous.
   */
  private parse (template: string, cb: (any)): void {
    const tokenizer = new Tokenizer(template, this.tags)
    tokenizer.parse()

    tokenizer.tokens.forEach((token) => {
      /**
       * Raw node
       */
      if (token.type === 'raw') {
        cb(`'${token.value}'`)
        return
      }

      /**
       * New line node
       */
      if (token.type === 'newline') {
        cb(`'\\n'`)
        return
      }

      /**
       * Token is a mustache node, but is escaped
       */
      if (token.properties.name === Contracts.MustacheType.EMUSTACHE) {
        cb(`\`{{${token.properties.jsArg}}}\``)
        return
      }

      /**
       * Token is a safe mustache node, but is escaped
       */
      if (token.properties.name === Contracts.MustacheType.ESMUSTACHE) {
        cb(`\`{{{${token.properties.jsArg}}}}\``)
        return
      }

      /**
       * Token is a mustache node and must be processed as a Javascript
       * expression
       */
      if (token.type === 'mustache') {
        const props = (token as Contracts.IMustacheNode).properties

        const ast = acorn.parse(this.normalizeJsArg(props.jsArg), {
          locations: true,
          ecmaVersion: 7,
        })

        const node = this.parseStatement(ast.body[0])

        /**
         * If safe node, then wrap it inside a function to disable escaping
         */
        if (props.name === Contracts.MustacheType.SMUSTACHE) {
          cb(getCallExpression([node], 'safe'))
          return
        }

        cb(node)
        return
      }
    })
  }
}
