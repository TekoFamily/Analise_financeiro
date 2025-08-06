const assert = require('assert');

test('hello world!', () => {
    const nodeEnv = process.env.NODE_ENV || 'development';
    assert.strictEqual(nodeEnv, 'development');
});