return (function (template, ctx) {
let out = '';
ctx.$lineNumber = 1;
ctx.$filename = '{{ __dirname }}index.edge';
try {
out += 'Hello ';
out += '{{';
out += '  users.map((user) => {';
out += '    return user.username';
out += '  })';
out += '}}';
} catch (error) {
ctx.reThrow(error);
}
return out;
})(template, ctx)