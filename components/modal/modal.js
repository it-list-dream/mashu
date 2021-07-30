// components/modal/modal.js
//var api = require('../../utils/request.js')
Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'shared'
  },
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: false
    },
    //modal的高度
    height: {
      type: String,
      value: '80%'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached: function () {
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            console.log(res.code)
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },
  methods: {
    clickMask() {
      this.setData({
        show: false
      })
    },
    cancel() {
      this.setData({
        show: false
      })
      this.triggerEvent('cancel',false)
    },
    //通过绑定手机号登录
    getPhoneNumber: function (e) {
      var that = this
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        //登录
        // wx.login({
        //   success: function (res) {
        //     let code = res.code
        //     api.request({
        //       url: "/WxUserLogin",
        //       data: {
        //         user_token: wx.getStorageSync('token'),
        //         code: code
        //       }
        //     }).then(res => {
        //       if (res.data.code == 1) {
        //         wx.setStorageSync('userOpenid', res.data.openid);
        //         api.request({
        //           url: "/userPhoneBind",
        //           data: {
        //             user_token: res.data.user_token,
        //             encryptedDataStr: e.detail.encryptedData,
        //             iv: e.detail.iv,
        //           }
        //         }).then(res => {
        //           //保存token 
        //           if (res.data.code == 1) {
        //             wx.setStorageSync('token', res.data.user_token);
        //             wx.setStorageSync('loginStatus', 2);
        //             // 保存手机号码
        //             wx.setStorageSync('phone', res.data.phone);
        //              //获取已有的会员信息
        //             api.request({
        //               url: "/MyAllVIPCard",
        //               data: {
        //                 user_token: wx.getStorageSync('token')
        //               }
        //             }).then(res => {
        //               if (res.data.code == 1) {
        //                 if(res.data.data.length>0){
        //                   wx.setStorageSync('UI_ID', res.data.data[0].UI_ID);
        //                 }
        //                 //返回上一个页面
        //                 wx.navigateBack({
        //                   delta: 1,
        //                 })
        //               }
        //             })
        //           } else {
        //             wx.navigateBack({
        //               delta: 1,
        //             })
        //           }
        //         })
        //       }

        //     })
        //   }
        // })
      } else {
        //返回上一个页面
        wx.navigateBack({
          delta: 1,
        })
      }
    },
  }
})