const app = getApp()


// const checkWxSession = function(){
//   return new Promise(resolve=>{
//     wx.checkSession({
//       success(){
//         resolve(true)  //session_key未过期，并且生命周期一直有效
//       },
//       fail(){
//         resolve(false) //session_key已经失效，需要重新执行登录流程
//       }
//     })
//   })
// }

const checkWxSession = function() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        resolve(true) //session_key未过期，并且生命周期一直有效
      },
      fail(err) {
        resolve(false)  //session_key已经失效，需要重新执行登录流程
      }
    })
  })
}

const getcode = function() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function(e) {
        wx.clearStorage('COOKIE');
        app.globalData.js_code = e.code
        resolve(e.code);
      },
      fail: function(e) {
        reject(e);
      }
    })
  })
}


/**首次登录的时候请求cookie,并储存用户信息 */
const getcookie = function (url, code, userName, charImage) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method: 'post',
      data:{
        'js_code': code,
        'grant_type': "authorization_code",
        'userName': userName,
        'charImage': charImage,
      },
      header: {
        'content-Type': 'application/json',
      },
      success(request) {
        console.log(request)
        //if (request.data.errmsg != 'OK' || request.cookies == '' || request.cookies == 'undefined') {
          wx.clearStorage('COOKIE');
          var str = request.header['Set-Cookie'];
          //var str2 = str.slice(0, -18);
          //console.log(str2.slice(0, -18));
          resolve(str);
        //}
      },
      fail(error) {
        reject('网络出错' + error.data)
      }
    })
  })
}

//根据服务器返回的数据判断cookie是否失效，若失效则重新登录
const getrequest=function(url,options){
  return new Promise((resolve,reject)=>{
    wx.request({
      url:`${app.globalData.baseUrl}${url}`,
      method: 'GET',
      header: {
        'content-Type': 'application/json',
        'cookie': wx.getStorageSync('COOKIE'),
      },
      data: options,
      success:function(res){
        resolve(res)
      },
      fail:function(err){
        reject('网络出错' + error.data)
      }
    })
  })
}
const getcategory = function (url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method: 'GET',
      header: {
        'content-Type': 'application/json',
      },
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject('网络出错' + error.data)
      }
    })
  })
}

const acceptdate = function (num, list, element){
  return new Promise((resolve, reject) => {
    for (var i = 0; i < list.length; i++) {
      if (list[i].title == element) {
        var select = i
        var options={
          currentTab: num,
          currentType: select,
        }
        resolve(options)
      }else{
        reject('网络出错')
      }
    }
  })
}
module.exports = {
  checkWxSession,
  getcode,
  getcookie,
  getrequest,
  getcategory,
  acceptdate
}