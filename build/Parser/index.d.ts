import { IParser } from '../Contracts';
declare class Parser implements IParser {
    private parseInvoked;
    private tokenizer;
    constructor(template: string, tags: any);
    parseStatement(statement: any): any;
    toString(): string;
    toObject(): object[];
    private parse(cb);
}
export = Parser;
