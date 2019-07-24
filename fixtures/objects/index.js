(function (template, ctx) {
  let out = '';
  out += `${ctx.escape(Object.keys({
  username: 'virk'
}).join(','))}`;
  return out;
})(template, ctx)