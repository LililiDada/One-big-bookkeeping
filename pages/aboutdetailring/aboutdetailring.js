var app = getApp()
const promise = require('../../utils/promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function(e) {
    console.log(e)
    this.setData({
      circleId: e.circleId
    })
    var options = {
      circleId: e.circleId
    }
    promise.getrequest('circle/circle/getCircleFriend',options).then(res=>{
      console.log(res)
      var part = []
      for(var i in res.data){
        var userName = res.data[i].userName
        if (userName.length >= 3) {
          userName = userName.substring(0, 2) + "...";
        }
        var temp={
          userName: userName
        }
        part.push(temp)
      }
      this.setData({
        part:part
      })
    })
  },
  //编辑圈子，将成员号传递过去，并将其selected变为true,和圈子类型id传过去，将图标定位到此，并绑定圈子名以便修改。
  editringTap: function() {
    wx.navigateTo({
      url: '../addring/addring?circleId=' + this.data.circleId,
    })
  },
  //删除圈子
  deltringTap: function() {
    var that = this
    wx.showModal({
      //title: '删除账单',
      content: '确定要删除该圈？',
      showCancel: true, //是否显示取消按钮
      cancelText: "否", //默认是“取消”
      confirmText: "是", //默认是“确定”
      success: function(res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          var options={
            circleId: that.data.circleId
          }
          promise.getrequest('circle/circle/deleteCircle',options).then(res => {
            if (res.data.errcode == 1001 && res.data.errmsg =='还有清账信息'){
              wx.showModal({
                title: '温馨提示',
                content: '无法删除该圈子，还有账单未清算！',
                showCancel:false,
                success(res) {
                  wx.reLaunch({
                    url: '../ring/ring',
                  })
                }
              })
            }else{
              wx.showToast({
                title: '删除成功', //提示文字
                duration: 1000, //显示时长
                mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                icon: 'success', //图标，支持"success"、"loading"  
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../ring/ring',
                })
              }, 1000)
            }
           
          })

        }
      }
    })
  },
  //添加圈子内好友
  addfellowTap:function(){
    wx.navigateTo({
      url: '../ringfellow/ringfellow?addfellow=' + true + '&circleId=' + this.data.circleId,
    })
  },
  //删除圈子内好友
  deletefellowTap:function(){
    wx.navigateTo({
      url: '../ringfellow/ringfellow?deletefellow=' + false + '&circleId=' + this.data.circleId,
    })
  },
  onShow:function(){
    var options={
      circleId: this.data.circleId
    }
    promise.getrequest('circle/circle/getCircleFriend', options).then(res => {
      console.log(res)
      var part = []
      for (var i in res.data) {
        var userName = res.data[i].userName
        if (userName.length >= 3) {
          userName = userName.substring(0, 2) + "...";
        }
        var temp = {
          userName: userName
        }
        part.push(temp)
      }
      this.setData({
        part: part
      })
    })
  }
})