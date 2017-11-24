var Readable=require('stream').Readable //拿到可读流的构造函数
var Writable=require('stream').Writable//拿到可写流的构造函数

//通过new,拿到两个实例
var readStream=new Readable()
var writeStream=new Writable()

//对可读流push一些数据
readStream.push('I')
readStream.push('Love')
readStream.push('Imooc\n')
readStream.push(null)//告诉可读流的数据已经读取完毕

//重写_write方法。可写流负责打印内容
writeStream._write=function(chunk,encode,cb){
    console.log(chunk.toString())
    cb()
}
//通过pipe将可读流可写流连接起来
readStream.pipe(writeStream)
