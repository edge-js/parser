(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `{{{ username }}}`
  out += '\n'
  return out
})(template, ctx)