import * as assert from 'assert'

import keyify from './keyify'

describe('helpers/keyify()', function() {
  it('SHOULD return the expected string.', () => {
    const entry = JSON.stringify({ message: 'Hello World !' })
    const expected = 'cdb59242ecb97518bb40d0666cfc269e'

    assert.strictEqual(keyify(entry), expected)
  })
})
