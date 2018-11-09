(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += ctx.escape(`${ctx.resolve('username')} - ${ctx.resolve('age')}`)
  return out
})(template, ctx)