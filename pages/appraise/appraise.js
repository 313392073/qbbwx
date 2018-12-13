var app = getApp();
var server = require('../../utils/server');
Page({
  data: {
    orderID: '',
    info: '',
    text: '',
    content: [],
    starArr: [
      { class: false },
      { class: false },
      { class: false },
      { class: false },
      { class: false }
    ],
    textareaVal: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    var that = this;
    that.setData({
      orderID: options.orderid
    });
    
    server.getJSON("/User/getOrderDetail?order_id="+options.orderid,{},function(res){

wx.hideToast();
      console.log(res);
        if (res.data.status == 1) {
          var info = res.data.result;
          if (!info.colorname) {
            info.colorname = '';
          }
          if (!info.couponname) {
            info.couponname = '';
          }
          if (!info.desc) {
            info.desc = '';
          }

          that.setData({
            info: info
          })
        }


    });



  },
  //选择星星
  selectStar: function (event) {
    console.log(event)
    var index = event.target.dataset.index;
    var starArr = this.data.starArr;
    for (var i = 0; i < starArr.length; i++) {
      if (i <= index) {
        starArr[i].class = true;
      } else {
        starArr[i].class = false;
      }
    }
    var appraiseArr = [
      {
        text: '很差',
        content: [{ text: '技术不行', class: false }, { text: '态度很差', class: false }, { text: '严重延迟时间', class: false }, { text: '清洁整理不好', class: false }]
      },
      {
        text: '较差',
        content: [{ text: '技术不行', class: false }, { text: '态度很差', class: false }, { text: '时间延迟很多', class: false }, { text: '不注意清洁整理', class: false }]
      },
      {
        text: '一般',
        content: [{ text: '技术一般', class: false }, { text: '态度一般', class: false }, { text: '到达不及时', class: false }, { text: '清洁整理不够好', class: false }]
      },
      {
        text: '良好',
        content: [{ text: '到达及时', class: false }, { text: '细心专业', class: false }, { text: '维修快速', class: false }, { text: '帅气给力', class: false }, { text: '态度亲和', class: false }, { text: '注意清洁', class: false }]
      }, {
        text: '满意',
        content: [{ text: '到达及时', class: false }, { text: '细心专业', class: false }, { text: '维修快速', class: false }, { text: '帅气给力', class: false }, { text: '态度亲和', class: false }, { text: '注意清洁', class: false }]
      }
    ]
    var text = appraiseArr[index].text;
    var content = appraiseArr[index].content;

    this.setData({
      starArr: starArr,
      text: text,
      content: content
    })
  },
  //选择评价内容
  selectBtn: function (event) {
    var index = event.target.dataset.index;
    var content = this.data.content;
    content[index].class = !content[index].class;
    this.setData({
      content: content
    })
  },
  //其他想说的
  textareaVal: function (event) {
    this.setData({
      textareaVal: event.detail.value
    })
  },
  //提交
  confirm: function () {
    //几个星星
    var star = 0;
    var starArr = this.data.starArr;
    for (var i = 0; i < starArr.length; i++) {
      if (starArr[i].class) {
        star++;
      }
    }
    if (star == 0) {
      wx.showModal({
        title: '提示',
        content: '您还没选择星星评价',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }

    //选择评价内容starArr
    /*var content = [];
    var contentArr = this.data.content;
    for (var i = 0; i < contentArr.length; i++) {
      if (contentArr[i].class) {
        content.push(contentArr[i].text);
      }
    }*/
    var textareaVal = this.data.textareaVal;
    
    wx.showToast({
      title: '提交中...',
      icon: 'loading',
      duration: 10000
    });
    
    server.getJSON("/User/add_comment",{
        stars: star,
        orderID: this.data.orderID,
        
        content: textareaVal
      },function(res){

wx.hideToast();
console.log(res);
        if (res.data.status == 0) {
          wx.showModal({
            title: '提示',
            content: '评价成功，感谢你的评价',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }




      });

    return;

    wx.request({
      url: app.globalData.serverUrl + 'comment',
      data: {
        stars: star,
        orderID: this.data.orderID,
        
        content: textareaVal
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.error_code == 0) {
          wx.showModal({
            title: '提示',
            content: '评价成功，感谢你的评价',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
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
        wx.hideToast();
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