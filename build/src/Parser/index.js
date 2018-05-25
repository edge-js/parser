"use strict";
/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const Tokenizer = require("edge-lexer");
const Contracts = require("edge-lexer/build/Contracts");
const acorn = require("acorn");
const astring_1 = require("astring");
const EdgeBuffer_1 = require("../EdgeBuffer");
const utils_1 = require("../../utils");
const Expressions = require("../Expressions");
class Parser {
    constructor(template, tags) {
        this.parseInvoked = false;
        this.tokenizer = new Tokenizer(template, tags);
    }
    parseStatement(statement) {
        if (Expressions[statement.type]) {
            return Expressions[statement.type].toStatement(statement, this);
        }
        throw new Error(`${statement.type}: Expression not allowed`);
    }
    toString() {
        const buffer = new EdgeBuffer_1.default();
        this.parse((node) => {
            if (typeof (node) === 'string') {
                buffer.writeLine(node);
                return;
            }
            if (node.type === 'TemplateLiteral') {
                buffer.writeLine(astring_1.generate(node));
                return;
            }
            buffer.writeInterpol(astring_1.generate(node));
        });
        return buffer.flush();
    }
    toObject() {
        const tokens = [];
        this.parse((node) => (tokens.push(node)));
        return tokens;
    }
    normalizeJsArg(arg) {
        return arg.replace(/^\n|\n$/g, '');
    }
    parse(cb) {
        this.tokenizer.parse();
        this.tokenizer.tokens.forEach((token) => {
            if (token.type === 'raw') {
                cb(`'${token.value}'`);
                return;
            }
            if (token.type === 'newline') {
                cb(`'\\n'`);
                return;
            }
            if (token.type === 'mustache') {
                const props = token.properties;
                const ast = acorn.parse(this.normalizeJsArg(props.jsArg));
                const nodes = ast.body.map((node) => this.parseStatement(node));
                if (props.name === Contracts.MustacheType.SMUSTACHE) {
                    cb(utils_1.getCallExpression(nodes[0]));
                    return;
                }
                cb(nodes[0]);
                return;
            }
        });
    }
}
exports.default = Parser;
