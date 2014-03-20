var raf = require("raf").polyfill
var vdomRender = require("virtual-dom/render")
var vdomDiff = require("virtual-dom/diff")
var vdomPatch = require("virtual-dom/patch")

module.exports = main

function main(initialState, view, opts) {
    opts = opts || {}

    var currentState = initialState
    var render = opts.render || vdomRender
    var diff = opts.diff || vdomDiff
    var patch = opts.patch || vdomPatch
    var looping = true

    var tree = view(currentState)
    var target = render(tree, opts)

    currentState = null

    raf(redraw)

    return {
        target: target,
        update: update
    }

    function update(state) {
        if (currentState === null && !looping) {
            looping = true
            raf(redraw)
        }

        currentState = state
    }

    function redraw() {
        if (currentState === null) {
            looping = false
            return
        }

        var newTree = view(currentState)

        if (opts.renderOnly) {
            render(newTree, opts)
        } else {
            var patches = diff(tree, newTree)
            patch(target, patches)
        }

        tree = newTree
        currentState = null

        raf(redraw)
    }
}
