let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "@if(username)";
out += "@endif";
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;