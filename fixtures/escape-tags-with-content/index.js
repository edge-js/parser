return (function (template, state, escape, reThrow) {
let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "@if(username)";
out += "  Hello ";
$lineNumber = 2;
out += `${escape(state.username)}`;
out += "@endif";
} catch (error) {
reThrow(error, $filename, $lineNumber);
}
return out;
})(template, state, escape, reThrow)