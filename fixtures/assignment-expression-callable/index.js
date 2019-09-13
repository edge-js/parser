(function (template, ctx) {
  let out = '';
  out += `${ctx.escape(name = ctx.resolve('username').toUpperCase())}`;
  out += '\n';
  out += `${ctx.escape(name = ctx.resolve('getUser')(ctx).username)}`;
  return out;
})(template, ctx)