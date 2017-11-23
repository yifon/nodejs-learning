var fs=require('fs')

var readStream=fs.createReadStream('canon.mp3')
var writeStream=fs.createWriteStream('1-canon.mp3')

readStream.on('data',function(chunk){
    //若传得块，写得慢，数据可能还在缓存区，则会爆仓，所以要判断数据是否还在缓存区
    //writeStream.write(chunk)
    //改造：若写入流已经将缓存写入到目标了，则可以传入下一段的数据块了
    if(writeStream.write(chunk)==false){
        //证明数据还在缓存区，则需要将读的速度降下来
        console.log('still cached')
        readStream.pause()
    }
})

readStream.on('end',function(){
    writeStream.end()
})

//drain事件表示数据已经被消费完了，即写入到目标了
writeStream.on('drain',function(){
    console.log('data drains')

    //通知readStream可以继续读取数据
    readStream.resume()
})