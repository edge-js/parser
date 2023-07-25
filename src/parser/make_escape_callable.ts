/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Returns Acorn complaint AST for a callable expression
 */
export function makeEscapeCallable(paths: string | [string, string], args: object[]): any {
  if (typeof paths === 'string') {
    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: paths,
      },
      arguments: args,
    }
  }

  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: paths[0],
      },
      property: {
        type: 'Identifier',
        name: paths[1],
      },
    },
    arguments: args,
  }
}
