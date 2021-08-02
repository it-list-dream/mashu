// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      windowHeight: app.globalData.windowHeight,
      hasUserInfo: wx.getStorageSync('hasUserInfo') || false
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
          // showModal: true,
          hasUserInfo: true
        })
      },
      fail: function () {
        console.log('用户拒绝获取头像信息');
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  onCancel() {
    wx.navigateBack({
      delta: 1,
    })
  },
  _navBack(){
   wx.navigateBack({
     delta: 1,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})