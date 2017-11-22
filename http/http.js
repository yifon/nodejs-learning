var http=require('http')
//创建服务器
http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/plain'})
    res.write('Hello Nodejs')
    res.end()
}).listen(2015)