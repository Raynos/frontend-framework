var addEvent = require("dom-delegator/add-event")
var FormData = require("form-data-set")
var uuid = require("uuid")
var walk = require("dom-walk")
var extend = require("xtend")

var ENTER = 13
var cacheKey = uuid(0)

module.exports = value

function value(sink, data) {
    return vdomEvent(sink.id, new SinkHandler(sink, data))
}

function SinkHandler(sink, data) {
    this.sink = sink
    this.data = data
    this.type = null
}

function buildElems(rootElem) {
    var hash = {}

    walk(rootElem, function (child) {
        if (child.name) {
            hash[child.name] = child
        }
    })

    return hash
}

function getFormData(rootElem) {
    var elements = buildElems(rootElem)

    return FormData(elements)
}

SinkHandler.prototype.handleEvent = function handleEvent(ev) {
    var target = ev.target
    var isValid

    //console.log('ev', ev)

    if (this.type === "submit") {
        isValid = ev.type === "click" &&
            target.tagName === "BUTTON"

        isValid = isValid || ((
            target.type === "text" || target.tagName === "TEXTAREA"
        ) && (
            ev.keyCode === ENTER && !ev.shiftKey
        ) && target.value.trim() !== "")
    } else if (this.type === "change") {
        isValid = ev.type === "change" &&
            target.type === "checkbox"

        isValid = isValid || (
            ev.type === "keyup" && target.type === "text"
        )
    }

    if (isValid) {
        var value = getFormData(ev.currentTarget)

        var data = extend(this.data, { currentValue: value })

        this.sink.write(data)
    }
}

function vdomEvent(id, handler) {
    return function (elem, property) {
        var eventName = property.substr(5)

        if (eventName === "submit") {
            handler.type = "submit"
            addEvent(id, elem, "click", handler)
            addEvent(id, elem, "keyup", handler)
        } else if (eventName === "change") {
            handler.type = "change"
            addEvent(id, elem, "keyup", handler)
            addEvent(id, elem, "change", handler)
        }

        addEvent(id, elem, eventName, handler)
    }
}
