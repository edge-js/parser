/*
* edge-lexer
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { EdgeError } from 'edge-error'

import { Stack } from '../Stack'
import * as Expressions from '../Expressions'

/**
 * Transform acorn AST to Edge AST. This must always be performed before
 * writing it to the compiled template buffer.
 */
export function transformAst (astExpression: any, filename: string, stack: Stack): any {
  if (Expressions[astExpression.type]) {
    return Expressions[astExpression.type].toStatement(astExpression, filename, stack)
  }

  const { type, loc } = astExpression
  throw new EdgeError(`"${type}" is not supported`, 'E_UNALLOWED_EXPRESSION', {
    line: loc.start.line,
    col: loc.start.column,
    filename: filename,
  })
}
