(function (template, ctx) {
  let out = '';
  let edge_debug_line = 1;
  let edge_filename = '{{ __dirname }}index.edge';
  try {
    out += `${ctx.escape(name = ctx.resolve('username').toUpperCase())}`;
    out += '\n';
    edge_debug_line = 2;
    out += `${ctx.escape(name = ctx.resolve('getUser')().username)}`;
  } catch (error) {
    ctx.reThrow(error, edge_filename, edge_debug_line);
  }
  return out;
})(template, ctx)