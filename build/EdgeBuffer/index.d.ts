/**
 * @module Parser
 */
export default class EdgeBuffer {
    private lines;
    private indentSpaces;
    indent(): void;
    dedent(): void;
    writeLine(text: string): void;
    writeInterpol(text: string): void;
    flush(): string;
    private getSpace();
}
