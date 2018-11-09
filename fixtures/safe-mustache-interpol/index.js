(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.resolve('greeting')}`
  return out
})(template, ctx)