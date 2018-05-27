"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
const Tokenizer = require("edge-lexer");
const Contracts = require("edge-lexer/build/Contracts");
const acorn = require("acorn");
const astring_1 = require("astring");
const EdgeBuffer_1 = require("../EdgeBuffer");
const utils_1 = require("../utils");
const Expressions = require("../Expressions");
const Exceptions_1 = require("../Exceptions");
class Parser {
    constructor(tags) {
        this.tags = tags;
        this.parseInvoked = false;
    }
    /**
     * Parses a given acorn statement.
     */
    parseStatement(statement) {
        if (Expressions[statement.type]) {
            return Expressions[statement.type].toStatement(statement, this);
        }
        const { type, loc } = statement;
        throw Exceptions_1.UnAllowedExpressionException.invoke(type, loc.line, loc.col);
    }
    /**
     * Converts a given acorn statement node to it's string
     * representation
     */
    statementToString(statement) {
        const parsed = this.parseStatement(statement);
        return astring_1.generate(parsed);
    }
    /**
     * Parses the template string to a function string, which
     * can be invoked using `new Function` keyword.
     */
    parseTemplate(template) {
        const buffer = new EdgeBuffer_1.default();
        this.parse(template, (node) => {
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
    /**
     * Normalizes jsArg by removing newlines from starting and end.
     * It is done to get right line numbers when parsing the
     * arg.
     */
    normalizeJsArg(arg) {
        return arg.replace(/^\n|\n$/g, '');
    }
    /**
     * Returns a boolean telling if a token type is escaped and
     * hence not be processed
     */
    isEscaped(type) {
        return [Contracts.MustacheType.EMUSTACHE, Contracts.MustacheType.ESMUSTACHE].indexOf(type) > -1;
    }
    /**
     * Parses template into tokens and then each token is processed
     * with acorn.
     *
     * This method will invoke the callback for each token and the
     * entire process is synchrohous.
     */
    parse(template, cb) {
        const tokenizer = new Tokenizer(template, this.tags);
        tokenizer.parse();
        tokenizer.tokens.forEach((token) => {
            /**
             * Raw node
             */
            if (token.type === 'raw') {
                cb(`'${token.value}'`);
                return;
            }
            /**
             * New line node
             */
            if (token.type === 'newline') {
                cb(`'\\n'`);
                return;
            }
            /**
             * Token is a mustache node, but is escaped
             */
            if (token.properties.name === Contracts.MustacheType.EMUSTACHE) {
                cb(`\`{{${token.properties.jsArg}}}\``);
                return;
            }
            /**
             * Token is a safe mustache node, but is escaped
             */
            if (token.properties.name === Contracts.MustacheType.ESMUSTACHE) {
                cb(`\`{{{${token.properties.jsArg}}}}\``);
                return;
            }
            /**
             * Token is a mustache node and must be processed as a Javascript
             * expression
             */
            if (token.type === 'mustache') {
                const props = token.properties;
                const ast = acorn.parse(this.normalizeJsArg(props.jsArg), {
                    locations: true,
                    ecmaVersion: 7,
                });
                const node = this.parseStatement(ast.body[0]);
                /**
                 * If safe node, then wrap it inside a function to disable escaping
                 */
                if (props.name === Contracts.MustacheType.SMUSTACHE) {
                    cb(utils_1.getCallExpression([node], 'safe'));
                    return;
                }
                cb(node);
                return;
            }
        });
    }
}
exports.default = Parser;
