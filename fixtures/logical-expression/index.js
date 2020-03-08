(function (template, ctx) {
  let out = '';
  ctx.$lineNumber = 1;
  ctx.$filename = '{{ __dirname }}index.edge';
  try {
    out += `${ctx.escape(ctx.resolve('username') || 'virk')}`;
  } catch (error) {
    ctx.reThrow(error);
  }
  return out;
})(template, ctx)