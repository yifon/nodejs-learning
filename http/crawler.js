var http = require('http')
var url = 'http://www.imooc.com/learn/348'
var cheerio = require('cheerio')
function filterChapters(html) {
    //通过cheerio.load把html内容装载进来
    var $ = cheerio.load(html)
    var chapters = $('.chapter')

    // [{
    //     chapterTitle:'',
    //     videos:[
    //         title:'',
    //         id:''
    //     ]
    // }]
    var courseData = []
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
    return courseData //需要返回一个数组
}

function printCourseInfo(courseData) {
    courseData.forEach(function (item) {
        //拿到每一章的标题
        var chapterTitle = item.chapterTitle
        console.log(chapterTitle + '\n')
        item.videos.forEach(function (video) {
            console.log('[' + video.id + ']' + video.title + '\n')
        })
    })
}

http.get(url, function (res) {
    var html = ''

    res.on('data', function (data) {
        html += data
    })
    res.on('end', function () {
        var courseData = filterChapters(html)
        //打印拿到的值
        printCourseInfo(courseData)
    })
}).on('error', function () {
    console.log('获取课程数据出错')
})