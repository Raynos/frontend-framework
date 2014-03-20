var find = require("array-find")
var findIndex = require("array-findindex")

var State = require("./state.js")

module.exports = {
    setRoute: setRoute,
    toggleAll: toggleAll,
    add: add,
    setTodoField: setTodoField,
    toggle: toggle,
    destroy: destroy,
    startEdit: startEdit,
    finishEdit: finishEdit
}

function setRoute(state, route) {
    state.route.set(route.hash)
}

function toggleAll(state) {
    state.todos.forEach(function (todo) {
        todo.completed.set(!todo.completed())
    })
}

function add(state, data) {
    state.todos.push(State.todoItem({
        title: data.currentValue.newTodo
    }))
    state.todoField.set("")
}

function setTodoField(state, data) {
    state.todoField.set(data.currentValue.newTodo)
}

function toggle(state, data) {
    var item = find(state.todos, data.id)
    item.completed.set(data.completed)
}

function startEdit(state, data) {
    var item = find(state.todos, data.id)
    item.editing.set(true)
}

function destroy(state, data) {
    var index = findIndex(state.todos, data.id)
    state.todos.splice(index, 1)
}

function finishEdit(state, data) {
    var item = find(state.todos, data.id)
    item.ittle.set(data.currentValue.title)
}