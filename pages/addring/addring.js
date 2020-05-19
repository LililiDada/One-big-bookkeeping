var app = getApp()
const promise = require('../../utils/promise.js');
Page({


  data: {
    currentType: 0,
    type: [{
      imgsrc: '../../images/ring/chuang.png',
      title: '寝室'
    }, {
      imgsrc: '../../images/ring/bao.png',
      title: '生意场'
    }, {
      imgsrc: '../../images/ring/blackborad.png',
      title: '班集体'
    }, {
      imgsrc: '../../images/ring/bangongshi.png',
      title: '办公室'
    }, {
      imgsrc: '../../images/ring/jiating.png',
      title: '小家庭'
    }, {
      imgsrc: '../../images/ring/lvxing.png',
      title: '去旅行'
    }, {
      imgsrc: '../../images/ring/skirt.png',
      title: '姐妹淘'
    }, {
      imgsrc: '../../images/ring/roommate.png',
      title: '合租'
    }, {
      imgsrc: '../../images/ring/wanle.png',
      title: '一起玩'
    }, {
      imgsrc: '../../images/ring/else.png',
      title: '其他'
    }
    ],
    circleImg: '../../images/ring/jiating.png',
    circleName: '家庭'
  },

  onLoad: function (e) {
    promise.getrequest('account/category/getCircleCategory').then(res => {
      this.setData({
        type: res.data,
        circleImg: res.data[0].image,
        circleName: res.data[0].categoryName,
        categoryId: res.data[0].categoryId
      })
    })

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //ascv 
    if (prevPage.route == 'pages/aboutdetailring/aboutdetailring') {
      wx.setNavigationBarTitle({
        title: '修改圈子'
      })
      this.setData({
        circleId: e.circleId
      })
      var options = {
        circleId: e.circleId
      }
      var url = 'circle/circle/getCircleDetail'
      this.requestring(url, options, e.circleId)
    }
  },

  requestring: function (url, options, circleId) {
    promise.getrequest(url, options).then(res => {
      console.log(res)
      this.setData({
        circleName: res.data[0].circleName,
        categoryId: res.data[0].categoryId,
        circleImg: res.data[0].image,
        circleId: circleId
      })
      for (var i in this.data.type) {
        if (res.data[0].categoryId == this.data.type[i].categoryId) {
          this.setData({
            currentType: i,
          })
        }
      }
    })
  },

  typeTap: function (e) {
    var str = e.currentTarget.dataset
    this.setData({
      circleImg: str.clicksrc,
      circleName: str.clicktitle,
      currentType: str.index,
      categoryId: str.categoryid
    })
  },
  onReady: function () {

  },

  onShow: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //ascv 
    if (prevPage.route == 'pages/aboutdetailring/aboutdetailring') {
      var options = {
        circleId: this.data.circleId
      }
      var url = 'circle/circle/getCircleDetail'
      this.requestring(url, options, this.data.circleId)
    }
  },
  //添加好友
  addTap: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //ascv 
    if (prevPage.route == 'pages/aboutdetailring/aboutdetailring') {
      wx.navigateTo({
        url: '../fellow/fellow?circleId=' + this.data.circleId,
      })
    } else {
      wx.navigateTo({
        url: '../fellow/fellow',
      })
    }

  },

  //获得圈子名
  getRingName: function (e) {
    this.setData({
      circleName: e.detail.value
    })

  },
  //点击确定，把圈子名，选择的用户，即selected发送到服务器
  addRingTap: function () {
    var that = this

    if (that.data.circleId) {
      var options = {
        categoryId: that.data.categoryId,
        circleName: that.data.circleName,
        circleId: that.data.circleId
      }
      promise.getrequest('circle/circle/reviseCircle', options).then(res => {
        console.log(res)
        if (res.data.errcode = 1000 && res.data.errmsg == true) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../detailring/detailring?circleId=' + that.data.circleId,
            })
          }, 1500)
        }
      })
    } else {
      if (this.data.user != undefined && this.data.user != '') {
        var options = {
          categoryId: that.data.categoryId,
          circleName: that.data.circleName,
          user: that.data.user
        }
        promise.getrequest('circle/circle/setCircle', options).then(res => {
          if (res.data.errcode = 1000 && res.data.errmsg == true) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1500
            })
            setTimeout(function () {
              wx.reLaunch({
                url: '../ring/ring',
              })
            }, 1500)
          }
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '请添加好友!',
          showCancel: false
        })
      }
    }
  }

})