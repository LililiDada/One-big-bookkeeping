const promise = require('../../utils/promise.js');
const app = getApp()

Page({

  
  data: {
   ring:{},
    cueShow:true,
    backgroundUrl:'/images/background.png'
  },
  onLoad: function (options) {
    //背景图片在手机预览无法显示，需进行转码
    let base64 = wx.getFileSystemManager().readFileSync(this.data.backgroundUrl, 'base64');
    this.setData({
      backgroundUrl: 'data:image/jpg;base64,' + base64
    });

    promise.getrequest('circle/circle/getCircle').then(res=>{
      console.log(res);
      var ringmsg=[];
      for (var idx in res.data){
        var data= res.data[idx];
        var ringname = data.circleName;
        if (ringname.length>3){
          ringname = ringname.substring(0,3)+'...';
        }
        var temp={
          ringname: ringname,
          circleName: data.circleName,
          categoryId: data.categoryId,
          circleId: data.circleId,
          day: data.day,
          image: data.image
        }
        ringmsg.push(temp)
      }
      this.setData({
        ring: ringmsg,
        cueShow:false
      })
    })
  },
  addBillRing:function(){
    wx.navigateTo({
      url: '../addring/addring',
    })
  },
  detailRingTap:function(e){
    var par = e.currentTarget.dataset;
    var para = 'circleId=' + par.circleid
    wx.navigateTo({
      url: '../detailring/detailring?' + para,
    })
  }
})