//引入mongoose的建模工具模块
var mongoose = require('mongoose')
//引入Category文件导出的模块
var CategorySchema = require('../schemas/category')
//编译生成Category模型,传入模型名字和模式
var Category = mongoose.model('Category', CategorySchema)

//将构造函数导出
module.exports = Category