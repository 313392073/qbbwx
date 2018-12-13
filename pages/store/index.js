var server = require('../../utils/server');
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;


        server.getJSON("/User/getStores", { la: latitude, lo: longitude }, function (res) {
          that.setData({ "stores": res.data.result });
        });


      }
    }
    );


  },
  make: function (res) {
    var index = res.currentTarget.dataset.index;
    var phone = this.data.stores[index].store_phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function (res) {
        // success
      }
    })
  },

  select: function (res) {
    var index = res.currentTarget.dataset.index;
    var store_id = this.data.stores[index].store_id;
    getApp().globalData.store_id = store_id;

    getApp().globalData.storeInfo1 = this.data.stores[index];
    wx.navigateTo({
      url: '../category/index?store_id='+store_id,
    })
  },


  map: function (res) {
    var index = res.currentTarget.dataset.index;
    var la = this.data.stores[index].la;
    var lo = this.data.stores[index].lo;
    wx.openLocation({
      latitude: parseFloat(la),
      longitude: parseFloat(lo),
      name: this.data.stores[index].address,
      scale: 28
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