/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.object = parser.parseStatement(statement.object)
    return statement
  },
}
