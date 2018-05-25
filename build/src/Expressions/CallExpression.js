"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    toStatement(statement, parser) {
        if (statement.callee.type !== 'MemberExpression') {
            statement.arguments = statement.arguments.map((node) => {
                node.start += 3;
                node.end += 3;
                return node;
            });
            const argStart = statement.arguments.length ? statement.arguments[0].start : 0;
            statement.arguments.unshift({
                type: 'Identifier',
                start: argStart,
                end: argStart + 3,
                name: 'ctx',
            });
        }
        statement.callee = parser.parseStatement(statement.callee);
        statement.arguments = statement.arguments.map((node) => parser.parseStatement(node));
        return statement;
    },
};
