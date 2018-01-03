var User = require('../models/user')

//show signup page
exports.showSignup = function (req, res) {
    //直接渲染页面
    res.render('signup', {
        title: '注册页面'
    })
}
//show signin page
exports.showSignin = function (req, res) {
    //直接渲染页面
    res.render('signin', {
        title: '登陆页面'
    })
}
//signup
exports.signup = function (req, res) {
    var _user = req.body.user;//获取表单里的数据
    //req.param('user')//param是对body,query,路由的封装
    //判断用户名是否注册过
    User.findOne({ name: _user.name }, function (err, user) {
        if (err) {
            console.log(err);
        }
        //如果用户已经注册过，重定向到登陆页面
        if (user) {
            return res.redirect('/signin');
        } else {
            var user = new User(_user);
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/')
            })
        }
    })
}
//signin
exports.signin = function (req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    User.findOne({ name: name }, function (err, user) {
        if (err) {
            console.log(err);
        }
        //用户不存在，重定向到注册页面
        if (!user) {
            return res.redirect('/signup');
        }
        //比较一下加密的密码
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err);
            }
            if (isMatch) {
                //将状态存储到内存中
                req.session.user = user
                return res.redirect('/');
            } else {
                return res.redirect('/signin');//密码错误，则继续登陆
            }
        })
    })
}

//logout
exports.logout = function (req, res) {
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/');
}

//userlist page
exports.list = function (req, res) {
    //返回用户列表页
    User.fetch(function (err, users) {
        if (err) {
            console.log(err)
        }
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        })
    })
}

//midware for user,登陆中间件
exports.signinRequired = function (req, res, next) {
    var user = req.session.user;
    if (!user) {
        console.log("here 1");
        return res.redirect('/signin');
    }
    next();
}
//midware for user,管理员中间件
exports.adminRequired = function (req, res, next) {
    var user = req.session.user;
    console.log("user.name:"+user.name);
    console.log("user.role:"+user.role);
    if (user.role <= 10) {
        return res.redirect('/signin');
    }
    next();
}
