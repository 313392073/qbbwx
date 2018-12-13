var app = getApp();
var server = require('../../utils/server');
var orderid;
Page({
  data: {
    info: '',
    timeShadeFlag:true,
    detailFailureFlag:true
  },
  //选择时间蒙层
  selectConTime: function () {
    this.setData({
      timeShadeFlag: !this.data.timeShadeFlag
    })
  },
  wc:function(res){
     //var index = e.currentTarget.dataset.index;
		var order = this.data.info;
        var that = this;
        wx.showModal({
  title: '提示',
  showCancel:true,
  content: '确定已维修完成了,并且支付维修费用吗？',
  success: function(res) {
    
    if (res.confirm) {

wx.navigateTo({
			url: '../pay/pay?orderid='+order['order_id']+"&order_amount="+order['order_amount']
		});
	
		 return;
		var user_id = getApp().globalData.userInfo.user_id
		
		server.getJSON('/User/orderConfirm/user_id/' + user_id +"/order_id/" + order['order_id'],function(res){
wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 })
				cPage = 0;
				
	      that.data.orders = [];
          that.getOrderLists(ctype,0);
		});
		
    }
  }
})
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(options)
    orderid = options.orderid;
    wx.showToast({
      title: '获取数据中...',
      icon: 'loading',
      duration: 10000
    });

    server.getJSON("/User/getOrderDetail?order_id="+orderid,{user_id:getApp().globalData.userInfo.user_id},function(res){

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
          //info.ordertime = that.getTime(new Date(parseInt(info.ordertime) * 1000));
          info.addTime = that.getTime(new Date(parseInt(info.addTime) * 1000));
          info.price = parseFloat(info.couponPrice) + parseFloat(info.totalPrice);
          that.setData({
            info: info
          })
        }


    });

    return;
    wx.request({
      url: app.globalData.serverUrl + 'getOrder',
      data: {
        orderID: orderid,
        userID: app.globalData.userid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.error_code == 0) {
          var info = res.data.data.info;
          if (!info.colorName) {
            info.colorName = '';
          }
          if (!info.couponName) {
            info.couponName = '';
          }
          if (!info.desc) {
            info.desc = '';
          }
          info.orderTime = that.getTime(new Date(parseInt(info.orderTime) * 1000));
          info.addTime = that.getTime(new Date(parseInt(info.addTime) * 1000));
          info.price = parseFloat(info.couponPrice) + parseFloat(info.totalPrice);
          that.setData({
            info: info
          })
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        wx.hideToast()
      }
    })
  },
  //打电话
  tel: function (event) {
    var phone = parseInt(event.currentTarget.dataset
.phone)
    console.log(event.currentTarget.dataset
.phone);
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset
.phone
    })
  },
  //返修
  backRepair: function (event) {
    var orderid = event.target.dataset.orderid;
    try {
      wx.removeStorageSync('backRepair_data')
    } catch (e) {
      console.log(e)
    }
    wx.navigateTo({
      url: '../back_repair/back_repair?orderid=' + orderid
    })
  },
  //评价
  appraise: function (event) {
    wx.redirectTo({
      url: '../appraise/appraise?orderid=' + orderid,
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
  //取消订单
  cancelOrder: function (event) {
    this.setData({detailFailureFlag:false});
    return ;
    wx.showModal({
      title: '提示',
      content: '是否取消订单',
      success: function (res) {
        if (res.confirm) {
          var orderid = event.target.dataset.orderid;
          wx.showToast({
            title: '取消订单中...',
            icon: 'loading',
            duration: 10000
          });
          wx.request({
            url: app.globalData.serverUrl + 'cancelOrder',
            data: {
              orderID: orderid,
              userID: app.globalData.userid
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              console.log(res)
              if (res.data.error_code == 0) {
                wx.showModal({
                  title: '提示',
                  content: '取消订单成功',
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
                  content: res.data.error_msg,
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
        }
      }
    })

  },
  //付款
  pay: function (event) {
    var orderid = event.target.dataset.orderid;
    wx.showToast({
      title: '付款中...',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: app.globalData.serverUrl + 'wxPay',
      data: {
        orderID: orderid,
        userID: app.globalData.userid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.data.error_code == 0) {
          var info = res.data.data.info;
          wx.requestPayment({
            'timeStamp': info.timeStamp,
            'nonceStr': info.nonceStr,
            'package': info.package,
            'signType': info.signType,
            'paySign': info.paySign,
            'success': function (res) {
              wx.showModal({
                title: '提示',
                content: '付款成功',
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
            },
            'fail': function (res) {
              console.log(res)
            }
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
      },
      fail: function () {
        // fail
      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  getTime: function (time) {
    console.log(time)
    // var time = this.data.time;
    if (time) {
      var yy = time.getYear() + 1900;
      var MM = time.getMonth() + 1;
      var dd = time.getDate();
      var HH = time.getHours();
      var mm = time.getMinutes();
      var ss = time.getSeconds();

      return yy + "-" + this.bl(MM) + "-" + this.bl(dd) + " " + this.bl(HH) + ":" + this.bl(mm) + ":" + this.bl(ss);
    }
    else {
      time = new Date();
      var yy = time.getYear() + 1900;
      var MM = time.getMonth() + 1;
      var dd = time.getDate();
      var HH = time.getHours();
      var mm = time.getMinutes();
      var ss = time.getSeconds();

      return yy + "-" + this.bl(MM) + "-" + this.bl(dd) + " " + this.bl(HH) + ":" + this.bl(mm) + ":" + this.bl(ss);
    }
  },
  bl: function (s) {
    return s < 10 ? '0' + s : s;
  },
  previewImage: function (event) {
    wx.previewImage({
      current: event.target.dataset.url, // 当前显示图片的http链接
      urls: [event.target.dataset.url] // 需要预览的图片http链接列表
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    //获取时间规则
    wx.request({
      url: app.globalData.serverUrl + 'getOrderTime',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        //下单时间规则 
        var time_list = res.data.data.time;
        var time_interval_str = JSON.parse(time_list.time_interval_str.trim());
        var time_list_weekArr = time_interval_str.weekArr;
        that.setData({
          time_list: time_list,
          time_interval_str: time_interval_str,
          time_list_weekArr: time_list_weekArr
        })
        console.log(time_list.longest_appointment)
        //添加下单日期
        that.showTime(parseInt(time_list.longest_appointment));
        //添加下单时段
        that.showTimeDetaile(true)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // 取消
  cancel: function () {
    

    this.setData({
      detailFailureFlag: true
    })
  },

  //确定
  confirm: function () {
    this.setData({
      detailFailureFlag: true
    })
    
    var r;
    if(this.data.s1 == true){
       r="等待太久";
    }else if(this.data.s2 == true){
r="价格不合理";
    }else if(this.data.s3 == true){
r="填写信息错误";
    }else if(this.data.s4 == true){
r="其他";
    }
    else{
      return ;
    }

server.getJSON("/User/cancelOrder",{user_id:getApp().globalData.userInfo.user_id,order_id:orderid,"return":r},function(res){
wx.showToast({title:res.data.msg});


setTimeout(function () {
               
			   
				wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
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
			}, 2000);
			    



});

  },
  s1:function(res){
    this.setData({s1:true,s2:false,s3:false,s4:false});
  },
  s2:function(res){
this.setData({s2:true,s1:false,s3:false,s4:false});
  },
  s3:function(res){
this.setData({s3:true,s2:false,s1:false,s4:false});
  },
  s4:function(res){
this.setData({s4:true,s2:false,s3:false,s1:false});
  },

  //取消
  cancle: function () {
    this.setData({
      timeShadeFlag: !this.data.timeShadeFlag
    })
  },
  //选择日期
  selectDate: function (event) {
    var index = event.target.dataset.index;
    var dateArr = this.data.dateArr;
    for (var i = 0; i < dateArr.length; i++) {
      dateArr[i].class = false;
    }
    dateArr[index].class = true;
    this.setData({
      dateArr: dateArr
    })
    if (index == 0) {
      this.showTimeDetaile(true);
    } else {
      this.showTimeDetaile(false);
    }
  },
  //选择时间时段
  selectTime: function (event) {
    var text = event.target.dataset.text;
    var dateArr = this.data.dateArr;
    var dateArr = this.data.dateArr;
    var time = '';
    for (var i = 0; i < dateArr.length; i++) {
      if (dateArr[i].class) {
        time = dateArr[i].text;
      }
    }
    time += text;
    this.data.timeStr = time
    this.setData({
      
      timeShadeFlag: !this.data.timeShadeFlag
    });
    

    var year = (new Date()).getFullYear();
    var month = time.split('月')[0].replace(/(明天|今天)/gi, '');
    var day = time.split('月')[1].split('日')[0];
    var hours = time.split('日')[1];
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    var orderTime = year + '-' + month + '-' + day + ' ' + hours;



    server.getJSON("/User/updateOrder",{order_id:orderid,"orderTime":orderTime},function(res){
wx.showToast({title:res.data.msg});

setTimeout(function () {
               
			   
				wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
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
			}, 2000);



});

  },
  makephone:function(res){
     wx.makePhoneCall({
       phoneNumber: this.data.info.phone,
       success: function(res) {
         // success
       }
     })
  },
  //添加下单日期
  showTime: function (num) {

    if (this.isLeapYear(year)) {
      var show_month = ['31', '29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
    } else {
      var show_month = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
    }

    var show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    var time = new Date();
    var year = time.getFullYear();

    var month = time.getMonth();
    var date = time.getDate() - 1;
    var day = time.getDay() - 1;
    var hour = time.getHours();
    var minutes = time.getMinutes();
    var second = time.getSeconds();

    month < 10 ? month = '0' + month : month;

    month = parseInt(month) + 1;

    var monthFlag = true;
    var monthNumber = month; //月份存储变量
    var dataNumber = '';  //日存储变量
    var dateArr = [];
    for (var i = 0; i < num; i++) {
      //星期
      var number = day + 1;
      if (number >= 7) {
        number = number - 7;
      }
      day = number;

      //日期
      dataNumber = date + 1;
      //月份
      if (dataNumber > show_month[monthNumber - 1]) {
        dataNumber = dataNumber - show_month[monthNumber - 1];
        monthNumber = monthNumber + 1;
        if (monthNumber > 12) {
          monthNumber = monthNumber - 12;
        }
      }
      date = dataNumber;

      //检查星期数组是否有相应的星期
      if (!this.checkoutWeek(show_day[number])) {
        num++;
        continue;
      }

      if (i == 0) {
        dateArr.push({
          text: '今天' + monthNumber + '月' + dataNumber + '日',
          class: true
        })
      } else if (i == 1) {
        dateArr.push({
          text: '明天' + monthNumber + '月' + dataNumber + '日',
          class: false
        })
      } else {
        dateArr.push({
          text: '' + monthNumber + '月' + dataNumber + '日',
          class: false
        })
      }
    }
    console.log(dateArr)
    this.setData({
      dateArr: dateArr
    })
  },
  //添加下单时段
  showTimeDetaile: function (flag) {
    var time_list = this.data.time_list;
    var time_interval_str = this.data.time_interval_str;
    var sm_star_hour = parseInt(time_interval_str.sm_star_hour); //开始小时
    var sm_star_minute = parseInt(time_interval_str.sm_star_minute); //开始分钟
    var sm_end_hour = parseInt(time_interval_str.sm_end_hour); //结束小时
    var sm_end_minute = parseInt(time_interval_str.sm_end_minute); //结束分钟
    var seg_time_periods = parseInt(time_list.seg_time_periods); //时间间隔多少		

    var star = sm_star_hour * 60 + sm_star_minute;
    var end = sm_end_hour * 60 + sm_end_minute;

    var star_m = star;
    star_m = star_m + seg_time_periods;
    var timeArr = [];
    while (star_m <= (end + seg_time_periods)) {
      if (flag) { //如果选择是今天
        //判断今天已经过时的时段
        var totalMunite = (new Date()).getHours() * 60 + (new Date()).getMinutes(); //当前时间总分钟数
        var reservation_time = parseInt(time_list.reservation_time); //提前多少分钟
        if (star >= (totalMunite + reservation_time)) {
          timeArr.push({
            text: this.transformTime(star),
            class: false
          })
        }
      } else {
        timeArr.push({
          text: this.transformTime(star),
          class: false
        })
      }

      star = star_m;
      star_m = star_m + seg_time_periods;
    }

    this.setData({
      timeArr: timeArr
    })
  },
  //总分钟转换为24小时标准时间
  transformTime: function (time) {
    var hour = parseInt(time / 60);
    var minute = time % 60;
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    return hour + ':' + minute;
  },
  //检查星期数组是否有相应的星期
  checkoutWeek: function (week) {
    var time_list_weekArr = this.data.time_list_weekArr;
    for (var i = 0; i < time_list_weekArr.length; i++) {
      if (time_list_weekArr[i] == week) {
        return true;
      }
    }
    return false;
  },
  //是否闰年
  isLeapYear: function (year) {
    var cond1 = year % 4 == 0;  //条件1：年份必须要能被4整除
    var cond2 = year % 100 != 0;  //条件2：年份不能是整百数
    var cond3 = year % 400 == 0;  //条件3：年份是400的倍数
    //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
    //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
    //所以得出判断闰年的表达式：
    var cond = cond1 && cond2 || cond3;
    if (cond) {
      //			        alert(year + "是闰年");
      return true;
    } else {
      //			        alert(year + "不是闰年");
      return false;
    }
  }
})