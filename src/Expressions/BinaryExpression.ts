/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.left = parser.acornToEdgeExpression(statement.left)
    statement.right = parser.acornToEdgeExpression(statement.right)
    return statement
  },
}
