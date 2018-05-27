"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
class EdgeBuffer {
    constructor() {
        this.lines = '';
        this.indentSpaces = 2;
    }
    indent() {
        this.indentSpaces += 2;
    }
    dedent() {
        this.indentSpaces -= 2;
    }
    writeLine(text) {
        this.lines += `\n${this.getSpace()}out += ${text}`;
    }
    writeInterpol(text) {
        this.lines += `\n${this.getSpace()}out += \`\${${text}}\``;
    }
    flush() {
        let returnValue = '(function (ctx) {';
        returnValue += `\n  let out = ''`;
        returnValue += `${this.lines}`;
        returnValue += '\n  return out';
        returnValue += '\n})(ctx)';
        return returnValue;
    }
    getSpace() {
        let spaces = '';
        for (let i = 0; i < this.indentSpaces; i++) {
            spaces += ' ';
        }
        return spaces;
    }
}
exports.default = EdgeBuffer;
