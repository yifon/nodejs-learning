var Movie = require('../models/movie');//加载编译的Movie模型
var Category = require('../models/category');//分类模型

//index page
exports.index = function (req, res) {
    Category
        .find({})
        .populate({
            path: 'movies',//指定要填充的字段。String/Object类型，此处为Object类型
            select: 'title poster',//指定填充document中的哪些字段。String/Object类型。Object格式:{name:1,_id:0},0表示不填充，1表示填充；String格式:"name -_id"，用空格分隔字段，-表示不填充
            options: { limit: 6 }//Object,指定附加的其他查询选项，如排序以及条数限制等。
        })
        .exec(function (err, categories) {
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: 'imooc 首页',
                categories: categories
            })
        })
}

//search page
exports.search = function (req, res) {
    var catId = req.query.cat;//拿到category id
    var q = req.query.q;
    var page = parseInt(req.query.p, 10) || 0;//拿到分页
    var count = 2;
    var index = page * count;//每页拿2条数据
    //找到所有的分类
    //有catId,则证明搜索的是分类
    if (catId) {
        Category
            .find({ _id: catId })//拿到分类
            .populate({ path: 'movies', select: 'title poster' })//对分类下的所有电影进行populate,跳到索引的位置去查询
            .exec(function (err, categories) {
                //在回调里拿到返回的movies数据
                if (err) {
                    console.log(err)
                }
                //渲染首页的模版
                var category = categories[0] || {};
                var movies = category.movies || {};
                var results = movies.slice(index, index + count);

                res.render('results', {
                    title: 'imooc 结果列表页面',
                    keyword: category.name,
                    currentPage: (page + 1),
                    query: 'cat=' + catId,
                    totalPage: Math.ceil(movies.length / count),//向上舍入
                    movies: results
                })
            })
    }
    //若无catId,则是搜索框的请求
    else {
        Movie
            .find({ title: new RegExp(q + '.*') })//模糊搜索
            .exec(function (err, movies) {
                if (err) {
                    console.log(err);
                }
                var results = movies.slice(index, index + count);
                res.render('results', {
                    title: 'imooc结果列表页面',
                    keyword: q,
                    currentPage: (page + 1),
                    query: 'q=' + q,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                })
            })
    }
}
