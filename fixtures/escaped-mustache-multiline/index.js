let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += "Hello ";
out += "{{";
out += "  users.map((user) =\u003E {";
out += "    return user.username";
out += "  })";
out += "}}";
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;