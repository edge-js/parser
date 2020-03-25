return (function (template, state, escape, reThrow) {
let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += `${escape(2 + 2)}`;
out += " = 4";
} catch (error) {
reThrow(error, $filename, $lineNumber);
}
return out;
})(template, state, escape, reThrow)