var Delegator = require("dom-delegator")
var window = require("global/window")
var EventSource = require("geval/source")
var HashRouter = require("hash-router")
var EventSinks = require("event-sinks/geval")

module.exports = createInput

function createInput() {
    var del = Delegator()
    var tuple = EventSinks(del.id, [
        "toggleAll", "add", "setTodoField", "toggle", "destroy",
        "startEdit", "finishEdit"
    ])

    tuple.events.setRoute = EventRouter()

    return { sinks: tuple.sinks, events: tuple.events }
}

function EventRouter() {
    var router = HashRouter()
    window.addEventListener("hashchange", router)

    return EventSource(function (emit) {
        router.on("hash", emit)
    })
}
