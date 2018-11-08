(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `{{ username }}`
  return out
})(template, ctx)