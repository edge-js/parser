export default {
  toStatement (statement, parser) {
    statement.elements = statement.elements.map((element) => parser.parseStatement(element))
    return statement
  },
}
