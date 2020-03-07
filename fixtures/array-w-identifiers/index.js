(function (template, ctx) {
  let out = '';
  let edge_debug_line = 1;
  let edge_filename = '{{ __dirname }}index.edge';
  try {
    out += 'The even numbers are ';
    out += `${ctx.escape([ctx.resolve('num1'), ctx.resolve('num2'), ctx.resolve('num3')].filter(num => num % 2 === 0))}`;
  } catch (error) {
    ctx.reThrow(error, edge_filename, edge_debug_line);
  }
  return out;
})(template, ctx)