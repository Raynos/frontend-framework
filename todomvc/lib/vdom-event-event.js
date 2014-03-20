var addEvent = require("dom-delegator/add-event")

module.exports = event

function event(sink, data) {
    return vdomEvent(sink.id, new SinkHandler(sink, data))
}

function SinkHandler(sink, data) {
    this.sink = sink
    this.data = data
}

SinkHandler.prototype.handleEvent = function handleEvent(ev) {
    this.sink.write(this.data)
}

function vdomEvent(id, fn) {
    return function (elem, property) {
        var eventName = property.substr(5)

        addEvent(id, elem, eventName, fn)
    }
}
