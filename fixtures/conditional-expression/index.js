(function (ctx) {
  let out = ''
  out += `${ctx.resolve('username') ? ctx.resolve('username') : 'Guest'}`
  out += '\n'
  return out
})(ctx)