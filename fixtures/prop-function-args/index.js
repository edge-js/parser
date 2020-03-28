let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += "Hello ";
out += `${ctx.escape(state.username.toString(true))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;