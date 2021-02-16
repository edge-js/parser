/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Stack exposes the API to define variables and scopes. This is used by the parser
 * to decide the syntax for resolving variables.
 */
export class Stack {
  private localVariables: string[] = []
  private scopes: string[][] = []

  /**
   * Returns the recent scope of the local variables array
   */
  private getRecentScope(): string[] {
    const hasScopes = this.scopes.length
    return hasScopes ? this.scopes[this.scopes.length - 1] : this.localVariables
  }

  /**
   * Finds item inside the list or `needle in haystack`
   */
  private isInList(list: string[], item: string): boolean {
    return !!list.find((listItem) => listItem === item)
  }

  /**
   * Define a new custom scope
   */
  public defineScope(): void {
    this.scopes.push([])
  }

  /**
   * Clear recently created scope
   */
  public clearScope(): void {
    this.scopes.pop()
  }

  /**
   * Define variable inside the stack.
   */
  public defineVariable(variableName: string): void {
    this.getRecentScope().push(variableName)
  }

  /**
   * Returns a boolean telling if a variable is defined inside
   * the stack
   */
  public has(variableName: string): boolean {
    if (this.isInList(this.localVariables, variableName)) {
      return true
    }

    return !!this.scopes.find((scope) => this.isInList(scope, variableName))
  }

  /**
   * Returns the state tree for the stack
   */
  public getState() {
    return {
      localVariables: this.localVariables,
      scopes: this.scopes,
    }
  }

  /**
   * Returns a flat list of defined variables
   */
  public list() {
    return this.scopes.flat().concat(this.localVariables)
  }
}
