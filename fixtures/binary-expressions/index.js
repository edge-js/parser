(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(2 + 2)}`
  out += ' = 4'
  out += '\n'
  return out
})(template, ctx)