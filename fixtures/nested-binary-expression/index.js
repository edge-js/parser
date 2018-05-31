(function (ctx) {
  let out = ''
  out += `${ctx.escape((2 + 2) * 4)}`
  out += ' = 16'
  out += '\n'
  return out
})(ctx)