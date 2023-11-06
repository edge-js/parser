let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\n";
$lineNumber = 2;
out += `${ctx.escape(state.foo(...state.args))}`;
out += "\n";
out += "";
out += "\n";
out += "\n";
$lineNumber = 5;
out += `${ctx.escape(state.foo(...[1, 2, 3]))}`;
out += "\n";
out += "";
out += "\n";
out += "\n";
$lineNumber = 8;
out += `${ctx.escape(state.users = [...state.newUsers, ...state.suspendedUsers])}`;
out += "\n";
out += "";
out += "\n";
out += "\n";
$lineNumber = 11;
out += `${ctx.escape(state.users = [...[1, 2, 3], 4])}`;
out += "\n";
out += "";
out += "\n";
out += "\n";
$lineNumber = 14;
out += `${ctx.escape(state.cloned = {
  ...state.users,
  ...state.suspendedUsers
})}`;
out += "\n";
out += "";
out += "\n";
out += "\n";
$lineNumber = 17;
out += `${ctx.escape(state.foo({
  ...state.users,
  ...state.suspendedUsers
}))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;