//import { config } from '../../../../Library/Caches/typescript/2.6/node_modules/@types/bluebird';

var http = require('http')
var Promise = require('bluebird')
var cheerio = require('cheerio')
var baseUrl = 'http://www.imooc.com/learn/'
var url = 'http://www.imooc.com/learn/348'
var videoIds = [348, 259, 197, 134, 75]
function filterChapters(page) {
    //通过cheerio.load把html内容装载进来
    var $ = cheerio.load(page.html)//必须.html加载进来
    var chapters = $('.chapter')
    var title = $('.course-infos .hd h2').text()
    var number = 0 //ajax获得的
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
    //courseData是每个课程，里面有多个章节标题，多个视频
    var courseData = {
        title: title,
        number: page.watchedNumber,
        videos: []//不同小章节的集合
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
        //对videos进行遍历，拿到不同page内的内容 （包括不同章节和每个章节的视频）
        videos.each(function (item) {
            var video = $(this).find('.J-media-item')
            var videoTitle = video.text()
            //把一个字符串分割成字符串数组
            var id = video.attr('href').split('video/')[1]
            //把组装好的数组ChapterData.videos push进当前的每一章节
            //获取每一小章节的标题和序号，组成每一小章节的视频组
            chapterData.videos.push({
                video: videoTitle,
                id: id
            })
        })
        //把当前分析的这一章chapterData,push进数组courseData
        courseData.videos.push(chapterData)
    })
    return courseData //需要返回一个对象自变量
}

function printCourseInfo(coursesData) {
    coursesData.forEach(function (courseData) {
        console.log('有' + courseData.number + ' 人学过:' + courseData.title + '\r\n')
        //深度遍历
    })
    coursesData.forEach(function (courseData) {
        //拿到每一章的标题
        //var chapterTitle = courseData.title
        console.log('课程标题：\r\n')
        console.log(courseData.title+ '\r\n')
        courseData.videos.forEach(function (chapterData) {
            console.log('章节标题：\r\n')
            console.log(chapterData.chapterTitle)
            chapterData.videos.forEach(function (video) {
                console.log('[' + video.id + ']' + video.video+ '\r\n')
            })
        })
    })

}

function getPageAsync(url) {
    return new Promise(function (resolve, reject) {
        console.log('正在爬取' + url)
        //页面的观看人数需要用ajax获取
        var ajaxData = {
            watchedNumber: 0,
            html: ''
        }
        var numbers = new Promise(function (resolve1, reject1) {
            //var vid=url.match(/[^http://www.imooc.com/learn/]\d*/)
            var headers = {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Connection': 'keep-alive',
                'Cookie': 'imooc_uuid=99579ac6-8275-40b7-ab31-49103bdb9ab1; imooc_isnew_ct=1510385221; loginstate=1; apsid=ZhYzU0ZDU4NTBhZTlmYmYzMDVkN2JhNjE0MWVmYTIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMTY5NDY4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5b2xpbmFfMzc5NjUzNzM0QHFxLmNvbQAAAAAAAAAAAGU5ZDA4ZTRhMjhjNWVjOWFjZWI1MDA5NjQ3ZTM4ZDcwSqYGWgTDlFU%3DZG; UM_distinctid=15fcfd2888c3ef-003ffc535c6a9d-574e6e46-3d10d-15fcfd2888d28a; PHPSESSID=118o2c9t1gfce5iod7o8o1t1r1; imooc_isnew=2; cvde=5a12e6f3e2749-107; IMCDNS=0; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1511060852,1511188219,1511191775,1511354736; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1511355435',
                'Host': 'www.imooc.com',
                'Referer': url,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
            }
            var options = {
                hostname: 'www.imooc.com',
                path: '/course/AjaxCourseMembers?ids=' + url.match(/[^http://www.imooc.com/learn/]\d*/),
                method: 'GET',
                headers: headers
            }
            http.get(options, function (res) {
                var rawData = ''
                res.on('data', function (data) {
                    rawData += data;
                })
                res.on('end', function () {
                    ajaxData.watchedNumber = parseInt(JSON.parse(rawData).data[0].numbers, 10)
                    resolve1(ajaxData)
                })
            }).on('error', function (e) {
                reject1(e)
                console.log('获取课程观看人数出错')
            })
        })


        http.get(url, function (res) {
            var html = ''
            res.on('data', function (data) {
                html += data
            })
            res.on('end', function () {
                //resolve(html)
                ajaxData.html = html
                resolve(numbers)//numbers又会把resolve给ajaxData
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
var fetchCourseArray = []
//对所有的id进行遍历
videoIds.forEach(function (id) {
    fetchCourseArray.push(getPageAsync(baseUrl + id))
})

Promise
    .all(fetchCourseArray)
    .then(function (pages) {
        //爬取到章节信息后，进行加工
        var coursesData = []
        pages.forEach(function (page) {
            var courses = filterChapters(page) //解析html
            coursesData.push(courses)//把解析到结果放到 courseData中
        })
        //对courseData进行遍历，排序：从课程人数高到人数少进行遍历
        coursesData.sort(function (a, b) {
            return a.number < b.number
        })
        printCourseInfo(coursesData)
    })
