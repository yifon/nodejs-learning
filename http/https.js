var https=require('https')
var fs=require('fs')

var option={
    key:fs.readFileSync('ssh_key.pem'),//私钥文件
    cert:fs.readFileSync('ssh_cert.pem')//证书文件
}

https.createServer(options,function(req,res){
    res.writeHead(200)//写入一个返回的状态值
    res.end('Hello Imooc')
}).listen(8090)//监听端口