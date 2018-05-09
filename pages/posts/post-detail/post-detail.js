var postsData = require("../../../data/data-post.js");
var app = getApp(); //小程序启动时运行，在onShow之后
var g_isPlayingMusic = false;
var dataUrl = "";
Page({             
    data: {
    },

    onLoad: function (options) {
        //var a = app.globalData;
        var postId = options.id;
        this.data.currentPostId = postId;

        // dataUrl = "http://v.juhe.cn/toutiao/index?type=&key=63236a39391e5ae02b1cfa932c7b4ae8";
        // postsData.httpRead(dataUrl)
        // this.requestUrl = dataUrl;

        // function processNewsData(newsData) {//newsData是成功后的res.data
        //     var news = [];
        //     news = newsData.result.data;
        //     for (var idx in news) {
        //         var singleNews = new [idx];
        //         var local_database = {
        //             author: author_name,
        //             date: date,
        //             title: title,
        //             imgSrc: thumbnail_pic_s,
        //             content:title,
        //             detail:title,
        //             postId:idx,
        //         }
        //     }
        // }

        //此处的postData是一个数组元素，postsData（等号右边）是一个文件对象，postList是一个数据入口，postsData.postList获取该数据（Local-database）
        var postData = postsData.postList[postId];
        //console.log(postData);
        this.setData({
            postData: postData,
        })
        this.data.musicData = postData;

        //获取并渲染缓存
        var postsCollected = wx.getStorageSync('posts_collected')
        var postCollected = postsCollected[postId]
        if (postsCollected) {
            if (postCollected) {
                this.setData({
                    collected: postCollected
                })
            }
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync("posts_collected", postsCollected);
        }
        //
        if (g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true,
            })
        }
        this.setMusicMonitor();
        //console.log("hhh");
        //console.log(g_isPlayingMusic);//此处输出播放状态
        //console.log(this.data.isPlayingMusic);//此处输出undefined
    },

    onShareAppMessage: function (res) {
        return {
            title: '自定义转发标题',
            path: '/page/posts/post-detail/post-detail?id=0',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

    setMusicMonitor: function () { //通过onBackgroundAudioPlay和onBackgroundAudioPause监听音乐状态，通过g_isPlayingMusic将状态传出以便再次进入页面时进行渲染，将状态isPlayingMusic绑定到data中
        var that = this;
        wx.onBackgroundAudioPlay(function () { //点击之后才触发
            that.setData({
                isPlayingMusic: true,
            });
            g_isPlayingMusic = true; //g_isPlayingMusic的作用就是传出isPlayingMusic的值
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
            // console.log("播放状态");
            // console.log(that.data.isPlayingMusic);
        });
        wx.onBackgroundAudioPause(function () { //点击暂停之后才触发
            that.setData({
                isPlayingMusic: false,
            });
            g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
            // console.log("暂停状态");
            // console.log(that.data.isPlayingMusic);
        });
        wx.onBackgroundAudioStop(function () { //点击暂停之后才触发
            that.setData({
                isPlayingMusic: false,
            });
            g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
            // console.log("暂停状态");
            // console.log(that.data.isPlayingMusic);
        });
    },
    //收藏
    onCollectionTap: function (event) {
        // console.log("hhh");
        //取出缓存
        var postsCollected = wx.getStorageSync("posts_collected");
        //处理缓存
        var postCollected = postsCollected[this.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        //更新缓存
        wx.setStorageSync("posts_collected", postsCollected);
        //更新collected
        this.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000
        })
    },
    //分享
    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享个QQ好友",
            "分享到空间"
        ];
        this.data.itemList =itemList;
        // console.log("nnn" + this.data.isPlayingMusic);
        this.showList();
    },
    showList:function() {
        var that = this;
        wx.showActionSheet({
            itemList: this.data.itemList,
            itemColor: "#666",
            success: function (res) {
                // res.cancel 用户是不是点击了取消
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: '用户' + itemList[res.tapIndex],
                    content: "用户是否选择取消" + res.cancel + '现在还无法实现分享',
                })
            }
        })
    },
    //播放和暂停
    onMusicTap: function (event) {
        var musicData = this.data.musicData;
        var isPlayingMusic = this.data.isPlayingMusic;
        //点击之后如果监听到音乐正在播放，则停止
        if (isPlayingMusic) {
            //this.data.isPlayingMusic = false;
            this.setData({
                isPlayingMusic: false, //更新数据绑定
            })
            wx.pauseBackgroundAudio();
        }
        //点击之后如果监听到音乐没有播放，则开始播放
        else {
            //this.data.isPlayingMusic = true;
            this.setData({
                isPlayingMusic: true,
            })
            wx.playBackgroundAudio({
                dataUrl: musicData.music.url,
                title: musicData.music.title,
                coverImgUrl: musicData.music.coverImg
            })
        }
    },

})