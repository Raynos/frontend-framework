var uuid = require("uuid")
var extend = require("xtend")
var hash = require("observ-hash")
var array = require("observ-array")
var value = require("observ")

var TodoApp = {
    todos: [],
    route: "all",
    todoField: ""
}

var TodoItem = {
    id: null,
    title: "",
    editing: false,
    completed: false
}

module.exports = {
    todoApp: todoApp,
    todoItem: todoItem
}

function todoApp(sinks, initialState) {
    var state = extend(initialState, TodoApp)

    return hash({
        todos: array(state.todos),
        route: value(state.route),
        todoField: value(state.todoField),
        sinks: sinks
    })
}

function todoItem(item) {
    var state = extend(item, TodoItem)

    return hash({
        id: uuid(),
        title: value(state.title),
        editing: value(state.editing),
        completed: value(state.complted)
    })
}
