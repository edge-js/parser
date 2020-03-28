let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += `${ctx.escape(Object.keys({
  [state.user.username]: state.user.age
}).join(","))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;