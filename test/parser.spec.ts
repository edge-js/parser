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
import Youch from 'youch'
import { join } from 'path'
import dedent from 'dedent-js'
import { MustacheToken } from 'edge-lexer'

import { Parser } from '../src/Parser'
import { EdgeBuffer } from '../src/EdgeBuffer'
import { normalizeNewLines } from '../test-helpers'

const tags = {
  if: class If {
    public static block = true
    public static seekable = true
    public static selfclosed = false
    public static compile () {
    }
  },
}

test.group('Parser', () => {
  test('report correct line number when expression is not allowed', async (assert) => {
    assert.plan(3)

    const parser = new Parser(tags)
    const template = dedent`
    Hello {{ username }}

    Let's define a class {{
      class User {}
    }}
    `

    try {
      const buffer = new EdgeBuffer('eval.edge')
      const tokens = parser.tokenize(template, 'eval.edge')
      tokens.forEach((token) => parser.processToken(token, buffer))
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'eval.edge')
      assert.equal(json.error.frames[0].line, 4)
      assert.equal(json.error.frames[0].column, 2)
    }
  })

  test('report compile time syntax errors with correct line number', async (assert) => {
    assert.plan(3)

    const parser = new Parser(tags)
    const template = dedent`
    Hello world!

    The list of friends are {{
      users.map((user) => {
        return user username
      })
    }}
    `

    try {
      const buffer = new EdgeBuffer('eval.edge')
      const tokens = parser.tokenize(template, 'eval.edge')
      tokens.forEach((token) => parser.processToken(token, buffer))
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'eval.edge')
      assert.equal(json.error.frames[0].line, 5)
      assert.equal(json.error.frames[0].column, 16)
    }
  })

  test('report runtime errors with correct line number', (assert) => {
    assert.plan(1)

    const parser = new Parser(tags)
    const template = dedent`
      Hello
      {{ getUser() }}!
    `

    const buffer = new EdgeBuffer('eval.edge')
    const tokens = parser.tokenize(template, 'eval.edge')
    tokens.forEach((token) => parser.processToken(token, buffer))

    const fn = new Function('template', 'state', 'ctx', buffer.flush())
    fn({}, {}, {
      escape () {},
      reThrow (error: any) {
        assert.equal(error.message, 'state.getUser is not a function')
      },
    })
  })

  test('pass tag details to tag implementation when exists', (assert) => {
    assert.plan(2)

    const customTags = {
      if: class If {
        public static block = true
        public static seekable = true
        public static selfclosed = false
        public static compile (_, __, token) {
          assert.equal(token.properties.jsArg, 'username')
          assert.equal(token.properties.name, 'if')
        }
      },
    }

    const template = dedent`
    @if(username)
    @endif
    `
    const parser = new Parser(customTags)
    const buffer = new EdgeBuffer('eval.edge')
    const tokens = parser.tokenize(template, 'eval.edge')
    tokens.forEach((token) => parser.processToken(token, buffer))
  })

  test('report correct columns in errors inside mustache statement', async (assert) => {
    assert.plan(3)

    const parser = new Parser(tags)
    try {
      const buffer = new EdgeBuffer('eval.edge')
      const tokens = parser.tokenize(dedent`
        Hello {{ user\ name }}
      `, 'eval.edge')
      tokens.forEach((token) => parser.processToken(token, buffer))
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'eval.edge')
      assert.equal(json.error.frames[0].line, 1)
      assert.equal(json.error.frames[0].column, 14)
    }
  })

  test('report correct columns in errors inside safe mustache statement', (assert) => {
    assert.plan(2)

    const parser = new Parser(tags)
    try {
      const buffer = new EdgeBuffer('eval.edge')
      const tokens = parser.tokenize(dedent`
        Hello {{{ user\ name }}}
      `, 'eval.edge')
      tokens.forEach((token) => parser.processToken(token, buffer))
    } catch ({ message, line, col }) {
      assert.equal(line, 1)
      assert.equal(col, 15)
    }
  })

  test('report correct columns in errors in multiline mustache', async (assert) => {
    assert.plan(3)

    const parser = new Parser(tags)
    try {
      const buffer = new EdgeBuffer('eval.edge')
      const tokens = parser.tokenize(dedent`
        Hello {{
          user username
        }}
      `, 'eval.edge')
      tokens.forEach((token) => parser.processToken(token, buffer))
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'eval.edge')
      assert.equal(json.error.frames[0].line, 2)
      assert.equal(json.error.frames[0].column, 7)
    }
  })

  test('report filename mentioned on token for mustache', async (assert) => {
    assert.plan(3)

    const parser = new Parser(tags)
    try {
      const tokens = parser.tokenize(dedent`
        Hello {{ a..b }}
      `, 'eval.edge')

      const mustacheToken = (tokens[2] as MustacheToken)
      mustacheToken.filename = 'bar.edge'
      parser.processToken(mustacheToken, new EdgeBuffer('eval.edge'))
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'bar.edge')
      assert.equal(json.error.frames[0].line, 1)
      assert.equal(json.error.frames[0].column, 11)
    }
  })

  test('do not prefix idenifiers with state when using local variable', (assert) => {
    assert.plan(1)

    const parser = new Parser(tags)
    parser.stack.defineVariable('username')
    const template = dedent`
      Hello
      {{ username }}!
    `

    const buffer = new EdgeBuffer('eval.edge')
    const tokens = parser.tokenize(template, 'eval.edge')
    tokens.forEach((token) => parser.processToken(token, buffer))

    const fn = new Function('template', 'state', 'ctx', buffer.flush())
    assert.stringEqual(fn.toString(), normalizeNewLines(dedent`function anonymous(template,state,ctx
      ) {
      let out = "";
      let $lineNumber = 1;
      let $filename = "eval.edge";
      try {
      out += "\\n";
      out += "Hello";
      out += "\\n";
      $lineNumber = 2;
      out += \`\${ctx.escape(username)}\`;
      out += "!";
      } catch (error) {
      ctx.reThrow(error, $filename, $lineNumber);
      }
      return out;
      }`))
  })

  test('report error when using await expression in non async mode', async (assert) => {
    assert.plan(3)

    const parser = new Parser(tags)
    const template = dedent`
    Hello {{ username }}

    Let's use {{ await getUsername() }}`

    try {
      const buffer = new EdgeBuffer('eval.edge')
      const tokens = parser.tokenize(template, 'eval.edge')
      tokens.forEach((token) => parser.processToken(token, buffer))
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'eval.edge')
      assert.equal(json.error.frames[0].line, 3)
      assert.equal(json.error.frames[0].column, 13)
    }
  })

  test('escape unicodes in filename', (assert) => {
    assert.plan(2)

    const parser = new Parser(tags)
    const template = dedent`
      Hello
      {{ getUser() }}!
    `

    const buffer = new EdgeBuffer(join(__dirname, 'eval.edge'))
    const tokens = parser.tokenize(template, join(__dirname, 'eval.edge'))
    tokens.forEach((token) => parser.processToken(token, buffer))

    const fn = new Function('template', 'state', 'ctx', buffer.flush())
    fn({}, {}, {
      escape () {},
      reThrow (error: any, filename: string) {
        assert.equal(filename, join(__dirname, 'eval.edge'))
        assert.equal(error.message, 'state.getUser is not a function')
      },
    })
  })
})
