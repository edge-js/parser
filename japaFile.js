require('ts-node/register')

const cli = require('japa/cli')
cli.run('test/**/*.spec.ts')
const Assertion = require('japa/api').Assertion

Assertion.use((chai, utils) => {
  chai.assert.stringEqual = function (val, exp, msg) {
    new chai.Assertion(val.split('\n'), msg).to.deep.equal(exp.split('\n'))
  }
})
