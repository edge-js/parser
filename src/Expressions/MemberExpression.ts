/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { transformAst } from '../Parser/transformAst'
import { Parser } from '../Parser'

export default {
  toStatement(statement: any, filename: string, parser: Parser) {
    statement.object = transformAst(statement.object, filename, parser)

    /**
     * Making the following expressions work
     *
     * user[Object.keys(user).find((k) => k === 'id')]
     * [num1, num2, num3].filter((num) => num % 2 === 0)
     */
    if (statement.property.type !== 'Identifier') {
      statement.property = transformAst(statement.property, filename, parser)
    }
    return statement
  },
}
