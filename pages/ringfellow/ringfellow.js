var app = getApp()
const promise = require('../../utils/promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deletefellow: true,
    addpartShow: true,
    hasSelect: '../../images/selectring.png',
    noSelect: '../../images/circle.png',
    type: {},
    searchType: {},
    ifselectall: false,
    searchPanelShow: false,
    searchShow: false,
    partShow: true
  },


  onLoad: function(options) {
    if (options.addfellow) {
      this.setData({
        addfellow: options.addfellow,
        deletefellow: false,
        circleId: options.circleId
      })
      var options = {
        circleId: options.circleId,
      }
      this.showAddFriend('circle/circle/getRevisefriend', options)
    }
    if (options.deletefellow) {
      this.setData({
        addfellow: false,
        deletefellow: options.deletefellow,
        circleId: options.circleId
      })
      var options = {
        circleId: options.circleId,
      }
      this.showDeleteFriend('circle/circle/getCircleFriend', options)
    }
  },
  onShow:function(){
    var that = this
    var add = this.data.addfellow
    if (add==true){
      var options = {
        circleId: that.data.circleId,
      }
      this.showAddFriend('circle/circle/getRevisefriend', options)
    }else{
      var options = {
        circleId: that.data.circleId,
      }
      this.showDeleteFriend('circle/circle/getCircleFriend', options)
    }
  },
  //删除中全部好友显示
  showDeleteFriend: function(url, options) {
    promise.getrequest(url, options).then(res => {
      console.log(res)
      var part = []
      for (var i in res.data) {
        var temp = {
          userName: res.data[i].userName,
          userId: res.data[i].userId,
          status: false
        }
        part.push(temp)
      }
      this.setData({
        type: part
      })
    })
  },

  //添加好友圈子好友显示
  showAddFriend: function(url, options) {
    promise.getrequest(url, options).then(res => {
      console.log(res)
      var part = []
      for (var i in res.data) {
        var user = res.data[i].user[0]
        var temp = {
          userId: user.userId,
          userName: user.userName,
          status: user.status,
          checked: user.status,
        }
        part.push(temp)
      }
      this.setData({
        type: part
      })
    })
  },

  //取消添加搜索，隐藏搜索部分
  onaddCancelTap: function(event) {
    var options = {
      circleId: this.data.circleId
    }
    this.setData({
      partShow: true,
      searchPanelShow: false,
      searchShow: false,
      searchInput: ''
    })
    this.showAddFriend('circle/circle/getRevisefriend', options)
  },

//取消删除搜索，隐藏搜索部分
  ondeleteCancelTap: function (event) {
    var options = {
      circleId: this.data.circleId
    }
    this.setData({
      partShow: true,
      searchPanelShow: false,
      searchShow: false,
      searchInput: ''
    })
    this.showDeleteFriend('circle/circle/getCircleFriend', options)
  },

  //搜索框获取焦点一次账单，显示搜索结果
  onBindFocus: function(event) {
    this.setData({
      partShow: false,
      searchPanelShow: true,
    })

  },
  //确定搜索按钮
  onAddConfirm: function(e) {
    console.log(e.detail.value)
    var that = this
    var options = {
      circleId: that.data.circleId,
      txt: e.detail.value
    }
    var type = that.data.type
    var part = []
    for (var i in type) {
      if (type[i].userName == e.detail.value) {
        var temp = {
          userName: type[i].userName,
          userId: type[i].userId,
          status: type[i].status,
          checked: type[i].status,
        }
        part.push(temp)
      }
    }
    that.setData({
      type: part,
      searchShow: true
    })
    if (part == '') {
      wx.showModal({
        title: '温馨提示',
        content: '该用户不存在',
        showCancel: false
      })
    }
  },

  onDeleteConfirm: function(e) {
    var that = this
    var options = {
      circleId: that.data.circleId,
      txt: e.detail.value
    }
    var type = that.data.type
    var part = []
    for (var i in type) {
      if (type[i].userName == e.detail.value) {
        var temp = {
          userName: type[i].userName,
          userId: type[i].userId,
          status: false
        }
        part.push(temp)
      }
    }
    that.setData({
      type: part,
      searchShow: true
    })
    if (part == '') {
      wx.showModal({
        title: '温馨提示',
        content: '该用户不存在',
        showCancel: false
      })
    }
  },

  //跳转至添加新成员页面
  addTap: function() {
    wx.navigateTo({
      url: '../addfellow/addfellow?circleId=' + this.data.circleId
    })
  },

  //全选和取消全选
  selectTap: function() {
    //首先定义一个data值，以记录全选状态
    var ifselectall = this.data.ifselectall;
    ifselectall = !ifselectall;
    var type = this.data.type;
    for (var i = 0; i < type.length; i++) {
      let choseChange = "type[" + i + "].status"
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
    selectIndex[index].status = !selectIndex[index].status; //点击就赋相反的值
    console.log(e)
    this.setData({
      type: selectIndex //将已改变属性的json数组更新
    })
  },

  addFellowTap: function() {
    var that = this
    var type = this.data.type
    var part = []
    for (var i in type) {
      var temp = {
        userId: type[i].userId,
        status: type[i].status
      }
      part.push(temp)
    }
    var options = {
      circleId: this.data.circleId,
      user: part
    }
    promise.getrequest('circle/circle/reviseCircleFriend', options).then(res => {
      if (res.data.errcode == 1000) {
        wx.showToast({
          title: '添加好友成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(function() {
          // wx.navigateTo({
          //   url: '../aboutdetailring/aboutdetailring?circleId=' + that.data.circleId
          // })
          var pages = getCurrentPages(); // 当前页面
          var beforePage = pages[pages.length - 2]; // 前一个页面
          wx.navigateBack({
            delta: 1,
            success: function (e) {
              beforePage.onShow();
            }
          })
        }, 1500)
      }
    })
  },
  deleteFellowTap: function() {
    var that = this
    var type = this.data.type
    var part = []
    for (var i in type) {
      if (type[i].status == true) {
        var temp = {
          userId: type[i].userId
        }
        part.push(temp)
      }
    }
    var options = {
      circleId: this.data.circleId,
      userId: part
    }
    promise.getrequest('circle/circle/deleteCircleFriend', options).then(res => {
      if (res.data.errcode == 1000) {
        wx.showToast({
          title: '删除好友成功',
          icon: 'success',
          duration: 1500
        })
        setTimeout(function() {
          // wx.navigateTo({
          //   url: '../aboutdetailring/aboutdetailring?circleId=' + that.data.circleId
          // })
          var pages = getCurrentPages(); // 当前页面
          var beforePage = pages[pages.length - 2]; // 前一个页面
          wx.navigateBack({
            delta:1,
            success:function(e){
              beforePage.onShow(); 
            }
          })
        }, 1500)
      }
    })
  }
})