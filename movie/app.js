/**
 * 测试前端流程：
 * localhost:3000/
 * localhost:3000/movie/1   //电影详情页
 * localhost:3000/admin/movie 　//后台的录入页
 * localhost:3000/admin/list    //后台的列表页
 */

var express = require('express')//加载express模块
var path = require('path')//样式、脚本路径
var bodyParser = require('body-parser')
//var serveStatic=require('serve-static')

var cookieParser = require('cookie-parser');
//var cookieSession = require('cookie-session');//这种方式在下面的mongodb会话持久化中引入有问题
var expressSession = require('express-session');
var multipart = require('connect-multiparty');

//利用mongodb做会话的持久化
//var mongoStore = require('connect-mongo')(express);//此方式已经不支持
var mongoStore = require('connect-mongo')(expressSession);

var logger = require('morgan');

//引入mongoose模块，来连接本地数据库
var mongoose = require('mongoose')

var fs = require('fs');
//models loading
var models_path = __dirname + '/app/models';
var walk = function (path) {
    fs.readdirSync(path).forEach(function (file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(newPath);
            }
        }
        else if (stat.isDirectory()) {
            walk(newPath);
        }
    })
}
walk(models_path);

//从命令行中设置port号，默认是3000
var port = process.env.PORT || 3000
var app = express()//启动一个web服务器，将实例赋予给app变量

var dbUrl = "mongodb://localhost:12345/imooc";
//连接本地数据库
mongoose.Promise = global.Promise;
//, { useMongoClient: true }
mongoose.connect(dbUrl, { useMongoClient: true });

app.set('views', './app/views/pages')//设置视图的根目录
app.set('view engine', 'jade')//设置默认的模版引擎
app.use(bodyParser.json())
//返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.urlencoded({ extended: true }))//将表单数据进行格式化



app.use(cookieParser());
app.use(multipart());
app.use(expressSession({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'//存到mongodb里点collection名字
    })
}))
if ('development' === app.get('env')) {
    app.set('showStackError', true);//开发环境则能打印错误
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;//格式代码
    mongoose.set('debug', true);
}
require('./config/routes')(app);//引用路由文件

app.listen(port)//监听端口
//添加moment模块
app.locals.moment = require('moment')
//静态资源的获取，dirname为当前目录
app.use(express.static(path.join(__dirname, 'public')))
//app.use(serveStatic('bower_components'))

console.log('imooc started successfully on port ' + port)
