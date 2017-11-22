var http=require('http')
var url='http://www.imooc.com/learn/348'

http.get(url,function(res){
    var html=''
    
    //当response有data事件触发的时候，有一个回调
    res.on('data',function(data){
        html+=data
    })
    res.on('end',function(){
        console.log(html)
    })
}).on('error',function(){//注册一个error事件
    console.log('获取课程数据出错')
})