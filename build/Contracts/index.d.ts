/**
 * @module Parser
 */
interface IParser {
    parseStatement(statement: any): any;
    parseTemplate(template: string): string;
    statementToString(statement: any): string;
}
export { IParser as IParser };
