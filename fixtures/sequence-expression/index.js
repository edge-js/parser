(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.escape((true, false))}`
  out += '\n'
  return out
})(template, ctx)