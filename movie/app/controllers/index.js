var Movie = require('../models/movie');//加载编译的Movie模型
var Category = require('../models/category');//分类模型
//index page
exports.index = function (req, res) {

    //找到所有的分类
    Category
    .find({})
    .populate({path:'movies',options:{limit:5}})
    .exec(function(err,categories){
        //在回调里拿到返回的movies数据
            if (err) {
                console.log(err)
            }
            //渲染首页的模版
            res.render('index', {
                title: 'imooc 首页',
                categories: categories
            })
    })
}
