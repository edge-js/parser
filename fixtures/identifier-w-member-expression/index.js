let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "The type is ";
out += `${ctx.escape(state.types[state.type])}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;