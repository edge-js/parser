let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += `${ctx.escape(new Url(state.appUrl))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;