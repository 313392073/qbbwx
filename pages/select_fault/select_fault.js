var app = getApp();
var server = require('../../utils/server');
Page({
  data: {
    brand: '', //品牌
    model: '', //型号
    color: '', //颜色
    brandId: '',
    modelId: '',
    colorId: '',
    chooseFailureTitle: '', //选中的故障类型
    remark: '', //选中的故障类型备注
    chooseFailureindex: -1, //选中哪个故障类型
    chooseFailureList: '', //故障类型列表
    detailFailureList: '', //每种故障详情列表 
    combList: '', //组合列表
    chooseFailureArr: '', //故障类型列表
    detailFailureArr: '', //每种故障详情列表 
    combArr: '', //组合列表
    detailFailureFlag: true, //是否显示故障详情列表
    detailFailureOrtherFlag: true, //是否显示其他故障弹窗
    comFlag: true, //是否展开选中故障详情组合列表
    footerFlag: true, //是否显示底部
    footer_l_imgConFlag: false, //是否隐藏图片
    price: 0, //总维修价格
    combTampArr: [], //选中故障详情组合
    combTampNum: 0, //选中故障详情组合的长度
    imgArr: [], //故障上传图片数组
    uploadimgArr: [], //需要提交故障上传图片数组
    textareaVal: '', //其他故障描述
    otherRepairCombID:'',//其他故障组合id
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    // console.log(options);
    var that = this;
    that.setData({
      brand: options.brand,
      model: options.model,
      color: options.color,
      brandId: options.brandID,
      modelId: options.modelID,
      colorId: options.colorID,
      gimage:options.gimage
    });
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 0,
      mask: true
    });
    // console.log(options.brandID + '--' + options.modelID + "--" + options.colorID)
    //请求获取数据
server.getJSON("/Goods/getRepair",{id:options.modelID},function(res){
  var chooseFailureList = res.data.spec_list;
  that.setData({
          chooseFailureList: chooseFailureList
        });

});
    
   
     return;

    wx.request({
      url: app.globalData.serverUrl + 'getRepair',
      data: {
        brandId: options.brandID,
        modelId: options.modelID,
        colorId: options.colorID
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        var chooseFailureList = res.data.data.chooseFailureList;
        for (var i = 0; i < chooseFailureList.length; i++) {
          chooseFailureList[i].class = false; //默认都没有选中样式
          chooseFailureList[i].select_index = -1; //默认选中故障详情的索引为-1
        }
        var detailFailureList = res.data.data.detailFailureList;
        for (var j = 0; j < detailFailureList.length; j++) {
          detailFailureList[j].class = false;
        }
        that.setData({
          chooseFailureList: chooseFailureList,
          detailFailureList: detailFailureList,
          combList: res.data.data.combList
        });

        wx.hideToast();
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  
  //选择故障类型
  select_chooseFailureList: function (event) {

    var ChooseFailureid = event.target.dataset.id; //故障类型id
    var sub_index = event.target.dataset.sub_index;
    var num = event.target.dataset.num;
    var text = event.target.dataset.text;
    var remark = event.target.dataset.remark;

    //查找符合条件的故障详情放到临时数组里面
    var ArrTemp = [];
    ArrTemp = this.data.chooseFailureList[num].spec_item;

    var  chooseFailureList = this.data.chooseFailureList; 
    

    for (var i = 0, len = chooseFailureList.length; i < len; i++) {
      //chooseFailureList[num].class = false;
    }
    //chooseFailureList[num].class = true;
    this.setData({chooseFailureList:chooseFailureList});


    /*var detailFailureList = this.data.detailFailureList;
    for (var i = 0, len = detailFailureList.length; i < len; i++) {
      if (sub_index == detailFailureList[i].sub_index) {
        ArrTemp.push(detailFailureList[i]);
      }
    }

    //查询选择的故障类型对应有没有选中过故障详情
    var chooseFailureList = this.data.chooseFailureList;
    var select_index = chooseFailureList[num].select_index;
    // console.log(select_index)
    if (select_index > -1) {
      for (var j = 0; j < ArrTemp.length; j++) {
        if (j == select_index) {
          ArrTemp[j].class = true;
          ArrTemp[j].ChooseFailureid = ChooseFailureid;
        }
        else {
          ArrTemp[j].class = false;
           ArrTemp[j].ChooseFailureid = ChooseFailureid;
        }
      }
    } else {
      for (var j = 0; j < ArrTemp.length; j++) {
        ArrTemp[j].class = false;
         ArrTemp[j].ChooseFailureid = ChooseFailureid;
      }
    }
*/
    this.setData({
      chooseFailureTitle: text, //选中的故障类型
      remark: remark, //选中的故障类型备注 
      detailFailureArr: ArrTemp, //故障详情列表
      chooseFailureindex: num //当前选中的故障索引
    });
    if (text == "其他故障") {
      var otherRepairCombID = '';
      var otherChooseFailureid = '';
      var detailFailureList = this.data.detailFailureList;
      for (var i = 0, len = detailFailureList.length; i < len; i++) {
        if (sub_index == detailFailureList[i].sub_index) {
          otherRepairCombID = detailFailureList[i].repairCombID;
          otherChooseFailureid = detailFailureList[i].ChooseFailureid;
          console.log(detailFailureList[i].repairCombID)
        }
      }
      this.setData({
        detailFailureOrtherFlag: false, //是否显示故障详情列表
        otherRepairCombID:otherRepairCombID,
        otherChooseFailureid:otherChooseFailureid
      })
    } else {
      this.setData({
        detailFailureFlag: false, //是否显示故障详情列表
      })
    }
  },
  //选择故障详情
  select_detailFailur: function (event) {
    var sub_index = event.target.dataset.sub_index;
    var repairCombID = event.target.dataset.repaircombid;
    var num = event.target.dataset.num;
    var text = event.target.dataset.text;
    var grade = event.target.dataset.grade;
    var ChooseFailureid = event.target.dataset.choosefailureid;

    //样式切换
    var detailFailureArr = this.data.detailFailureArr;
    for (var i = 0; i < detailFailureArr.length; i++) {
      if (i == num) {
        if (detailFailureArr[num].class) { //已选中
          var combTampArr = this.data.combTampArr;
          for (var j = 0; j < combTampArr.length; j++) {
            if (combTampArr[j].sub_index == sub_index) { //找到所属的类别删除
              combTampArr.splice(j, 1);
            }
          }
        } else { //未选中
          //选择故障详情添加到选中故障详情组合数组
          var combTampArr = this.data.combTampArr;
          if (combTampArr.length) { //是否有数据
            var flag = true;
            for (var k = 0; k < combTampArr.length; k++) {
              if (combTampArr[k].sub_index == sub_index) { //找到所属的类别更换
                combTampArr[k] = {
                  sub_index: sub_index,
                  repairCombID: repairCombID,
                  num: num,
                  text: text,
                  grade: grade,
                  ChooseFailureid:ChooseFailureid
                }
                flag = false;
              }
            }
            if (flag) { //没找到所属类别直接添加
              combTampArr.push({
                sub_index: sub_index,
                repairCombID: repairCombID,
                num: num,
                text: text,
                grade: grade,
                ChooseFailureid:ChooseFailureid
              })
            }
          } else { //没有数据直接添加
            combTampArr.push({
              sub_index: sub_index,
              repairCombID: repairCombID,
              num: num,
              text: text,
              grade: grade,
              ChooseFailureid:ChooseFailureid
            })
          }
        }
        detailFailureArr[num].class = !detailFailureArr[num].class;

      } else {
        detailFailureArr[i].class = false;
      }
    }

    //修改已选中故障详情的索引
    var chooseFailureList = this.data.chooseFailureList;
    var chooseFailureindex = this.data.chooseFailureindex;
    var flag_1 = true;
    for (var j = 0; j < detailFailureArr.length; j++) {
      if (detailFailureArr[j].class) {
        chooseFailureList[chooseFailureindex].select_index = j;
        flag_1 = false;
      }
    }
    if (flag_1) {
      chooseFailureList[chooseFailureindex].select_index = -1;
    }

    this.setData({
      combTampArr: combTampArr,
      detailFailureArr: detailFailureArr,
      chooseFailureList: chooseFailureList
    })
  },
  // 取消
  cancel: function () {
    var combTampArr = this.data.combTampArr;
    var combTampNum = this.data.combTampNum;
    if (combTampArr.length == combTampNum) { //相等，则没有选中故障详情

    } else {
      combTampArr.pop(); //删除并返回数组的最后一个元素
    }

    this.setData({
      detailFailureFlag: true,
      combTampNum: combTampArr.length,
      combTampArr: combTampArr
    })
  },
  //确定
  confirm: function () {
    var combTampArr = this.data.combTampArr;
    var chooseFailureList = this.data.chooseFailureList;
    var chooseFailureindex = this.data.chooseFailureindex;

    //查找符合条件的故障详情放到临时数组里面
    var ArrTemp = [];
    var detailFailureArr = this.data.detailFailureArr;
    for (var i = 0, len = detailFailureArr.length; i < len; i++) {
      if (chooseFailureList[chooseFailureindex].sub_index == detailFailureArr[i].sub_index) {
        ArrTemp.push(detailFailureArr[i]);
      }
    }

    var classFlag = true;
    for (var k = 0; k < ArrTemp.length; k++) {
      if (ArrTemp[k].class) {
        chooseFailureList[chooseFailureindex].class = true;
        chooseFailureList[chooseFailureindex].select_index = k;
        classFlag = false;
      }
    }
    if (classFlag) {
      chooseFailureList[chooseFailureindex].class = false;
      chooseFailureList[chooseFailureindex].select_index = -1;
    }
    // console.log(chooseFailureList[chooseFailureindex].class)


    var combTampArr = [];

    var chooseFailureList = this.data.chooseFailureList;

    for (var i = 0; i < chooseFailureList.length; i++) {
          
        if(chooseFailureList[i].select_index != -1){
                combTampArr.push(chooseFailureList[i].spec_item[chooseFailureList[i].select_index]);
        }

     
          //chooseFailureList[i].select_index = -1; //默认选中故障详情的索引为-1
        }




    this.setData({
      chooseFailureList: chooseFailureList,
      detailFailureFlag: true,
      combTampArr:combTampArr,
      combTampNum: combTampArr.length
    })

    //是否显示底部和统计维修价格
    if (combTampArr.length) {
      //统计维修价格
      this.price();
      this.setData({
        footerFlag: false
      })
    } else {
      this.setData({
        footerFlag: true
      })
    }
  },
  //切换显示隐藏选中故障详情列表
  taggleCom: function () {

    var combTampArr = [];

    var chooseFailureList = this.data.chooseFailureList;

    for (var i = 0; i < chooseFailureList.length; i++) {
          
        if(chooseFailureList[i].select_index != -1){
                combTampArr.push(chooseFailureList[i].spec_item[chooseFailureList[i].select_index]);
        }

     
          //chooseFailureList[i].select_index = -1; //默认选中故障详情的索引为-1
        }



    this.setData({combTampArr:combTampArr,
      footer_l_imgConFlag: !this.data.footer_l_imgConFlag
    })
  },
  //删除某个选中故障详情
  del: function (event) {
    var index = event.target.dataset.index;


    var chooseFailureList = this.data.chooseFailureList;

    var pos = 0;
    for (var i = 0; i < chooseFailureList.length; i++) {
          
        if(chooseFailureList[i].select_index != -1){
                if(pos == index){
chooseFailureList[i].select_index = -1;
chooseFailureList[i].class = false;
pos++;
                }
                else
                pos++;
        }

     
          //chooseFailureList[i].select_index = -1; //默认选中故障详情的索引为-1
        }
this.setData({chooseFailureList:chooseFailureList});


var combTampArr = [];

    //var chooseFailureList = this.data.chooseFailureList;

    for (var i = 0; i < chooseFailureList.length; i++) {
          
        if(chooseFailureList[i].select_index != -1){
                combTampArr.push(chooseFailureList[i].spec_item[chooseFailureList[i].select_index]);
        }

     
          //chooseFailureList[i].select_index = -1; //默认选中故障详情的索引为-1
        }



    this.setData({combTampArr:combTampArr
    })

this.price();

    return;
    var combTampArr = this.data.combTampArr;
    var chooseFailureList = this.data.chooseFailureList;

    var otherFlag = false;
    //删除故障详情数组中的元素
    for (var j = 0; j < combTampArr.length; j++) {
      if (combTampArr[j].sub_index == sub_index) { //找到所属的类别删除   
        if (combTampArr[j].other) { //是否是其他故障
          otherFlag = true;
        }
        combTampArr.splice(j, 1);
      }
    }
    //删除故障类型样式
    for (var i = 0; i < chooseFailureList.length; i++) {
      if (chooseFailureList[i].sub_index == sub_index) {
        chooseFailureList[i].class = false;
        chooseFailureList[i].select_index = -1;
      }

      if (otherFlag) { //取消其他故障选中样式和删除其他故障信息
        chooseFailureList[sub_index].class = false;
        this.setData({
          imgArr: [],
          uploadimgArr: [],
          textareaVal: ''
        })
      }
    }
    //统计维修价格
    this.price();
    this.setData({
      combTampArr: combTampArr,
      combTampNum: combTampArr.length,
      chooseFailureList: chooseFailureList
    })
    if (!combTampArr.length) {
      this.taggleCom();
      this.setData({
        footerFlag: true
      })
    }
  },
  //统计维修价格
  price: function () {
    var combTampArr = this.data.chooseFailureList;
    var price = 0;
    for (var l = 0; l < combTampArr.length; l++) {
      if (combTampArr[l].select_index == -1) { //如果有其他故障
        continue;
      }
      price = price + parseFloat(combTampArr[l].spec_item[combTampArr[l].select_index].price);
    }
    this.setData({
      price: price
    })
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
          url: "https://service.505coder.com/index.php/Api/Goods/" + 'upload',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          
          success: function (res) {
            // console.log("上传图片")
            var data = JSON.parse(res.data);
            if (data.status == 1) { //成功
              //添加到图片数组
              imgArr.push(tempFilePaths[0]);
              uploadimgArr.push(data.msg)
              that.setData({
                imgArr: imgArr,
                uploadimgArr: uploadimgArr
              })
            } else {
              wx.showToast({
                title: data.msg+"",
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
  //故障图片上传确定
  otherConfirm: function () {
    var textareaVal = this.data.textareaVal;
    var imgArr = this.data.imgArr;
    var chooseFailureList = this.data.chooseFailureList;
    var chooseFailureindex = this.data.chooseFailureindex;
    var combTampArr = this.data.combTampArr;
    //显示隐藏故障类型选中样式
    if (imgArr.length || textareaVal) {
      chooseFailureList[chooseFailureindex].class = true;

      //判断是否已添加其他故障
      var otherFlag = true;
      for (var i = 0; i < combTampArr.length; i++) {
        if (combTampArr[i].other == 'other') {
          otherFlag = false;
        }
      }
      if (otherFlag) {
        combTampArr.push({
          sub_index: chooseFailureindex,
          text: '其它故障',
          grade: '暂无报价',
          other: 'other',
          repairCombID:this.data.otherRepairCombID,
          ChooseFailureid:this.data.otherChooseFailureid
        })
      }

    } else {
      chooseFailureList[chooseFailureindex].class = false;
      for (var i = 0; i < combTampArr.length; i++) {
        if (combTampArr[i].other == 'other') {
          combTampArr.splice(i, 1);
        }
      }
    }

    this.setData({
      detailFailureOrtherFlag: true,
      chooseFailureList: chooseFailureList,
      combTampArr: combTampArr,
      combTampNum: combTampArr.length
    })

    //是否显示底部和统计维修价格

    console.log(JSON.stringify(combTampArr))
    if (combTampArr.length) {
      //统计维修价格
      this.price();
      this.setData({
        footerFlag: false
      })
    } else {
      this.setData({
        footerFlag: true
      })
    }
  },
  previewImage: function (event) {
    wx.previewImage({
      current: event.target.dataset.url, // 当前显示图片的http链接
      urls: [event.target.dataset.url] // 需要预览的图片http链接列表
    })
  },
  //其他故障描述
  textareaVal: function (event) {
    this.setData({
      textareaVal: event.detail.value
    })
  },
  //下一步
  next: function () {
    // var comIds = [];
    // var combTampArr = this.data.combTampArr;
    // for (var i = 0; i < combTampArr.length; i++) {
    //   comIds.push(combTampArr[i].repairCombID)
    // }
    this.price();
    
    var ArrTemp = [];
    var chooseFailureList = this.data.chooseFailureList;

    for (var i = 0; i < chooseFailureList.length; i++) {
          
        if(chooseFailureList[i].select_index != -1){
                ArrTemp.push(chooseFailureList[i].spec_item[chooseFailureList[i].select_index]);
        }

          //chooseFailureList[i].select_index = -1; //默认选中故障详情的索引为-1
        }


    var data = {
      textareaVal:this.data.textareaVal,
      gimage:this.data.gimage,
      brand: this.data.brand,
      model: this.data.model,
      color:this.data.color,
      brandID: this.data.brandId,
      modelID: this.data.modelId,
      colorID: this.data.colorId,
      combTampArr: ArrTemp,
      imgArr: this.data.imgArr,
      userUploadImgs: this.data.uploadimgArr,
      price:this.data.price,
      serverAddress:'请选择服务地址',
      timeStr:'请选择上门时间',
      payPrice:0,
      couponPrice:0,
      couponName:'',
      couponID:"0",
      couponName:""
    }
    console.log(data)
    //保存下单对象信息到本地 
    try {
        wx.setStorageSync('order_data', data)
    } catch (e) {    
      console.log("select_fault页面的存储本地数据catch")
      console.log(e)
    }
    //带参数跳转到选择故障页面
    wx.redirectTo({
      url: '../fillout_order/fillout_order'
    });
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '', // 分享标题
      desc: '', // 分享描述
      path: '' // 分享路径
    }
  }
})