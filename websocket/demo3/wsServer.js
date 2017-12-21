var ws = require("nodejs-websocket")
var PORT=3000

var clientCount=0;

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
	console.log("New connection")
	clientCount++;
	conn.nickname='user'+clientCount;
	//当user进来时，进行广播
	broadcast(conn.nickname+' comes in');
	conn.on("text", function (str) {
		console.log("Received "+str)
		conn.sendText(str.toUpperCase()+"!!!");
		//当有消息发送时，进行广播
		broadcast(str);
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed");
		broadcast(conn.nickname+' left');
    })
    conn.on("error",function(err){
        console.log("handle err")
        console.log(err)
    })
}).listen(PORT)
console.log("websocket server listening on port:"+PORT);

function broadcast(str){
	//获取server下的所有连接，并调用sendText
	server.connections.forEach(function(connection){
		connection.sendText(str);
	})

}