/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { transformAst } from '../parser/transform_ast.js'
import { Parser } from '../parser/main.js'

export default {
  toStatement(statement: any, filename: string, parser: Parser) {
    statement.test = transformAst(statement.test, filename, parser)
    statement.consequent = transformAst(statement.consequent, filename, parser)
    statement.alternate = transformAst(statement.alternate, filename, parser)
    return statement
  },
}
