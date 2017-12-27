//传入mongoose的建模工具模块
var mongoose = require('mongoose')
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    /*
    0:normal user
    1:verified user
    2:professional user
    ...
    >10:admin
    >50:super admin
    */
    role: {
        type: Number,
        default: 0
    },
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
//为模式创建方法，每次存储前都会调用此方法
UserSchema.pre('save', function (next) {
    var user = this;
    //判断数据是否为新添加的，如果是，则将创建时间设置为当前时间
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    //若只是单纯的修改，则只需将修改时间设置为当前时间
    else {
        this.meta.updateAt = Date.now()
    }
    //生成一个随机的盐，参数2为回调方法，拿到随机的盐；参数1为计算强度，即计算密码所需要的资源和时间
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        //参数1为用户明文密码，参数2为上一个genSalt生成的盐，第三个为回调函数，能拿到hash加盐后新的哈希值
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            // console.log("pwd:"+user.password);
            next();
        })
    })
    //next() //错误调用会使密码无法hash，因为先执行了这一句的next(),再执行了上文的
})

//添加comparePassword实例方法
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) {
                return cb();
            }
            //将错误设成null
            cb(null, isMatch);
        })
    }
}

//静态方法不会直接与数据库交互，只有经过模型编译和实例化后，才会具有此方法
UserSchema.statics = {
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
module.exports = UserSchema
