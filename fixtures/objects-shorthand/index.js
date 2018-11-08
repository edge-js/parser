(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(ctx.resolve('toJSON')(ctx, {
  username: ctx.resolve('username'),
  age: '22'
}))}`
  return out
})(template, ctx)