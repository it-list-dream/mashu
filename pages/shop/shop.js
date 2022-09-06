// pages/shop/shop.js
import {
  getGymList
} from '../../service/home.js'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myStore: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    getGymList().then(res => {
      if (res.data.code == 1) {
        wx.hideLoading();
        this.setData({
          myStore: res.data.data,
          gymCount:res.data.gymCount
        })
      }
    })
  },
  //
  chooseShop(e){
     var shop = e.currentTarget.dataset.shop;
     var my_id = wx.getStorageSync('UI_ID');
     if(shop.UI_ID){
       if(shop.UI_ID != my_id){
        app.globalData.switchStores = true;
        wx.setStorageSync('UI_ID', shop.UI_ID);
       }
     }else{
       wx.setStorageSync('UI_ID',0)
     }
     wx.setStorageSync('GB_ID',shop.GB_ID);
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

  }
})