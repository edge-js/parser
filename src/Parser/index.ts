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

export default class Parser implements IParser {
  private parseInvoked: boolean = false
  private tokenizer: Tokenizer

  constructor (template: string, tags) {
    this.tokenizer = new Tokenizer(template, tags)
  }

  public parseStatement (statement: any) {
    if (Expressions[statement.type]) {
      return Expressions[statement.type].toStatement(statement, this)
    }

    throw new Error(`${statement.type}: Expression not allowed`)
  }

  public toString (): string {
    const buffer = new EdgeBuffer()

    this.parse((node) => {
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

  public toObject (): object[] {
    const tokens = []
    this.parse((node) => (tokens.push(node)))

    return tokens
  }

  private normalizeJsArg (arg: string): string {
    return arg.replace(/^\n|\n$/g, '')
  }

  private isEscaped (type: Contracts.MustacheType): boolean {
    return [Contracts.MustacheType.EMUSTACHE, Contracts.MustacheType.ESMUSTACHE].indexOf(type) > -1
  }

  private parse (cb: (any)): void {
    this.tokenizer.parse()

    this.tokenizer.tokens.forEach((token) => {
      if (token.type === 'raw') {
        cb(`'${token.value}'`)
        return
      }

      if (token.type === 'newline') {
        cb(`'\\n'`)
        return
      }

      if (token.properties.name === Contracts.MustacheType.EMUSTACHE) {
        cb(`\`{{${token.properties.jsArg}}}\``)
        return
      }

      if (token.properties.name === Contracts.MustacheType.ESMUSTACHE) {
        cb(`\`{{{${token.properties.jsArg}}}}\``)
        return
      }

      if (token.type === 'mustache') {
        const props = (token as Contracts.IMustacheNode).properties
        const ast = acorn.parse(this.normalizeJsArg(props.jsArg))
        const nodes = ast.body.map((node) => this.parseStatement(node))

        if (props.name === Contracts.MustacheType.SMUSTACHE) {
          cb(getCallExpression(nodes))
          return
        }

        cb(nodes[0])
        return
      }
    })
  }
}
