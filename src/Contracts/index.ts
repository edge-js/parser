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

import { ITagDefination } from 'edge-lexer/build/src/Contracts'

export interface ITag extends ITagDefination {
  new ()
}
