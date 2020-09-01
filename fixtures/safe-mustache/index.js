let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "Hello ";
out += `${"<p> World </p>"}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;