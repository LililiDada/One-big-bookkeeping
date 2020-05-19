var app = getApp()
const promise = require('../../utils/promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasSelect: '../../images/selectring.png',
    noSelect: '../../images/circle.png',
    // ifselectall: '取消全选',
    ifselectall: true,
    selectedAllStatus: true,
    type: {},
    alltype: {}
  },
  onLoad: function(e) {
    console.log(e)
    this.setData({
      payerId: e.payerId,
      payerName: e.payerName,
      allAmount: e.allAmount
    })
    var that = this
    if (e.chargeId) {
      that.setData({
        circleId: e.circleId,
        chargeId: e.chargeId
      })
      var options = {
        circleId: e.circleId,
        chargeId: e.chargeId
      }
      promise.getrequest('circle/circle/reviseChargeFriend', options).then(res => {
        console.log(res)
        var type = []
        var seter
        for (var i in res.data) {
          var seter = {
            userId: res.data[i].userId,
            userName: res.data[i].userName,
            status: true
          }
          break;
        }
        for (var i in res.data) {
          var temp = {
            userId: res.data[i].userId,
            userName: res.data[i].userName,
            status: res.data[i].status
          }
          type.push(temp)
        }
        this.setData({
          type: type,
          seter: seter
        })
      })
    } else {
      var options = {
        circleId: e.circleId
      }
      promise.getrequest('circle/circle/getChargeFriend', options).then(res => {
        console.log(res)
        var seter
        for (var i in res.data) {
          var seter = {
            userId: res.data[i].userId,
            userName: res.data[i].userName,
            status: true
          }
          break;
        }
        var friends = []
        for (var i in res.data) {
          var temp = {
            userId: res.data[i].userId,
            userName: res.data[i].userName,
            status: true
          }
          friends.push(temp)
        }
        this.setData({
          type: friends,
          seter: seter
        })
      })
    }

  },

  selectTap: function() {
    //首先定义一个data值，以记录全选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    var ifselectall = this.data.ifselectall;
    selectedAllStatus = !selectedAllStatus;
    ifselectall = !ifselectall;
    var type = this.data.type;
    for (var i = 0; i < type.length; i++) {
      let choseChange = "type[" + i + "].status"
      this.setData({
        [choseChange]: selectedAllStatus
      })
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      ifselectall: ifselectall
    })
  },

  checkTap: function(e) {
    var index = e.currentTarget.dataset.selectindex;
    var selectIndex = this.data.type; //取到data里的selectIndex
    selectIndex[index].status = !selectIndex[index].status; //点击就赋相反的值
    this.setData({
      type: selectIndex //将已改变属性的json数组更新
    })
  },
  //添加付款人
  addpayer: function(prevPage, allpart) {
    var that = this
    var payerId = Number(that.data.payerId)
    var sum = that.data.allAmount / (allpart.length + 1)
    var allPart = [] //插入选中参与人和付款人
    for (var i in allpart) {
      var temp = {
        userId: allpart[i].userId,
        userName: allpart[i].userName,
        money: sum,
        status: true
      }
      allPart.push(temp)
    }
    var y = {
      userId: payerId,
      userName: that.data.payerName,
      money: sum,
      status: true
    }
    allPart.push(y)
    console.log('add', allPart)
    this.selectAndUpdate(prevPage, allPart)
  },

  //添加创建人
  addSeter: function(prevPage, allpart) {
    console.log(this.data.seter)
    var that = this
    var sum = that.data.allAmount / (allpart.length + 1)
    sum = sum.toFixed(2);
    var that = this
    var y = {
      userId: that.data.seter.userId,
      userName: that.data.seter.userName,
      money: sum,
      status: true
    }
    allpart.unshift(y)
    var allPart = [] //插入选中参与人和付款人
    for (var i in allpart) {
      var temp = {
        userId: allpart[i].userId,
        userName: allpart[i].userName,
        money: sum,
        status: true
      }
      allPart.push(temp)
    }
    console.log('add', allPart)
    this.selectAndUpdate(prevPage, allPart)
  },

  //选取前五个并更新前一个页面的数据
  selectAndUpdate: function(prevPage, allPart) {
    var that = this
    //判断参与人共有几个，选取前五个
    if (allPart.length > 6) {
      var smlpart = []
      for (var i = 0; i <= 5; i++) {
        smlpart.push(allPart[i])
      }
      prevPage.setData({
        allParticipant: allPart,
        participant: smlpart,
        allCount: allPart.length
      })
    } else {
      prevPage.setData({
        allParticipant: allPart,
        participant: allPart,
        allCount: allPart.length
      })
    }
    console.log('jkj', allPart)
  },
  confirmTap: function() {
    console.log('hj')
    var that = this
    var part = this.data.type;
    var alltype = this.data.alltype
    alltype = part
    //获取全部参与人
    var allPart = []
    var allCount = 0
    for (var i in part) {
      if (part[i].status === true) {
        allCount++
      }
    }
    var sum = that.data.allAmount / allCount
    for (var i in part) {
      if (part[i].status === true) {
        var temp = {
          userId: part[i].userId,
          userName: part[i].userName,
          money: sum,
          status: true
        }
        allPart.push(temp)
      }
    }
    //获取前五个参与人
    var participant = [];
    var count = 0
    for (var idx in part) {
      if (part[idx].status === true) {
        count++;
        var temp = {
          userId: part[idx].userId,
          userName: part[idx].userName,
          money: sum,
          status: true
        }
        participant.push(temp);
      }
      if (count > 6) {
        break;
      }
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    //判断参与人是否存在付款人
    var result = allPart.some(function(item) {
      if (item.userId == that.data.payerId) {
        return true;
      }
    })
    //判断参与人是否存在创建人
    var result_two = allPart.some(function(item) {
      if (item.userId == that.data.seter.userId) {
        return true;
      }
    })
    console.log(result_two, result)
    //参与人中无付款人,有创建人
    if (result == false && result_two == true) {
      this.addpayer(prevPage, allPart)
    }
    // 参与人中无创建人，有付款人
    else if (result_two == false && result == true) {
      this.addSeter(prevPage, allPart)
    }
    //创建人和付款人均不存在参与人
    else if (result_two == false && result == false) {
      var that = this
      if (that.data.payerId == that.data.seter.userId) {
        this.addSeter(prevPage, allPart)
      } else {
        var sum = that.data.allAmount / (allPart.length + 1)
        var y = {
          userId: that.data.seter.userId,
          userName: that.data.seter.userName,
          money: sum,
          status: true
        }
        allPart.unshift(y)
        this.addpayer(prevPage, allPart)
      }
    } else {
      prevPage.setData({
        allParticipant: allPart,
        participant: participant,
        allCount: allCount,
      })
    }

    // if (allCount > 5) {
    //   prevPage.setData({
    //     morefiveShow: true,
    //   })
    // }

    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 3]; //上一个页面
    if (prevPage.route == 'pages/ringbilldetail/ringbilldetail') {
      for (var i in part) {
        if (part[i].userId == that.data.payerId || part[i].userId == that.data.seter.userId) {
          if (part[i].status == false) {
            let choseChange = "type[" + i + "].status"
            that.setData({
              [choseChange]: true
            })
          }
        }

      }
      //传修改后好友状态至服务器
      var friend = []
      for (var i in part) {
        if (part[i].status == true) {
          var temp = {
            userId: part[i].userId,
            status: 'true'
          }
          friend.push(temp)
        } else {
          var temp = {
            userId: part[i].userId,
            status: 'false'
          }
          friend.push(temp)
        }
      }
      var option = {
        chargeId: this.data.chargeId,
        user: friend
      }
      promise.getrequest('circle/circle/reviseSaUsers', option).then(res => {
        console.log(res)
        if (res.data.errmsg == '该交易存在已清算状态') {
          wx.showModal({
            title: '温馨提示',
            content: '该交易存在已清算状态，不能修改！',
            showCancel: false,
            success(res) {
              wx.navigateBack({
                delta: 3
              })
            }
          })
        } else {
          setTimeout(function() {
            wx.navigateBack();
          }, 500)
        }
      })
    } else {
      //500毫秒后跳转回前一个页面
      setTimeout(function() {
        wx.navigateBack();
      }, 500)

    }
  },
})