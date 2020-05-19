const promise = require('../../utils/promise.js');
const app = getApp()
const billData = require('../data/bill-data.js'); //模拟

const date = new Date()
const year = date.getFullYear()
var month = date.getMonth() + 1

if (month < 10) {
  var months = month.toString();
  month = '0' + months;
  var dateStr = year + '-' + months
} else {
  dateStr = year + '-' + month
}
Page({
  data: {
    date: '',
    year: year,
    month: month,
    paid: '0.00',
    income: '0.00',
    budget: '0.00',
    billShow: true,
    searchPanelShow: false,
    promptShow: false,
    billList: {},
    searchInput: '',
    totalCount: 1,
    isEmpty: true,
    //  searchList:{}
    showTip: false
  },

  //加载的时候判断用户是否授权，若授权了则请求展示数据，若没授权，则隐藏账单详情页面，展示“账单空空如也，赶快记一笔”
  onLoad: function(options) {
    this.straining();
    // wx.request({
    //   url: 'http://120.78.206.187/think-5.1/public/index.php/account/account/getAccount',
    //   method: 'GET',
    //   header: {
    //     'content-Type': 'application/json',
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (err) {

    //   }
    // })
  },

  straining: function() {
    var that = this;
    //检验微信端登录态，
    promise.checkWxSession().then(res => {
      //微信端登录，获取服务器存储的数据
      if (res) {
        var oneUrl = "account/account/getAccount?pageNum=" + this.data.totalCount + "&pageSize= 5";
        return promise.getrequest('account/account/getAccount')
      } else {
        //微信端未登录，显示“空空如也”标记页面
        that.setData({
          billShow: false,
          searchPanelShow: false,
          promptShow: true,

        })
      }
    }).then(res => {
      console.log('hjgjgjgjgjgjgjj')
      console.log(res)
      var that = this
      // 根据返回的数据是判断服务端session处于有效期
      // 无效期，显示“空空如也”标记页面
      if (res.data.errmsg == '未登录' && res.data.errcode == 1001) {
        that.setData({
          billShow: false,
          searchPanelShow: false,
          promptShow: true,
          loginbtnShow: false
        })
      } else {
        this.requireData(res.data)
      }
    })
  },

  requireData: function(res) {

    var that = this
    var subject = []; //记录处理（筛选）完数据的容器,定义在for外面，不然只能push一组数据

    for (var index in res.object) {
      var type = ['收入', '支出']
      var what
      //获取每次循环的总支出金额
      var money = res.object[index].getMoney
      var totalSum =parseFloat('0.00')  ;
      if (money == 0) {
        what = 0
      } else {
        what = 1
      }
      //转换日期
      var period = res.object[index].day;
      var periodStr = this.dataConversion(period);

      var intactbill = []; //记录处理（筛选）完数据的容器,定义在for外面，不然只能push一组数据
      //判断备注是否为空，若为空，转换为''
      for (var idx in res.object[index].detail) {
        //获取每个详细账单数据
        var detailBill = res.object[index].detail[idx]
        //若没有支出，则显示收入和收入总值
        if (money == 0) {
          totalSum += Number(detailBill.money)
        }else{
          totalSum = money
        }
        var temp_1 = {
          sort: detailBill.sort,
          accountid: detailBill.accountId,
          money: detailBill.money,
          smallType: detailBill.categoryName,
          typeImg: detailBill.image,
          remarks: detailBill.remarks,
          categoryid: detailBill.categoryId
        }
        intactbill.push(temp_1);
      }
      var temp_2 = {
        date: period,
        day: periodStr,
        detail: intactbill,
        getMoney: totalSum,
        sort: type[what]
      }
      subject.push(temp_2);
    }

    //成功返回数据，提取数据，绑定到data，渲染页面
    that.setData({
      billList: subject
    })
    // var totalBill = {}
    //   //如果要绑定新加载的数据，那么需要同旧的数据并合在一起
    //   if(!that.data.isEmpty){
    //     totalBill = that.data.billList.concat(subject)
    //   }else{
    //     totalBill = subject;
    //     this.data.isEmpty=false;
    //   }

    //   that.setData({
    //     billList:totalBill
    //   });
    //   that.data.totalCount+=1
  },

  //上拉刷新加载更多
  //先在onload里面加载全部数据绑定到billList里面
  //显示合适大小的数据，然后上拉刷新显示相同多的数据
  onScrollLower: function(event) {
    //要设置滚动的高度，在css里面设置最外层元素的高度
    //在获取数据函数processDoubanData中，tatalCount在每次获取完数据后，累加5
    var nextUrl = "account/account/getAccount?pageNum=" + this.data.totalCount + "&pageSize = 5";
    promise.getrequest('account/account/getAccount').then(res => {
      if (res.data.num == 0) {
        this.setData({
          showTip: true
        })
      }
      this.requireData(res.data)
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
    })
  },

  //截取日期格式为（**月**日）
  dataConversion: function(period) {
    var dateStr = period.split("-");
    var monthStr = dateStr[1];
    var dayStr = dateStr[2];
    var getDate = monthStr + '月' + dayStr + '日'
    return getDate;
  },

  onShow: function() {

    wx.showTabBar({
      animation: false
    })
    promise.getrequest('account/account/getMonthData').then(res => {
      var monthlyDate = res.data.monthly
      this.setData({
        budget: monthlyDate.budget,
        income: monthlyDate.income,
        paid: monthlyDate.paid
      })
    })
  },

  //绑定选定的时间,并进行搜索
  bindDateChange: function(e) {
    const str = e.detail.value;
    const yearstr = str.substring(0, 4);
    const monthstr = str.substring(5, 7);
    var options = {
      days: str
    }
    console.log(str)
    this.setData({
      date: e.detail.value,
      year: yearstr,
      month: monthstr,
      // pageCount:1
    })
    // var oneUrl = "account/account/getAccount?pageNum=" + this.data.pageCount + "&pageSize= 5";
    promise.getrequest('account/account/getAccount', options).then(res => {
      console.log(res, 'hgjguguufydrseaea')
      if (res.data.errcode && res.data.errmsg) {
        wx.showModal({
          content: '该月还没有记账',
          showCancel: false, //是否显示取消按钮
          success: function(res) {},
        })
        this.setData({
          year: year,
          month: months,
        })
      } else {
        this.requireData(res.data)
      }
    })
  },

  //取消搜索，显示账单，隐藏搜索部分
  onCancelTap: function(event) {
    this.setData({
      billShow: true,
      searchPanelShow: false,
      searchInput: '',
      searchList: ''
    })
    this.straining();
  },

  //搜索框获取焦点一次账单，显示搜索结果
  onBindFocus: function(event) {
    this.setData({
      billShow: false,
      searchPanelShow: true
    })
  },

  //确定搜索按钮
  onBindConfirm: function(e) {
    var that = this
    var options = {
      txt: e.detail.value
    }
    promise.getrequest('account/account/getSearch', options).then(res => {
      console.log(res.data);
      var result = res.data.object.search[0];
      var subject = []
      for (var index in result) {
        var dayStr = result[index].day;
        var dateStr = this.dataConversion(dayStr);
        var temp = {
          date: dateStr,
          accountid: result[index].accountId,
          categoryName: result[index].categoryName,
          image: result[index].image,
          money: result[index].money,
          remarks: result[index].remarks,
          sort: result[index].sort,
          day: result[index].day
        }
        subject.push(temp);
      }
      this.setData({
        searchList: subject
      })
    })
  },
  //跳转到账单详情
  onBillTap: function(e) {

    var detailBill = e.currentTarget.dataset
    console.log(detailBill)
    var that = this
    wx.navigateTo({
      url: '../billdetail/billdetail?accountid=' + detailBill.accountid + '&image=' + detailBill.image + '&categoryname=' + detailBill.categoryname + '&sort=' + detailBill.sort + '&money=' + detailBill.money + '&day=' + detailBill.day + '&remarks=' + detailBill.remarks + '&date=' + detailBill.date + '&categoryid=' + detailBill.categoryid
    })
  },




})