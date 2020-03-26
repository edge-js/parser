/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { Stack } from '../Stack'
import { makeStatePropertyAccessor } from '../Parser/makeStatePropertyAccessor'
const WHITE_LISTED = ['Object', 'state']

export default {
  toStatement (statement: any, _: string, stack: Stack): object {
    if (WHITE_LISTED.indexOf(statement.name) > -1 || stack.has(statement.name)) {
      return statement
    }
    return makeStatePropertyAccessor(statement)
  },
}
