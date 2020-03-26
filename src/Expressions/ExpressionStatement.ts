/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { transformAst } from '../Parser/transformAst'
import { Stack } from '../Stack'

export default {
  toStatement (statement: any, filename: string, stack: Stack) {
    return transformAst(statement.expression, filename, stack)
  },
}
