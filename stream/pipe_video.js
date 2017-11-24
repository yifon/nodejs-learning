var fs=require('fs')

fs.createReadStream('canon.mp3').pipe(fs.createWriteStream('canon-pipe.mp3'))