(function (ctx) {
  let out = ''
  out += `${ctx.resolve('username') ? `Welcome ${ctx.resolve('username')}` : 'Welcome guest'}`
  out += '\n'
  return out
})(ctx)