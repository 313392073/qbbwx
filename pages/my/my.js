var app = getApp();
Page({
  data: {
    userInfo: ''
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
var that = this;
    wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.setData({userInfo:res.userInfo}); 
              
            }
          })
        }
      })


    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  openwin: function (event) { //跳转页面
    console.log(event)
    var path = event.target.dataset.url;
    wx.navigateTo({
      url: '../' + path + '/' + path
    })
  },
  tel:function(){
    wx.makePhoneCall({
      phoneNumber: '13032887722' //仅为示例，并非真实的电话号码
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    wx.removeStorage({
      key: 'order_data',
      success: function (res) {
        console.log(res)
      }
    })
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
    // wx.stopPullDownRefresh()
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