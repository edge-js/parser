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

import { ITagToken } from 'edge-lexer/build/src/Contracts'
import { Parser } from '../Parser'
import { EdgeBuffer } from '../EdgeBuffer'

export type ITag = {
  compile (parser: Parser, buffer: EdgeBuffer, token: ITagToken): void,
  seekable: boolean,
  block: boolean,
}

export type IAcornLoc = {
  start: {
    line: number
    column: number,
  },
  end: {
    line: number
    column: number,
  },
}
