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
import dedent from 'dedent-js'
import { Parser } from '../src/Parser'
import { EdgeBuffer } from '../src/EdgeBuffer'
import { MustacheToken } from 'edge-lexer/build/src/Contracts'

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

    const parser = new Parser(tags, { filename: 'foo.edge' })
    const template = dedent`
    Hello {{ username }}

    Let's define a class {{
      class User {}
    }}
    `

    try {
      parser.parse(template)
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'foo.edge')
      assert.equal(json.error.frames[0].line, 4)
      assert.equal(json.error.frames[0].column, 2)
    }
  })

  test('report compile time syntax errors with correct line number', async (assert) => {
    assert.plan(3)

    const parser = new Parser(tags, { filename: 'foo.edge' })
    const template = dedent`
    Hello world!

    The list of friends are {{
      users.map((user) => {
        return user username
      })
    }}
    `

    try {
      parser.parse(template)
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'foo.edge')
      assert.equal(json.error.frames[0].line, 5)
      assert.equal(json.error.frames[0].column, 16)
    }
  })

  test('report runtime errors with correct line number', (assert) => {
    assert.plan(3)

    const parser = new Parser(tags, { filename: 'eval.edge' })
    const template = dedent`
      Hello
      {{ getUser() }}!
    `

    const fn = new Function('template', 'ctx', parser.parse(template))

    fn({}, {
      resolve () {
        return undefined
      },
      reThrow (error, filename: string, lineNumber: number) {
        assert.match(error.message, /ctx.resolve\(...\)/)
        assert.equal(filename, 'eval.edge')
        assert.equal(lineNumber, 2)
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

    const parser = new Parser(customTags, { filename: 'foo.edge' })
    parser.parse(dedent`
    @if(username)
    @endif
    `)
  })

  test('report correct columns in errors inside mustache statement', async (assert) => {
    assert.plan(3)

    const parser = new Parser(tags, { filename: 'foo.edge' })
    try {
      parser.parse(dedent`
        Hello {{ user\ name }}
      `)
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'foo.edge')
      assert.equal(json.error.frames[0].line, 1)
      assert.equal(json.error.frames[0].column, 14)
    }
  })

  test('report correct columns in errors inside safe mustache statement', (assert) => {
    assert.plan(2)

    const parser = new Parser(tags, { filename: 'foo.edge' })
    try {
      parser.parse(dedent`
        Hello {{{ user\ name }}}
      `)
    } catch ({ message, line, col }) {
      assert.equal(line, 1)
      assert.equal(col, 15)
    }
  })

  test('report correct columns in errors in multiline mustache', async (assert) => {
    assert.plan(3)

    const parser = new Parser(tags, { filename: 'foo.edge' })
    try {
      parser.parse(dedent`
        Hello {{
          user username
        }}
      `)
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'foo.edge')
      assert.equal(json.error.frames[0].line, 2)
      assert.equal(json.error.frames[0].column, 7)
    }
  })

  test('report filename mentioned on token for mustache', async (assert) => {
    assert.plan(3)

    const parser = new Parser(tags, { filename: 'foo.edge' })
    try {
      const tokens = parser.tokenize(dedent`
        Hello {{ a..b }}
      `)

      const mustacheToken = (tokens[1] as MustacheToken)
      mustacheToken.filename = 'bar.edge'

      parser.processToken(tokens[1], new EdgeBuffer('foo.edge', false))
    } catch (error) {
      const json = await new Youch(error, {}).toJSON()
      assert.equal(json.error.frames[0].file, 'bar.edge')
      assert.equal(json.error.frames[0].line, 1)
      assert.equal(json.error.frames[0].column, 11)
    }
  })
})
