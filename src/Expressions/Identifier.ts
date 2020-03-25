/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { makePropertyAccessor } from '../Parser/makePropertyAccessor'
const WHITE_LISTED = ['Object', 'state']

export default {
  toStatement (statement: any): object {
    if (WHITE_LISTED.indexOf(statement.name) > -1) {
      return statement
    }
    return makePropertyAccessor(statement)
  },
}
