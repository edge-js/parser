/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    return parser.acornToEdgeExpression(statement.expression)
  },
}
