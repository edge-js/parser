/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import './assert_extend.js'

import { join } from 'node:path'
import { test } from '@japa/runner'
import { getDirname } from '@poppinss/utils'
import { readdirSync, readFileSync, statSync } from 'node:fs'

import { Parser } from '../src/parser/main.js'
import { EdgeBuffer } from '../src/edge_buffer/index.js'
import { normalizeNewLines, normalizeFilename } from '../test_helpers/index.js'

const basePath = join(getDirname(import.meta.url), '../fixtures')
const tags = {
  if: class If {
    static block = true
    static seekable = true
    static selfclosed = false
    static compile() {}
  },
}
const filter = process.env.FIXTURE

test.group('Fixtures', () => {
  const dirs = readdirSync(basePath).filter((file) => statSync(join(basePath, file)).isDirectory())

  dirs.forEach((dir) => {
    if (filter && dir !== filter) {
      return
    }

    const dirBasePath = join(basePath, dir)

    test(dir, ({ assert }) => {
      const template = readFileSync(join(dirBasePath, 'index.edge'), 'utf-8')
      const out = normalizeNewLines(readFileSync(join(dirBasePath, 'index.js'), 'utf-8'))

      const parser = new Parser(tags, undefined, {
        async: true,
        statePropertyName: 'state',
        escapeCallPath: ['ctx', 'escape'],
        toAttributesCallPath: ['ctx', 'toAttributes'],
      })

      const buffer = new EdgeBuffer(join(dirBasePath, 'index.edge'), {
        outputVar: 'out',
        rethrowCallPath: ['ctx', 'reThrow'],
      })

      const tokens = parser.tokenize(template, {
        filename: join(dirBasePath, 'index.edge'),
      })
      tokens.forEach((token) => parser.processToken(token, buffer))

      assert.stringEqual(
        buffer.flush(),
        out
          .split('\n')
          .map((line) => normalizeFilename(dirBasePath, line))
          .join('\n')
      )
    })
  })
})
