var app = getApp()
const promise = require('../../utils/promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasSelect: '../../images/selectring.png',
    noSelect: '../../images/circle.png',
    type: {},
    allAmount: 0
  },
  onLoad: function(e) {
    if (e.allAmount) {
      this.setData({
        allAmount: e.allAmount
      })
    }
    console.log(e)
    var options = {
      circleId: e.circleId
    }
    promise.getrequest('circle/circle/getChargeFriend', options).then(res => {
      console.log(res)
      var friends = []
      for (var i in res.data) {
        if (res.data[i].userId == e.userId) {
          var temp = {
            userId: res.data[i].userId,
            userName: res.data[i].userName,
            status: true
          }
        } else {
          var temp = {
            userId: res.data[i].userId,
            userName: res.data[i].userName,
            status: false
          }
        }

        friends.push(temp)
      }
      this.setData({
        type: friends,
      })


    })
  },
  checkTap: function(e) {
    console.log(e)
    var userId = e.currentTarget.dataset.userid;
    var selectStatus = this.data.type;
    for (var i in selectStatus) {
      if (selectStatus[i].userId == userId) {
        selectStatus[i].status = true;
      } else {
        selectStatus[i].status = false
      }
    }
    this.setData({
      type: selectStatus //将已改变属性的json数组更新
    })

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var that = this;
    var allParticipant = prevPage.data.allParticipant
    var userid = e.currentTarget.dataset.userid
    var participant = prevPage.data.participant
    var result = participant.some(function(item) {
      if (item.userId == userid) {
        return true;
      }
    })
    if (result == false) {
      var amount = that.data.allAmount / (allParticipant.length + 1)
      var part = []
      for (var i in allParticipant) {
        var t = {
          userId: allParticipant[i].userId,
          userName: allParticipant[i].userName,
          money: amount
        }
        part.push(t)
      }
      var tem = {
        userId: userid,
        userName: e.currentTarget.dataset.username,
        money: amount
      }
      part.push(tem)
    }else{
      part= allParticipant;
    }
    console.log(part)
    var payer = {
      userId: userid,
      userName: e.currentTarget.dataset.username,
    }
    if (allParticipant.length > 6) {
      var smlpart = []
      for (var i = 0; i <= 5; i++) {
        smlpart.push(part[i])
      }
      prevPage.setData({
        payer: payer,
        allParticipant: part,
        participant: smlpart,
        allCount:part.length
      })
    } else {
      prevPage.setData({
        payer: payer,
        allParticipant: part,
        participant: part,
        allCount: part.length
      })
    }

    //500毫秒后跳转回前一个页面
    setTimeout(function() {
      wx.navigateBack();
    }, 800)

  },
})