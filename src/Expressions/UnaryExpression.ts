/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.argument = parser.acornToEdgeExpression(statement.argument)
    return statement
  },
}
