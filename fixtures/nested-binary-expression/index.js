(function (template, ctx) {
  let out = ''
  out += `${ctx.escape((2 + 2) * 4)}`
  out += ' = 16'
  return out
})(template, ctx)