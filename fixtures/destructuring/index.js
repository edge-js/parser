let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += `${ctx.escape({
  name: state.name,
  age: 22
})}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;