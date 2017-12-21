var app = require("http").createServer()//创建一个http server
var io = require('socket.io')(app)//把http包装成一个io的对象
var PORT = 3000

var clientCount = 0;

app.listen(PORT)

//在有连接过来时，会调用回调
io.on('connection', function (socket) {
	clientCount++
	socket.nickname = 'user' + clientCount
	//如果使用的是socket.emit，则是向socket的客户端发送消息；io.emit则进行广播
	io.emit('enter', socket.nickname + ' comes in')

	//有消息过来时，进行广播
	socket.on('message', function (str) {
		io.emit('message', socket.nickname + ' says:' + str)
	})

	//客户端断开
	socket.on('disconnect', function () {
		io.emit('leave', socket.nickname + ' left')
	})
})

console.log("websocket server listening on port " + PORT)