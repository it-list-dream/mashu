// page2/courseList/courseList.js
import {
  getEquestrianClassAll
} from '../../service/other.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.trianClassAll();
  },
  courseDetail(e) {
    let course =JSON.stringify(e.currentTarget.dataset.course);
    console.log(course)
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?course='+course,
    })
  },
  trianClassAll() {
    var GB_ID = wx.getStorageSync('GB_ID');
    var UI_ID = wx.getStorageSync('UI_ID') || 0;
    getEquestrianClassAll(GB_ID, UI_ID).then(res => {
      if (res.data.code == 1) {
        this.setData({
          courseList: res.data.data
        })
      }
    })
  },
  callMe(){
    let phoneNumber = app.globalData.storePhone;
    console.log(phoneNumber)
    if (phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      }).catch((e) => {
        console.log(e) //用catch(e)来捕获错误{makePhoneCall:fail cancel}
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '该门店没有预留电话号码',
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

  }
})