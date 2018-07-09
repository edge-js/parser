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

import { ITagDefination, IBlockNode } from 'edge-lexer/build/src/Contracts'
import { Parser } from '../Parser'
import { EdgeBuffer } from '../EdgeBuffer'

export interface ITag extends ITagDefination {
  compile (parser: Parser, buffer: EdgeBuffer, token: IBlockNode): void
}

export type ILoc = {
  start: {
    line: number
    column: number,
  },
  end: {
    line: number
    column: number,
  },
}
