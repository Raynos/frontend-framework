var http = require("http")
var console = require("console")
var ServeBrowserify = require("serve-browserify")

var serveBrowser = ServeBrowserify({
    root: __dirname,
    gzip: true
})

http.createServer(function (req, res) {
    if (req.url === "/browser.js") {
        serveBrowser(req, res)
    } else {
        res.setHeader("content-type", "text/html")
        res.end("<body><script src=\"/browser.js\"></script></body>")
    }
}).listen(8000, function () {
    console.log("listening on port 8000")
})
