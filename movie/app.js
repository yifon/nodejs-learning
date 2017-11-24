/**
 * 测试前端流程：
 * localhost:3000/
 * localhost:3000/movie/1   //电影详情页
 * localhost:3000/admin/movie 　//后台的录入页
 * localhost:3000/admin/list    //后台的列表页
 */

var express=require('express')
var path=require('path')//样式、脚本路径
var bodyParser=require('body-parser')
//var serveStatic=require('serve-static')

//引入mongoose模块，来连接本地数据库
var mongoose=require('mongoose')

//加载编译的Movie模型
var Movie=require('./models/movie')

//
var _=require('underscore')

//从命令行中设置port号，默认是3000
var port=process.env.PORT||3000
var app=express()//将实例赋予给app变量

//连接本地数据库
mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages')//设置视图的根目录
app.set('view engine','jade')//设置默认的模版引擎
//返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.urlencoded({extended:false}))//将表单数据进行格式化
//静态资源的获取，dirname为当前目录
app.use(express.static(path.join(__dirname,'bower_components')))
//app.use(serveStatic('bower_components'))

app.locals.moment=require('moment')

app.listen(port)//监听端口

console.log('imooc started successfully on port '+port)

//编写路由
//index page
app.get('/',function(req,res){
    //返回首页
    //直接调用模型Movie的fetch方法，在回调里拿到返回的movies数据
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        //渲染首页的模版
        res.render('index',{
            title:'imooc 首页',
            /**实现本地的查询逻辑 */
            movies:movies
            /**下述为伪造的数据 */
            // movies:[{
            //         title:'机械战警',
            //         _id:1,
            //         poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
            //     },{
            //         title:'机械战警',
            //         _id:2,
            //         poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
            //     },{
            //         title:'机械战警',
            //         _id:3,
            //         poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
            //     },{
            //         title:'机械战警',
            //         _id:4,
            //         poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
            //     },{
            //         title:'机械战警',
            //         _id:5,
            //         poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
            //     },{
            //         title:'机械战警',
            //         _id:6,
            //         poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
            //     }]
    })

    })
})
//detail page
app.get('/movie/:id',function(req,res){
    //返回详情页
    var id=req.params.id //id为查询的id
    //传入id,在回调方法里拿到查询到的电影数据
    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title:'imooc 详情页:'+movie.title,
            //传入movie的对象
            movie:movie
            /**以下为伪造数据 */
            // movie:{
            //     doctor:'何塞－帕迪里亚',
            //     country:'美国',
            //     title:'机械战警',
            //     year:2014,
            //     poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
            //     language:'英语',
            //     flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
            //     summary:'bala bala机械战警简介'
            // }
        })
    })

})

//admin page
app.get('/admin/movie',function(req,res){
    //返回录入页
    res.render('admin',{
        title:'imooc 录入页',
        //传入movie对象
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }
    
    })
})

//在列表页点击更新时，会跳转到post页，同时要初始化表单数据
app.get('/admin/update/:id',function(req,res){
    //先拿到id,再判断id是否存在
    var id=req.params.id
    //若id存在，则通过模型Movie来拿到电影
    if(id){
        Movie.findById(id,function(err,movie){
            //拿到电影数据后，直接去渲染表单，即后台录制页
            res.render('admin',{
                title:'imooc 后台更新页',
                movie:movie
            })
        })
    }
})

//需要实现从表单提交后的数据存储，需要加入新的路由
app.post('/admin/movie/new',function(req,res){
    //传过来的数据可能是新添加的，也可能是修改已存在的数据
    //需要拿到传过来的 id
    var id=req.body.movie._id
    var movieObj=req.body.movie //拿到传过来的movie对象
    var _movie
    if(id!=='undefined'){
        //证明电影是存储进数据库过的，需要对其进行更新
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err)
            }
            //需要将post过来的电影数据替换掉数据中中老的电影数据
            //underscore内的extend方法可以实现用另外一个对象内的新的字段来替换掉老的对象里对应的字段
            _movie=_.extend(movie,movieObj)//第一个参数为查询到的，第二个参数为post过来的
            _movie.save(function(err,movie){
                if(err){
                    console.log(err)
                }
                //保存成功后，重定向到新的详情页
                res.redirect('/movie/'+movie._id)
            })
        })
    }
    //若电影为新加的，则直接调用模型的构造函数，来传入电影数据
    else{
        _movie=new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.summary,
            flash:movieObj.flash
        })
        //再调用save方法
        _movie.save(function(err,movie){
            if(err){
                console.log(err)
            }
            //保存成功后，重定向到新的详情页
            res.redirect('/movie/'+movie._id)
        })
    }
})


//list page
app.get('/admin/list',function(req,res){
    //返回后台列表页
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('list',{
        title:'imooc 后台列表页',
        movies:movies
        /**伪造数据 */
        // movies:[{
        //     title:'机械战警',
        //     _id:1,
        //     doctor:'何塞帕－迪里卡',
        //     country:'美国',
        //     year:2014,
        //     language:'英语',
        //     flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
        //     summary:'bala bala机械战警简介'
        // }]
        })
    })
})