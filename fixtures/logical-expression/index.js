(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(ctx.resolve('username') || 'virk')}`
  return out
})(template, ctx)