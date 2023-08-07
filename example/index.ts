/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser, EdgeBuffer, Stack } from '../index.js'

const filename = 'eval.edge'

const parser = new Parser({}, new Stack(), {
  statePropertyName: 'state',
  escapeCallPath: 'escape',
  toAttributesCallPath: 'toAttributes',
})

const buffer = new EdgeBuffer(filename, { outputVar: 'out', rethrowCallPath: 'reThrow' })

parser
  .tokenize('Hello {{ username }}', { filename })
  .forEach((token) => parser.processToken(token, buffer))

/**
 * Compiled output
 */
const output = buffer.flush()

const state = { username: 'virk' }

function escape(value: any) {
  return value
}

function reThrow(error: Error) {
  throw error
}

/**
 * Wrap inside function and invoke it
 */
const fn = new Function('state', 'escape', 'reThrow', output)
console.log(fn(state, escape, reThrow))
