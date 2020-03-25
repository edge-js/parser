return (function (template, state, escape, reThrow) {
let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += `${escape(name = state.username.toUpperCase())}`;
out += "\n";
$lineNumber = 2;
out += `${escape(name = state.getUser().username)}`;
} catch (error) {
reThrow(error, $filename, $lineNumber);
}
return out;
})(template, state, escape, reThrow)