/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.expressions = statement.expressions.map((expression) => {
      return parser.acornToEdgeExpression(expression)
    })

    return statement
  },
}
