(function (template, ctx) {
  let out = '';
  out += `${ctx.escape(Object.keys({
  username: ctx.resolve('user').username
}).join(','))}`;
  return out;
})(template, ctx)