return (function (template, state, escape, reThrow) {
let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "Hello ";
out += `${state.greeting}`;
} catch (error) {
reThrow(error, $filename, $lineNumber);
}
return out;
})(template, state, escape, reThrow)