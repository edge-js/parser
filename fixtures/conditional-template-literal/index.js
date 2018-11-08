(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(ctx.resolve('username') ? `Welcome ${ctx.resolve('username')}` : 'Welcome guest')}`
  return out
})(template, ctx)