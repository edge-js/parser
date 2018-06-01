(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `${'<p> World </p>'}`
  out += '\n'
  return out
})(template, ctx)