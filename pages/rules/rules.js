import {
  getReservationRule
} from '../../service/other.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rules: null,
    storeName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var gb_id = wx.getStorageSync('GB_ID'),
        gb_name = wx.getStorageSync('storeName');
    getReservationRule(gb_id).then(res => {
      if (res.data.code == 1) {
        var rulesTime = res.data.data[0];
        var hours = 0;
        var miniutes = 0;
        if (rulesTime.CancelClass % 60 == 0) {
          hours = Math.floor(rulesTime.CancelClass / 60);
          rulesTime.CancelClass = hours + '小时'
        }else{
          hours = Math.floor(rulesTime.CancelClass / 60);
          miniutes = rulesTime.CancelClass - hours * 60;
          rulesTime.CancelClass = hours + '小时' + miniutes + '分钟'
        }
        this.setData({
          rules: rulesTime,
          storeName:gb_name
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