(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `{{
  users.map((user) => {
    return user.username
  })
}}`
  return out
})(template, ctx)