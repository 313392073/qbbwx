//获取应用实例
var tcity = require("../../utils/citys.js");
var server = require('../../utils/server');
var app = getApp()
Page({
  data: {
    name: '',
    phone: '',
    address: '',
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false
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
  open: function () {
    this.setData({
      condition: !this.data.condition
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
    var that = this;


    //设置城市选择
    console.log("onLoad");


    server.getJSON("/User/getArea",function(res){
      var citys = res.data.result;
      that.setData({cityData:citys});
      that.initCityData();
    });
    
    


    
    console.log('初始化完成');


    //return ;
    var value = '';
    try {
      value = wx.getStorageSync('order_data');
    } catch (e) {
      // Do something when catch error
    }
    console.log(value)
    var name = '';
    if (value.name != undefined) {
      name = value.name;
    }
    var phone = '';
    if (value.phone != undefined) {
      phone = value.phone;
    }
    var address = '';
    if (value.address != undefined) {
      address = value.address;
    }
    /*
    var province = '北京';
    if (value.province != undefined) {
      province = value.province;
    }
    var city = '北京市';
    if (value.city != undefined) {
      city = value.city;
    }
    var district = '东城区';
    if (value.district != undefined) {
      district = value.district;
    }*/
    var id = '0';
    if (value.id != undefined) {
      id = value.id;
    }
    console.log(name)
    that.setData({
      init_name: name,
      name: name,
      init_phone: phone,
      phone: phone,
      init_address: address,
      address: address,
      
      id: id
    })

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
    }
    console.log(event.detail.value)
  },
  //确定
  confirm: function () {
    var that = this;
    console.log(this.data)
    var data = this.data;

    if (!data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: '12',
        duration: 2000
      });
      return false;
    }

    if (!data.phone) {
      wx.showToast({
        title: '请输入手机号',
        duration: 2000
      });
      return false;
    }

    if (!data.address) {
      wx.showToast({
        title: '请输入详情地址',
        duration: 2000
      });
      return false;
    }
    wx.showToast({
      title: '保存中...',
      icon: 'loading',
      duration: 10000
    });
    console.log(data)

    var user_id = getApp().globalData.userInfo.user_id

    server.postJSON('/User/addAddress/user_id/' + user_id,{user_id:user_id,mobile:data.phone,zipcode:"",consignee:data.name,address:data.address,is_default:1,country:"",twon:"",province:data.province,city:data.city,district:data.county,id:data.id},function (res) {
        console.log(res)
        if (res.data.status == 1) {
          //返回页面
          wx.navigateBack({
            delta: 1
          })
        } else {
          setTimeout(function () {
            wx.showToast({
              title: res.data.error_msg,
              icon: 'success',
              duration: 2000
            })
          }, 2000)
        }
        // success
      });



  }
})
