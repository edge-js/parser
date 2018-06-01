(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(ctx.resolve('toJSON')(ctx, {
  [ctx.resolve('username')]: ctx.resolve('username'),
  age: '22'
}))}`
  out += '\n'
  return out
})(template, ctx)