/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { transformAst } from '../parser/transform_ast.js'
import { Parser } from '../parser/main.js'
import { EdgeError } from 'edge-error'

export default {
  toStatement(statement: any, filename: string, parser: Parser) {
    statement.properties = statement.properties.map((node: any) => {
      if (node.type === 'Property') {
        /**
         * Since we change the structure of node.value, we have to
         * turnoff shorthand objects, so that the astring outputs
         * the key name explicitly
         */
        node.shorthand = false

        if (node.computed === true) {
          node.key = transformAst(node.key, filename, parser)
        }
        node.value = transformAst(node.value, filename, parser)
        return node
      }

      if (node.type === 'SpreadElement') {
        return transformAst(node, filename, parser)
      }

      const { line, col } = parser.utils.getExpressionLoc(node)
      throw new EdgeError(
        `Report this error to the maintainers: Unexpected object property type "${node.type}"`,
        'E_PARSER_ERROR',
        {
          line,
          col,
          filename,
        }
      )
    })

    return statement
  },
}
