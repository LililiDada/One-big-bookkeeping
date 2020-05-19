const app = getApp()
const promise = require('../../utils/promise.js');
Page({

  

  data: {
    avtarimg:'../../images/yonghu.png',
    username:'未登录',
    budgetMonry:"0.00",
    loginbtnShow :true,
    settingShow:false
  },

  fillBudget:function(){
    var that = this
    wx.navigateTo({
      url: '../monthbudget/monthbudget'
    })
  },
  quitTap:function(){
    var that = this
    wx.navigateTo({
      url: '../set/set?avtarimg=' + that.data.avtarimg + '&username=' + that.data.username,
    })
  },
  onLoad: function (options) {
    var that = this 
    promise.checkWxSession().then(res=>{
      if(res){
        return promise.getrequest('user/user/getUserInfo')
      }else{
        this.setData({
          loginbtnShow: true,
          settingShow: false
        })
      }
    }).then(res=>{
      console.log(res)
      if (res.data.errcode == 1001 && res.data.errmsg =='"未登录"'){
        that.setData({
          loginbtnShow: true,
          settingShow: false
        })
      }else{
        that.setData({
          avtarimg: res.data[0].charImage,
          username: res.data[0].userName,
          loginbtnShow: false,
          settingShow: true, 
        })
        return promise.getrequest('account/account/getBudget')
      }
      
    }).then(res=>{
      this.setData({
        budgetMonry: res.data[0].mouthlyBudget
      })
    })
  },
 onShow:function(){

 },
 
  onReady: function () {
    
  },
  
  loginTap:function(){
    //微信不处于登录态，跳转至登录页面登录
    wx.navigateTo({
      url: '../homepage/homepage'
    })
  }
})