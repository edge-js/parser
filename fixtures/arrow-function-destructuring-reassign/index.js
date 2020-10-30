let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += `${ctx.escape(state.users.find(({age: myAge}) => myAge === state.minAge))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;