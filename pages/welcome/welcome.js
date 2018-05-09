Page({


  data: {
  },
  onTap: function (event) {
    wx.switchTab({
      url: '../posts/post'
    })
    console.log("哈哈哈");
  },

  onLoad: function (options) {
    
  },

})