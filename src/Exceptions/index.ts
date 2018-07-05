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

import * as NE from 'node-exceptions'

class BaseException extends NE.LogicalException {
  public line: number

  constructor (message: string, status: number, code: string, errShLink?: string) {
    super(message, status, code, errShLink)
  }
}

export class UnAllowedExpressionException extends BaseException {
  public static invoke (expression: string, line: number): UnAllowedExpressionException {
    const message = `${expression} is not allowed`
    const error = new this(message, 500, 'E_UNALLOWED_EXPRESSION')

    error.line = line
    return error
  }
}

export class InvalidAssignmentExpression extends BaseException {
  public static invoke (line: number): InvalidAssignmentExpression {
    const message = 'Make use of @set tag to define nested properties.'
    const error = new this(message, 500, 'E_INVALID_ASSGIGMENT_EXPRESSION')

    error.line = line
    return error
  }
}
