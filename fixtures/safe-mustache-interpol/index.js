(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.resolve('greeting')}`
  out += '\n'
  return out
})(template, ctx)