// pages/movies/movie-detail/movie-detail.j
var util = require("../../../utils/utils.js");
var app = getApp();
Page({
    data: {
        movie: {},
    },
    onLoad: function (option) {
        var movieId = option.id;
        var url = app.globalData.douban_base + "/v2/movie/subject/" + movieId;
        //console.log(url);
        util.http(url, this.processDoubanData);
    },
    processDoubanData: function (data) {
        if (!data) {
            return;
        }
        //console.log(data);
        var director = {
            avatar: "",
            name: "",
            id: "",
        }
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large;
            }
            director.name = data.directors[0].name;
            director.id = data.id;
        }
        var movie = {
            movieImg: data.images ? data.images.large : "", //如果data.images为空，则movieImg的值就是""
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            genres: data.genres.join("、"),    //join方法将”、“加入元素之间
            year: data.year,
            summary: data.summary,
            score: data.rating.average,
            director: director,
            stars: util.covertToStarsArray(data.rating.stars),
            casts: util.covertToCastString(data.casts),
            castsInfo: util.coverTocastInfo(data.casts),
        }
        this.setData({
            movie: movie,
        })
        console.log(movie)
    },
    viewMoviePostImg: function (event) {
        var src = event.currentTarget.dataset.src;
        wx.previewImage({
            current:src,
            urls: [src],
        })
    }
})