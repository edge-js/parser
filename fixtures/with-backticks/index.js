(function (template, ctx) {
  let out = '';
  out += 'This is ';
  out += `${ctx.escape(ctx.resolve('username'))}`;
  out += '\'s `pet`.';
  return out;
})(template, ctx)