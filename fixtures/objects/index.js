(function (template, ctx) {
  let out = ''
  out += `${ctx.escape(Object.keys({
  username: 'virk'
}).join(','))}`
  out += '\n'
  return out
})(template, ctx)