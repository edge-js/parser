let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "The value is ";
out += `${ctx.escape(state.counter++)}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;