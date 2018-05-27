/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.argument = parser.parseStatement(statement.argument)
    return statement
  },
}
