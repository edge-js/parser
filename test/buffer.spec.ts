/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import './assert-extend'

import test from 'japa'
import dedent from 'dedent-js'

import { EdgeBuffer } from '../src/EdgeBuffer'
import { normalizeNewLines } from '../test-helpers'

test.group('Buffer', () => {
  test('write line to the output', (assert) => {
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

  test('write raw line to the output', (assert) => {
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

  test('escape quotes in raw line', (assert) => {
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

  test('write expression', (assert) => {
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

  test('indent output', (assert) => {
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

  test('define wrapping code', (assert) => {
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

  test('disable filename and linenumber variables', (assert) => {
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

  test('disable output variable', (assert) => {
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
})
