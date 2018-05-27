(function (ctx) {
  let out = ''
  out += 'Inspect '
  out += `${typeof ctx.resolve('username')}`
  out += '\n'
  return out
})(ctx)