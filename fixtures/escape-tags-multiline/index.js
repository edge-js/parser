(function (template, ctx) {
  let out = '';
  ctx.$lineNumber = 1;
  ctx.$filename = '{{ __dirname }}index.edge';
  try {
    out += '@if(';
    out += '  2 + 2 === 4';
    out += ')';
    out += '@endif';
  } catch (error) {
    ctx.reThrow(error);
  }
  return out;
})(template, ctx)