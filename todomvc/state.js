var cuid = require("cuid")
var extend = require("xtend")
var mercury = require("mercury")

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
    var state = extend(TodoApp, initialState)

    return mercury.hash({
        todos: mercury.array(state.todos),
        route: mercury.value(state.route),
        todoField: mercury.value(state.todoField),
        sinks: sinks
    })
}

function todoItem(item) {
    var state = extend(TodoItem, item)

    return mercury.hash({
        id: cuid(),
        title: mercury.value(state.title),
        editing: mercury.value(state.editing),
        completed: mercury.value(state.completed)
    })
}
