// page2/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipMessage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // type 1 表示购买成功 2 表示预约成功
    var tip;
    if (options.type == 1) {
      tip = '购买成功'
    } else {
      tip = '预约成功'
    }
    this.setData({
      tipMessage: tip
    })
  },
  backHome() {
    wx.switchTab({
      url: '/pages/tabbar/home/home',
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

  }
})