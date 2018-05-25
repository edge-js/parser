import { IParser } from '../Contracts';
export default class Parser implements IParser {
    private parseInvoked;
    private tokenizer;
    constructor(template: string, tags: any);
    parseStatement(statement: any): any;
    toString(): string;
    toObject(): object[];
    private normalizeJsArg(arg);
    private parse(cb);
}
