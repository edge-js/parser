(function (template, ctx) {
  let out = '';
  out += `${ctx.escape(ctx.resolve('username') || ctx.resolve('admin').username)}`;
  return out;
})(template, ctx)