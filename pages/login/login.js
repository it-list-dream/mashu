// pages/login/login.js
const app = getApp();
import {
  getWxUserLogin,
  getUserPhoneBind
} from '../../service/login.js'
import {
  getMyCardList
} from '../../service/my.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      windowHeight: app.globalData.windowHeight,
      hasUserInfo: wx.getStorageSync('hasUserInfo') || false,
      storeName: wx.getStorageSync('storeName'),
      stroeLogo: wx.getStorageSync('storeLogo')
    })
    this.login();
  },
  login() {
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
  },
  getUserProfile(e) {
    var that = this;
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        console.log(res.userInfo)
        wx.setStorageSync('hasUserInfo', true)
        wx.setStorageSync('userInfo', res.userInfo)
        //登录状态
        wx.setStorageSync('loginStatus', 1)
        that.setData({
          userInfo: res.userInfo,
          showModal: true,
          hasUserInfo: true
        })
      },
      fail: function () {
        // console.log('用户拒绝获取头像信息');
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  onCancel() {
    wx.showToast({
      icon: "none",
      title: '取消授权',
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 1500)
  },
  modalCancel() {
    wx.navigateBack({
      delta: 1,
    })
  },
  _navBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
  //获取手机号码
  getPhoneNumber(e) {
    var that = this
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      //登录
      wx.login({
        success: function (res) {
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
                   that.getMyCard();
                } else {
                  wx.navigateBack({
                    delta: 1,
                  })
                }
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
  getMyCard() {
    let gb_id = wx.getStorageSync('GB_ID')
    getMyCardList(gb_id).then(res => {
      if (res.data.code == 1) {
        if(res.data.data.length>0){
          wx.setStorageSync('UI_ID', res.data.data[0].UI_ID)
        }
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})