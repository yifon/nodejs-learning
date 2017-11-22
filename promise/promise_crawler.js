//import { config } from '../../../../Library/Caches/typescript/2.6/node_modules/@types/bluebird';

var http = require('http')
var Promise = require('bluebird')
var cheerio = require('cheerio')
var baseUrl= 'http://www.imooc.com/learn/'
var url = 'http://www.imooc.com/learn/348'
var videoIds=[348,259,197,134,75]
function filterChapters(html) {
    //通过cheerio.load把html内容装载进来
    var $ = cheerio.load(html)
    var chapters = $('.chapter')
    var title=$('.path span').text()
    var number=parseInt($('.js-learn-num"').text().trim(),10)
    // courseData＝{
    //     title:title,//标题
    //     number:number,//学习过的人数
    //     videos:[｛chapterTitle:'',
    //     videos:[
    //         title: '',
    //         id:''
    //     ]
    // }]
    // }
    //不再用一个数组，而是用对象自变量去存储
    var courseData ={
        title:title,
        number:number,
        videos:[]

    }  
    //拿到所有章，进行遍历，获取单独的每一章
    chapters.each(function (item) {
        var chapter = $(this)
        //拿到章节标题
        var chapterTitle = chapter.find('strong').text()
        //拿到每小节,即为每个视频
        var videos = chapter.find('.video').children('li')
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }
        //对videos进行遍历，拿到单独的video
        videos.each(function (item) {
            var video = $(this).find('.J-media-item')
            var videoTitle = video.text()
            //把一个字符串分割成字符串数组
            var id = video.attr('href').split('video/')[1]
            //把组装好的数组ChapterData.videos push进当前对一节
            chapterData.videos.push({
                title: videoTitle,
                id: id
            })
        })
        //把当前分析的这一章chapterData,push进数组courseData
        courseData.push(chapterData)
    })
    return courseData //需要返回一个对象自变量
}

function printCourseInfo(coursesData) {
coursesData.forEach(function(courseData){
    console.log(courseData.number+' 人学过 '+courseData.title+'\n')
    //深度遍历
    coursesData.forEach(function (item) {
        //拿到每一章的标题
        var chapterTitle = item.chapterTitle
        console.log(chapterTitle + '\n')
        item.videos.forEach(function (video) {
            console.log('[' + video.id + ']' + video.title + '\n')
        })
    })
})

}

function getPageAsync(url) {
    return new Promise(function (resolve, reject) {
        console.log('正在爬取' + url)
        http.get(url, function (res) {
            var html = ''

            res.on('data', function (data) {
                html += data
            })
            res.on('end', function () {

                resolve(html)//当请求返回时，把html通过resolve传递下去
                //var courseData = filterChapters(html)
                //打印拿到的值
                //printCourseInfo(courseData)
            })
        }).on('error', function (e) {
            //如果爬虫在爬的时候出错，则reject一个错误信息
            reject(e)
            console.log('获取课程数据出错')
        })
    })
}
//爬取所有的章节
var fetchCourseArray=[]
//对所有的id进行遍历
videoId.forEach(function(id){
    fetchCourseArray.push(getPageAsync(baseUrl+id))
})

Promise
    .all(fetchCourseArray)
    .then(function (pages) {
        //爬取到章节信息后，进行加工
        var courseData=[]
        pages.forEach(function(html){
            var courses=filterChapters(html) //解析html
            courseData.push(courses)//把解析到结果放到 courseData中
        })
        //对courseData进行遍历，排序：从课程人数高到人数少进行遍历
        courseData.sort(function(a,b){
            return a.number<b.number
        })
        printCourseInfo(courseData)
    })
