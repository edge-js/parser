(function (template, ctx) {
  let out = '';
  out += '@if(';
  out += '  2 + 2 === 4';
  out += ')';
  out += '@endif';
  return out;
})(template, ctx)