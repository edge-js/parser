let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += `${ctx.escape(Array.isArray([]))}`;
out += "\n";
$lineNumber = 2;
out += `${ctx.escape(Object.keys({}))}`;
out += "\n";
$lineNumber = 3;
out += `${ctx.escape(isNaN(NaN))}`;
out += "\n";
$lineNumber = 4;
out += `${ctx.escape(isFinite(1))}`;
out += "\n";
$lineNumber = 5;
out += `${ctx.escape(JSON.stringify({}))}`;
out += "\n";
$lineNumber = 6;
out += `${ctx.escape(new Date().getTime())}`;
out += "\n";
$lineNumber = 7;
out += `${ctx.escape(parseInt('1'))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;