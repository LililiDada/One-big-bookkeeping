const promise = require('../../utils/promise.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginbtnShow:false
  },

   //如果返回数据的用户名或头像为空，设置loginbtnShow:true
  onLoad: function (options) {
    var that = this ;
    console.log(options);
    this.setData({
      avtarimg:that.options.avtarimg,
      username: that.options.username,
    })
  },
  quitLoginTap:function(){
    wx.showLoading({
      title: '退出登录中',
    })
    promise.getrequest('user/user/signOut').then(res=>{
      if (res.data.errcode == 1000 && res.data.errmsg=='退出成功'){
        wx.hideLoading();
        wx.removeStorageSync('COOKIE');
        wx.reLaunch({
          url: '../home/home'
        })
      }
    })
  }
})