/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

/** @hidden */
export function getCallExpression (args: object[], fnName: string): any {
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
