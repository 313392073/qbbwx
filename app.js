var server = require('./utils/server');
var md5 = require('./utils/md5.js');
var config = require('./utils/config.js');

App({
  getWxDeviceInfo: function (e) {
    try {
      var t = wx.getSystemInfoSync();
      this.globalData.wxDeviceInfo = t, this.globalData.winRate = t.windowWidth / 750,
        "function" == typeof e && e(this.globalData.wxDeviceInfo);
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  },
  setHwxUserInfo: function (t) {
    this.globalData.hwxUserInfo = t, wx.setStorage({
      key: e.storageKeys.currentUser,
      data: t
    });
  },
  setHiDeviceInfo: function (t) {
    this.globalData.hwxDeviceInfo = t, wx.setStorage({
      key: e.storageKeys.currentDevice,
      data: t
    });
  },
  setTimeDifference: function (t) {
    this.globalData.timeDifference = t, wx.setStorage({
      key: e.storageKeys.timeDifference,
      data: t
    });
  },
  onLaunch: function () { //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    this.getWxDeviceInfo();
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code;
          console.log(code);
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              console.log(JSON.parse(res.rawData))
              that.globalData.userInfo = JSON.parse(res.rawData);
              var encryptedData = encodeURIComponent(res.encryptedData);//一定要把加密串转成URI编码
              //var encryptedData = res.encryptedData;//一定要把加密串转成URI编码
              var iv = res.iv;
              //请求自己的服务器
              that.login(code, encryptedData, iv);
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
        console.log(res)
      }, fail: function (res) {
        console.log(res)
      }, complete: function (res) {
        console.log(res)
      }
    });
  },
  onShow: function () { //当小程序启动，或从后台进入前台显示，会触发 onShow

  },
  onHide: function () { //当小程序从前台进入后台，会触发 onHide

  },
  onError: function (msg) { //当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
    console.log("appError:" + msg)
  },

  globalData: { //定义全局对象
    userInfo: null,
    userid: null,
    serverUrl: 'https://small.azooo.com/api/',
    'openid': null


  },
  login: function (code, encryptedData, iv, callback) {
    var that = this;
    return;
    // console.log('code=' + code);
    // console.log('encryptedData=' + encryptedData);
    // console.log('iv=' + iv);
    //创建一个dialog

    //请求服务器获取用户id
    wx.request({
      url: this.globalData.serverUrl + 'login',
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        console.log(res);
        var data = JSON.parse(res.data.trim());
        // console.log(data)
        if (data.error_code == 0) { //成功
          var azooo_userID = data.data.azooo_userID;
          that.globalData.userid = azooo_userID;
          if (callback) {
            callback()
          }
        } else {
          wx.showModal({
            title: '提示',
            content: data.error_msg,
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
        // wx.hideToast();
      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  getOpenId: function (cb) {

    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          server.getJSON("/User/getOpenid", { url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.appid + '&secret=' + config.secret + '&js_code=' + res.code + '&grant_type=authorization_code' }, function (response) {
            // 获取openId
            var openId = response.data.openid;
            // TODO 缓存 openId
            var app = getApp();
            var that = app;
            that.globalData.openid = openId;

            //验证是否关联openid

            typeof cb == "function" && cb()
          });

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });



  },

  register: function (cb) {
    var app = this;
    this.getUserInfo(function () {
      var openId = app.globalData.openid;
      var userInfo = app.globalData.userInfo;
      var country = userInfo.country;
      var city = userInfo.city;
      var gender = userInfo.gender;
      var nick_name = userInfo.nickName;
      var province = userInfo.province;
      var avatarUrl = userInfo.avatarUrl;


      server.getJSON('/User/register?open_id=' + openId + "&country=" + country + "&gender=" + gender + "&nick_name=" + nick_name + "&province=" + province + "&city=" + city + "&head_pic=" + avatarUrl, function (res) {
        app.globalData.userInfo = res.data.res

        typeof cb == "function" && cb()
      });

    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  }

})