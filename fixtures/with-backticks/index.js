let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "This is ";
out += `${ctx.escape(state.username)}`;
out += "'s `pet`.";
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;