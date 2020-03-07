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
    statement.properties = statement.properties.map((node: any) => {
      /**
       * Since we change the structure of node.value, we have to
       * turnoff shorthand objects, so that the astring outputs
       * the key name explicitly
       */
      node.shorthand = false

      if (node.computed === true) {
        node.key = transformAst(node.key, filename)
      }
      node.value = transformAst(node.value, filename)
      return node
    })

    return statement
  },
}
