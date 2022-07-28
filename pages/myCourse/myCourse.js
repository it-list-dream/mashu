// pages/myCourse/myCourse.js
import {
  getMyEquestrianListHave
} from '../../service/other.js'
var uitil = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs_list: ['可使用', '已过期'],
    chooseId: 0,
    //是否过期
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.classStatus(this.data.chooseId)
  },
  chooseTabs(e) {
    var index = e.currentTarget.dataset.index;
    if (index == this.data.chooseId) {
      return
    }
    this.classStatus(index)
    this.setData({
      chooseId: index
    })
  },
  classStatus(isexpire) {
    var GB_ID = wx.getStorageSync('GB_ID');
    var UI_ID = wx.getStorageSync('UI_ID') || 0;
    getMyEquestrianListHave(GB_ID, UI_ID, isexpire).then(res => {
      if (res.data.code == 1) {
        let newList = res.data.data;
        newList.forEach(item => {
          item.EO_ActiveEnd = uitil.format(item.EO_ActiveEnd, 'yyyy-mm-dd')
        })
        this.setData({
          list:newList
        })
      }
    })
  },
  //
  handleAppointment(e){
      var aboutCourse = e.currentTarget.dataset.course;
      console.log(aboutCourse)
      app.globalData.aboutCourse = aboutCourse;
      wx.switchTab({
        url: '/pages/tabbar/appointment/appointment',
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