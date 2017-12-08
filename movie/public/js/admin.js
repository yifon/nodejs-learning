//处理删除逻辑 
$(function(){
    $('.del').click(function(e){
        var target=$(e.target);
        var id=target.data('id');
        var tr=$('.item-id-'+id);
        $.ajax({
            type:'DELETE',//异步请求类型为del
            url:'/admin/list?id'+id
        })//删除后，服务器返回状态
        .done(function(results){
            //删除成功
            if(results.success===1){
                if(tr.length>0){
                    tr.remove();
                }
            }
        })
    })
})