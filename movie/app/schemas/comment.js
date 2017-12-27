import { ObjectID } from '../../../../../../Library/Caches/typescript/2.6/node_modules/@types/bson';

//传入mongoose的建模工具模块
var mongoose = require('mongoose')

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
    //评论内容，哪一部电影，回复谁
    movie: {
        type: ObjectId, ref: 'Movie'
    },
    from: { type: ObjectId, ref: 'User' },
    to: { type: ObjectId, ref: 'User' },
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
CommentSchema.pre('save', function (next) {
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
CommentSchema.statics = {
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
module.exports = CommentSchema
