
//加载编译的Movie模型
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
//underscore内的extend方法可以实现用另外一个对象内的新的字段来替换掉老的对象里对应的字段
var _ = require('underscore')

//需要实现从表单提交后的数据存储，需要加入新的路由
exports.new = function (req, res) {
    res.render('categoryAdmin', {
        title: 'imooc后台分类录入页',
        category:{}
    })
}

exports.save = function (req, res) {
    var _category = req.body.category;
    var category = new Category(_category);
    category.save(function (err, category) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/category/list')
    })
}

//categoryList page
exports.list = function (req, res) {
    //返回用户列表页
    Category.fetch(function (err, categories) {
        if (err) {
            console.log(err)
        }
        res.render('categorylist', {
            title: 'imooc 分类列表页',
            categories: categories
        })
    })
}