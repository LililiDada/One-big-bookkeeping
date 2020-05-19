var app = getApp()
const promise = require('../../utils/promise.js');
Page({


  data: {
    hasSelect: '../../images/selectring.png',
    noSelect: '../../images/circle.png',
    // ifselectall: '取消全选',
    ifselectall: false,
    type: {}
  },

  onLoad: function(e) {
    var that = this;
    var options = {
      chargeId: e.chargeId,
      paymentStatus: false,
    }
    promise.getrequest('circle/circle/getUserPayment', options).then(res => {
      if (res.data.errmsg == false && res.data.errcode==1001){
        wx.showModal({
          title: '温馨提示',
          content: '参与人已全部清算完毕！',
          showCancel:false,
          success(res){
            wx.redirectTo({
              url: '../detailring/detailring?circleId=' + e.circleId,
            })
          }
        })
      }else{
        var user = []
        for (var i in res.data) {
          if (res.data[i].paymentStatus == 'false') {
            var temp = {
              userId: res.data[i].userId,
              averageAmount: res.data[i].averageAmount,
              paymentStatus: false,
              userName: res.data[i].userName,
            }
            user.push(temp)
          }
        }
        this.setData({
          type: user,
          chargeId: e.chargeId,
          circleId: e.circleId
        })
      }
    })
  },
  selectTap: function() {
    //首先定义一个data值，以记录全选状态
    var ifselectall = this.data.ifselectall;
    ifselectall = !ifselectall;
    var type = this.data.type;
    for (var i = 0; i < type.length; i++) {
      let choseChange = "type[" + i + "].paymentStatus"
      this.setData({
        [choseChange]: ifselectall
      })
    }
    this.setData({
      ifselectall: ifselectall
    })

  },
  checkTap: function(e) {
    var index = e.currentTarget.dataset.selectindex;
    var selectIndex = this.data.type; //取到data里的selectIndex
    selectIndex[index].paymentStatus = !selectIndex[index].paymentStatus; //点击就赋相反的值
    console.log(e)
    this.setData({
      type: selectIndex //将已改变属性的json数组更新
    })
  },
  countTap: function() {
    var that=this
    console.log(this.data.type)
    var type = this.data.type
    var user = []
    for (var i in type) {
      if (type[i].paymentStatus == true) {
        var temp = {
          userId: type[i].userId
        }
        user.push(temp)
      }
    }
    var options = {
      chargeId: that.data.chargeId,
      users: user
    }
    promise.getrequest('circle/circle/setSettleMoney', options).then(res => {
      if (res.data.errcode == 1000) {
        wx.redirectTo({
          url: '../detailring/detailring?circleId=' + that.data.circleId,
        })
       
      }
    })
  }
})