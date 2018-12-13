// pages/order_success/order_success.js
Page({
  data: {
    id: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.id
    })
  },
  //查看订单
  look: function () {
    wx.navigateTo({
      url: '../order_details/order_details?orderid=' + this.data.id
    })
  },
  home:function(res){
wx.switchTab({
  url: '../index/index',
  success: function(res){
    // success
  },
  fail: function(res) {
    // fail
  },
  complete: function(res) {
    // complete
  }
})
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})