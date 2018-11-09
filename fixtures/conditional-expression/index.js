(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(ctx.resolve('username') ? ctx.resolve('username') : 'Guest')}`
  return out
})(template, ctx)