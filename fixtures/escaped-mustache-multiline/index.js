(function (ctx) {
  let out = ''
  out += 'Hello '
  out += `{{
  users.map((user) => {
    return user.username
  })
}}`
  out += '\n'
  return out
})(ctx)