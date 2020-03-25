return (function (template, state, escape, reThrow) {
let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "Hello ";
out += `${escape(state.upper(state.auth.user.getUsername()))}`;
} catch (error) {
reThrow(error, $filename, $lineNumber);
}
return out;
})(template, state, escape, reThrow)