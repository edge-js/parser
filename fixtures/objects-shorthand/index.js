let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += `${ctx.escape(state.toJSON({
  username: state.username,
  age: "22"
}))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;