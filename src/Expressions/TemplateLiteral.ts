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
    statement.expressions = statement.expressions.map((expression) => {
      return parser.acornToEdgeExpression(expression)
    })

    return statement
  },
}
