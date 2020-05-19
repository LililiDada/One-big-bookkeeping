var app = getApp()
const promise = require('../../utils/promise.js');
Page({
  data: {
    hasSelect: '../../images/selectring.png',
    noSelect: '../../images/circle.png',
    type: {},
    ifselectall: true,
  },


  onLoad: function(e) {
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 3]; //上三个页面
    console.log(prevPage.route)
    if (prevPage.route =='pages/aboutdetailring/aboutdetailring'){
      var options={
        circleId: e.circleId
      }
      promise.getrequest('circle/circle/getRevisefriend', options).then(res => {
        console.log(res)
        var fellow = []
        for (var i in res.data) {
          var user = res.data[i].user[0]
          var temp = {
            userId: user.userId,
            status: user.status,
            userName: user.userName
          }
          fellow.push(temp)
        }
        this.setData({
          type: fellow,
          circleId: e.circleId,
          prevPage: prevPage.route
        })
      })
    }else{
      promise.getrequest('circle/circle/getfriend').then(res => {
        console.log(res)
        console.log(res.data)
        var menber = []
        for (var index in res.data) {
          console.log(res.data[index].user[0])
          var one = res.data[index].user[0]
          menber.push(one)
        }
        this.setData({
          type: menber
        })
      })
    }
   
  },

  //跳转至添加新成员页面
  addTap: function() {
    var that = this 
    var prevPage = that.data.prevPage
    if (prevPage =='pages/aboutdetailring/aboutdetailring'){
      wx.redirectTo({
        url: '../addfellow/addfellow?circleId=' + that.data.circleId
      })
    }else{
      wx.redirectTo({
        url: '../addfellow/addfellow'
      })
    }
   
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
    if(this.data.circleId){
      var type = that.data.type
      var menber=[]
      for(var i in type){
        var temp={
          userId: type[i].userId,
          status: type[i].status
        }
        menber.push(temp)
      }
      var options={
        circleId: that.data.circleId,
        user: menber
      }
      promise.getrequest('circle/circle/reviseCircleFriend',options).then(res=>{
        
        wx.showToast({
          title: '修改成功！',
          icon: 'success'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      })
    }else{
      //判断是否所有好友选中
      var circle = this.data.type;
      var user = [];
      for (var i in circle) {
        if (circle[i].status == true) {
          var userid = circle[i].userId;
          user.push(userid);
        }
      }
      wx.showToast({
        title: '添加成功！',
        icon: 'success'
      })
      setTimeout(function () {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面

        //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          user: user
        });
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }
    }
   
})