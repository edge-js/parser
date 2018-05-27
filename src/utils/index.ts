/**
 * @module Parser
 */

/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/** @hidden */
function getCallExpression (args: object[], fnName: string): object {
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
        name: fnName,
      },
    },
    arguments: args,
  }
}

export { getCallExpression as getCallExpression }
