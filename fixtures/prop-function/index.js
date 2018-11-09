(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.escape(ctx.resolve('username').toUpperCase())}`
  return out
})(template, ctx)