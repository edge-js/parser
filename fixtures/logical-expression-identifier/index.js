(function (ctx) {
  let out = ''
  out += `${ctx.resolve('username') || ctx.resolve('admin').username}`
  out += '\n'
  return out
})(ctx)