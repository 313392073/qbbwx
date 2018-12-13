var app = getApp();
Page({
  data: {
    imgArr: [],
    uploadimgArr: [],
    textareaVal: '',
    inputVal: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
  //问题和建议描述
  textareaVal: function (event) {
    this.setData({
      textareaVal: event.detail.value
    })
  },
  //联系电话
  inputVal: function (event) {
    this.setData({
      inputVal: event.detail.value
    })
  },
  //提交
  confirm: function () {
    var textareaVal = this.data.textareaVal;
    var inputVal = this.data.inputVal;
    var uploadimgArr = this.data.uploadimgArr;
    if (!textareaVal) {
      wx.showModal({
        title: '提示',
        content: '请填写您的问题和建议',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    if (inputVal) {
      if (!this.regularPhoneNumber(inputVal)) {
        wx.showModal({
          title: '提示',
          content: '手机号码格式不对',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        return false;
      }
    }


    wx.showToast({
      title: '提交中...',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: app.globalData.serverUrl + 'advise',
      data: {
        phone: inputVal,
        cont: textareaVal,
        img: uploadimgArr
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.error_code == 0) {
          wx.showModal({
            title: '提示',
            content: '提交成功，感谢您的问题和建议',
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
  },
  //判断手机号码是否正确
  regularPhoneNumber: function (str) {
    var s = str.replace(/\s|\-/g, '');
    if (s.indexOf("+86") == 0) {
      s = s.substr(3);
    }
    var d = /^1\d{10}$/g;
    if (d.test(s)) {
      return s;
    } else {
      return null;
    }
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