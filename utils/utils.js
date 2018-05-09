function covertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 0; i < 5; i++) {
        if (i < num) {
            array.push(1);
        }
        else {
            array.push(0);
        }
    }
    return array;
};

function covertToCastString(casts) {
    var castsjoin = ""
    for (var idx in casts) {
        castsjoin += (casts[idx].name + " / ");
    }
    return castsjoin.substring(0, castsjoin.length - 2);
}
function coverTocastInfo(casts) {
    var castsArray = [];
    for (var idx in casts) {
        var castidx = casts[idx];
        var cast = {
            img: castidx.avatars.large ? castidx.avatars.large : "",
            name: castidx.name,
        }
        castsArray.push(cast);
    }
    return castsArray;
}

function http(url, callBack) {
    wx.showNavigationBarLoading();
    wx.request({
        url: url,
        header: {
            'content-type': "json"
        },
        success: function (res) {
            callBack(res.data)                        //请求成功后的res.data交给callBack处理
            wx.hideNavigationBarLoading();
        },
        fail: function (error) {
            console.log(error);
        }
    })
};

module.exports = {
    http: http,
    covertToStarsArray: covertToStarsArray,
    coverTocastInfo: coverTocastInfo,
    covertToCastString: covertToCastString,
}