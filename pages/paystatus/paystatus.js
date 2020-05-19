var app = getApp()
const promise = require('../../utils/promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)
    // this.setData({
    //   saId
    // })
    var options={
      chargeId: e.chargeId,
      userName: e.userName
    }
    promise.getrequest('circle/circle/chargeDetail',options).then(res=>{
      console.log(res.data[0])
      var data = res.data[0]
      this.setData({
        averageAmount: data.averageAmount,
        circleId: data.circleId,
        date: data.date,
        payer: data.payer,
        userName: data.userName
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  
})