const WHITE_LISTED = ['Object', 'ctx']

export default {
  toStatement (statement: any): object {
    if (WHITE_LISTED.indexOf(statement.name) > -1) {
      return statement
    }

    return {
      type: 'CallExpression',
      start: statement.start,
      end: statement.end + 13,
      callee: {
        type: 'MemberExpression',
        start: statement.start,
        end: statement.start + 11,
        object: {
          type: 'Identifier',
          start: statement.start,
          end: statement.start + 4,
          name: 'ctx',
        },
        property: {
          type: 'Identifier',
          start: statement.start + 4,
          end: statement.start + 11,
          name: 'resolve',
        },
        computed: false,
      },
      arguments: [
        Object.assign({}, statement, {
          type: 'Literal',
          value: statement.name,
          raw: `'${statement.name}'`,
        }),
      ],
    }
  },
}
