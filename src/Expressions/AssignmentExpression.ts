/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.right = parser.parseStatement(statement.right)
    return statement
  },
}
