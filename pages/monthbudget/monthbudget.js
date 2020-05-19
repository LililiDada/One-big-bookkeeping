const promise = require('../../utils/promise.js');
const app = getApp()
 
Page({
  data: {
    getInput: null
  },
  //获取input输入的值
  getInput: function (e) {
    this.setData({
      getInput: e.detail.value
    })
  }, 

  
  //点击确定按钮把数据传输到前一个页面并返回
  confirmTap:function(e){
    // var money = this.data.getInput
    // wx.setStorageSync('budget', money);
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var that = this;
    prevPage.setData({
      budgetMonry: that.data.getInput
    })
    var options = {
       budget: that.data.getInput,
    }
    var sum = parseInt(that.data.getInput);
    if (sum != null && sum != undefined && sum!=''){
      if (/^[0-9]+$/.test(sum)){
        promise.getrequest('account/account/setBudget', options)
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 800
        })
        //150毫秒后跳转回前一个页面
        setTimeout(function () {
          wx.navigateBack();
        }, 800)

      }else{
        wx.showModal({
          title: '温馨提示',
          content: '请输入有效的金额！',
          showCancel: false,
          comfirmText: '确定'
        })
      }
      
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '请输入有效的金额！',
        showCancel: false,
        comfirmText: '确定'
      })
    }
  

  },
  onLoad: function (options) {
    
  },


})