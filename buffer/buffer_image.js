//import { Buffer } from 'buffer';

var fs =require('fs')

fs.readFile('logo.png',function(err,origin_buffer){
    console.log(Buffer.isBuffer(origin_buffer))

    //若无指定编码，则fs.writeFile会认为传入的为Buffer对象为utf-8的编码字符串
    fs.writeFile('logo_buffer.png',origin_buffer,function(err){
        if(err)console.log(err)
    })

    //通过toString('base64')来解码成为字符串
    //var base64Image=new Buffer(origin_buffer).toString('base64')
    var base64Image=origin_buffer.toString('base64')

    console.log(base64Image)

    //这个base64Image为base64后的字符串，需要传递给构造函数，指定编码格式，来生成一个新的Buffer实例    
    var decodedImage=new Buffer(base64Image,'base64')
    console.log(Buffer.compare(origin_buffer,decodedImage))

    fs.writeFile('logo_decoded.png',decodedImage,function(err){
        if(err)console.log(err)
    })
})