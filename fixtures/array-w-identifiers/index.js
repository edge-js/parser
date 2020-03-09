return (function (template, ctx) {
let out = '';
ctx.$lineNumber = 1;
ctx.$filename = '{{ __dirname }}index.edge';
try {
out += 'The even numbers are ';
out += `${ctx.escape([ctx.resolve('num1'), ctx.resolve('num2'), ctx.resolve('num3')].filter(num => num % 2 === 0))}`;
} catch (error) {
ctx.reThrow(error);
}
return out;
})(template, ctx)