(function (template, ctx) {
  let out = '';
  ctx.$lineNumber = 1;
  ctx.$filename = '{{ __dirname }}index.edge';
  try {
    out += 'Your friends are ';
    out += ctx.escape(`${ctx.resolve('users').map(user => {
  return user.username;
})}`);
  } catch (error) {
    ctx.reThrow(error);
  }
  return out;
})(template, ctx)