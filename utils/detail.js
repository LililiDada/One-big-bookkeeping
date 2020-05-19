/**
 * 每个页面表示哪个页面
 */

/**
 * home:首页
 * billdetail:首页每笔账单的详情
 * editbill:首页账单详情跳转至编辑
 */

/**
 * accounts:记一笔
 */

/**
 * ring:圈子
 * addring:添加圈子
 * fellow:添加圈子时显示已存在好友并可选择已存在好友或添加新好友
 * addfellow:添加圈子时添加好友中添加新好友
 * detailring:圈子里的账单列表
 * addbill:圈子里的账单添加
 * ringbilldetail:圈子里账单的详情
 * aboutdetailring:圈子里账单详情里面查看圈子成员和编辑或删除圈子
 * selectpayer:添加圈子账单是选择付款人
 * participant:添加圈子账单时选择参与人
 * countbill:圈子账单里参与人给予手动结算
 * paystatus:圈子里账单参与人清算详情
 * ringfellow:圈子里账单好友更改
 */

/**
 * my:我的
 * monthbudget:设置月预算
 * set:我的页面里面的设置
 */

/**
 * /**首次登录的时候请求cookie,并储存用户信息 */
// const getcookie = function (url, code) {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: `${app.globalData.baseUrl}${url}`,
//       method: 'post',
//       data: {
//         'js_code': code,
//         'grant_type': "authorization_code",
//       },
//       header: {
//         'content-Type': 'application/json',
//       },
//       success(request) {
//         console.log(request)
//         //if (request.data.errmsg != 'OK' || request.cookies == '' || request.cookies == 'undefined') {
//         wx.clearStorage('COOKIE');
//         var str = request.header['Set-Cookie'];
//         //var str2 = str.slice(0, -18);
//         //console.log(str2.slice(0, -18));
//         resolve(str);
//         //}
//       },
//       fail(error) {
//         reject('网络出错' + error.data)
//       }
//     })
//   })
// }
 

promise.getrequest('account/category/getCategory').then(res => {
  var category = [];
  for (var idx in res.data[0].category) {
    var subject = res.data[0].category[idx];
    var temp = {
      categoryId: subject.categoryId,
      title: subject.categoryName,
      imgsrc: subject.image
    }
    if (subject.sort == '支出') {
      category.push(temp);
    }
  }
  this.setData({
    type: category,
    circleId: e.circleId,
    categoryId: 1
  })
})
var options = {
  circleId: e.circleId,
}
promise.getrequest('circle/circle/getChargeFriend', options).then(res => {
  console.log(res.data)
  //获取第一个为付款人
  var payer
  for (var i in res.data) {
    payer = {
      userId: res.data[i].userId,
      userName: res.data[i].userName,
      money: ''
    }
    break;
  }
  //获取前五个参与人
  var participant = [];
  var count = 0
  for (var idx in res.data) {
    count++;
    var temp = {
      userId: res.data[idx].userId,
      userName: res.data[idx].userName,
      money: ''
    }
    participant.push(temp);
    if (count > 6) {
      break;
    }
  }
  //获取所有的参与者
  var allParticipant = []
  for (var i in res.data) {
    var temp = {
      userId: res.data[i].userId,
      userName: res.data[i].userName,
      money: ''
    }
    allParticipant.push(temp)
  }
  //获取总人数
  var allCount = 0;
  for (var i in res.data) {
    allCount++;
  }
  this.setData({
    allParticipant: allParticipant,//所有参与人
    payer: payer,//默认第一个为付款人
    participant: participant,//列表渲染前五个参与人
    allCount: allCount,
  })
  if (allCount > 5) {
    this.setData({
      morefiveShow: true
    })
  }
})

