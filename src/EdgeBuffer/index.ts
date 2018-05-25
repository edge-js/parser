/*
* edge-lexer
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

export default class EdgeBuffer {
  private lines: string = ''
  private indentSpaces: number = 2

  public indent () {
    this.indentSpaces += 2
  }

  public dedent () {
    this.indentSpaces -= 2
  }

  public writeLine (text: string): void {
    this.lines += `\n${this.getSpace()}out += ${text}`
  }

  public writeInterpol (text: string): void {
    this.lines += `\n${this.getSpace()}out += \`\${${text}}\``
  }

  public flush () {
    let returnValue = '(function (ctx) {'
    returnValue += `\n  let out = ''`
    returnValue += `${this.lines}`
    returnValue += '\n  return out'
    returnValue += '\n})(ctx)'
    return returnValue
  }

  private getSpace (): string {
    let spaces = ''
    for (let i = 0; i < this.indentSpaces; i++) {
      spaces += ' '
    }
    return spaces
  }
}
