// pages/chooseCoach/chooseCoach.js
import {
  getCoachStyleList
} from '../../service/home.js'
import {
  getEquestrianPriceByTeacher
} from '../../service/appointment.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coachList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.title = options.title;
    if (options.title == '教练列表') {
      console.log('教练列表')
      this.getCoachList();
    } else {
      console.log('选择教练')
      this.getTeacherPrice(options.id);
    }
    wx.setNavigationBarTitle({
      title: this.title
    })
  },
  coachStatus(e) {
    let coach = e.currentTarget.dataset.coach;
    if (this.title == '选择教练') {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('updateCoach', {coach:coach});
      wx.navigateBack({
        delta: 1,
      })
    } else {
      wx.navigateTo({
        url: '/pages/coachDetail/coachDetail?coach=' + JSON.stringify(coach),
      })
    }
  },
  getTeacherPrice(id) {
    var gb_id = wx.getStorageSync('GB_ID')
    getEquestrianPriceByTeacher(gb_id,id).then(res => {
      if (res.data.code == 1) {
        this.setData({
          coachList: res.data.data
        })
      }
    })
  },
  getCoachList() {
    let gb_id = wx.getStorageSync('GB_ID')
    getCoachStyleList(gb_id).then(res => {
      if (res.data.code == 1) {
        //console.log(res);
        this.setData({
          coachList: res.data.data
        })
      }
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
        title: '该教练没有预留电话号码',
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})