(function (ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.resolve('username')}`
  out += '\n'
  return out
})(ctx)