(function (ctx) {
  let out = ''
  out += 'The even numbers are '
  out += `${[1, 2, 3, 4].filter(num => num % 2 === 0)}`
  out += '\n'
  return out
})(ctx)