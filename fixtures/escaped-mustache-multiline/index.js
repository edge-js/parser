(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += '{{'
  out += '  users.map((user) => {'
  out += '    return user.username'
  out += '  })'
  out += '}}'
  return out
})(template, ctx)