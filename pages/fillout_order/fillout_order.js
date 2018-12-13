var app = getApp();
var server = require('../../utils/server');
var tcity = require("../../utils/citys.js");
var maxTime = 60
var interval = null
var currentTime = -1 //倒计时的事件（单位：s）  
Page({
  data: {
    tab:0,
    name: '',
    phone: '',
    address: '',
    provinces: [],
    province: "北京",
    citys: [],
    city: "北京市",
    countys: [],
    county: '东城区',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    time:"获取验证码",
    data: {
      brand: '',
      model: '',
      brandID: '',
      modelID: '',
      colorID: '',
      combTampArr: [], //故障详情数组
      imgArr: [], //本地显示图片
      userUploadImgs: [],//需要上传图片的路径
      price: '',//总维修价格
      addressID: '', //地址ID
      serverAddress: '',//服务地址
      // province: '', //省份
      // city: '',//城市
      // district: '',//地区
      // address: '',//详情地址
      timeStr: '', //上门时间
      couponID: '',//优惠券ID
      couponName: '',//优惠券名称
      couponPrice: '',//优惠价格
      payPrice: '',//预计需支付
      userID: app.globalData.userid, //用户ID
      repairWay: 72, //维修方式，72上门，73寄邮，74到店
      orderTime: '',//预约时间，0表示立即出发
      desc: '', //留言
    },
    timeShadeFlag: true, //是否隐藏时间蒙层
    dateArr: [],
    timeArr: [],
  },

  store: function () {
    wx.navigateTo({
      url: '../store/index1',
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

  initCityData:function(){
    
    var that = this;
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': provinces[0],
      'city': citys[0],
      'county': countys[0]
    })
  },


  onLoad: function (options) {

    var storeInfo = getApp().globalData.storeInfo;
    this.setData({ storeInfo: storeInfo });
    //设置城市选择
    console.log("onLoad");
    var that = this;

wx.setStorageSync("store", "");

if(getApp().globalData.storeInfo1 != undefined){
  this.setData({ store: getApp().globalData.storeInfo1});
}

server.getJSON("/User/getArea",function(res){
      var citys = res.data.result;
      that.setData({cityData:citys});
      that.initCityData();
    });
    
    //tcity.init(that);

    //var cityData = that.data.cityData;

/*
    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': "北京",
      'city': "北京市",
      'county': "东城区"
    })
    console.log('初始化完成');

*/

    console.log(options)
  },
  openwin: function (event) { //跳转页面
    console.log(event)
    var path = event.target.dataset.url;
    wx.navigateTo({
      url: '../' + path + '/' + path
    })
  },

  tab1:function(res){
this.setData({tab:0});
  },
tab2:function(res){
this.setData({tab:1});
wx.navigateTo({
  url: '../store/index',
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
  tab3:function(res){
this.setData({tab:2});
  },
  //提交预约
  confirm: function () {
    var data = this.data.data;

    var that = this;
    var data1 = this.data;


    if (this.data.store == undefined || this.data.store.store_id == undefined) {
      wx.showToast({
        title: '请选择门店',
        icon: '12',
        duration: 2000
      });
      return false;
    }


    if (!data1.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: '12',
        duration: 2000
      });
      return false;
    }

    if (!data1.phone) {
      wx.showToast({
        title: '请输入手机号',
        duration: 2000
      });
      return false;
    }

    if (!data1.address) {
      wx.showToast({
        title: '请输入详情地址',
        duration: 2000
      });
      return false;
    }


    
    if (data.timeStr == '请选择上门时间') {
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
    var month = data.timeStr.split('月')[0].replace(/(明天|今天)/gi, '');
    var day = data.timeStr.split('月')[1].split('日')[0];
    var hours = data.timeStr.split('日')[1];
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    var orderTime = year + '-' + month + '-' + day + ' ' + hours;
    console.log(data)
    var comIds = [];
    var combTampArr = data.combTampArr;
    for (var i = 0; i < combTampArr.length; i++) {
      comIds.push(combTampArr[i].repairCombID);
    }
    wx.showToast({
      title: '提交预约中...',
      icon: 'loading',
      duration: 10000
    });
    if(data.desc == undefined)
    data.desc = "";
    server.getJSON("/Cart/addOrder",{
      store_id: this.data.store.store_id,
        brandName: data.brand,
        textareaVal:data.textareaVal,
        userUploadImgs:data.userUploadImgs,
        modelName: data.model,
        colorName: data.color,
        code: data1.code,
        colorID: data.colorID,
        mobile:data1.phone,
        consignee:data1.name,
        address:data1.address,
        province:data1.province,
        city:data1.city,
        district:data1.county,
        
        comIds: comIds,
        combTampArr:data.combTampArr,
        orderTime: orderTime,
        brandID: data.brandID,
        modelID: data.modelID,
        repairWay: 72,
        total_amount:data.price,
        order_amount: data.payPrice,
        desc: data.desc,
        
        couponID: data.couponID,
        user_id: app.globalData.userInfo.user_id
      },function(res){
if (res.data.status == 1) {
          wx.redirectTo({
            url: '../order_success/order_success?id=' + res.data.id
          })
        }
        else{
          wx.showToast({title:res.data.msg});
        }
    });
    
return;
    wx.request({
      url: app.globalData.serverUrl + 'endterOrder',
      data: {
        store_id: this.data.store.store_id,
        brandName: data.brand,
        modelName: data.model,
        colorID: data.colorID,
        addressID: data.addressID,
        order_amount:data.payPrice,
        orderTime: orderTime,
        brandID: data.brandID,
        modelID: data.modelID,
        repairWay: 72,
        desc: data.desc,
        userUploadImgs: data.userUploadImgs,
        couponID: data.couponID,
        user_id: app.globalData.userid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.data.error_code == 0) {
          wx.redirectTo({
            url: '../order_success/order_success?id=' + res.data.data.id
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.error_mgs,
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
  //输入留言
  inputMark: function (event) {
    this.data.data.desc = event.detail.value
    this.setData({
      data: this.data.data
    })
  },
  //留言失去焦点
  blurMark: function () {
    try {
      wx.setStorageSync('order_data', this.data.data)
    } catch (e) {
      console.log(e)
    }
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
    this.data.data.timeStr = time
    this.setData({
      data: this.data.data,
      timeShadeFlag: !this.data.timeShadeFlag
    });
    try {
      wx.setStorageSync('order_data', this.data.data)
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
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;

    try {
      var value = wx.getStorageSync('store')
      if(value != "" && value != undefined)
      that.setData({ "store": value });
    } catch (e) {
      // Do something when catch error
      console.log("fillout_order页面的获取本地数据catch")
      console.log(e)
    }



    //获取本地下单对象信息
    try {
      var value = wx.getStorageSync('order_data')
      if (value) {

        var payPrice = parseFloat(value.price) - parseFloat(value.couponPrice);
        if (payPrice < 0) {
          payPrice = 0;
        }
        value.payPrice = payPrice;
        that.setData({
          data: value
        })
      }
    } catch (e) {
      // Do something when catch error
      console.log("fillout_order页面的获取本地数据catch")
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
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  //姓名手机号详细地址输入
  input: function (event) {

    var val = event.target.dataset.type;
    if (val == "name") {
      this.setData({
        name: event.detail.value
      })
    } else if (val == "phone") {
      this.setData({
        phone: event.detail.value
      })
    } else if (val == "address") {
      this.setData({
        address: event.detail.value
      })
    }else if (val == "code") {
      this.setData({
        code: event.detail.value
      })
    }
    console.log(event.detail.value)
  },
  getnum: function (e) {
    var that = this;

    if (parseInt(that.data.phone).toString().length == 11) {

//that.reSendPhoneNum();
//return ;

      server.getJSON("/User/send_sms_reg_code", { mobile: that.data.phone, user_id: getApp().globalData.userInfo.user_id }, function (res) {
        var data = res.data;
        if (data.status == 1) {
          that.reSendPhoneNum();
        }
        else {
          wx.showToast({ "title": data.msg });
        }
      });

      return;
     
    } else {
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "loading"
      })
    }
  },
  reSendPhoneNum: function () {
    if (currentTime < 0) {
      var that = this
      currentTime = maxTime
      interval = setInterval(function () {
        currentTime--
        that.setData({
          time: currentTime + "s"
        })

        if (currentTime <= 0) {
          currentTime = -1
          clearInterval(interval)
          that.setData({
            time: '获取验证码'
          })
        }
      }, 1000)
    } else {
      wx.showToast({
        title: '短信已发到您的手机，请稍后重试!',
        icon: 'loading',
        duration: 700
      })
    }
  }
})