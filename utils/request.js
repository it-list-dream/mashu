var baseURL = 'https://user.360ruyu.cn/EquestrianUser.asmx';
// 同时发送异步代码的次数
let ajaxTimes = 0;
var fixtion = {};

var request = (options) => {
  if (options.url == '/GetUrlBySign' || options.url == '/WxUserLogin' || options.url == '/userPhoneBind') {
    fixtion = {
      key: "BD687B66ECDBED4E12C4320B0ABB3BB111",
    }
  }
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
   // console.log(token)
    let header = {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': token
    };
    // ajaxTimes++;
    // wx.showLoading({
    //   title: '加载中...',
    // })
    wx.request({
      url: baseURL + options.url || '',
      data: {
        ...fixtion,
        ...options.data
      },
      method: options.method || 'POST',
      header: options.header || header,
      timeout: 15000,
      success(res) {
        resolve(res);
      },
      fail(res) {
        wx.showToast({
          title: '网络断开了',
          icon: 'error',
          duration: 2000
        })
        reject(res);
      },
      complete: function () {
        // ajaxTimes--;
        // if (ajaxTimes === 0) {
        //   //  关闭正在等待的图标
        //   wx.hideLoading();
        // }
      }
    })
  })
};

//支付加载
module.exports = {
  request: request
};