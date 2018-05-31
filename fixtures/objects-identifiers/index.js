(function (ctx) {
  let out = ''
  out += `${ctx.escape(Object.keys({
  username: ctx.resolve('user').username
}).join(','))}`
  out += '\n'
  return out
})(ctx)