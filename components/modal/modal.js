// components/modal/modal.js
//var api = require('../../utils/request.js')
import {
  getMyCardList
} from '../../service/my.js'
import {
  getWxUserLogin,
  getUserPhoneBind
} from '../../service/login.js'
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
      this.triggerEvent('cancel', false)
    },
    //通过绑定手机号登录
    getPhoneNumber: function (e) {
      var that = this
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        //登录
        wx.login({
          success: function (res) {
            // let code = res.code
            getWxUserLogin(res.code).then(res => {
              if (res.data.code == 1) {
                wx.setStorageSync('userOpenid', res.data.openid);
                wx.setStorageSync('token', res.data.user_token);
                getUserPhoneBind(e.detail.encryptedData,
                  e.detail.iv).then(res => {
                  //保存token 
                  if (res.data.code == 1) {
                    wx.setStorageSync('token', res.data.user_token);
                    wx.setStorageSync('loginStatus', 2);
                    // 保存手机号码
                    wx.setStorageSync('phone', res.data.phone);
                  }
                  wx.navigateBack({
                    delta: 1,
                  })
                })
              }
            })
          }
        })
      } else {
        //返回上一个页面
        wx.navigateBack({
          delta: 1,
        })
      }
    },
    //
    getMyCard() {
      let gb_id = wx.getStorageSync('GB_ID')
      getMyCardList(gb_id).then(res => {
        if (res.data.code == 1 && res.data.data.length>0) {
          wx.setStorageSync('UI_ID', res.data.data[0].UI_ID)
        }
      })
    }
  }
})