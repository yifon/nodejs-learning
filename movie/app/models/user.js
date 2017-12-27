//引入mongoose的建模工具模块
var mongoose = require('mongoose')
//引入user文件导出的UserSchema模块
var UserSchema = require('../schemas/user')
//编译生成User模型,传入模型名字和模式
var User = mongoose.model('User', UserSchema)

//将构造函数导出
module.exports = User