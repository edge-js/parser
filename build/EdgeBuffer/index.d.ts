/**
 * @module Parser
 */
import { IEdgeBuffer } from '../Contracts';
export default class EdgeBuffer implements IEdgeBuffer {
    private lines;
    private indentSpaces;
    indent(): void;
    dedent(): void;
    writeLine(text: string): void;
    writeInterpol(text: string): void;
    flush(): string;
    private getSpace();
}
