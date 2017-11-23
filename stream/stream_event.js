//import { Buffer } from 'buffer';

var fs = require('fs')

//创建一个可读的流，其生产数据等方式是读取磁盘等文件
//可读流是生产数据用来供程序消费的流。常见的数据生产方式有读取磁盘文件、读取网络请求内容等
//var readStream = fs.createReadStream('stream_copy_logo.js')
var readStream = fs.createReadStream('canon.mp3')

var n = 0 //计数器
readStream
    //数据在传递的时候会触发事件，传递chunk数据块
    .on('data', function (chunk) {
        console.log('data emits')
        n++ //data事件触发时，让n的值加一
        //验证下流的传递是不是以Buffer的形式
        console.log(Buffer.isBuffer(chunk))
        //打印chunk内容
        console.log(chunk.toString('utf8'))
        //让可读流暂停
        readStream.pause()
        console.log('data pause')
        setTimeout(function () {
            console.log('data pause end')//暂停结束
            readStream.resume()//重新启动事件的传递
       // }, 3000)//3秒钟
    }, 10)//10毫钟
    })
    .on('readable', function () {
        console.log('data readable')
    })
    .on('end', function () {
        console.log('data ends')
    })
    //整个流传输关闭结束时触发close事件
    .on('close', function () {
        console.log(n)//打印n的值
        console.log('data close')
    })
    //读的时候出现异常，如文件不存在，则会触发error事件
    .on('error', function (e) {
        console.log('data read error' + e)
    })