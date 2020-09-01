let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "The even numbers are ";
out += `${ctx.escape([1, 2, 3, 4].filter(num => num % 2 === 0))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;