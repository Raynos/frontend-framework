var main = require("./lib/vdom-main")
var document = require("global/document")

var Input = require("./input.js")
var State = require("./state.js")
var Render = require("./render.js")
var Update = require("./update.js")

module.exports = createApp

var rootNode = createApp()
document.body.appendChild(rootNode)

function createApp() {
    // load from localStorage
    var initialState = null

    var input = Input()
    var state = State.todoApp(input.sinks, initialState)

    wireUpEvents(state, input.events)

    var loop = main(state(), Render, {
        renderOnly: true,
        onNode: function (node) {
            console.log('onNode')
            document.body.textContent = ""
            document.body.appendChild(node)
        }
    })

    state(function (newState) {
        console.log('newState', newState)
        loop.update(newState)
        // write to localStorage
    })

    return loop.target
}

function wireUpEvents(state, events) {
    events.toggleAll(Update.toggleAll.bind(null, state))
    events.add(Update.add.bind(null, state))
    events.setTodoField(Update.setTodoField.bind(null, state))
    events.toggle(Update.toggle.bind(null, state))
    events.destroy(Update.destroy.bind(null, state))
    events.startEdit(Update.startEdit.bind(null, state))
    events.finishEdit(Update.finishEdit.bind(null, state))
    events.setRoute(Update.setRoute.bind(null, state))
}
