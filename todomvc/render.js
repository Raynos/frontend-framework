var h = require("virtual-dom/h")
var partial = require("vdom-thunk")
var valueEvent = require("vdom-event/value-event")
var event = require("vdom-event/event")

var doMutableFocus = require("./lib/do-mutable-focus.js")

var footer = infoFooter()

module.exports = render

function render(state) {
    return h(".todomvc-wrapper", [
        h("section.todoapp", [
            partial(header, state.todoField, state.sinks),
            partial(mainSection, state.todos, state.route, state.sinks),
            partial(statsSection, state.todos, state.route)
        ]),
        footer
    ])
}

function header(todoField, sinks) {
    return h("header.header", {
        "data-submit": valueEvent(sinks.add),
        "data-change": valueEvent(sinks.setTodoField)
    }, [
        h("h1", "Todos"),
        h("input.new-todo", {
            placeholder: "What needs to be done?",
            autofocus: true,
            value: todoField,
            name: "newTodo"
        })
    ])
}

function mainSection(todos, route, sinks) {
    var allCompleted = todos.every(function (todo) {
        return todo.completed
    })
    var visibleTodos = todos.filter(function (todo) {
        return route === "completed" && todo.completed ||
            route === "active" && !todo.completed ||
            route === "all"
    })

    return h("section.main", { hidden: !todos.length }, [
        h("input#toggle-all.toggle-all", {
            type: "checkbox",
            checked: allCompleted,
            "data-change": event(sinks.toggleAll)
        }),
        h("label", { htmlFor: "toggle-all" }, "Mark all as complete"),
        h("ul.todolist", visibleTodos.map(function (todo) {
            return partial(todoItem, todo, sinks)
        }))
    ])
}

function todoItem(todo, sinks) {
    var className = (todo.completed ? "completed " : "") +
        (todo.editing ? "editing" : "")

    return h("li", { className: className, key: todo.id }, [
        h(".view", [
            h("input.toggle", {
                type: "checkbox",
                checked: todo.completed,
                "data-change": event(sinks.toggle, {
                    id: todo.id,
                    completed: todo.completed
                })
            }),
            h("label", {
                "data-dblclick": event(sinks.startEdit, { id: todo.id })
            }, todo.title),
            h("button.destroy", {
                "data-click": event(sinks.destroy, { id: todo.id })
            })
        ]),
        h("input.edit", {
            value: todo.title,
            name: "title",
            // when we need an RPC invocation we add a 
            // custom mutable operation into the tree to be
            // invoked at patch time
            "data-focus": todo.editing ? doMutableFocus : null,
            "data-submit": valueEvent(sinks.finishEdit, { id: todo.id }),
            "data-blur": valueEvent(sinks.finishEdit, { id: todo.id })
        })
    ])
}

function statsSection(todos, route) {
    var todosLeft = todos.filter(function (todo) {
        return !todo.completed
    }).length

    return h("footer.footer", { hidden: !todos.length }, [
        h("span.todo-count", [
            h("strong", todosLeft),
            todosLeft === 1 ? " item" : " items",
            " left"
        ]),
        h("ul.filters", [
            link("#/", "All", route === "all"),
            link("#/active", "Active", route === "active"),
            link("#/completed", "Completed", route === "completed")
        ])
    ])
}

function link(uri, text, isSelected) {
    return h("li", [
        h("a", { className: isSelected ? "selected" : "", href: uri }, text)
    ])
}

function infoFooter() {
    return h("footer.info", [
        h("p", "Double-click to edit a todo"),
        h("p", [
            "Written by ",
            h("a", { href: "https://github.com/Raynos" }, "Raynos")
        ]),
        h("p", [
            "Part of ",
            h("a", { href: "http://todomvc.com" }, "TodoMVC")
        ])
    ])
}
