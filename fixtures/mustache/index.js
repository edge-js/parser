let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "Hello ";
out += `${ctx.escape(state.username)}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;