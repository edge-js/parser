let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += `${ctx.escape(name = state.username.toUpperCase())}`;
out += "\n";
$lineNumber = 2;
out += `${ctx.escape(name = state.getUser().username)}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;