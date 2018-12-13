var app = getApp();
var server = require('../../utils/server');
var orderid;
Page({
  data: {
    id: ''
  },
  onLoad: function (options) {
    orderid = options.orderid;
    var order_amount = options.order_amount;
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.id,
      order_amount:order_amount
    })
  },
  //查看订单
  look: function () {
    
    
    wx.showToast({
      title: '付款中...',
      icon: 'loading',
      duration: 10000
    });
    
    
    
    var app = getApp();
		var that = this;
		var orderId = orderid;
		
		console.log('order id : ' + orderId);

    server.getJSON('/Cart/getWXPayData/user_id/' + 2 +"/order_id/" + orderId,function(res){
      wx.hideToast();
app.globalData.wxdata = res.data.result;
that.pay();
		});
	},
	pay: function () {
		var app = getApp();
		
		var wxdata = app.globalData.wxdata.wdata
		var timeStamp = wxdata.timeStamp + "";
		var nonceStr = wxdata.nonceStr + "";
		var package1 = wxdata.package
		var sign = wxdata.sign;
			 wx.requestPayment({
			    
			    'nonceStr': nonceStr,
		       'package': package1,
			    'signType': 'MD5',
				'timeStamp': timeStamp,
			    'paySign': sign,
			    'success':function(res){
			    		console.log(res);
							wx.showToast({ title: '支付成功', icon: 'success', duration: 2000 })
                setTimeout(function doHandler(){
                  wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                    success: function(res){
                      // success
                    },
                    fail: function() {
                      // fail
                    },
                    complete: function() {
                      // complete
                    }
                  })
                },2000);
			    },
			    'fail':function(res){
			    		console.log(res);
							wx.showToast({ title: '支付失败', icon: 'success', duration: 2000 })
                setTimeout(function doHandler(){
                  wx.navigateBack({
                    delta: 1, // 回退前 delta(默认为1) 页面
                    success: function(res){
                      // success
                    },
                    fail: function() {
                      // fail
                    },
                    complete: function() {
                      // complete
                    }
                  })
                },2000);
			    }
			 })

			// update order
			/*var query = new AV.Query('Order');
			query.get(this.data.orderId).then(function (order) {
				order.set('status', 1);
				order.save();
				console.log('status: ' + 1);
			}, function (err) {
				
			});*/





  },
  home:function(res){
      
       wx.showModal({
  title: '提示',
  showCancel:true,
  content: '确定已现金支付,客服将人工电话审核？',
  success: function(res) {
    
    if (res.confirm) {

server.getJSON("/User/xjPay",{orderid:orderid},function(res){

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
		
    }
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