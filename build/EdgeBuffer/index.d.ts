/**
 * @module Parser
 */
declare class EdgeBuffer {
    private lines;
    private indentSpaces;
    /**
     * Indent output by 2 spaces
     */
    indent(): void;
    /**
     * Decrease upcoming line indentation by
     * 2 spaces
     */
    dedent(): void;
    /**
     * Writes raw text to the output
     */
    writeRaw(text: string): void;
    /**
     * Write a new line to the output
     */
    writeLine(text: string): void;
    /**
     * Write a new statement. Statements are not written to the
     * output. `if (something) {` is a statement.
     */
    writeStatement(text: string): void;
    /**
     * Write string as interpolation to the output
     */
    writeInterpol(text: string): void;
    /**
     * Return all the lines from the buffer wrapped inside a self
     * invoked function.
     */
    flush(): string;
    /**
     * Returns the number of spaces to the added to the current line for
     * pretty identation.
     */
    private getSpace();
}
export = EdgeBuffer;
