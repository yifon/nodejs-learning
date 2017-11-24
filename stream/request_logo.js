var http=require('http')
var fs=require('fs')
var request=require('request')

http.createServer(function(req,res){
    //读一个文件到内存中
    // fs.readFile('./buffer/logo.png',function(err,data){
    //     if(err){
    //         res.end('file not exist!')
    //     }
    //     else{
    //         //如果文件的读取是正常的，
    //         //写入一个返回的头
    //         res.writeHead(200,{'Context-Type':'text\html'})
    //         res.end(data)//把读到的图片的data写入进去
    //     }
    // })
    //拿到一个可读流，pipe给response
    //fs.createReadStream('../buffer/logo.png').pipe(res)

    //线上爬取图片
    request('https://static.mukewang.com/static/img/common/logo.png?t=2.4')
    .pipe(res)//pipe会不断地监听data和end事件，图片中的数据会不断地发给客户端
})
.listen(8090)