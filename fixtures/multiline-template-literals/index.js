(function (template, ctx) {
  let out = '';
  out += 'Your friends are ';
  out += ctx.escape(`${ctx.resolve('users').map(user => {
  return user.username;
})}`);
  return out;
})(template, ctx)