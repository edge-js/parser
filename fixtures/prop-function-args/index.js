(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.escape(ctx.resolve('username').toString(true))}`
  out += '\n'
  return out
})(template, ctx)