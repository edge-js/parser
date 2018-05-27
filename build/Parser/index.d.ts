import { IParser, ITag } from '../Contracts';
import EdgeBuffer from '../EdgeBuffer';
declare class Parser implements IParser {
    tags: {
        [key: string]: ITag;
    };
    private parseInvoked;
    private acornArgs;
    constructor(tags: {
        [key: string]: ITag;
    });
    /**
     * Parses a given acorn statement.
     */
    parseStatement(statement: any): any;
    /**
     * Converts a given acorn statement node to it's string
     * representation
     */
    statementToString(statement: any): string;
    /**
     * Parses the `jsArg` property of a token and also patches
     * the lineno in the errors raised by acorn (if any)
     */
    parseJsArg(arg: string, lineno: number): any;
    /**
     * Parses the template string to a function string, which
     * can be invoked using `new Function` keyword.
     */
    parseTemplate(template: string): string;
    /**
     * Process a token and writes the output to the buffer instance
     */
    processToken(token: any, buffer: EdgeBuffer): void;
    /**
     * Returns a boolean telling if a token type is escaped and
     * hence not be processed
     */
    private isEscaped(type);
}
export = Parser;
