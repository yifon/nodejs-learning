(function () {
    var d = document,
        w = windows,
        p = parseInt,
        dd = d.documentElement,
        db = d.body,
        dc = d.compatMode == 'CSS1Compat',
        dx = dc ? dd : db,
        ex = encodeURIComponent;

    w.CHAT = {
        msgObj: d.getElementById("message"),
        screenheight: w.innerHeight ? w.innerHeight : dx.clientHeight,
        username: null,
        userid: null,
        socket: null,
        //让浏览器滚动条保持中最底部
        scrollToBottom: function () {
            w.scrollTo(0, this.msgObj.clientHeight);
        },
        //退出，本例只是一个简单的刷新
        logout: function () {
            //this.socket.disconnect();
            location.reload();
        },
        //提交聊天消息内容
        submit: function () {
            var content = d.getElementById("content").value;
            if (content != '') {
                var obj = {
                    userid: this.userid,
                    username: this.username,
                    content: content
                };
                this.socket.emit('message', obj);
                d.getElementById("content").value = '';//将content框内容置为空
            }
            return false;
        },
        getUid:function(){
            return new Date().getTime()+""+Math.floor(Math.random()*899+100);
        },
        //更新系统消息，本例中中用户加入、退出的时候调用
        updateSysMsg:function(o,action){
            //当前在线用户列表
            var onlineUsers=o.onlineUsers;
            //当前在线人数
            var onlineCount=o.onlineCount;
            //新加入用户的信息
            var user=o.user;

            //更新在线人数
            var userhtml='';
            var separator='';
            for(key in onlineUsers){
                if(onlineUsers.hasOwnProperty(key)){
                    userhtml+=separator+onlineUsers[key];
                    separator='、';
                }
            }
            d.getElementById("onlinecount").innerHTML="当前共有 "+onlineCount+' 人在线，在线列表：'+userhtml;
        }
    }
})