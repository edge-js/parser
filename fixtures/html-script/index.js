let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += "\u003Cscript\u003E";
out += "\n";
out += "  var reg = \u002F\\+\u002Fg";
out += "\n";
out += "\u003C\u002Fscript\u003E";
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;