(function (template, ctx) {
  let out = ''
  out += `@if(
  2 + 2 === 4
)`
  out += `@endif`
  return out
})(template, ctx)