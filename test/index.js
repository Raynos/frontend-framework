var test = require("tape")

var frontendFramework = require("../index")

test("frontendFramework is a function", function (assert) {
    assert.equal(typeof frontendFramework, "function")
    assert.end()
})
