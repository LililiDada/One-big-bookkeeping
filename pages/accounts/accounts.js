var app=getApp()
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
    navbar: ['支出','收入'],
    currentTab:0,
    currentType:0,
    type:{},
    type1:{},
    clicksrc: '../../images/icon_1/canyin.png',
    clicktitle: '餐饮',
    bigtype:'支出',
    sum:'', 
    remark:'',
    categoryId:1
  },
  back:function(){
    wx.switchTab({
      url: '../home/home',  
    })
  },

  navbarTap: function (e) {
    var that = this
    var id = e.currentTarget.dataset.idx
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      bigtype:that.data.navbar[id],
      currentType:0,
      categoryId:15
    })
  },

  //获取选择的类型
  typeTap:function(e){
    this.setData({
      currentType: e.currentTarget.dataset.index,
      categoryId: e.currentTarget.dataset.categoryid,
      clicksrc: e.currentTarget.dataset.clicksrc ,
      clicktitle: e.currentTarget.dataset.clicktitle ,
    })
  },

//获取输入的内容
  getMoney:function(e){
    this.setData({
      sum:e.detail.value
    })
  },
  //修改日期
  bindDateChange: function (e) {
    const str = e.detail.value
    console.log(str)
    const monthstr = str.substring(5, 7);
    const daystr = str.substring(8, 11);
    this.setData({
      date: str,
      day: daystr,
      month: monthstr
    })
  },
  //获得备注
  getRemark:function(e){
    this.setData({
      remark: e.detail.value
    })
  },
  
  onLoad: function (options) {
    //渲染服务器返回的数据
    promise.getrequest('account/category/getCategory').then(res=>{
      var category = [];     //记录处理（筛选）完数据的容器
      var category_1 =[];
      for (var idx in res.data[0].category) {
        var subject = res.data[0].category[idx];
        var temp = {
          categoryId: subject.categoryId,
          title: subject.categoryName,
          imgsrc: subject.image
        }
        if (subject.sort=='支出') {
          category.push(temp);
        }else{
          category_1.push(temp);
        }
      }
      this.setData({
        type: category,
        type1: category_1
      })
    })
  },
  onShow: function () {
    wx.hideTabBar({
      animation: false //是否需要过渡动画
    })
  },

  //点击确定按钮。判断是否登录，若未登录，跳转至登录页面，登录成果后返回此页面。若已登录，把信息添加到数据库存储起来|| !/^[0-9]+$/.test(money)
  addbill:function(){
    
    var money = this.data.sum;
    if (money == '' || ! /^\d+(\.\d+)?$/.test(money) ){
      wx.showModal({
        title: '温馨提示',
        content: '请输入有效的金额！',
        showCancel:false,
        comfirmText:'确定'
      })
    }else{
      var that = this;
      //发送到浏览器的数据
      var options = {
        sort: that.data.bigtype,
        categoryId: that.data.categoryId,
        date: that.data.date,
        money: that.data.sum,
        remarks: that.data.remark,
      }
      console.log(options)
      //检验微信端登录态
      promise.checkWxSession().then(res => {
        //微信处于登录态，发送数据至服务器存储
        console.log(res);
        if (res) {
          return promise.getrequest('account/account/setAccount', options)
        } else {
          //微信不处于登录态，跳转至登录页面登录
          wx.navigateTo({
            url: '../homepage/homepage'
          })
        }
      }).then(res => {
        console.log(res)
        //微信处于登录态，根据返回的数据，判断服务器session是否有效，
        //session失效，跳转至登页面重新登录
        if (res.data.errmsg == '未登录' && res.data.errcode == 1001) {
          wx.navigateTo({
            url: '../homepage/homepage'
          })
        } else {
          //sesion有效，发送数据至服务器
          //发送请求的数据后清空，并跳转至数据显示首页
          this.setData({
            sum: '',
            remark: '',
            money: money,
            day: day
          })
          wx.showToast({
            title: '成功',//提示文字
            duration: 3000,//显示时长
            mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false  
            icon: 'success', //图标，支持"success"、"loading"  

          })
          wx.reLaunch({
            url: '../home/home'
          })
        }
      }).catch(res => {
        console.log(res)
      })
    }
  
  }
})