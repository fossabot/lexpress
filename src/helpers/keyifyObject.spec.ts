// tslint:disable

import * as assert from 'assert'

import keyifyObject from './keyifyObject'

describe('helpers/keyifyObject()', function() {
  it('SHOULD return the expected string.', () => {
    assert.strictEqual(
      keyifyObject({ message: '`a\'b"c_d eèf/g\\' }),
      'message-a-b-c_d-e-f-g'
    )
  })
})
