export default {
  toStatement (statement, parser) {
    statement.expressions = statement.expressions.map((expression) => {
      return parser.parseStatement(expression)
    })

    return statement
  },
}
