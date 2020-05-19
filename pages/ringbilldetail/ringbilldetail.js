var app = getApp()
const promise = require('../../utils/promise.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navber: ['详情', '参与人'],
    currentTab: 0,
    image: '../../images/ring/chuang.png',
    categoryname: '寝室',
    array: ['已支付', '未支付', '默认'],
    type: {},
    searchPanelShow: false,
    partShow: true,
    searchShow: false,
    searchmenber: {},
    countbtn:true
  },

  onLoad: function(e) {
    console.log(e)
    var options = {
      chargeId: e.chargeId
    }
    promise.getrequest('circle/circle/getChargeDetail', options).then(res => {
      console.log(res)
      this.setData({
        allAmount: res.data[0].allAmount,
        categoryName: res.data[0].categoryName,
        circleName: res.data[0].circleName,
        date: res.data[0].date,
        image: res.data[0].image,
        remarks: res.data[0].remarks,
        userName: res.data[0].userName,
        averageAmount: res.data[0].averageAmount,
        chargeId: e.chargeId,
        circleId: e.circleId,
        categoryId: res.data[0].categoryId
      })
    })
    // promise.getrequest('circle/circle/getSettleAccount', options).then(res => {
    //   console.log(res)
    // var people = []
    // for (var i in res.data) {
    //   var paymentStatus = res.data[i].paymentStatus
    //   if (paymentStatus == 'true') {
    //     var temp = {
    //       userName: res.data[i].userName,
    //       paymentStatus: true,
    //       how: '已支付'
    //     }
    //     people.push(temp)
    //   } else {
    //     var temp = {
    //       userName: res.data[i].userName,
    //       paymentStatus: false,
    //       how: '未支付'
    //     }
    //     people.push(temp)
    //   }
    // }
    // this.setData({
    //   type: people
    // })
    // })
    this.paymentStatus('circle/circle/getSettleAccount', options)
  },
  //账单好友支付状态
  paymentStatus: function(url, options) {
    var that = this
    promise.getrequest(url, options).then(res => {
      console.log(res)
      if(res.data.error!=1001&&res.data.errmsg!=false){
        var people = []
        for (var i in res.data) {
          var paymentStatus = res.data[i].paymentStatus
          if (paymentStatus == 'true') {
            var temp = {
              userName: res.data[i].userName,
              paymentStatus: true,
              how: '已支付'
            }
            people.push(temp)
          } else if (paymentStatus == 'false'){
            var temp = {
              userName: res.data[i].userName,
              paymentStatus: false,
              how: '未支付'
            }
            people.push(temp)
          }else{
            var temp = {
              userName: res.data[i].userName,
            }
            people.push(temp)
            that.setData({
              countbtn: false
            })
          }
        }
        that.setData({
          type: people,
        })
      }else{
        wx.showModal({
          title: '温馨提示',
          content: '无该数据',
          showCancel:false
        })
      }
     
    })
  },
  //取消搜索，显示账单，隐藏搜索部分
  onCancelTap: function(event) {
    var options = {
      chargeId: this.data.chargeId
    }
    this.setData({
      partShow: true,
      searchPanelShow: false,
      searchShow: false,
      searchInput: ''
    })
    this.paymentStatus('circle/circle/getSettleAccount', options)
  },


  //搜索框获取焦点一次账单，显示搜索结果
  onBindFocus: function(event) {
    this.setData({
      partShow: false,
      searchPanelShow: true
    })
  },

  //确定搜索按钮
  onBindConfirm: function(e) {
    console.log(e)
    var that = this
    that.setData({
      partShow: false,
      searchPanelShow: true,
      searchShow: true
    })
    var type = that.data.type
    var part = []
    for (var i in type) {
      if (type[i].userName == e.detail.value) {
        if (type[i].paymentStatus == false) {
          var temp = {
            userName: type[i].userName,
            paymentStatus: false,
            how: '未支付'
          }
          part.push(temp)
        } else {
          var temp = {
            userName: type[i].userName,
            paymentStatus: true,
            how: '已支付'
          }
          part.push(temp)
        }
      }
    }
    this.setData({
      searchmenber: part
    })
    if (part == '') {
      wx.showModal({
        title: '温馨提示',
        content: '该用户不存在',
        showCancel: false
      })
    }
  },

  navbarTap: function(e) {
    // console.log(e.currentTarget.dataset.index);
    this.setData({
      currentTab: e.currentTarget.dataset.index
    })
  },
  //删除账单
  deleteTap: function() {
    var options = {
      chargeId: this.data.chargeId
    }
    wx.showModal({
      title: '删除',
      content: '确定要删除该账单吗?',
      showCancel: true,
      success: function(res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          promise.getrequest('circle/circle/deleteCharge', options).then(res => {
            
            if (res.data.errcode == 1001 && res.data.errmsg == '还有清账信息') {
              wx.showModal({
                title: '温馨提示',
                content: '无法删除该圈子，还有账单未清算！',
                showCancel: false,
                success(res) {
                  wx.navigateBack({
                    delta: 2
                  })
                }
              })
            } else {
              wx.showToast({
                title: '成功', //提示文字
                duration: 1000, //显示时长
                mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                icon: 'success', //图标，支持"success"、"loading"  
              })
              //redirectTo
              setTimeout(function () {
                // wx.redirectTo('../detailring/detailring');
                wx.navigateBack({
                  delta: 2
                })
              }, 1000)
            }
           
          })
        }
      }
    })
  },
  editTap: function() {
    wx.navigateTo({
      url: '../addbill/addbill?chargeId=' + this.data.chargeId + '&circleId=' + this.data.circleId + '&averageAmount=' + this.data.averageAmount + '&categoryId=' + this.data.categoryId,
    })
  },

  //选择支付状态
  bindPickerChange: function(e) {
    console.log(e.detail.value)
    var that = this
    var status = e.detail.value
    if (status == 0) {
      var options = {
        chargeId: that.data.chargeId,
        paymentStatus: 'true'
      }
      that.paymentStatus('circle/circle/getUserPayment', options)
    } else if (status == 1){
      var options = {
        chargeId: that.data.chargeId,
        paymentStatus: false
      }
      that.paymentStatus('circle/circle/getUserPayment', options)
    }else{
      var options = {
        chargeId: that.data.chargeId,
      }
      that.paymentStatus('circle/circle/getSettleAccount', options)
    }
  },

  //清算未支付好友
  countTap: function() {
    wx.navigateTo({
      url: '../countbill/countbill?chargeId=' + this.data.chargeId+'&circleId=' + this.data.circleId,
    })
  },
  // onUnload: function () {
  //   wx.redirectTo({
  //     url: '../detailring/detailring?circleId=' + this.data.circleId,
  //   })
  // }
})