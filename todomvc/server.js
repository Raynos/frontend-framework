var http = require("http")
var fs = require("fs")
var path = require("path")
var console = require("console")
var ServeBrowserify = require("serve-browserify")

var serveBrowser = ServeBrowserify({
    root: __dirname,
    gzip: true
})
var css = fs.readFileSync(path.join(__dirname, "style.css"))
var img = fs.readFileSync(path.join(__dirname, "bg.png"))

http.createServer(function (req, res) {
    if (req.url === "/browser.js") {
        serveBrowser(req, res)
    } else if (req.url === "/bg.png") {
        res.setHeader("content-type", "image/png")
        return res.end(img)
    } else if (req.url === "/style.css") {
        res.setHeader("content-type", "text/css")
        return res.end(css)
    } else {
        res.setHeader("content-type", "text/html")
        res.end(
            "<meta charset=\"utf-8\">" +
            "<link rel=\"stylesheet\" href=\"style.css\">" +
            "<body>" +
            "    <script src=\"/browser.js\"></script>" +
            "</body>")
    }
}).listen(8000, function () {
    console.log("listening on port 8000")
})
