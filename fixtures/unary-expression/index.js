(function (template, ctx) {
  let out = '';
  out += 'Inspect ';
  out += `${ctx.escape(typeof ctx.resolve('username'))}`;
  return out;
})(template, ctx)