(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(ctx.resolve('first') + ' ' + ctx.resolve('last'))}`
  return out
})(template, ctx)