let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += `${ctx.escape(state.user[Object.keys(state.user).find(k => k === 'id')])}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;