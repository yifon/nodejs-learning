var ws = require("nodejs-websocket")
var PORT = 3000

var clientCount = 0;

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
	console.log("New connection")
	clientCount++;
	conn.nickname = "user" + clientCount;
	//当user进来时，进行广播
	var mes = {};//新建一个对象
	mes.type = "enter";
	mes.data = conn.nickname + " comes in";
	broadcast(JSON.stringify(mes));
	conn.on("text", function (str) {
		console.log("Received " + str)
		var mes = {};//新建一个对象
		mes.type = "message";
		mes.data = conn.nickname+" says "+str;
		//当有消息发送时，进行广播
		broadcast(JSON.stringify(mes));
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed");
		var mes = {};//新建一个对象
		mes.type = "leave";
		mes.data = conn.nickname + ' left';
		broadcast(JSON.stringify(mes));
	})
	conn.on("error", function (err) {
		console.log("handle err")
		console.log(err)
	})
}).listen(PORT)
console.log("websocket server listening on port:" + PORT);

function broadcast(str) {
	//获取server下的所有连接，并调用sendText
	server.connections.forEach(function (connection) {
		connection.sendText(str);
	})

}