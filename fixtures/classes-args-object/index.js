let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += `${ctx.escape(new Url({
  url: state.url,
  somethingelse: 'bar'
}))}`;
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;