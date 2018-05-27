(function (ctx) {
  let out = ''
  out += `${ctx.resolve('username') || 'virk'}`
  out += '\n'
  return out
})(ctx)