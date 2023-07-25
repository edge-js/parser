/*
 * edge-lexer
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EdgeError } from 'edge-error'

import { Parser } from './index.js'
import * as Expressions from '../expressions/index.js'

/**
 * Transform acorn AST to Edge AST. This must always be performed before
 * writing it to the compiled template buffer.
 */
export function transformAst(astExpression: any, filename: string, parser: Parser): any {
  const Expression = Expressions[astExpression.type as keyof typeof Expressions]
  if (Expression) {
    return Expression.toStatement(astExpression, filename, parser)
  }

  const { type, loc } = astExpression
  throw new EdgeError(`"${type}" is not supported`, 'E_UNALLOWED_EXPRESSION', {
    line: loc.start.line,
    col: loc.start.column,
    filename: filename,
  })
}
