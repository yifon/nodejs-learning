var mongoose=require('mongoose')
//引入movie文件导出的MovieSchema模块
var MovieSchema=require('../schemas/movie')
//编译生成Movie模型,传入模型名字和模式
var Movie=mongoose.model('Movie',MovieSchema)

//将构造函数导出
module.exports=Movie