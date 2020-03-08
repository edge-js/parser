(function (template, ctx) {
  let out = '';
  ctx.$lineNumber = 1;
  ctx.$filename = '{{ __dirname }}index.edge';
  try {
    out += '@if(`i${username}` === \'ivirk\')';
    out += '@endif';
  } catch (error) {
    ctx.reThrow(error);
  }
  return out;
})(template, ctx)