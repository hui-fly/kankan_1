var postsData = require('../../data/data-post.js')
Page({
    data: {
        a: 666,
    },

    onLoad: function (options) {
        this.setData({
            post_key: postsData.postList
        })
        //观看次数
        var readsNum = wx.getStorageSync('reads_num');
        // var readNum = reads_num[postId];
        if (readsNum) {
            this.setData({
                data_readsNum: readsNum,
            })
        }
        else {
            var readsNum = [];//数组是对象\
            wx.setStorageSync("reads_num", readsNum);
        }
    },

    onPostTap: function (event) {
        //currentTarget是当前点击的控件，dataset是自定义属性的集合
        var postId = event.currentTarget.dataset.postid;
        this.data.postId = postId;
        var readsNum = wx.getStorageSync('reads_num');
        //数量加一
        readsNum[postId]++;
        //更新数据绑定
        this.setData({
            data_readsNum: readsNum,
        })
        //更新缓存
        wx.setStorageSync("reads_num", this.data.data_readsNum);
        // console.log(postId + "  " + this.data.data_readsNum[postId]);
        // console.log(postId);
        wx.navigateTo({
            //转到对应的url，并为该页面添加id（任意变量名）属性，属性值是postId
            url: 'post-detail/post-detail?id=' + postId,
        })
    },

    onSwiperTap: function (event) {
        var postId = event.target.dataset.postid;
        //console.log(postId);
        wx.navigateTo({
            //转到对应的url，并为该页面添加id（任意变量名）属性，属性值是postId
            url: 'post-detail/post-detail?id=' + postId,
        })
    }
})