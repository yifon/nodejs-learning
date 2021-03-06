//传入mongoose的建模工具模块
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;//来声明一个对象ID类型,MongoDB内置的_id 的类型
//传入跟分类有关的字段和类型
var CategorySchema = new mongoose.Schema({
    name: String,//分类名字，拿到分类名字即可拿到所有的电影
    movies: [{ type: ObjectId, ref: 'Movie' }],//数组，保存电影的ObjectId
    //meta存放的是录入或者更新数据时的时间记录
    meta: {
        //创建时间
        createAt: {
            type: Date,
            default: Date.now()
        },
        //更新时间
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
//为模式创建方法，pre-save表示每次存储前都会调用此方法
CategorySchema.pre('save', function (next) {
    //判断数据是否为新添加的，如果是，则将创建时间设置为当前时间
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    //若只是单纯的修改，则只需将修改时间设置为当前时间
    else {
        this.meta.updateAt = Date.now()
    }
    next()//将存储流程走下去
})
//静态方法不会直接与数据库交互，只有经过模型编译和实例化后，才会具有此方法
CategorySchema.statics = {
    //取出数据库中所有的数据
    fetch: function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb)//按更新时间排序,执行查询，并将结果传入回调方法
    },
    //查询数据库中单条的数据
    findById: function (id, cb) {
        return this.findOne({ _id: id }).exec(cb);//执行查询，并将结果传入回调方法
    }
}
//将模式导出
module.exports = CategorySchema
