const app = getApp()
//const promise = require('../plugins/es6-promise.js')


const js_cookie = '';
class Http {
  static checksession(){
    return new Promise((resolve, reject) => {
      //var that =this;
      wx.checkSession({
        success: function() {
          console.log('微信处于登录状态!')
          resolve('session_key未过期')
        },
        fail: function() {
          wx.clearStorage('COOKIE');
          console.log('请先登录，获取cookie!');
          wx.login({
            success: function(res) {
              console.log(res.code);
              resove(res.code);
            },
            fail: function(res) {
              reject('登录失败！' + res.errMsg)
            }
          })
        }
      })
    })
  }

  static putcookie (url, options){
    return new Promise((resolve, code) => {
      //异步代码
      //resolve——成功了
      //reject——失败了
      wx.request({
        url: `${app.globalData.baseUrl}${url}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'js_code':code,
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
  }
}



module.exports =  Http;