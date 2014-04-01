var window = require("global/window")
var mercury = require("mercury")

module.exports = createInput

function createInput() {
    var del = mercury.Delegator()
    var tuple = mercury.EventSinks(del.id, [
        "toggleAll", "add", "setTodoField", "toggle", "destroy",
        "startEdit", "finishEdit"
    ])

    tuple.events.setRoute = EventRouter()

    return { sinks: tuple.sinks, events: tuple.events }
}

function EventRouter() {
    var router = mercury.HashRouter()
    window.addEventListener("hashchange", router)

    return mercury.Event(function (emit) {
        router.on("hash", emit)
    })
}
