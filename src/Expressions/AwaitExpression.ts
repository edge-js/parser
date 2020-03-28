/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { EdgeError } from 'edge-error'
import { transformAst } from '../Parser/transformAst'
import { Parser } from '../Parser'

const UNALLOWED_EXPRESSION_MESSAGE = 'Make sure to render template in async mode before using await expression'

export default {
  toStatement (statement: any, filename: string, parser: Parser) {
    if (!parser.asyncMode) {
      const { line, col } = parser.utils.getExpressionLoc(statement)
      throw new EdgeError(UNALLOWED_EXPRESSION_MESSAGE, 'E_PARSER_ERROR', {
        line,
        col,
        filename,
      })
    }

    statement.argument = transformAst(statement.argument, filename, parser)
    return statement
  },
}
