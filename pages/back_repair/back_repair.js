var app = getApp();
Page({
  data: {
    info: {
      addressID: '', //地址ID
      serverAddress: '请选择服务地址',//服务地址
      province: '', //省份
      city: '',//城市
      district: '',//地区
      address: '',//详情地址
      timeStr: '请选择上门时间', //上门时间
      orderID: '', //订单ID
      repairWay: 72, //维修方式，72上门，73寄邮，74到店
      orderTime: '',//预约时间，0表示立即出发
      desc: '', //留言
    },
    timeShadeFlag: true, //是否隐藏时间蒙层
    dateArr: [],
    timeArr: [],
    imgArr: [], //本地显示图片
    uploadimgArr: [],//需要上传图片的路径
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(options)
    var orderid = options.orderid;
    wx.showToast({
      title: '获取数据中...',
      icon: 'loading',
      duration: 10000
    });
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

          var info = that.data.info;
          var resInfo = res.data.data.info;
          info.phoneBrand = resInfo.phoneBrand;
          info.phoneModel = resInfo.phoneModel;
          info.Failurelist = resInfo.Failurelist;
          info.Failurelist = resInfo.orderSn;
          if (!resInfo.colorName) {
            info.colorName = '';
          } else {
            info.colorName = resInfo.colorName;
          }

          info.dealTime = that.getTime(new Date(parseInt(resInfo.dealTime) * 1000));
          info.totalPrice = resInfo.totalPrice;
          info.orderID = orderid;

          that.setData({
            info: info
          })
          console.log(info)
          try {
            wx.setStorageSync('backRepair_data', that.data.info)
          } catch (e) {
            console.log(e)
          }

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
  //添加图片
  addImg: function () {
    var that = this;
    var imgArr = this.data.imgArr;
    var uploadimgArr = this.data.uploadimgArr;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        //上传图片
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          duration: 10000
        });
        // console.log(tempFilePaths[0])
        wx.uploadFile({
          url: app.globalData.serverUrl + 'upload',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          success: function (res) {
            // console.log("上传图片")
            var data = JSON.parse(res.data.trim())
            if (data.error_code == 0) { //成功
              //添加到图片数组
              imgArr.push(tempFilePaths[0]);
              uploadimgArr.push(data.data.path)
              that.setData({
                imgArr: imgArr,
                uploadimgArr: uploadimgArr
              })
            } else {
              wx.showToast({
                title: data.error_msg,
                icon: 'success',
                duration: 2000
              })
            }
          },
          complete: function () {
            wx.hideToast();
          }
        })
      }
    })
  },
  //删除图片
  imgDel: function (event) {
    var imgArr = this.data.imgArr;
    var index = event.target.dataset.index;
    if (imgArr.length) {
      for (var i = 0; i < imgArr.length; i++) {
        if (i == index) {
          imgArr.splice(i, 1);
        }
      }
    }
    this.setData({
      imgArr: imgArr
    })
  },
  previewImage: function (event) {
    wx.previewImage({
      current: event.target.dataset.url, // 当前显示图片的http链接
      urls: [event.target.dataset.url] // 需要预览的图片http链接列表
    })
  },
  //选择时间蒙层
  selectConTime: function () {
    this.setData({
      timeShadeFlag: !this.data.timeShadeFlag
    })
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
    this.data.info.timeStr = time
    this.setData({
      info: this.data.info,
      timeShadeFlag: !this.data.timeShadeFlag
    });
    try {
      wx.setStorageSync('backRepair_data', this.data.info)
    } catch (e) {
      console.log(e)
    }
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
  },
  //输入留言
  inputMark: function (event) {
    this.data.info.desc = event.detail.value
    this.setData({
      info: this.data.info
    })
  },
  openwin: function (event) { //跳转页面
    console.log(event)
    var path = event.target.dataset.url;
    wx.navigateTo({
      url: '../' + path + '/' + path
    })
  },
  //提交
  confirm: function () {

    var info = this.data.info;
    var desc = info.desc;
    var uploadimgArr = this.data.uploadimgArr;
    console.log(info)
    if (info.serverAddress == '请选择服务地址') {
      wx.showModal({
        title: '提示',
        content: '请选择服务地址',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    if (info.timeStr == '请选择上门时间') {
      wx.showModal({
        title: '提示',
        content: '请选择上门时间',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }

    var year = (new Date()).getFullYear();
    var month = info.timeStr.split('月')[0].replace(/(明天|今天)/gi, '');
    var day = info.timeStr.split('月')[1].split('日')[0];
    var hours = info.timeStr.split('日')[1];
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    var orderTime = year + '-' + month + '-' + day + ' ' + hours;
    if (!desc) {
      wx.showModal({
        title: '提示',
        content: '请填写返修原因',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    wx.showToast({
      title: '提交中...',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: app.globalData.serverUrl + 'backRepair',
      data: {
        orderID: info.orderID,
        userID: app.globalData.userid,
        addressID: info.addressID,
        repairWay: info.repairWay,
        orderTime: orderTime,
        userUploadImgs: uploadimgArr,
        desc: desc,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.error_code == 0) {
          wx.showModal({
            title: '提示',
            content: '提交成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.switchTab({
                  url: '../index/index'
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
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    var that = this;
    // 页面显示
    //获取本地下单对象信息
    try {
      var value = wx.getStorageSync('backRepair_data')
      if (value) {
        that.setData({
          info: value
        })
      }
    } catch (e) {
      // Do something when catch error
      console.log(e)
    }
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
  }
})