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
import { EOL } from 'os'
import { join } from 'path'
import { readdirSync, readFileSync, statSync } from 'fs'

import { Parser } from '../src/Parser'

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

function normalizeNewLines (value: string) {
  // eslint-disable-next-line @typescript-eslint/quotes
  return value.replace(/out\s\+=\s'\\n'/, `out += ${EOL === '\n' ? `'\\n'` : `'\\r\\n'`}`)
}

test.group('Fixtures', () => {
  const dirs = readdirSync(basePath).filter((file) => {
    return statSync(join(basePath, file)).isDirectory()
  })

  dirs.forEach((dir) => {
    const dirBasePath = join(basePath, dir)

    test(dir, (assert) => {
      const template = readFileSync(join(dirBasePath, 'index.edge'), 'utf-8')
      const out = normalizeNewLines(readFileSync(join(dirBasePath, 'index.js'), 'utf-8'))

      const parser = new Parser(tags, { filename: join(dirBasePath, 'index.edge') })
      const output = parser.parseTemplate(template)
      assert.stringEqual(output, out)
    })
  })
})
