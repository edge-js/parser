(function (ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.resolve('username').toUpperCase()}`
  out += '\n'
  return out
})(ctx)