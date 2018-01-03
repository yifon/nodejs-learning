//加载编译的Comment模型
var Comment = require('../models/comment')

//comment
exports.save = function (req, res) {
    var _comment = req.body.comment;
    var movieId = _comment.movie;

    //如果有cid,则证明用户是在回复
    if (_comment.cid) {
        console.log(1);
        Comment.findById(_comment.cid, function (err, comment) {
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            }
            comment.reply.push(reply);//在数组里新增一条回复的内容
            comment.save(function (err, comment) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movieId);//跳转到对应的movie页面
            })
        })
    }
    //如果没有cid，则是简单评论
    else {
        console.log(2);
        var comment = new Comment(_comment);
        comment.save(function (err, comment) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movieId);
        })
    }

}

