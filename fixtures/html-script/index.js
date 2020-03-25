return (function (template, state, escape, reThrow) {
let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\u003Cscript\u003E";
out += "\n";
out += "  var reg = \u002F\\+\u002Fg";
out += "\n";
out += "\u003C\u002Fscript\u003E";
} catch (error) {
reThrow(error, $filename, $lineNumber);
}
return out;
})(template, state, escape, reThrow)