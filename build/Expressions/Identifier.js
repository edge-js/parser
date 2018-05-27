"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
/** @hidden */
const WHITE_LISTED = ['Object', 'ctx'];
exports.default = {
    toObject(statement) {
        const value = WHITE_LISTED.indexOf(statement.name) > -1 ? statement.name : `\ctx.resolve('${statement.name}')`;
        return `\{ ${[statement.name]}: ${value} }`;
    },
    toStatement(statement) {
        if (WHITE_LISTED.indexOf(statement.name) > -1) {
            return statement;
        }
        return utils_1.getCallExpression([
            Object.assign({}, statement, {
                type: 'Literal',
                value: statement.name,
                raw: `'${statement.name}'`,
            }),
        ], 'resolve');
    },
};
