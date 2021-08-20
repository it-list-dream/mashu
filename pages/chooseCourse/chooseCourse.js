// pages/chooseCourse/chooseCourse.js
import {
  getMyEquestrianList
} from '../../service/appointment.js'
var util = require('../../utils/util.js')
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
    this.OwnerEquestrian();
  },
  //选课
  chooseCourse(e) {
    var pages = getCurrentPages(); //当前页面
    console.log(e.currentTarget.dataset.course)
    var prevPage = pages[pages.length - 2]; //上一页面
    prevPage.setData({
      currentCourse: e.currentTarget.dataset.course,
      checked_horse:false,
      isChooseCoach:false
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //马术
  OwnerEquestrian() {
    let gb_id = wx.getStorageSync('GB_ID');
    let ui_id = wx.getStorageSync('UI_ID') || 0;
    getMyEquestrianList(gb_id, ui_id).then(res => {
      let newList = [];
      if (res.data.code == 1) {
        newList = res.data.data;
        newList.forEach(item => {
          if(item.EO_ActiveEnd!==''){
            item.EO_ActiveEnd = util.format(item.EO_ActiveEnd, 'yyyy-mm-dd')
          }
        })
        this.setData({
          EquestrianList: newList
        })
      }
    })
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