(function (template, ctx) {
  let out = '';
  let edge_debug_line = 1;
  let edge_filename = '{{ __dirname }}index.edge';
  try {
    out += 'Hello ';
    out += '{{';
    out += '  users.map((user) => {';
    out += '    return user.username';
    out += '  })';
    out += '}}';
  } catch (error) {
    ctx.reThrow(error, edge_filename, edge_debug_line);
  }
  return out;
})(template, ctx)