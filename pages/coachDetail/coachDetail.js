// pages/coachDetail/coachDetail.js
import {getClassPriceByTearchId} from '../../service/other.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imgList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.coach){
      let coach = JSON.parse(options.coach)
       this.setData({
         coach:coach
       })
       this.getCoachById(coach.FK_AL_TeachCoach_ID);
    }
  },
  //预览图片，放大预览
  preview(event) {
    // console.log(event.currentTarget.dataset.src)
    // let currentUrl = event.currentTarget.dataset.src
    // wx.previewImage({
    //   current: currentUrl, // 当前显示图片的http链接
    //  // urls: this.data.imgList // 需要预览的图片http链接列表
    // })
  },
  //
  getCoachById(teacherId){
    getClassPriceByTearchId(teacherId).then(res=>{
      if(res.data.code ==1){
         this.setData({
           myCoachList:res.data.data
         })
      }
    })
  },
  toCoachDetail(e){
     let course =JSON.stringify( e.currentTarget.dataset.course);
     wx.navigateTo({
       url: '/pages/courseDetail/courseDetail?course='+course,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})