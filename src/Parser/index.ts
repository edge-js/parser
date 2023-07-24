/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EOL } from 'node:os'
import { Token, TagToken, TagTypes, Tokenizer, MustacheToken, MustacheTypes } from 'edge-lexer'

import { Stack } from '../stack/index.js'
import { stringify } from './stringify.js'
import { EdgeBuffer } from '../edge_buffer/index.js'
import { generateAST } from './generate_ast.js'
import { transformAst } from './transform_ast.js'
import { makeEscapeCallable } from './make_escape_callable.js'
import { makeStatePropertyAccessor } from './make_state_property_accessor.js'
import { ParserTagDefinitionContract, ParserOptions } from '../types.js'
import {
  collectObjectExpressionProperties,
  collectArrayExpressionProperties,
} from './collect_object_expression_properties.js'

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
 * const tokens = parser.parse(template)
 * console.log(fn)
 * ```
 */
export class Parser {
  /**
   * A boolean to know if async mode is enabled
   */
  asyncMode: boolean

  constructor(
    public tags: { [key: string]: ParserTagDefinitionContract },
    public stack: Stack = new Stack(),
    public options: ParserOptions
  ) {
    this.asyncMode = !!this.options.async
  }

  /**
   * Parser utilities work with the AST
   */
  utils = {
    generateAST: generateAST,
    transformAst,
    stringify,
    makeEscapeCallable,
    makeStatePropertyAccessor,
    collectObjectExpressionProperties,
    collectArrayExpressionProperties,
    getExpressionLoc(expression: any): { line: number; col: number } {
      const loc = expression.loc || expression.property?.loc
      return {
        line: loc.start.line,
        col: loc.start.column,
      }
    },
  }

  /**
   * Returns the options to be passed to the tokenizer
   */
  private getTokenizerOptions(options: { filename: string }) {
    if (!this.options) {
      return options
    }

    return {
      claimTag: this.options.claimTag,
      onLine: this.options.onLine,
      filename: options.filename,
    }
  }

  /**
   * Process escaped tag token by writing it as it is. However, the children
   * inside a tag are still processed.
   */
  private processEscapedTagToken(token: TagToken, buffer: EdgeBuffer) {
    /**
     * Since `jsArg` can span over multiple lines, we split it into multiple lines
     * and write one line at a time to maintain the original shape.
     */
    const lines = `@${token.properties.name}(${token.properties.jsArg})`.split('\n')
    lines.forEach((line) => buffer.outputRaw(line))

    /**
     * Process all inner children of the tag
     */
    token.children.forEach((child) => this.processToken(child, buffer))

    /**
     * Close the tag
     */
    buffer.outputRaw(`@end${token.properties.name}`)
  }

  /**
   * Process escaped muscahe block by writing it as it is.
   */
  private processEscapedMustache(token: MustacheToken, buffer: EdgeBuffer) {
    const lines =
      token.type === MustacheTypes.EMUSTACHE
        ? `{{${token.properties.jsArg}}}`.split('\n')
        : `{{{${token.properties.jsArg}}}}`.split('\n')

    lines.forEach((line) => buffer.outputRaw(line))
  }

  /**
   * Process mustache token
   */
  private processMustache({ properties, loc, filename, type }: MustacheToken, buffer: EdgeBuffer) {
    const node = transformAst(generateAST(properties.jsArg, loc, filename), filename, this)

    /**
     * Wrap mustache output to an escape call for preventing XSS attacks
     */
    const expression =
      type === MustacheTypes.MUSTACHE
        ? makeEscapeCallable(this.options.escapeCallPath, [node])
        : node

    /**
     * Template literal, so there is no need to wrap it inside another
     * template string
     */
    if (node.type === 'TemplateLiteral') {
      buffer.outputExpression(stringify(expression), filename, loc.start.line, false)
    } else if (node.type === 'FunctionDeclaration') {
      buffer.outputExpression(stringify(node), filename, loc.start.line, false)
    } else {
      buffer.outputExpression(stringify(expression), filename, loc.start.line, true)
    }
  }

  /**
   * Convert template to tokens
   */
  tokenize(template: string, options: { filename: string }) {
    const tokenizer = new Tokenizer(template, this.tags, this.getTokenizerOptions(options))
    tokenizer.parse()
    return tokenizer.tokens
  }

  /**
   * Process a lexer token. The output gets written to the buffer
   */
  processToken(token: Token, buffer: EdgeBuffer) {
    switch (token.type) {
      case 'raw':
        buffer.outputRaw(token.value)
        break
      case 'newline':
        buffer.outputRaw(EOL === '\n' ? '\n' : '\r\n')
        break
      case TagTypes.TAG:
        if (typeof this.options.onTag === 'function') {
          this.options.onTag(token)
        }
        this.tags[token.properties.name].compile(this, buffer, token as TagToken)
        break
      case TagTypes.ETAG:
        this.processEscapedTagToken(token, buffer)
        break
      case MustacheTypes.EMUSTACHE:
      case MustacheTypes.ESMUSTACHE:
        this.processEscapedMustache(token, buffer)
        break
      case MustacheTypes.SMUSTACHE:
      case MustacheTypes.MUSTACHE:
        if (typeof this.options.onMustache === 'function') {
          this.options.onMustache(token)
        }
        this.processMustache(token, buffer)
    }
  }
}
