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
    statement.test = transformAst(statement.test, filename, localVariables)
    statement.consequent = transformAst(statement.consequent, filename, localVariables)
    statement.alternate = transformAst(statement.alternate, filename, localVariables)
    return statement
  },
}
