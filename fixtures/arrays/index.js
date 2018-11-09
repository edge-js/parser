(function (template, ctx) {
  let out = ''
  out += 'The even numbers are '
  out += `${ctx.escape([1, 2, 3, 4].filter(num => num % 2 === 0))}`
  return out
})(template, ctx)