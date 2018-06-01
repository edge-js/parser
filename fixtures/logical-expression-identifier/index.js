(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(ctx.resolve('username') || ctx.resolve('admin').username)}`
  out += '\n'
  return out
})(template, ctx)