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
import Expressions = require('../Expressions')

class Parser implements IParser {
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

      if (token.type === 'mustache') {
        const ast = acorn.parse((token as Contracts.IBlockNode).properties.jsArg)
        const nodes = ast.body.map((node) => this.parseStatement(node))
        cb(nodes[0])

        return
      }
    })
  }
}

export = Parser
