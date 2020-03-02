(function (template, ctx) {
  let out = '';
  out += `${ctx.escape(ctx.resolve('toJSON')({
  username: ctx.resolve('username'),
  age: '22'
}))}`;
  return out;
})(template, ctx)