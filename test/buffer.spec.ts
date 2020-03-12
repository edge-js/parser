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
    const buff = new EdgeBuffer('eval.edge', true)
    buff.outputExpression('\'hello world\'', 'eval.edge', 1, false)
    assert.stringEqual(buff.flush(), normalizeNewLines(dedent`return (function (template, ctx) {
    let out = "";
    ctx.$lineNumber = 1;
    ctx.$filename = "eval.edge";
    try {
    out += 'hello world';
    } catch (error) {
    ctx.reThrow(error);
    }
    return out;
    })(template, ctx)`))
  })

  test('write raw line to the output', (assert) => {
    const buff = new EdgeBuffer('eval.edge', true)
    buff.outputRaw('hello world')

    assert.stringEqual(buff.flush(), normalizeNewLines(dedent`return (function (template, ctx) {
    let out = "";
    ctx.$lineNumber = 1;
    ctx.$filename = "eval.edge";
    try {
    out += "hello world";
    } catch (error) {
    ctx.reThrow(error);
    }
    return out;
    })(template, ctx)`))
  })

  test('escape quotes in raw line', (assert) => {
    const buff = new EdgeBuffer('eval.edge', true)
    buff.outputRaw('\'hello world\'')

    assert.stringEqual(buff.flush(), normalizeNewLines(dedent`return (function (template, ctx) {
    let out = "";
    ctx.$lineNumber = 1;
    ctx.$filename = "eval.edge";
    try {
    out += "'hello world'";
    } catch (error) {
    ctx.reThrow(error);
    }
    return out;
    })(template, ctx)`))
  })

  test('write expression', (assert) => {
    const buff = new EdgeBuffer('eval.edge', true)
    buff.writeStatement('if (username) {', 'eval.edge', 1)

    assert.stringEqual(buff.flush(), normalizeNewLines(dedent`return (function (template, ctx) {
    let out = "";
    ctx.$lineNumber = 1;
    ctx.$filename = "eval.edge";
    try {
    if (username) {
    } catch (error) {
    ctx.reThrow(error);
    }
    return out;
    })(template, ctx)`))
  })

  test('indent output', (assert) => {
    const buff = new EdgeBuffer('eval.edge', true)
    buff.writeStatement('if (username) {', 'eval.edge', 1)
    buff.outputRaw('hello world')
    buff.writeStatement('}', 'eval.edge', 3)

    assert.stringEqual(buff.flush(), normalizeNewLines(dedent`return (function (template, ctx) {
    let out = "";
    ctx.$lineNumber = 1;
    ctx.$filename = "eval.edge";
    try {
    if (username) {
    out += "hello world";
    ctx.$lineNumber = 3;
    }
    } catch (error) {
    ctx.reThrow(error);
    }
    return out;
    })(template, ctx)`))
  })

  test('flush lines without wrapping inside fuction', (assert) => {
    const buff = new EdgeBuffer('eval.edge', false)
    buff.outputExpression('\'hello world\'', 'eval.edge', 1, false)

    assert.stringEqual(buff.flush(), normalizeNewLines(dedent`
    let out = "";
    try {
    out += 'hello world';
    } catch (error) {
    ctx.reThrow(error);
    }
    return out;`))
  })

  test('define wrapping code', (assert) => {
    const buff = new EdgeBuffer('eval.edge', false)
    buff.wrap('return function () {', '}')
    buff.outputExpression('\'hello world\'', 'eval.edge', 1, false)

    assert.stringEqual(buff.flush(), normalizeNewLines(dedent`
    return function () {
    let out = "";
    try {
    out += 'hello world';
    } catch (error) {
    ctx.reThrow(error);
    }
    return out;
    }`))
  })
})
