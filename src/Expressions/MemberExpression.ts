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
    statement.object = transformAst(statement.object, filename, localVariables)
    return statement
  },
}
