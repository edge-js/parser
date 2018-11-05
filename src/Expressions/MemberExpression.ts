/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.object = parser.acornToEdgeExpression(statement.object)
    return statement
  },
}
