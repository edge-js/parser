(function (ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.resolve('username').toString(true)}`
  out += '\n'
  return out
})(ctx)