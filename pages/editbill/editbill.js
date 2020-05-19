var app = getApp()
const promise = require('../../utils/promise.js');

Page({
  data: {
    date: '',
    navbar: ['支出', '收入'],
    currentTab: 0,
    currentType: 0,
    type: {},
    type1: {},
    clicksrc: '',
    clicktitle: '',
    // money: '',
    // remarks: '',

  },

  //封装函数，绑定详情页面传递过来的类型(支出或收入)，详细类型(如餐饮)和选项卡显示情况
  acceptdate: function(num, list, element) {
    var cate = list;
    console.log(cate)
    var that = this;
    for (var i = 0; i < list.length; i++) {
      if (list[i].title == element) {
        console.log(i)
        var select = i
        that.setData({
          currentTab: num,
          currentType: select,
        })
      }
    }
  },

  //加载前一个页面传递过来的数据
  onLoad: function(element) {
    console.log(element)
    var category = []; //记录处理（筛选）完数据的容器
    var category_1 = [];
    //渲染服务器返回的数据
    promise.getrequest('account/category/getCategory').then(res => {
      for (var idx in res.data[0].category) {
        var subject = res.data[0].category[idx];
        var temp = {
          categoryId: subject.categoryId,
          title: subject.categoryName,
          imgsrc: subject.image
        }
        if (subject.sort == '支出') {
          category.push(temp);
        } else {
          category_1.push(temp);
        }
      }
      this.setData({
        type: category,
        type1: category_1
      })

      if (element.sort == '收入') {
         this.acceptdate(1, category_1, element.categoryname)
      } else {
         this.acceptdate(0, category, element.categoryname)
      }
    })
    this.setData({
      sort: element.sort,
      clicktitle: element.categoryname,
      sum: element.money,
      date: element.day,
      clicksrc: element.image,
      accountid: element.accountid,
      remark: element.remarks,
      day: element.date,
      categoryid: element.categoryid
    })
},

onShow: function() {

  },
  //点击选项卡修改选项卡选中情况
  navbarTap: function(e) {
    var that = this
    var id = e.currentTarget.dataset.idx
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      sort: that.data.navbar[id]
    })
  },

  //获取选择的类型
  typeTap: function(e) {
    this.setData({
      currentType: e.currentTarget.dataset.index,
      clicksrc: e.currentTarget.dataset.clicksrc,
      clicktitle: e.currentTarget.dataset.clicktitle,
      categoryid: e.currentTarget.dataset.categoryid,
    })
  },

  //获取输入的金钱
  getMoney: function(e) {
    this.setData({
      sum: e.detail.value
    })
  },
  //修改日期
  bindDateChange: function(e) {
    const str = e.detail.value
    const monthstr = str.substring(5, 7);
    const daystr = str.substring(8, 11);
    var dateStr = monthstr + '月' + daystr + '日'
    this.setData({
      date: dateStr,
      day: str
    })
  },
  //获得备注
  getRemark: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  //点击确定按钮。判断是否登录，若未登录，跳转至登录页面，登录成果后返回此页面。若已登录，把信息添加到数据库存储起来
  addbill: function() {
    var that = this;
    var money = this.data.sum
    if (money == 0 && /^[0-9]+$/.test(money)) {
      wx.showModal({
        title: '温馨提示',
        content: '请输入有效的金额！',
        showCancel: false,
        comfirmText: '确定'
      })
    }
    var options = {
      accountId: that.data.accountid,
      categoryId: that.data.categoryid,
      sort: that.data.sort,
      money: that.data.sum,
      remarks: that.data.remark,
      day: that.data.day,
    }
    promise.getrequest('account/account/reviseAccount', options).then(res=>{
      wx.reLaunch({
        url: '../home/home',
      })
    })
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1]; //当前页面
    // var prevPage = pages[pages.length - 2]; //上一个页面
    // var that = this;
    // var order = this.data.currentTab
    // prevPage.setData({
    //   sort: that.data.navbar[order],
    //   money: that.data.sum,
    //   image: that.data.clicksrc,
    //   categoryname: that.data.clicktitle,
    //   remarks: that.data.remark,
    //   date: that.data.day,
    // })
   
  }

})