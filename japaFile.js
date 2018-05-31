const Assertion = require('japa/api').Assertion
const cli = require('japa/cli')

Assertion.use((chai, utils) => {
  chai.assert.stringEqual = function (val, exp, msg) {
    new chai.Assertion(val.split('\n'), msg).to.deep.equal(exp.split('\n'))
  }
})

cli.run('test/*.spec.js')
