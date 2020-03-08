(function (template, ctx) {
  let out = '';
  ctx.$lineNumber = 1;
  ctx.$filename = '{{ __dirname }}index.edge';
  try {
    out += `${ctx.escape(ctx.resolve('toJSON')({
  username: ctx.resolve('username'),
  age: '22'
}))}`;
  } catch (error) {
    ctx.reThrow(error);
  }
  return out;
})(template, ctx)