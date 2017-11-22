/**
 * EventEmitter 支持若干个事件监听器。当事件发射时，注册到这个事件的事件监听器被依次调用，事件参数作为回调函数参数传递。 　
 */
var EventEmitter=require('events').EventEmitter
var life=new EventEmitter()
//EventEmitter.setMaxListeners(n)给EventEmitter设置最大监听,默认为10个
life.setMaxListeners(11)

//也可以用addEventListener;第一个参数为监听的事件的名字，第二个参数事件触发时回调的方法
life.on('sing',function(who){
    console.log('请'+who+'唱歌')
})
function move(who){
    console.log('请'+who+'边唱边动')
}
life.on('sing',move)

//移除事件,不能用匿名函数，要用具名函数
life.removeListener('sing',move)

//life.emit('sing','June')  //其返回值是一个布尔值，可以表示事件是否被监听过

var hasSingListener=life.emit('sing','June')
var hasDanceListener=life.emit('dance','June')
//var hasMoveListener=life.emit('move','June')
console.log(hasSingListener)
console.log(hasDanceListener)
//console.log(hasMoveListener)

console.log(life.listeners('sing').length)
life.removeAllListeners('sing')

console.log(EventEmitter.listenerCount(life,'sing'))

