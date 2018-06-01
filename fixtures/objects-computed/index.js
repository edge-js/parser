(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(Object.keys({
  [ctx.resolve('user').username]: ctx.resolve('user').age
}).join(','))}`
  out += '\n'
  return out
})(template, ctx)