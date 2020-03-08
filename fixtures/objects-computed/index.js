(function (template, ctx) {
  let out = '';
  ctx.$lineNumber = 1;
  ctx.$filename = '{{ __dirname }}index.edge';
  try {
    out += `${ctx.escape(Object.keys({
  [ctx.resolve('user').username]: ctx.resolve('user').age
}).join(','))}`;
  } catch (error) {
    ctx.reThrow(error);
  }
  return out;
})(template, ctx)