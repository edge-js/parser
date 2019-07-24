(function (template, ctx) {
  let out = '';
  out += `${ctx.escape(Object.keys({
  [ctx.resolve('user').username]: ctx.resolve('user').age
}).join(','))}`;
  return out;
})(template, ctx)