var fs=require('fs')

//同步读取的函数和异步函数相比，多来一个Sync后缀，并且不接受回调函数，函数直接返回结果
var source=fs.readFileSync('../buffer/logo.png')

fs.writeFileSync('stream_copy_logo.png',source)