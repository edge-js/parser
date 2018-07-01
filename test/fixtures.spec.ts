/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as test from 'japa'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import { Parser } from '../src/Parser'
import { EOL } from 'os'

const basePath = join(__dirname, '../fixtures')

const tags = {
  if: {
    block: true,
  },
}

test.group('Fixtures', () => {
  const dirs = readdirSync(basePath).filter((file) => {
    return statSync(join(basePath, file)).isDirectory()
  })

  dirs.forEach((dir) => {
    const dirBasePath = join(basePath, dir)

    test(dir, (assert) => {
      const template = readFileSync(join(dirBasePath, 'index.edge'), 'utf-8')
      const out = readFileSync(join(dirBasePath, 'index.js'), 'utf-8').replace(/out\s\+=\s'\\n'/, `out += ${EOL === '\n' ? `'\\n'` : `'\\r\\n'`}`)

      const parser = new Parser(tags)
      const output = parser.parseTemplate(template)
      assert.stringEqual(output, out)
    })
  })
})
