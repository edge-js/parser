(function (ctx) {
  let out = ''
  out += 'Your friends are '
  out += `${ctx.resolve('users').map(user => {
  return user.username;
})}`
  out += '\n'
  return out
})(ctx)