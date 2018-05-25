"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    toStatement(statement, parser) {
        return parser.parseStatement(statement.expression);
    },
};
