//const Promise = request('../plugins/es6-promise.js')

const js_cook = '';

let putcode = new Promise(function(resolve,reject){
  wx.checkSession({
    success:function(){
      console.log('微信处于登录状态!')
    },
    fail: function () {
      wx.clearStorage('COOKIE');
      console.log('请先登录，获取cookie!');
      wx.login({
        success: function (res) {
          console.log(res.code);
          js_cookie: res.code;
          console.log(js_cookie);
        },
        fail: function (res) {
          console.log('登录失败！' + res.errMsg)
        }
      })
    }
  })
})

let putcookie = new Promise(function(resolve,rejecr){
  var that = this;
  wx.request({
    url: 'http://111.230.228.113/index.php/login',
    method: 'GET',
    data: options.data,
    header: {
      'Content-Type': 'application/json',
      'js_code': that.js_code,
      'grant_type': "authorization_code",
    },
    success(request) {
      if (request.data.errmsg != 'OK' || request.cookies == '' || request.cookies == 'undefined') {
        wx.clearStorage('COOKIE');
        var str = res.header['Set-Cookie'];
        var str2 = str.slice(0, -18);
        console.log(str2.slice(0, -18));
        resolve(wx.setStorageSync('COOKIE', str2));
      }
    },
    fail(error) {
      reject('网络出错' + error.data)
    }
  })
})

module.exports = {
   putcode,
   putcookie
}