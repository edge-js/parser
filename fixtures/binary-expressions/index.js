(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(2 + 2)}`
  out += ' = 4'
  return out
})(template, ctx)