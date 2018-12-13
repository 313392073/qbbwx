var app = getApp();
var server = require('../../utils/server');
Page({
  data: {
    listArr: [],
    data: {}, //页面传来参数
    addressID: '',
  },
  onLoad: function (options) {
    

  },
  openwin: function (event) { //跳转页面
    console.log(event)
    var path = event.target.dataset.url;
    this.data.data.id = event.target.dataset.id;
    this.data.data.name = event.target.dataset.name;
    this.data.data.phone = event.target.dataset.phone;
    this.data.data.province = event.target.dataset.province;
    this.data.data.city = event.target.dataset.city;
    this.data.data.district = event.target.dataset.district;
    this.data.data.address = event.target.dataset.address;

    try {
      wx.setStorageSync('order_data', this.data.data)
    } catch (e) {
      console.log("address页面的保存本地数据catch")
      console.log(e)
    }
    wx.navigateTo({
      url: '../' + path + '/' + path
    })
  },
  //选择地址
  select: function (event) {
    
    var that = this;
    var id = event.target.dataset.id;
    var user_id = getApp().globalData.userInfo.user_id;
    server.getJSON('/User/setDefaultAddress/user_id/' + user_id + "/address_id/" + id,function(res){
if(res.data.status == 1)
			{
        wx.showToast({title:"加载中..."});
				//that.loadData();
			}
		 });



    //return ;
    var id = event.target.dataset.id;
    
    this.data.data.addressID = id;
    this.data.data.serverAddress = event.target.dataset.province + event.target.dataset.city + event.target.dataset.district;

    // this.data.data.province = event.target.dataset.province;
    // this.data.data.city = event.target.dataset.city;
    // this.data.data.district = event.target.dataset.district;
    // this.data.data.address = event.target.dataset.address;
    console.log(this.data.data)
    try {
      wx.setStorageSync('order_data', this.data.data)
    } catch (e) {
      console.log("address页面的保存本地数据catch")
      console.log(e)
    }
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: '../fillout_order/fillout_order'
    // })

  },
  //删除
  del: function (event) {
    var id = event.target.dataset.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址？',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: '删除中...',
            icon: 'loading',
            duration: 10000
          });
          var user_id = getApp().globalData.userInfo.user_id;
          server.getJSON('/User/del_address/user_id/' + user_id + "/id/" + id,function(res){
 wx.showToast({
  				title: res.data.msg,
  				icon: 'success',
  				duration: 2000
  			});

				that.loadData();
						})
            
					


        }
      }
    })

  },
  loadData:function(){
    var that =this;
     server.getJSON('/User/getAddressList/user_id/' + app.globalData.userInfo.user_id,function(res){

        wx.hideToast();
			var addressList = res.data.result;
			that.setData({
				addressObjects: addressList
			});
		});
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数

    //获取本地下单对象信息
    try {
      var value = wx.getStorageSync('order_data')
      if (value) {
        that.setData({
          data: value,
          addressID: value.addressID
        })
      }
    } catch (e) {
      // Do something when catch error
      console.log("address页面的获取本地数据catch")
      console.log(e)
    }

    //全局变量存在用户ID就请求服务器获取地址列表信息
    if (app.globalData.userInfo.user_id) {
      wx.showToast({
        title: '获取数据中...',
        icon: 'loading',
        duration: 10000
      });

      server.getJSON('/User/getAddressList/user_id/' + app.globalData.userInfo.user_id,function(res){

        wx.hideToast();
			var addressList = res.data.result;
			that.setData({
				addressObjects: addressList
			});
		});
    return ;

      wx.request({
        url: app.globalData.serverUrl + 'getAddressList',
        data: {
          userID: app.globalData.userid
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          console.log(res)
          if (res.data.error_code == 0) {
            var list = res.data.data.list;
            for (var i = 0; i < list.length; i++) {
              if(!list[i].district){
                list[i].district = '';
              }
              if (list[i].addressID == that.data.addressID) {
                list[i].class = true;
              } else {
                list[i].class = false;
              }
            }
            that.setData({
              listArr: list
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.error_msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          wx.hideToast();
        }
      })
    } else {//重新请求服务器获取用户id并刷新页面
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            console.log(code);
            wx.getUserInfo({
              success: function (res) {
                console.log(res);
                var encryptedData = encodeURIComponent(res.encryptedData);//一定要把加密串转成URI编码
                //var encryptedData = res.encryptedData;//一定要把加密串转成URI编码
                var iv = res.iv;
                //请求自己的服务器
                app.login(code, encryptedData, iv, function () {
                  wx.redirectTo({
                    url: '../address/address'
                  })
                });
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });

      console.log(app.globalData.userid)
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})