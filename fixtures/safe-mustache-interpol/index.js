(function (ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.safe(`${ctx.resolve('greeting')}`)}`
  out += '\n'
  return out
})(ctx)