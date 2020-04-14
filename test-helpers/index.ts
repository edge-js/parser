/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { sep } from 'path'
import { EOL } from 'os'
import stringify from 'js-stringify'

export function normalizeNewLines (value: string) {
  // eslint-disable-next-line @typescript-eslint/quotes
  return value.replace(/out\s\+=\s"\\n"/g, `out += ${EOL === '\n' ? `"\\n"` : `"\\r\\n"`}`)
}

export function normalizeFilename (basePath: string, value: string) {
  value = value.replace('{{ __dirname }}', `${basePath}${sep}`)
  if (value.trim().startsWith('let $filename')) {
    return value.replace(/=\s"(.*)"/, (_, group) => `= ${stringify(group)}`)
  }
  return value
}
