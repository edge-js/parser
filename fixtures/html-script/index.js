return (function (template, ctx) {
let out = '';
ctx.$lineNumber = 1;
ctx.$filename = '{{ __dirname }}index.edge';
try {
out += "\u003Cscript\u003E";
out += "\n";
out += "  var reg = \u002F\\+\u002Fg";
out += "\n";
out += "\u003C\u002Fscript\u003E";
} catch (error) {
ctx.reThrow(error);
}
return out;
})(template, ctx)