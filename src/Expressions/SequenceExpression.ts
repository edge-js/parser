/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.expressions = statement.expressions.map((expression) => parser.parseStatement(expression))
    return statement
  },
}
