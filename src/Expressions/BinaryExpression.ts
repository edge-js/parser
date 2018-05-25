export default {
  toStatement (statement, parser) {
    statement.left = parser.parseStatement(statement.left)
    statement.right = parser.parseStatement(statement.right)
    return statement
  },
}
