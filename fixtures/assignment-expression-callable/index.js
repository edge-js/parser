let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += `${ctx.escape(state.name = state.username.toUpperCase())}`;
out += "\n";
$lineNumber = 2;
out += `${ctx.escape(state.name = state.getUser().username)}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;