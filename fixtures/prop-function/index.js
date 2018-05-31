(function (ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.escape(ctx.resolve('username').toUpperCase())}`
  out += '\n'
  return out
})(ctx)