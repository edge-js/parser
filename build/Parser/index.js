"use strict";
/**
 * @module Parser
 */
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
        this.acornArgs = {
            locations: true,
            ecmaVersion: 7,
        };
    }
    /**
     * Parses a given acorn statement.
     */
    parseStatement(statement) {
        if (Expressions[statement.type]) {
            return Expressions[statement.type].toStatement(statement, this);
        }
        const { type, loc } = statement;
        throw Exceptions_1.UnAllowedExpressionException.invoke(type, loc.start.line, loc.end.column);
    }
    /**
     * Converts a given acorn statement node to it's string
     * representation
     */
    statementToString(statement) {
        return astring_1.generate(statement);
    }
    /**
     * Parses the `jsArg` property of a token and also patches
     * the lineno in the errors raised by acorn (if any)
     */
    parseJsArg(arg, lineno) {
        try {
            const ast = acorn.parse(arg, this.acornArgs);
            return this.parseStatement(ast.body[0]);
        }
        catch (error) {
            error.message = error.message.replace(/\(\d+:\d+\)/, '');
            error.loc.line = (lineno + error.loc.line) - 1;
            throw error;
        }
    }
    /**
     * Parses the template string to a function string, which
     * can be invoked using `new Function` keyword.
     */
    parseTemplate(template) {
        const buffer = new EdgeBuffer_1.default();
        const tokenizer = new Tokenizer(template, this.tags);
        tokenizer.parse();
        tokenizer.tokens.forEach((token) => {
            this.processToken(token, buffer);
        });
        return buffer.flush();
    }
    /**
     * Process a token and writes the output to the buffer instance
     */
    processToken(token, buffer) {
        /**
         * Raw node
         */
        if (token.type === 'raw') {
            buffer.writeLine(`'${token.value}'`);
            return;
        }
        /**
         * New line node
         */
        if (token.type === 'newline') {
            buffer.writeLine(`'\\n'`);
            return;
        }
        /**
         * A block level token (AKA tag)
         */
        if (token.type === 'block') {
            this.tags[token.properties.name].compile(this, buffer, token);
            return;
        }
        const mustacheToken = token;
        /**
         * Token is a mustache node, but is escaped
         */
        if (mustacheToken.properties.name === Contracts.MustacheType.EMUSTACHE) {
            buffer.writeLine(`\`{{${mustacheToken.properties.jsArg}}}\``);
            return;
        }
        /**
         * Token is a safe mustache node, but is escaped
         */
        if (mustacheToken.properties.name === Contracts.MustacheType.ESMUSTACHE) {
            buffer.writeLine(`\`{{{${mustacheToken.properties.jsArg}}}}\``);
            return;
        }
        /**
         * Token is a mustache node and must be processed as a Javascript
         * expression
         */
        if (mustacheToken.type === 'mustache') {
            const node = this.parseJsArg(mustacheToken.properties.jsArg, mustacheToken.lineno);
            /**
             * If safe node, then wrap it inside a function to disable escaping
             */
            if (mustacheToken.properties.name === Contracts.MustacheType.SMUSTACHE) {
                buffer.writeInterpol(this.statementToString(utils_1.getCallExpression([node], 'safe')));
                return;
            }
            /**
             * Template literal, so there is no need to wrap it inside another
             * template string
             */
            if (node.type === 'TemplateLiteral') {
                buffer.writeLine(this.statementToString(node));
                return;
            }
            buffer.writeInterpol(this.statementToString(node));
        }
    }
    /**
     * Returns a boolean telling if a token type is escaped and
     * hence not be processed
     */
    isEscaped(type) {
        return [Contracts.MustacheType.EMUSTACHE, Contracts.MustacheType.ESMUSTACHE].indexOf(type) > -1;
    }
}
module.exports = Parser;
