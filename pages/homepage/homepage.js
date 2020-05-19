const promise = require('../../utils/promise.js');
const app = getApp()

Page({
  data: {
    js_code:'',
  },
  onLoad: function (options) {
   
  },
  bindgetUserInfo:function(e){
    var userName = e.detail.userInfo.nickName
    var charImage = e.detail.userInfo.avatarUrl
    console.log(e)
    var that = this;
    promise.getcode().then(res=>{
      console.log(res)
      this.setData({
        js_code : res
      })
      return promise.getcookie('user/user/login', res, userName, charImage)
    }).then(res=>{
      console.log(res)
      var str = res.slice(0, -18);
      wx.setStorageSync('COOKIE', str);
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      if (prevPage.route=='pages/accounts/accounts'){
        wx.reLaunch({
          url: '../accounts/accounts',
        }) 
      }else{
        wx.reLaunch({
          url: '../my/my',
        }) 
      }
    })
  }
})