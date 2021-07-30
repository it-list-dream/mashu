// pages/tabbar/profile/profile.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     unloginUrl:'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   //
    ///wx.setStorageSync('key', data)

    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //登录
  loginout(){
    //console.log(111)
     wx.navigateTo({
       url: '/pages/login/login',
     })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let status = wx.getStorageSync('loginStatus') ||0;
    let user = wx.getStorageSync('userInfo');
    this.setData({
      status:status,
      user:user
    })
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