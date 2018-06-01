(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(ctx.resolve('username') ? `Welcome ${ctx.resolve('username')}` : 'Welcome guest')}`
  out += '\n'
  return out
})(template, ctx)