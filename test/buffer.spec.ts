/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import './assert_extend.js'

import { test } from '@japa/runner'
import dedent from 'dedent-js'

import { EdgeBuffer } from '../src/edge_buffer/index.js'
import { normalizeNewLines } from '../test_helpers/index.js'

test.group('Buffer', () => {
  test('write line to the output', ({ assert }) => {
    const buff = new EdgeBuffer('eval.edge', {
      outputVar: 'out',
      rethrowCallPath: ['ctx', 'reThrow'],
    })
    buff.outputExpression("'hello world'", 'eval.edge', 1, false)
    assert.stringEqual(
      buff.flush(),
      normalizeNewLines(dedent`let out = "";
    let $lineNumber = 1;
    let $filename = "eval.edge";
    try {
    out += 'hello world';
    } catch (error) {
    ctx.reThrow(error, $filename, $lineNumber);
    }
    return out;`)
    )
  })

  test('write raw line to the output', ({ assert }) => {
    const buff = new EdgeBuffer('eval.edge', {
      outputVar: 'out',
      rethrowCallPath: ['ctx', 'reThrow'],
    })
    buff.outputRaw('hello world')

    assert.stringEqual(
      buff.flush(),
      normalizeNewLines(dedent`let out = "";
    let $lineNumber = 1;
    let $filename = "eval.edge";
    try {
    out += "hello world";
    } catch (error) {
    ctx.reThrow(error, $filename, $lineNumber);
    }
    return out;`)
    )
  })

  test('escape quotes in raw line', ({ assert }) => {
    const buff = new EdgeBuffer('eval.edge', {
      outputVar: 'out',
      rethrowCallPath: ['ctx', 'reThrow'],
    })
    buff.outputRaw("'hello world'")

    assert.stringEqual(
      buff.flush(),
      normalizeNewLines(dedent`let out = "";
    let $lineNumber = 1;
    let $filename = "eval.edge";
    try {
    out += "'hello world'";
    } catch (error) {
    ctx.reThrow(error, $filename, $lineNumber);
    }
    return out;`)
    )
  })

  test('write expression', ({ assert }) => {
    const buff = new EdgeBuffer('eval.edge', {
      outputVar: 'out',
      rethrowCallPath: ['ctx', 'reThrow'],
    })
    buff.writeStatement('if (username) {', 'eval.edge', 1)

    assert.stringEqual(
      buff.flush(),
      normalizeNewLines(dedent`let out = "";
    let $lineNumber = 1;
    let $filename = "eval.edge";
    try {
    if (username) {
    } catch (error) {
    ctx.reThrow(error, $filename, $lineNumber);
    }
    return out;`)
    )
  })

  test('indent output', ({ assert }) => {
    const buff = new EdgeBuffer('eval.edge', {
      outputVar: 'out',
      rethrowCallPath: ['ctx', 'reThrow'],
    })
    buff.writeStatement('if (username) {', 'eval.edge', 1)
    buff.outputRaw('hello world')
    buff.writeStatement('}', 'eval.edge', 3)

    assert.stringEqual(
      buff.flush(),
      normalizeNewLines(dedent`let out = "";
    let $lineNumber = 1;
    let $filename = "eval.edge";
    try {
    if (username) {
    out += "hello world";
    $lineNumber = 3;
    }
    } catch (error) {
    ctx.reThrow(error, $filename, $lineNumber);
    }
    return out;`)
    )
  })

  test('define wrapping code', ({ assert }) => {
    const buff = new EdgeBuffer('eval.edge', {
      outputVar: 'out',
      rethrowCallPath: ['ctx', 'reThrow'],
    })
    buff.wrap('return function () {', '}')
    buff.outputExpression("'hello world'", 'eval.edge', 1, false)

    assert.stringEqual(
      buff.flush(),
      normalizeNewLines(dedent`
    return function () {
    let out = "";
    let $lineNumber = 1;
    let $filename = "eval.edge";
    try {
    out += 'hello world';
    } catch (error) {
    ctx.reThrow(error, $filename, $lineNumber);
    }
    return out;
    }`)
    )
  })

  test('disable filename and linenumber variables', ({ assert }) => {
    const buff = new EdgeBuffer('eval.edge', {
      outputVar: 'out',
      rethrowCallPath: ['ctx', 'reThrow'],
    })
    buff.outputExpression("'hello world'", 'eval.edge', 1, false)
    buff.disableFileAndLineVariables()

    assert.stringEqual(
      buff.flush(),
      normalizeNewLines(dedent`
    let out = "";
    try {
    out += 'hello world';
    } catch (error) {
    ctx.reThrow(error, $filename, $lineNumber);
    }
    return out;`)
    )
  })

  test('disable output variable', ({ assert }) => {
    const buff = new EdgeBuffer('eval.edge', {
      outputVar: 'out',
      rethrowCallPath: ['ctx', 'reThrow'],
    })
    buff.outputExpression("'hello world'", 'eval.edge', 1, false)
    buff.disableOutVariable()

    assert.stringEqual(
      buff.flush(),
      normalizeNewLines(dedent`
    let $lineNumber = 1;
    let $filename = "eval.edge";
    try {
    out += 'hello world';
    } catch (error) {
    ctx.reThrow(error, $filename, $lineNumber);
    }
    return out;`)
    )
  })

  test('disable try/catch block', ({ assert }) => {
    const buff = new EdgeBuffer('eval.edge', {
      outputVar: 'out',
      rethrowCallPath: ['ctx', 'reThrow'],
    })
    buff.outputExpression("'hello world'", 'eval.edge', 1, false)
    buff.disableTryCatchBlock()

    assert.stringEqual(
      buff.flush(),
      normalizeNewLines(dedent`
    let out = "";
    let $lineNumber = 1;
    let $filename = "eval.edge";
    out += 'hello world';
    return out;`)
    )
  })

  test('disable return statement', ({ assert }) => {
    const buff = new EdgeBuffer('eval.edge', {
      outputVar: 'out',
      rethrowCallPath: ['ctx', 'reThrow'],
    })
    buff.outputExpression("'hello world'", 'eval.edge', 1, false)
    buff.disableTryCatchBlock()
    buff.disableReturnStatement()

    assert.stringEqual(
      buff.flush(),
      normalizeNewLines(dedent`
    let out = "";
    let $lineNumber = 1;
    let $filename = "eval.edge";
    out += 'hello world';`)
    )
  })
})
