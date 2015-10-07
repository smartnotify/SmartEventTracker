var assert = require('assert');
var Index = require('../../index');

describe('testMethodName', function() {
    it('should do thit', function() {
        index = new Index();

        assert.equal(true, index.getTest());
    });
});
