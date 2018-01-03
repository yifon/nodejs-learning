//分别拿到控制层的入口文件
var Index = require('../app/controllers/index');//首页
var Movie = require('../app/controllers/movie');//加载编译的Movie模型
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

//underscore内的extend方法可以实现用另外一个对象内的新的字段来替换掉老的对象里对应的字段
var _ = require('underscore')

module.exports = function (app) {

    //pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user;

        app.locals.user = _user;//设置全局,如果为空，也赋值

        return next();
    })
    //编写路由

    //Index
    app.get('/', Index.index);

    //User
    app.post('/user/signup', User.signup);
    app.post('/user/signin', User.signin);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/logout', User.logout);
    //需要是登陆且有管理员权限
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

    //Movie
    app.get('/movie/:id', Movie.detail);
    app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
    app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.save);
    app.get('/admin/movie/list', Movie.movielist);
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

    //Comment
    app.post('/user/comment', User.signinRequired, Comment.save);

    //Category
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
    app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
}