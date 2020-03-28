let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += `${ctx.escape(Object.keys({
  username: state.user.username
}).join(","))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;