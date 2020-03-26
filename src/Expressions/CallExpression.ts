/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { transformAst } from '../Parser/transformAst'

export default {
  toStatement (statement: any, filename: string, localVariables: Set<string>) {
    statement.callee = transformAst(statement.callee, filename, localVariables)
    statement.arguments = statement.arguments.map((node: any) => transformAst(node, filename, localVariables))
    return statement
  },
}
