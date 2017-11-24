//import { ReadStream } from 'fs';

var stream=require('stream')
var util=require('util')//工具类

//声明构造函数为自己定制的可读流
function ReadStream(){
    //改变可读流的上下文
    stream.Readable.call(this)//让这个对象可以调用stream的可读流的方法
}
//声明下让自己定制的可读流继承流里面可读流的原型
util.inherits(ReadStream,stream.Readable)

//为可读流添加原型链上的_read方法。私有方法
ReadStream.prototype._read=function(){
    //此可读流只做push数据的动作
    this.push('I')
    this.push('Love')
    this.push('Imooc\n')
    this.push(null)//告诉可读流的数据已经读取完毕

}

//声明可写流
function WriteStream(){
    stream.Writable.call(this)
    this._cached=new Buffer('')//声明一个缓存，传入空的字符串
}
//继承可写流的原型
util.inherits(WriteStream,stream.Writable)

//重写可写流
WriteStream.prototype._write=function(chunk,encode,cb){
    console.log(chunk.toString())
    cb()
}

//重写转换流，具备调用上下文的能力
function TransformStream(){
    stream.Transform.call(this)
}
util.inherits(TransformStream,stream.Transform)

TransformStream.prototype._transform=function(chunk,encode,cb){
    this.push(chunk)
    cb()
}

TransformStream.prototype._flush=function(cb){
    this.push('Oh Yeah!')
    cb()
}

//生成可读流
var rs=new ReadStream()
var ws=new WriteStream()
var ts=new TransformStream()
rs.pipe(ts).pipe(ws)