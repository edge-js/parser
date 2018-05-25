(function (ctx) {
  let out = ''
  out += `${ctx.resolve('toJSON')(ctx, {
  [ctx.resolve('username')]: ctx.resolve('username'),
  age: '22'
})}`
  out += '\n'
  return out
})(ctx)