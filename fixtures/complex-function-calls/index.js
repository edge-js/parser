(function (ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.resolve('upper')(ctx, ctx.resolve('auth').user.getUsername())}`
  out += '\n'
  return out
})(ctx)