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
  toStatement (statement: any, filename: string) {
    statement.expressions = statement.expressions.map((expression: any) => {
      return transformAst(expression, filename)
    })

    return statement
  },
}
