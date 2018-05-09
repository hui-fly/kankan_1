// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/utils.js");
Page({
    data: {
        movies: {},
        totalCount: 0,
        isEmpty: "ture",
        navigateTitle: ""
    },
    onLoad: function (options) {
        var count = 0;
        this.data.count = count;
        console.log(count);
        var category = options.category;
        this.data.navigateTitle = category;
        var doubanBase = app.globalData.douban_base;
        var dataUrl = "";
        switch (category) {
            case "正在热映":
                dataUrl = doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = doubanBase + "/v2/movie/top250"
                break;
        }
        util.http(dataUrl, this.processDoubanData)//moviesDouban是请求dataUrl成功后的res.data
        this.data.requestUrl = dataUrl;
    },

    onMovieTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId,   //通过url将id传递到下个页面
        })
        console.log(movieId);
    },

    onScrollLower: function (event) {
        console.log("加载");
        this.data.count += 20;
        //console.log(count);
        //var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";//第25行函数执行后获取到this.data.totalCount
        var nextUrl = this.data.requestUrl + "?start = 0" + "&count=" + this.data.count;
        util.http(nextUrl, this.processDoubanData); //util包含请求数据和处理数据两个方法，处理数据方法的参数的来源于数据请求
    },
    processDoubanData: function (moviesDouban) {  //moviesDouban是请求dataUrl成功后的res.data
        console.log(moviesDouban);
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                title: title,
                coverageUrl: subject.images.large,
                average: subject.rating.average,
                stars: util.covertToStarsArray(subject.rating.stars),
                movieId: subject.id
            }
            movies.push(temp);
        }
        //实时更新电影总数
        // var tatalMovies = {};
        // if (!this.data.isEmpty) {
        //     tatalMovies = this.data.movies.concat(movies); //cancat方法用于连接两个数组，返回一个新的数组
        // }
        // else {
        //     tatalMovies = movies;
        //     this.data.isEmpty = false;
        // }
        // this.data.totalCount += 20;
        // this.setData({
        //     movies: tatalMovies,
        // })
        this.setData({
            movies: movies
        })
    },
})