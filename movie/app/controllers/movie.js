
//加载编译的Movie模型
var Movie = require('../models/movie')
//underscore内的extend方法可以实现用另外一个对象内的新的字段来替换掉老的对象里对应的字段
var _ = require('underscore')
//detail page
exports.detail = function (req, res) {
    //返回详情页
    var id = req.params.id //id为查询的id
    //传入id,在回调方法里拿到查询到的电影数据
    Movie.findById(id, function (err, movie) {
    res.render('detail', {
        title: 'imooc 详情页',
            //传入movie的对象
            movie: movie
        })
    })

}

//需要实现从表单提交后的数据存储，需要加入新的路由
exports.new = function (req, res) {
    console.log(req.body);
    //传过来的数据可能是新添加的，也可能是修改已存在的数据
    //需要拿到传过来的 id
    var id = req.body.movie._id
    var movieObj = req.body.movie //拿到传过来的movie对象
    var _movie
    console.log(movieObj);
    if (id !== 'undefined') {
        //证明电影是存储进数据库过的，需要对其进行更新
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }
            //需要将post过来的电影数据替换掉数据中老的电影数据
            /**
             * underscore内的extend方法可以实现用另外一个对象内的新的字段来替换掉老的对象里对应的字段
            * 作用是将sources对象中的所有属性拷贝到destination对象中，并返回destination对象。
            *_.extend(destination, *sources) 
            */
            _movie = _.extend(movie, movieObj)//第一个参数为查询到的，第二个参数为post过来的
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }
                //保存成功后，重定向到新的详情页
                res.redirect('/movie/' + movie._id)
            })
        })
    }
    //若电影为新加的，则直接调用模型的构造函数，来传入电影数据
    else {
        console.log("in");
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        //再调用save方法
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }
            //保存成功后，重定向到新的详情页
            res.redirect('/movie/' + movie._id)
        })
    }
}

//在列表页点击更新时，会跳转到后台录入post页，同时要初始化表单数据
exports.update = function (req, res) {
    //先拿到id,再判断id是否存在
    var id = req.params.id
    //若id存在，则通过模型Movie来拿到电影
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            //拿到电影数据后，直接去渲染表单，即后台录制页
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
}


//admin page
exports.save = function (req, res) {
    //返回录入页
    res.render('admin', {
        title: 'imooc 录入页',
        //传入movie对象
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }

    })
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
    console.log("id:" + id);
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
