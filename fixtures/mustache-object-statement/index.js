let out = "";
let $lineNumber = 1;
let $filename = "{{ __dirname }}index.edge";
try {
out += "\u003Cbutton ";
out += ctx.toAttributes({
  class: ['btn', {
    'btn-error': state.hasError,
    'btn-primary': !state.hasError
  }]
});
out += "\u003E Submit \u003C\u002Fbutton\u003E";
} catch (error) {
ctx.reThrow(error, $filename, $lineNumber);
}
return out;