var ws = require("nodejs-websocket");
console.log("start the connection");

var game1 = null, game2 = null, game1Ready = false, game2Ready = false;
var server = ws.createServer(function (conn) {
    console.log("connection");
    conn.on("text", function (str) {
        if (str === "game1") {
            game1 = conn;
            game1Ready = true;
            conn.sendText("success");
        }
        if (str === "game2") {
            game2 = conn;
            game2Ready = true;
        }
        if (game1Ready && game2Ready) {
            game2.sendText(str);
        }
        conn.sendText(str);
        console.log("发送:" + str);
    })

    conn.on('close', function (code, reason) {
        console.log("close the connection");
    });
    conn.on('error', function (code, reason) {
        console.log("close out of expected");
    });

}).listen(8001);
console.log("WebSocket建立完毕");