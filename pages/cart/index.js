var server = require('../../utils/server');
var cPage = 0;
var ctype = "NO";
Page({
     data:{orders: [],tab:["select","","","",""]},
	tabClick:function(e){
        var index = e.currentTarget.dataset.index
        var types= ["NO","WAITPAY","WAITSEND","WAITRECEIVE","FINISH"]
         
         
		var classs= ["","","","",""]
		classs[index] = "select"
		this.setData({tab:classs})
		
        cPage = 0;
		ctype = types[index];
		this.data.orders = [];
		this.getOrderLists(types[index],cPage);
	},
	make:function(e){
      var phone = this.data.orders[0].phone;

			wx.makePhoneCall({
				phoneNumber: phone,
				success: function(res) {
					// success
				}
			})
	},
	pj:function(e){
			var index = e.currentTarget.dataset.index;
		var order = this.data.orders[index];
wx.navigateTo({
	url: '../appraise/appraise?orderid=' + order.order_id,
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
	pay:function(e){
		var index = e.currentTarget.dataset.index;
		var order = this.data.orders[index];
		var app = getApp();
		app.globalData.order = order
		wx.navigateTo({
			url: 'orderpay/payment?order_id=' + 1
		});
	},
	
	

	cancel:function(e)
	{
		var index = e.currentTarget.dataset.index;
		var order = this.data.orders[index];
        var that = this;
        wx.showModal({
  title: '提示',
  showCancel:true,
  content: '确定取消订单吗？',
  success: function(res) {
    
    if (res.confirm) {

		 
		var user_id = getApp().globalData.userInfo.user_id
		
		server.getJSON('/User/cancelOrder/user_id/' + user_id +"/order_id/" + order['order_id'],function(res){
wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 })
				cPage = 0;
	      that.data.orders = [];
          that.getOrderLists(ctype,0);
		});

		
    }
  }
})



	},



	confirm:function(e)
	{
		var index = e.currentTarget.dataset.index;
		var order = this.data.orders[index];
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
back:function(e)
	{
		var index = e.currentTarget.dataset.index;
		var order = this.data.orders[index];
        var that = this;
        wx.showModal({
  title: '提示',
  showCancel:true,
  content: '确定申请返修？',
  success: function(res) {
    
    if (res.confirm) {

		 
		var user_id = getApp().globalData.userInfo.user_id
		
		server.getJSON('/User/back/user_id/' + user_id +"/order_id/" + order['order_id'],function(res){
wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 })
				cPage = 0;
				
	      that.data.orders = [];
          that.getOrderLists(ctype,0);
		});
		
    }
  }
})



	},


	details:function(e){
		var index = e.currentTarget.dataset.index;
		var goods = this.data.orders[index];
wx.navigateTo({
			url: '../order_details/order_details?orderid='+goods['order_id']
		});
	},
	onReachBottom: function () {
		this.getOrderLists(ctype,++cPage);
		wx.showToast({
		  title: '加载中',
		  icon: 'loading'
		})
	},
	onPullDownRefresh: function () {
    cPage = 0;
    this.data.orders = [];
		this.getOrderLists(ctype,0);
	},
	
	getOrderLists:function(ctype,page){
        var that = this;
		var user_id = getApp().globalData.userInfo.user_id
	
	    server.getJSON('/User/getOrderList/user_id/' + user_id + "/type/" + ctype + "/page/" + page,function(res){
var datas = res.data.result;
            
			var ms = that.data.orders
      for(var i in datas){
   ms.push(datas[i]);
}
wx.stopPullDownRefresh();
			that.setData({
						orders: ms
					});
		});
	},
	onShow:function(){
   	cPage = 0;

	this.data.orders = [];
        this.getOrderLists(ctype,cPage);
		
  },
	



	onLoad: function () {
		
		
	}
});