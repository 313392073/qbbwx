var server = require('../../utils/server');
var app = getApp();
Page({
  data: {
    imgUrls: [
      // '../../images/banner.png',
      // 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,//是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 5000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    circular: true, //是否采用衔接滑动
  },
  more: function () {
    wx.navigateTo({
      url: '../category/index?id=' + 0,
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },

  service: function (res) {
    var index = res.currentTarget.dataset.index;
    var id = this.data.categorys[index].id;
    wx.navigateTo({
      url: '../category/index?id=' + id,
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })

  },
  store: function () {
    wx.navigateTo({
      url: '../store/index',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    if (options.store_id == undefined) {
      getApp().globalData.store_id = 0;
    } else
      getApp().globalData.store_id = options.store_id;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });

    this.loadBanner();
    app.getOpenId(function () {

      var openId = getApp().globalData.openid;

      server.getJSON("/User/validateOpenid", { openid: openId }, function (res) {
        wx.hideToast();
        if (res.data.code == 200) {
          getApp().globalData.userInfo = res.data.data;
          getApp().globalData.login = true;
          //wx.switchTab({
          //url: '/pages/index/index'
          //});
        }
        else {
          if (res.data.code == '400') {
            console.log("need register");

            app.register(function () {

              getApp().globalData.login = true;
            });
          }
        }

      });

    });



    var that = this;
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.setData({ userInfo: res.userInfo });

          }
        })
      }
    })





  },

  loadBanner: function () {

    var that = this;

    server.getJSON("/Index/home", function (res) {
      var banner = res.data.result.ad;
      var goods = res.data.result.goods;
      var ad = res.data.ad;
      var categorys = res.data.goods_category;
      that.setData({
        banner: banner,
        goods: goods,
        ad: ad,
        categorys: categorys
      });
    });



  },


  openwin: function (event) { //跳转页面
    console.log(event)
    var path = event.target.dataset.url;
    wx.navigateTo({
      url: '../' + path + '/' + path
    })
  },
  openwin1: function (event) { //带参数跳转手机页面
    console.log(event.target.dataset.brandid)
    wx.navigateTo({
      url: '../select_phone/select_phone?brandID=' + event.target.dataset.brandid + '&modelID=' + event.target.dataset.modelid
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;


        server.getJSON("/User/getStore", { la: latitude, lo: longitude }, function (res) {
          that.setData({ "store": res.data.result });
        });

        server.getJSON("/User/store", { la: latitude, lo: longitude }, function (res) {
          that.setData({ "store1": res.data.result });
          getApp().globalData.storeInfo = res.data.result;
        });



      }
    }
    );


  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '快百帮维修连锁', // 分享标题
      desc: '快百帮维修连锁', // 分享描述
      path: 'pages/index/index' // 分享路径
    }
  },
  select: function (res) {

    var store_id = this.data.store.store_id;
    getApp().globalData.store_id = store_id;

    wx.navigateTo({
      url: '../category/index',
    })
  },


  map: function (res) {

    var la = this.data.store.la;
    var lo = this.data.store.lo;
    wx.openLocation({
      latitude: parseFloat(la),
      longitude: parseFloat(lo),
      name: this.data.store.address,
      scale: 28
    })

  },

})
