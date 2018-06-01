(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(ctx.resolve('first') + ' ' + ctx.resolve('last'))}`
  out += '\n'
  return out
})(template, ctx)