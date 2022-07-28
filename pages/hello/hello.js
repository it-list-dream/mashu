// pages/hello/hello.js
import {
  getUrlBySign
} from '../../service/login.js'
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
    wx.setStorageSync('sign', options.sign || 'ruyu')
    if (wx.getStorageSync('token')) {
      wx.switchTab({
        url: '/pages/tabbar/home/home'
      })
    } else {
      getUrlBySign(options.sign || 'ruyu').then(res => {
        //console.log(res)
        if (res.data.code == 1) {
          //console.log(res)
          wx.setStorageSync('token', res.data.user_token);
          wx.setStorageSync('storeName', res.data.GymName)
          wx.switchTab({
            url: '/pages/tabbar/home/home'
          })
        }
      })
    }

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