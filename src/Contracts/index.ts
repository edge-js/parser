/**
 * @module Parser
 */

import EdgeBuffer from '../EdgeBuffer'
import Contracts from 'edge-lexer/build/Contracts'

interface IParser {
  parseStatement (statement: any): any
  parseTemplate (template: string): string
  statementToString (statement: any): string
  parseJsArg (arg: string, lineno: number): any
  processToken (token: Contracts.IBlockNode | Contracts.IMustacheNode | Contracts.INode, buffer: EdgeBuffer): void
}

interface ITag {
  block: boolean
  seekable: boolean
  name: boolean
  compile (parser: IParser, buffer: EdgeBuffer, token: Contracts.IBlockNode): void
  run ()
}

export { IParser as IParser }
export { ITag as ITag }
