return (function (template, ctx) {
let out = '';
ctx.$lineNumber = 1;
ctx.$filename = '{{ __dirname }}index.edge';
try {
out += "Inspect ";
out += `${ctx.escape(typeof ctx.resolve('username'))}`;
} catch (error) {
ctx.reThrow(error);
}
return out;
})(template, ctx)