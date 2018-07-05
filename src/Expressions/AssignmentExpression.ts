/**
 * @module Parser
 */

import { getCallExpression } from '../utils'
import { InvalidAssignmentExpression } from '../Exceptions'

export default {
  toStatement (statement, parser) {
    let left = statement.left

    if (statement.left.type === 'MemberExpression') {
      throw InvalidAssignmentExpression.invoke(statement.loc.start.line)
    }

    /* istanbul ignore else */
    if (statement.left.type === 'Identifier') {
      left = {
        type: 'Literal',
        value: statement.left.name,
        raw: `'${statement.left.name}'`,
        loc: statement.left.loc,
        start: statement.start,
        end: statement.end,
      }
    }

    const assignment = getCallExpression([left, parser.parseStatement(statement.right)], 'set')
    assignment.assignment = true
    return assignment
  },
}
