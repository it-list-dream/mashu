var baseURL = 'https://user.360ruyu.cn/EquestrianUserV2.asmx';
// 同时发送异步代码的次数
let ajaxTimes = 0;
var fixtion = {};

var request = (options) => {
  if (options.url == '/GetUrlBySign' || options.url == '/WxUserLogin' || options.url == '/userPhoneBind') {
    fixtion = {
      key: "BD687B66ECDBED4E12C4320B0ABB3BB111",
    }
  }
  
  if (options.url == '/EquestrianOrderBuyBywxPay' || options.url == '/EquestrianOrderBuyByStored' || options.url == '/EquestrianOrderBywxPay' || options.url == '/EquestrianOrderClassBywxPay' || options.url == '/EquestrianOrderByStored' || options.url == '/EquestrianOrderClassByStored') {
    ajaxTimes++;
    wx.showLoading({
      title: '支付中...',
      mask: true
    })
  }

  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
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
        if (res.data.code == 1) {
          resolve(res)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            fail(err){
               console.log(err)
            }
          })
        }
      },
      fail(res) {
        // wx.showToast({
        //   title: '网络不稳定',
        //   icon: 'error',
        //   duration: 2000
        // })
        reject(res);
      },
      complete: function () {
        if (options.url == '/EquestrianOrderBuyBywxPay' || options.url == '/EquestrianOrderBuyByStored' || options.url == '/EquestrianOrderBywxPay' || options.url == '/EquestrianOrderClassBywxPay' || options.url == '/EquestrianOrderByStored' || options.url == '/EquestrianOrderClassByStored') {
          ajaxTimes--;
          if (ajaxTimes === 0) {
            //  关闭正在等待的图标
            wx.hideLoading();
          }
        }

      }
    })
  })
};

//支付加载
module.exports = {
  request: request
};