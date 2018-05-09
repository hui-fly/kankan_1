var app = getApp();
var util = require("../../utils/utils.js");
Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        containerShow: true,
        searchPanelShow: false,
        searchResult:{}
    },
    onLoad: function (options) {
        var doubanBase = app.globalData.douban_base;
        var inTheatersUrl = doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },

    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category,
        })
    },
    onMovieTap:function(event){
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id='+movieId,   //通过url将id传递到下个页面
        })
        console.log(movieId);
    },
    getMovieListData: function (url, setedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            header: {
                'content-type': "json"           // 默认值
            },
            success: function (res) {
                that.processDoubanData(res.data, setedKey, categoryTitle);
                console.log(res.data);
            },
            fail: function (error) {
                console.log(error);
            }
        })
    },
    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult: {},
            text: ""
        })
    },
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
           searchPanelShow: true,
        })        
    },
    onBindChange: function (event) {
        var text = event.detail.value;
        this.setData({
            text:text,
        })
        var searchUrl = app.globalData.douban_base + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl,"searchResult","");
    },
    processDoubanData: function (moviesDouban, setedKey, categoryTitle) {//从moviesDouban中提取数据到movies中，定义一个对象readyData，设置该对象的属性"setedKey",setedKey是一个对象，其属性为 “movies”和“categoryTitle”，然后将readyData绑定到data，相当于data:{setedKey:{movies:movies,categoryTitle:categoryTitle} }
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                stars: util.covertToStarsArray(subject.rating.stars)
            }
            movies.push(temp);
        }
        var readyData = {};
        readyData[setedKey] = {
            categoryTitle: categoryTitle,
            movies: movies,
        };
        this.setData(readyData);
    }
})