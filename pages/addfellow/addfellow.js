var app = getApp()
const promise = require('../../utils/promise.js');
Page({
  data: {
    friendName: null,
    addringpart:true,
    addbillpart:false
  },
  onLoad: function(e) {
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 3]; //上三个页面
    console.log(prevPage.route)
    var route = prevPage.route
    if (route == 'pages/detailring/detailring' || route=='pages/aboutdetailring/aboutdetailring'){
      this.setData({
        addringpart: false,
        addbillpart: true,
        circleId: e.circleId
      })
    }
  },
  //获取input输入的值
  getInput: function(e) {
    this.setData({
      friendName: e.detail.value
    })
  },
  //添加用户新好友
  addringpart: function() {
    console.log('新圈子')
    var value = this.data.friendName
    if (value == null || value == undefined || value == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请正确输入成员名！',
        showCancel: false,
        comfirmText: '确定'
      })
    } else {
      //发送请求并跳转
      var options = {
        userName: value
      }
      promise.getrequest('circle/circle/setUser', options).then( res => {
        // console.log(res);
        if (res.data.errmesg ='添加好友成功'){
          wx.showToast({
            title: '添加好友成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(function(){
           wx.redirectTo({
             url: '../fellow/fellow',
           })
          },1500)
        }else{
          wx.showToast({
            title: '添加好友失败',
            icon: 'success',
            duration: 1500
          })
        }
      })
    }
  },
  //仅在该圈子内添加新好友和用户好友表里面添加
  addbillpart:function(){
    console.log('圈内')
    var value = this.data.friendName
    if (value == null || value == undefined || value == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请正确输入成员名！',
        showCancel: false,
        comfirmText: '确定'
      })
    } else {
      //发送请求并跳转
      var options = {
        circleId: this.data.circleId,
        userName: value
      }
      promise.getrequest('circle/circle/setCircleUser', options).then(res => {
        console.log(res);
        var that = this
        if (res.data.errmesg = '添加好友成功') {
          wx.showToast({
            title: '添加好友成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(function () {
            // wx.redirectTo({
            //   // url: '../ringfellow/ringfellow?circleId=' + that.data.circleId + '&addfellow=' + true 
            //   url: '../aboutdetailring/aboutdetailring?circleId=' + that.data.circleId
            // })
            var pages = getCurrentPages(); // 当前页面
            var beforePage = pages[pages.length - 3]; // 前一个页面
            wx.navigateBack({
              delta: 2,
              success: function (e) {
                beforePage.onShow();
              }
            })
          }, 1500)
        }
      })
    }
  },
})