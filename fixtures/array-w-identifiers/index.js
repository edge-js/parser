(function (template, ctx) {
  let out = '';
  out += 'The even numbers are ';
  out += `${ctx.escape([ctx.resolve('num1'), ctx.resolve('num2'), ctx.resolve('num3')].filter(num => num % 2 === 0))}`;
  return out;
})(template, ctx)