(function (ctx) {
  let out = ''
  out += `${Object.keys({
  [ctx.resolve('user').username]: ctx.resolve('user').age
}).join(',')}`
  out += '\n'
  return out
})(ctx)