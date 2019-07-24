(function (template, ctx) {
  let out = '';
  out += '@if(username)';
  out += '  Hello ';
  out += `${ctx.escape(ctx.resolve('username'))}`;
  out += '@endif';
  return out;
})(template, ctx)