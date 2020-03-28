let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += `${ctx.escape(name = state.userName)}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;