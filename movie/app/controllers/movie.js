//加载编译的Movie模型
var Movie = require('../models/movie')
var Category = require('../models/category')
var Comment = require('../models/comment')
//underscore内的extend方法可以实现用另外一个对象内的新的字段来替换掉老的对象里对应的字段
var _ = require('underscore')

var fs = require('fs');
var path = require('path');
//detail page
exports.detail = function (req, res) {
    //返回详情页
    var id = req.params.id //id为查询的id
    //传入id,在回调方法里拿到查询到的电影数据
    Movie.findById(id, function (err, movie) {
        //从comment里查comment 里跟详情页里相同的id，再拿到对应id下的comment
        Comment.find({ movie: id })
            .populate('from', 'name')//查询关联的user数据
            .populate('reply.from reply.to', 'name')//回复的数据
            .exec(function (err, comments) {
                console.log(comments);
                res.render('detail', {
                    title: 'imooc 详情页',
                    //传入movie的对象
                    movie: movie,
                    comments: comments
                })
            })
    })
}

//需要实现从表单提交后的数据存储，需要加入新的路由
exports.new = function (req, res) {
    console.log("why")
    Category.find({}, function (err, categories) {
        res.render('admin', {
            title: 'imooc后台录入页',
            categories: categories,
            movie: {}
        })
    })
}

//在列表页点击更新时，会跳转到后台录入post页，同时要初始化表单数据
exports.update = function (req, res) {
    //先拿到id,再判断id是否存在
    var id = req.params.id
    //若id存在，则通过模型Movie来拿到电影
    if (id) {
        Movie.findById(id, function (err, movie) {
            Category.find({}, function (err, categories) {
                if (err) {
                    console.log(err);
                }
                //拿到电影数据后，直接去渲染表单，即后台录制页
                res.render('admin', {
                    title: 'imooc 后台更新页',
                    movie: movie,
                    categories: categories,
                })
            })
        })
    }
}

//admin poster
exports.savePoster = function (req, res, next) {
    var posterData = req.files.uploadPoster;//通过name值拿到上传的文件
    var filePath = posterData.path;
    console.log(req.files);
    var originalFilename = posterData.originalFilename;//拿到原始名字
    if (originalFilename) {
        fs.readFile(filePath, function (err, data) {
            var timestamp = Date.now();
            var type = posterData.type.split('/')[1];
            var poster = timestamp + '.' + type;
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)//生成服务器的存储地址
            fs.writeFile(newPath, data, function (err) {
                req.poster = poster;
                next();
            })
        })
    }
    else {
        next();//若无文件上传，则进入下一个环节
    }
}

//admin page
exports.save = function (req, res) {
    //传过来的数据可能是新添加的，也可能是修改已存在的数据
    //需要拿到传过来的 id
    var id = req.body.movie._id;
    var movieObj = req.body.movie; //拿到传过来的movie对象
    var _movie;
    //传来poster,则需要重写海报地址
    if (req.poster) {
        movieObj.poster = req.poster;
    }
    if (id) {
        //证明电影是存储进数据库过的，需要对其进行更新
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            //需要将post过来的电影数据替换掉数据中老的电影数据
            /**
             * underscore内的extend方法可以实现用另外一个对象内的新的字段来替换掉老的对象里对应的字段
            * 作用是将sources对象中的所有属性拷贝到destination对象中，并返回destination对象。
            *_.extend(destination, *sources) 
            */
            _movie = _.extend(movie, movieObj);//第一个参数为查询到的，第二个参数为post过来的
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                //保存成功后，重定向到新的详情页
                res.redirect('/movie/' + movie._id);
            })
        })
    }
    //若电影为新加的，则直接调用模型的构造函数，来传入电影数据
    else {
        _movie = new Movie(movieObj);
        var categoryId = movieObj.category;//选择的分类
        var categoryName = movieObj.categoryName;//自定义的分类
        //再调用save方法
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            //通过categoryId拿到当前对应的分类
            if (categoryId) {
                Category.findById(categoryId, function (err, category) {
                    category.movies.push(movie._id);
                    category.save(function (err, category) {
                        //保存成功后，重定向到新的详情页
                        res.redirect('/movie/' + movie._id)
                    })
                })
            }
            else if (categoryName) {
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });
                category.save(function (err, category) {
                    movie.category = category._id;
                    movie.save(function (err, movie) {
                        res.redirect('/movie/' + movie._id);
                    })
                })
            }
        })
    }
}

//movie list page
exports.movielist = function (req, res) {
    //返回后台列表页
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            title: 'imooc 后台列表页',
            movies: movies
        })
    })
}

//删除页路由
exports.del = function (req, res) {
    console.log("delete the row")
    var id = req.query.id;
    if (id) {
        Movie.remove({ _id: id }, function (err, movie) {
            if (err) {
                console.log(err);
            }
            else {//如果没有异常，则给客户端返回json数据
                res.json({ success: 1 })
            }
        })
    }
}
