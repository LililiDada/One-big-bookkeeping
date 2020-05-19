var app = getApp()
const promise = require('../../utils/promise.js');

var date = new Date()
var year = date.getFullYear()
var month = date.getMonth() + 1
var day = date.getDate()
if (month < 10) {
  var months = month.toString();
  month = '0' + months
}
if (day < 10) {
  var days = day.toString();
  day = '0' + days
}

var currentDate = year + '-' + month + '-' + day;


Page({
  data: {
    date: currentDate,
    year: year,
    month: month,
    day: day,
    remarks: '',
    type: {},
    currentType: 0,
    payer: {},
    participant: {},
    allParticipant: {},
    morefiveShow: true,
    allAmount:0
  },

  onLoad: function (e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    console.log(prevPage.route)
    var that = this
    
    promise.getrequest('account/category/getCategory').then(res => {
      var category = [];
      for (var idx in res.data[0].category) {
        var subject = res.data[0].category[idx];
        var temp = {
          categoryId: subject.categoryId,
          title: subject.categoryName,
          imgsrc: subject.image
        }
        if (subject.sort == '支出') {
          category.push(temp);
        }
      }
      if (prevPage.route == 'pages/detailring/detailring') {
        this.setData({
          type: category,
          categoryId: 1
        })
      } else {
        //修改支出类型的选中
        for (var i in category) {
          if (e.categoryId == category[i].categoryId) {
            that.setData({
              currentType: i,
            })
          }
        }
        this.setData({
          type: category,
          categoryId: e.categoryId
        })
      }

    })

    //创建新圈子里的账单
    if (prevPage.route == 'pages/detailring/detailring') {
      that.setData({
        circleId: e.circleId,
      })
      var options = {
        circleId: e.circleId,
      }
      promise.getrequest('circle/circle/getChargeFriend', options).then(res => {
        console.log(res.data)
        //获取第一个为付款人
        var payer
        for (var i in res.data) {
          payer = {
            userId: res.data[i].userId,
            userName: res.data[i].userName,
            money: ''
          }
          break;
        }
        //获取前五个参与人
        var participant = [];
        var count = 0
        for (var idx in res.data) {
          count++;
          var temp = {
            userId: res.data[idx].userId,
            userName: res.data[idx].userName,
            money: ''
          }
          participant.push(temp);
          if (count > 6) {
            break;
          }
        }
        //获取所有的参与者
        var allParticipant = []
        for (var i in res.data) {
          var temp = {
            userId: res.data[i].userId,
            userName: res.data[i].userName,
            money: ''
          }
          allParticipant.push(temp)
        }
        //获取总人数
        var allCount = 0;
        for (var i in res.data) {
          allCount++;
        }
        this.setData({
          allParticipant: allParticipant, //所有参与人
          payer: payer, //默认第一个为付款人
          participant: participant, //列表渲染前五个参与人
          allCount: allCount,
        })
        // if (allCount > 5) {
        //   this.setData({
        //     morefiveShow: true
        //   })
        // }
      })

    }
    //修改圈子账单
    if (prevPage.route == 'pages/ringbilldetail/ringbilldetail') {
      wx.setNavigationBarTitle({
        title: '修改账单'
      })
      console.log(e)

      var options = {
        chargeId: e.chargeId
      }
      promise.getrequest('circle/circle/getChargeDetail', options).then(res => {
        console.log(res.data[0])
        var date = res.data[0].date
        var month = date.slice(5, 7)
        var day = date.slice(8, 10)
        var payer = {
          userId: res.data[0].userId,
          userName: res.data[0].userName,
          money: res.data[0].allAmount
        }
        that.setData({
          payer: payer,
          date: date,
          month: month,
          day: day,
          remarks: res.data[0].remarks,
          chargeId: e.chargeId,
          categoryId: res.data[0].categoryId,
          circleId: res.data[0].circleId,
          allAmount: res.data[0].allAmount
        })
      })
      //获取参与人
      var option = {
        circleId: e.circleId,
        chargeId: e.chargeId,
      }
      promise.getrequest('circle/circle/reviseChargeFriend', option).then(res => {
        //获取参与人
        console.log(res)
        var participant = []
        var count = 0
        for (var i in res.data) {
          if (res.data[i].status == true) {
            count++;
            var temp = {
              userId: res.data[i].userId,
              userName: res.data[i].userName,
              money: e.averageAmount
            }
            participant.push(temp);
          }
          if (count > 6) {
            break;
          }
        }

        //获取所有的参与者
        var allParticipant = []
        var allCount = 0; //获取总人数
        for (var i in res.data) {
          if (res.data[i].status == true) {
            allCount++
            var temp = {
              userId: res.data[i].userId,
              userName: res.data[i].userName,
              money: e.averageAmount
            }
            allParticipant.push(temp)
          }
        }
        this.setData({
          allParticipant: allParticipant, //所有参与人
          participant: participant, //列表渲染前五个参与人
          allCount: allCount,
          circleId: e.circleId
        })
        if (allCount > 5) {
          this.setData({
            morefiveShow: true
          })
        }
      })
    }
  },
  typeTap: function (e) {
    var element = e.currentTarget.dataset;
    this.setData({
      currentType: element.index,
      categoryId: element.categoryid
    })
  },

  //选取付款人
  selectTap: function () {
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    if (prevPage.route == "pages/ringbilldetail/ringbilldetail") {
      wx.navigateTo({
        url: '../selectpayer/selectpayer?circleId=' + this.data.circleId + '&userId=' + this.data.payer.userId + '&chargeId=' + this.data.chargeId + '&allAmount=' + this.data.allAmount
      })
    } else {
      wx.navigateTo({
        url: '../selectpayer/selectpayer?circleId=' + this.data.circleId + '&userId=' + this.data.payer.userId,
      })
    }
  },
  //选择参与人
  participantTap: function () {
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    if (prevPage.route == "pages/ringbilldetail/ringbilldetail") {
      wx.navigateTo({
        url: '../participant/participant?circleId=' + this.data.circleId + '&chargeId=' + this.data.chargeId + '&allAmount=' + this.data.allAmount + '&payerId=' + this.data.payer.userId + '&payerName=' + this.data.payer.userName
      })
    } else {
      wx.navigateTo({
        url: '../participant/participant?circleId=' + this.data.circleId + '&allAmount=' + this.data.allAmount + '&payerId=' + this.data.payer.userId + '&payerName=' + this.data.payer.userName,
      })
    }

  },
  //获取总金额和实时计算平均金额
  moneyChange: function (e) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var that = this
    var totalmoney = e.detail.value
    // if (regPos.test(totalmoney)) {
    var part = this.data.participant
    var allpart = this.data.allParticipant
    var allCount = this.data.allCount
    var sum = this.data.payer.money
    var totalsum = this.data.allAmount
    var averMoney = (totalmoney / allCount).toFixed(2)
    //实时展现页面前五个人展现的金额
    var people = []
    for (var i = 0; i < part.length; i++) {
      var temp = {
        useId: part[i].userId,
        userName: part[i].userName,
        money: averMoney
      }
      people.push(temp)
    }

    //修改参与人应付的金额
    var allpeople = []
    for (var i = 0; i < allpart.length; i++) {
      var temp = {
        userId: allpart[i].userId,
        userName: allpart[i].userName,
        money: averMoney
      }
      allpeople.push(temp)
    }
    this.setData({
      participant: people,
      allParticipant: allpeople,
      'payer.money': totalmoney,
      allAmount: totalmoney,

    })
    // } else {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '请输入有效金额！',
    //     showCancel: false
    //   })
    // }

  },
  //修改日期
  bindDateChange: function (e) {
    const str = e.detail.value
    const monthstr = str.substring(5, 7);
    const daystr = str.substring(8, 11);
    this.setData({
      date: str,
      day: daystr,
      month: monthstr
    })
  },
  //获得备注
  getRemark: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },

  addbill: function () {
    var that = this

    // var tatalmoney = that.data.payer.money
    var tatalmoney = that.data.allAmount
    if (tatalmoney == '' || tatalmoney == undefined) {
     console.log(that.data.allParticipant)
      wx.showModal({
        title: '温馨提示',
        content: '请输入付款金额！',
        showCancel: false
      })
    } else {
      //获取参与人的付款金额和id号
      var allpeople = []
      var allpart = that.data.allParticipant
      for (var i = 0; i < allpart.length; i++) {
        var temp = {
          userId: allpart[i].userId,
          money: parseFloat(allpart[i].money),
        }
        allpeople.push(temp)
      }
      var pages = getCurrentPages()
      var currPage = pages[pages.length - 1] //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      if (prevPage.route == "pages/ringbilldetail/ringbilldetail") {
        var options = {
          chargeId: that.data.chargeId,
          categoryId: that.data.categoryId,
          money: tatalmoney,
          day: that.data.date,
          remarks: that.data.remarks,
          user: {
            userId: that.data.payer.userId,
            // money: parseFloat(that.data.payer.money)
            money: tatalmoney
          },
          usersId: allpeople
        }
        promise.getrequest('circle/circle/reviseCharge', options).then(res => {
          // console.log(res)
          if (res.data.errmsg == "该交易存在已清算状态") {
            wx.showModal({
              title: '温馨提示',
              content: '该交易存在已清算状态，不能修改！',
              showCancel: false,
              success: function (res) {
                wx.navigateBack({
                  delta: 2
                })
              }
            })
          } else {
            wx.redirectTo({
              url: '../detailring/detailring?circleId=' + this.data.circleId,
            })
          }
        })
      } else {
        var options = {
          circleId: that.data.circleId,
          categoryId: that.data.categoryId,
          money: tatalmoney,
          day: that.data.date,
          remarks: that.data.remarks,
          userId: {
            userId: that.data.payer.userId,
            // money: parseFloat(that.data.payer.money)
            money: tatalmoney
          },
          usersId: allpeople
        }
        promise.getrequest('circle/circle/setCharge', options).then(res => {
          if (res.data.errcode == 1000 && res.data.errmsg == true) {
            wx.redirectTo({
              url: '../detailring/detailring?circleId=' + that.data.circleId,
            })
          }
        })
      }
    }
  },

})