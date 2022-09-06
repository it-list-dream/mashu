import {
  getMyCardList
} from '../../service/my.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allCard: [],
    selected: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var gb_id = wx.getStorageSync('GB_ID');
    var ui_id = wx.getStorageSync('UI_ID');
    getMyCardList(gb_id).then(res => {
      let list = res.data.data;
      list.forEach(item => {
        if (item.UI_ID == ui_id) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      })
      this.setData({
        allCard: res.data.data
      });
    })
  },
  switchChange(e) {
    var ui_id = e.currentTarget.dataset.userid;
    let list = this.data.allCard;
    for (let i = 0; i < list.length; i++) {
      if (list[i].UI_ID == ui_id) {
        list[i].checked = true;
        app.globalData.switchCard = true;
      } else {
        list[i].checked = false;
      }
    }
    if (ui_id) {
      wx.setStorageSync('UI_ID', ui_id);
    }
    this.setData({
      allCard:list
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