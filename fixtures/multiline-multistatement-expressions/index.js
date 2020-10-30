let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "Your friends are ";
out += `${ctx.escape(state.users.map(user => {
  user.height.inches = user.height.cm / 2.54
  return user.username;
}))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;