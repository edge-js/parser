return (function (template, ctx) {
let out = '';
ctx.$lineNumber = 1;
ctx.$filename = '{{ __dirname }}index.edge';
try {
out += 'Hello ';
out += `${ctx.escape(ctx.resolve('upper')(ctx.resolve('auth').user.getUsername()))}`;
} catch (error) {
ctx.reThrow(error);
}
return out;
})(template, ctx)