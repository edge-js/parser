let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += "Inspect ";
out += `${ctx.escape(typeof state.username)}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;