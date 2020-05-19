var app = getApp()
const promise = require('../../utils/promise.js');

Page({


  data: {
    accountid:'',
    sort:'',
    categoryname:'',
    money:null,
    day:'',
    remarks:'',
    image:''
  },


  onLoad: function (options) {
    // if (options.remarks==''){
    //   this.setData({
    //     remarks: '无',
    //   })
    // }else{
    //   this.setData({
    //     remarks: options.remarks,
    //   })
    // }
    this.setData({
      sort: options.sort,
      categoryid: options.categoryid,
      money: options.money,
      day: options.day ,
      image: options.image,
      accountid: options.accountid,
      date:options.date,
      categoryname: options.categoryname,
      remarks: options.remarks,
    })
  },

  editTap:function(){
    var that = this
    wx.navigateTo({
      url: '../editbill/editbill?sort=' + that.data.sort + '&categoryname=' + that.data.categoryname + '&money=' + that.data.money + '&day=' + that.data.day + '&accountid=' + that.data.accountid + '&remarks=' + that.data.remarks + '&image=' + that.data.image + '&date=' + that.data.date + '&categoryid=' + that.data.categoryid
    })
  },

  //删除按钮
  deleteTap:function(){
    var sort= this.data.sort
    var options={
      accountId: this.data.accountid,
      sort:this.data.sort
    }
    wx.showModal({
      title: '删除',
      content: '确定要删除该账单吗?',
      showCancel: true,//是否显示取消按钮
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          promise.getrequest('account/account/deleteAccount', options).then(res=>{
            console.log(res)
            if (res.data.errmsg =='交易内还存在清算状态'){
              wx.showModal({
                title: '温馨提示',
                content: '交易内还存在清算状态，无法删除该账单！',
                showCancel:false,
                success(res) {
                    wx.reLaunch({
                      url: '../home/home',
                    })
                }
              })
            
            }else{
              wx.showToast({
                title: '成功',//提示文字
                duration: 3000,//显示时长
                mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false  
                icon: 'success', //图标，支持"success"、"loading"  

              })
              wx.reLaunch({
                url: '../home/home',
              })
            }
            
            // var pages = getCurrentPages();//当前页面栈
            // if (pages.length > 1) {
            //   var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
            //   beforePage.straining();//触发父页面中的方法
            // }
            // wx.navigateBack({
            //   delta: 1
            // }) 
          
          })
          
        }
      },
     
    })
  }

 

})