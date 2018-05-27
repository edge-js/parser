/**
 * @module Parser
 */
import * as NE from 'node-exceptions';
declare class UnAllowedExpressionException extends NE.LogicalException {
    static invoke(expression: string, line: number, column: number): UnAllowedExpressionException;
    loc: object;
    constructor(message: string, status: number, code: string, errShLink?: string);
}
export { UnAllowedExpressionException as UnAllowedExpressionException };
