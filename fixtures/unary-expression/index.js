(function (template, ctx) {
  let out = ''
  out += 'Inspect '
  out += `${ctx.escape(typeof ctx.resolve('username'))}`
  out += '\n'
  return out
})(template, ctx)