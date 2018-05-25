(function (ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.safe('<p> World </p>')}`
  out += '\n'
  return out
})(ctx)