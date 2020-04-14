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
import { join } from 'path'
import { readdirSync, readFileSync, statSync } from 'fs'

import { Parser } from '../src/Parser'
import { EdgeBuffer } from '../src/EdgeBuffer'
import { normalizeNewLines, normalizeFilename } from '../test-helpers'

const basePath = join(__dirname, '../fixtures')
const tags = {
  if: class If {
    public static block = true
    public static seekable = true
    public static selfclosed = false
    public static compile () {
    }
  },
}

test.group('Fixtures', () => {
  const dirs = readdirSync(basePath).filter((file) => statSync(join(basePath, file)).isDirectory())

  dirs.forEach((dir) => {
    const dirBasePath = join(basePath, dir)

    test(dir, (assert) => {
      const template = readFileSync(join(dirBasePath, 'index.edge'), 'utf-8')
      const out = normalizeNewLines(readFileSync(join(dirBasePath, 'index.js'), 'utf-8'))

      const parser = new Parser(tags, true)
      const buffer = new EdgeBuffer(join(dirBasePath, 'index.edge'))
      const tokens = parser.tokenize(template, join(dirBasePath, 'index.edge'))
      tokens.forEach((token) => parser.processToken(token, buffer))
      assert.stringEqual(buffer.flush(), out.split('\n').map((line) => normalizeFilename(dirBasePath, line)).join('\n'))
    })
  })
})
