(function (template, ctx) {
  let out = '';
  ctx.$lineNumber = 1;
  ctx.$filename = '{{ __dirname }}index.edge';
  try {
    out += `${ctx.escape(name = ctx.resolve('username').toUpperCase())}`;
    out += '\n';
    ctx.$lineNumber = 2;
    out += `${ctx.escape(name = ctx.resolve('getUser')().username)}`;
  } catch (error) {
    ctx.reThrow(error);
  }
  return out;
})(template, ctx)