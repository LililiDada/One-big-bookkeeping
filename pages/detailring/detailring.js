var app = getApp()
const promise = require('../../utils/promise.js');
Page({

  data: {
    bill:{}
  },

  onLoad: function (e) {
    console.log(e)
    var options = {
      circleId: e.circleId,
    }
    promise.getrequest('circle/circle/getCircleDetail', options).then(res => {
      console.log(res)
      this.setData({
        categoryId: res.data[0].categoryId,
        circleId: e.circleId,
        circleName: res.data[0].circleName,
        image: res.data[0].image
      })
    })
  
    promise.getrequest('circle/circle/getCharge', options).then(res=>{
      console.log(res)
      var that = this
      if(res.data.errcode!=1001){
        that.setData({
          bill: res.data
        })
      }
     
    })

   
  },

  //添加圈子账单
  addTap:function(e){
    var chargeId= e.current
    wx.navigateTo({
      url: '../addbill/addbill?circleId=' + this.data.circleId,
    })
  },
  moreTap:function(){
    wx.navigateTo({
      url: '../aboutdetailring/aboutdetailring?circleId=' + this.data.circleId,
    })
  },

  //跳转至账单详情
  detailbillTap:function(e){
    var element = e.currentTarget.dataset
    if (element.categoryname=='清算收入'){
      wx.navigateTo({
        url: '../paystatus/paystatus?chargeId=' + element.chargeid + '&circleId=' + this.data.circleId + '&userName=' + element.remarks,
      }) 
    }else{
      wx.navigateTo({
        url: '../ringbilldetail/ringbilldetail?chargeId=' + element.chargeid + '&circleId=' + this.data.circleId,
      }) 
    }
  },
  onUnload: function () {
    wx.reLaunch({
      url: '../ring/ring'
    })
  }
})