import { IParser } from '../Contracts';
export default class Parser implements IParser {
    tags: object;
    private parseInvoked;
    constructor(tags: object);
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
     * Parses the template string to a function string, which
     * can be invoked using `new Function` keyword.
     */
    parseTemplate(template: string): string;
    /**
     * Normalizes jsArg by removing newlines from starting and end.
     * It is done to get right line numbers when parsing the
     * arg.
     */
    private normalizeJsArg(arg);
    /**
     * Returns a boolean telling if a token type is escaped and
     * hence not be processed
     */
    private isEscaped(type);
    /**
     * Parses template into tokens and then each token is processed
     * with acorn.
     *
     * This method will invoke the callback for each token and the
     * entire process is synchrohous.
     */
    private parse(template, cb);
}
