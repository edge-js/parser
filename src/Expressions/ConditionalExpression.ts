/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.test = parser.parseStatement(statement.test)
    statement.consequent = parser.parseStatement(statement.consequent)
    statement.alternate = parser.parseStatement(statement.alternate)
    return statement
  },
}
