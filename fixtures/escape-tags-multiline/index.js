let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "@if(";
out += "  2 + 2 === 4";
out += ")";
out += "@endif";
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;