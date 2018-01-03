$(function () {
    $('.comment').click(function (e) {
        var target = $(this);
        var toId = target.data('tid');
        var commentId = target.data('cid');
        //tid的插入,回复别人
        if ($('#toId').length > 0) {
            console.log(111);
            $('#toId').val(toId);
        }
        else {
            console.log(222);
            $('<input>').attr({
                type: 'hidden',//隐藏域
                id: "toId",//判断input隐藏域是否添加过
                name: 'comment[tid]',
                value: toId
            }).appendTo('#commentForm')
        }
        //cid的插入，自己评论
        if ($('#commentId').length > 0) {
            console.log(333);
            $('#commentId').val(commentId);
        }
        else {
            console.log(444);
            $('<input>').attr({
                type: 'hidden',//隐藏域
                id: "commentId",//判断input隐藏域是否添加过
                name: 'comment[cid]',
                value: commentId
            }).appendTo('#commentForm')
        }
    })
})