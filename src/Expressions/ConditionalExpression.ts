/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.test = parser.acornToEdgeExpression(statement.test)
    statement.consequent = parser.acornToEdgeExpression(statement.consequent)
    statement.alternate = parser.acornToEdgeExpression(statement.alternate)
    return statement
  },
}
