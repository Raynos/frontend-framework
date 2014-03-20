var Delegator = require("dom-delegator")
var EventSource = require("geval/source")
var HashRouter = require("hash-router")
var EventSinks = require("event-sinks/geval")

module.exports = createInput

function createInput() {
    var del = Delegator()
    var events = EventSinks(del.id, [
        "toggleAll", "add", "setTodoField", "toggle", "destroy",
        "startEdit", "finishEdit"
    ])

    events.setRoute = EventRouter()

    return { sinks: events.sinks, events: events }
}

function EventRouter() {
    var router = HashRouter()

    return EventSource(function (emit) {
        router.on("hash", emit)
    })
}
