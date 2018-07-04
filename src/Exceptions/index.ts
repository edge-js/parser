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

export class UnAllowedExpressionException extends NE.LogicalException {
  public static invoke (expression: string, line: number): UnAllowedExpressionException {
    const message = `${expression} is not allowed`
    const error = new this(message, 500, 'E_UNALLOWED_EXPRESSION')

    error.line = line
    return error
  }

  public line: number

  constructor (message: string, status: number, code: string, errShLink?: string) {
    super(message, status, code, errShLink)
  }
}
