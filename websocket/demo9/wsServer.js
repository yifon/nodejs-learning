var app=require("http").createServer();//创建一个http server
var io=require("socket.io")(app);//把http包装成一个io的对象

var PORT=3000;

app.listen(PORT);

//在有连接过来时会调用回调
io.on("connection",function(socket){
    socket.nickname="";

    socket.on("userName",function(str){
        socket.nickname=str;
        console.log(socket.nickname+" comes!");
    })
//有消息过来时，进行广播
    socket.on("message",function(str){
        io.emit("message",str);
    })
//客户端断开
socket.on("disconnect",function(){
    console.log(socket.nickname+" close the connection!");
    // io.emit("leave",)
})

})
console.log("websocket server listening on port"+ PORT);