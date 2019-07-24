(function (template, ctx) {
  let out = '';
  out += 'Hello ';
  out += `${ctx.escape((true, false))}`;
  return out;
})(template, ctx)