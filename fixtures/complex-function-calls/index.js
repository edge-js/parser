(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.escape(ctx.resolve('upper')(ctx, ctx.resolve('auth').user.getUsername()))}`
  out += '\n'
  return out
})(template, ctx)