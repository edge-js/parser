"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    toStatement(statement, parser) {
        statement.left = parser.parseStatement(statement.left);
        statement.right = parser.parseStatement(statement.right);
        return statement;
    },
};
