let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += `${ctx.escape((2 + 2) * 4)}`;
out += " = 16";
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;