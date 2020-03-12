return (function (template, ctx) {
let out = "";
ctx.$lineNumber = 1;
ctx.$filename = "{{ __dirname }}index.edge";
try {
out += "This is Susan's pet.";
} catch (error) {
ctx.reThrow(error);
}
return out;
})(template, ctx)