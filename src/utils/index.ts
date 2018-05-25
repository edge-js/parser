/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

function getCallExpression (args: object[]): object {
  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'ctx',
      },
      property: {
        type: 'Identifier',
        name: 'safe',
      },
    },
    arguments: args,
  }
}

export { getCallExpression as getCallExpression }
