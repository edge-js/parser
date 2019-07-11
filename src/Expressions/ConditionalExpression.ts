/**
 * @module parser
 */

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
    statement.test = parser.acornToEdgeExpression(statement.test)
    statement.consequent = parser.acornToEdgeExpression(statement.consequent)
    statement.alternate = parser.acornToEdgeExpression(statement.alternate)
    return statement
  },
}
