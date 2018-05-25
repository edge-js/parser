export default {
  toStatement (statement, parser) {
    return parser.parseStatement(statement.expression)
  },
}
