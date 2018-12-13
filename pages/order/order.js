var app = getApp();
Page({
  data: {

  },
  onLoad: function (options) {

  },
  request: function (callback) {
    var that = this;
    wx.request({
      url: app.globalData.serverUrl + 'getOrderList',
      data: {
        userID: app.globalData.userid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.data.error_code == 0) {
          var list = res.data.data.list;
          if (list.length) {
            for (var i = 0; i < list.length; i++) {
              if (!list[i].colorName) {
                list[i].colorName = '';
              }
            }
          }
          that.setData({
            list: list
          })
          if (callback) {
            callback();
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.error_msg,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  openwin: function (event) { //跳转页面
    var path = event.target.dataset.url;
    var orderid = event.target.dataset.orderid;
    if (path == 'appraise') { //评价订单
      var masterid = event.target.dataset.masterid;
      wx.navigateTo({
        url: '../' + path + '/' + path + '?masterid=' + masterid + "&orderid=" + orderid
      })
    } else { //订单详情
      wx.navigateTo({
        url: '../' + path + '/' + path + '?orderid=' + orderid
      })
    }
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    var that = this;
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo.user_id) {
      console.log('-------------------------')
      that.request();
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            // console.log(code);
            wx.getUserInfo({
              success: function (res) {
                console.log(res);
                var encryptedData = encodeURIComponent(res.encryptedData);//一定要把加密串转成URI编码
                //var encryptedData = res.encryptedData;//一定要把加密串转成URI编码
                var iv = res.iv;
                //请求自己的服务器
                app.login(code, encryptedData, iv, function () {
                  console.log("请求自己的服务器")
                  that.request();
                });
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function (event) {
    // var that = this;
    // // 页面相关事件处理函数--监听用户下拉动作
    // console.log(event)
    // console.log(app.globalData.userid)
    // this.request(function () {
    //   wx.stopPullDownRefresh();
    // });
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})