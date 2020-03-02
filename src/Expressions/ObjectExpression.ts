/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

export default {
  toStatement (statement, parser) {
    statement.properties = statement.properties.map((node) => {
      /**
       * Since we change the structure of node.value, we have to
       * turn of shorthand objects, so that the astring outputs
       * the key name explicitly
       */
      node.shorthand = false

      if (node.computed === true) {
        node.key = parser.acornToEdgeExpression(node.key)
      }
      node.value = parser.acornToEdgeExpression(node.value)
      return node
    })

    return statement
  },
}
