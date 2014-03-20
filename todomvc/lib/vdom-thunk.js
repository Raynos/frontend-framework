var render = require('virtual-dom/render');
var diff = require('virtual-dom/diff');
// var enqueue = require('virtual-dom/enqueue');
var patch = require('virtual-dom/patch');

module.exports = partial;

/*
type Widget := {
  init: () => DOMElement,
  update: (previous: Widget) => DOMElement,
  destroy: () => void
}
*/

function partial(fn) {
    var args = [].slice.call(arguments, 1);

    return new Thunk(fn, args);
}

function Thunk(fn, args) {
    this.fn = fn;
    this.args = args;
    this.elm = null;
    this.tree = null;
    this.patches = null;
}

var type = Thunk.prototype.type = 'thunk@version';

Thunk.prototype.init = function () {
    this.tree = this.fn.apply(null, this.args);
    this.elem = render(this.tree);
    return this.elem;
};

Thunk.prototype.update = function (prev) {
    // prev is not a Thunk. However prev is always a Widget
    if (prev.type !== type) {
        return this.init();
    }

    this.elem = prev.elem;

    if (prev.fn === this.fn &&
        prev.args.length === this.args.length &&
        prev.args.every(function (arg, index) {
            return this[index] === arg;
        }, this)
    ) {
        this.tree = prev.tree;
        return null;
    }

    this.tree = this.fn.apply(null, this.args);
    var patches = this.patches = diff(prev.tree, this.tree);

    var elem = this.elem;
    // use an `enqueue` function from virtual-dom.
    // this is the global queue to apply patches in a raf loop
    setImmediate(function () {
        patch(elem, patches);
    });
};
