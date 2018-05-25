(function (ctx) {
  let out = ''
  out += `${Object.keys({
  username: ctx.resolve('user').username
}).join(',')}`
  out += '\n'
  return out
})(ctx)