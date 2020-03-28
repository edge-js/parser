let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
out += "Your friends are ";
out += `${ctx.escape(state.users.map(user => {
  return user.username;
}))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;