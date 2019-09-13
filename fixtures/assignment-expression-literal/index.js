(function (template, ctx) {
  let out = '';
  out += `${ctx.escape(name = ctx.resolve('userName'))}`;
  return out;
})(template, ctx)