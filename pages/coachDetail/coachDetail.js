// pages/coachDetail/coachDetail.js
import {
  getClassPriceByTearchId,
  getClassPriceByTearchIdUserId
} from '../../service/other.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myCoachList:[],
    coach:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(app.globalData.storePhone)
    var ui_id = wx.getStorageSync('UI_ID')
    if (options.coach) {
      let coach = JSON.parse(options.coach)
      this.setData({
        coach: coach
      })
      if (Number(ui_id) > 0) {
        this.getCoachById(coach.FK_AL_TeachCoach_ID)
      } else {
        this.getCoachById1(coach.FK_AL_TeachCoach_ID);
      }
    }
  },
  callPhone() {
    var phoneNumber = app.globalData.storePhone;
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
  getCoachById(teacherid) {
    var userId = wx.getStorageSync('UI_ID');
    var gb_id = wx.getStorageSync('GB_ID');
    getClassPriceByTearchIdUserId(gb_id,teacherid, userId).then(res => {
      if (res.data.code == 1) {
        this.setData({
          myCoachList: res.data.data
        })
      }
    })
  },
  getCoachById1(teacherid) {
    var gb_id = wx.getStorageSync('GB_ID');
    getClassPriceByTearchId(gb_id,teacherid).then(res => {
      if (res.data.code == 1) {
        this.setData({
          myCoachList: res.data.data
        })
      }
    })
  },
  toCoachDetail(e) {
    let course = JSON.stringify(e.currentTarget.dataset.course);
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?course=' + course,
    })
  },
  callPhone(e){
    let phoneNumber = e.currentTarget.dataset.phone;
    if (phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: phoneNumber
      }).catch((e) => {
        console.log(e)
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '该教练没有预留手机号码',
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