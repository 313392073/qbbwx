var server = require('../../utils/server');
var store_id = 0;
Page({
  data:{showVerifyPhone:false},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id;
    if(options.store_id != undefined)
      store_id = options.store_id;
      else{
        store_id = 0;
      getApp().globalData.storeInfo1 = undefined;
      }


      getApp().globalData.store_id = store_id;
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var windowHeight = res.windowHeight;
        var windowWidth = res.windowWidth;
        var marginHeight = windowWidth / 750 * 30;
        var silderHieght = windowHeight - marginHeight;
        that.setData({silderHieght:silderHieght});

      }
    })

    var that = this;
    //goodsCategoryList
    server.getJSON("/Goods/goodsCategoryList", { store_id: store_id},function(res){
      var result = res.data.result;

      if(result[0].ptype)
      result[0].ptype[0].select = "select";

var index = 0;
if(id != 0){


  var categorys = result;
       for(var i = 0; i< categorys.length;i++){
         categorys[i].active = "";
         if(id == categorys[i].id){
           categorys[i].active = "active";
           index = i ;
         }
       }
       if(categorys[index].ptype)
       for(var i = 0; i< categorys[index].ptype.length;i++){

         if(i == 0)
             categorys[index].ptype[0].select = "select";
         else categorys[index].ptype[i].select = "";
       }

result = categorys;
  
}


      that.setData({categorys:result,index:index,tindex:"0"});

      that.getGoods(index,0);

    });
  },
 goods:function(res){
   var index = res.currentTarget.dataset.index;
      
this.setData({showVerifyPhone:true,gindex:index});
 },
 cselect:function(res){
   var index = res.currentTarget.dataset.index;
   var gindex = this.data.gindex;
   var goods = this.data.goods;
       for(var i = 0; i< goods[gindex].colors.length;i++){
         goods[gindex].colors[i].select = "";
       }
goods[gindex].colors[index].select = "cselect";
   this.setData({cindex:index,goods:goods});
 },
  getGoods:function(index,tindex){
    var cid = this.data.categorys[index].id;
    var ptype = this.data.categorys[index].ptype[tindex].id;
var that = this;
//var store_id = 0;
      server.getJSON("/Goods/getGoods",{cid:cid,ptype:ptype,store_id:store_id},function(res){
      var result = res.data.result;
      that.setData({goods:result});

      });
  },
  showVerifyPhone:function(res){
     
this.setData({showVerifyPhone:false});
  },
  category:function(res){
       var index = res.currentTarget.dataset.index;
       //wx.showToast({title:index+""});
       var categorys = this.data.categorys;
       for(var i = 0; i< categorys.length;i++){
         categorys[i].active = "";
       }
       if(categorys[index].ptype)
       for(var i = 0; i< categorys[index].ptype.length;i++){

         if(i == 0)
             categorys[index].ptype[0].select = "select";
         else categorys[index].ptype[i].select = "";
       }
       
       categorys[index].active="active";
       this.setData({"goods":[],categorys:categorys,index:index,tindex:"0"});

       this.getGoods(index,0);

         },
  select:function(res){
       var index = res.currentTarget.dataset.index;
       var pindex = this.data.index;
       var categorys = this.data.categorys;
       for(var i = 0; i< categorys[pindex].ptype.length;i++){
         categorys[pindex].ptype[i].select = "";
       }

       categorys[pindex].ptype[index].select="select";
       this.setData({"goods":[],categorys:categorys,tindex:index});
       this.getGoods(pindex,index);
         },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  next:function(res){


    
   var gindex = this.data.gindex;
   var goods = this.data.goods;
   var go = false;
       for(var i = 0; i< goods[gindex].colors.length;i++){

         if(goods[gindex].colors[i].select == "cselect")
            go = true;
       }

  if(!go){
    wx.showToast({title:"请选择颜色"});
  }


    var index = this.data.index;
    var tindex = this.data.tindex;
    var gindex = this.data.gindex;
    var cindex = this.data.cindex;
    var gimage = this.data.goods[gindex].image;
    var brand = this.data.categorys[index].mobile_name;
    var brandId = this.data.categorys[index].id;

    var model = this.data.goods[gindex].mobile_name;
    var modelId = this.data.goods[gindex].id;

    var color = this.data.goods[gindex].colors[cindex].name;
    var colorId = this.data.goods[gindex].colors[cindex].id;


    wx.navigateTo({
      url: '../select_fault/select_fault?brand='+brand+"&model="+model+"&color="+color+"&brandID="+brandId+"&modelID="+modelId+"&colorID="+colorId+"&gimage="+gimage,
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

  }
})