//加载编译的Movie模型
var Movie = require('../models/movie')
//index page
exports.index = function (req, res) {
    //返回首页

    //打印下登陆成功是否持有的状态
    console.log('user in session:');
    console.log(req.session.user);

    //直接调用模型Movie的fetch方法，在回调里拿到返回的movies数据
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        //渲染首页的模版
        res.render('index', {
            title: 'imooc 首页',
            /**实现本地的查询逻辑 */
            movies: movies
        })

    })
}
