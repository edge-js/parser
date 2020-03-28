let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "@if(username)";
out += "\n";
out += "  Hello ";
$lineNumber = 2;
out += `${ctx.escape(state.username)}`;
out += "@endif";
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;