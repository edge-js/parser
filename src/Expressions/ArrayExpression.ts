/**
 * @module Parser
 */

export default {
  toStatement (statement, parser) {
    statement.elements = statement.elements.map((element) => parser.acornToEdgeExpression(element))
    return statement
  },
}
