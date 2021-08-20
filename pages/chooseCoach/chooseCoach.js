// pages/chooseCoach/chooseCoach.js
import {
  getCoachStyleList
} from '../../service/home.js'
import {getEquestrianPriceByTeacher} from '../../service/appointment.js'
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
    //console.log(options)
    this.title = options.title;
    if(options.title=='教练列表'){
      this.getCoachList();
    }else{
       this.getTeacherPrice(options.id);
    }
    wx.setNavigationBarTitle({
      title: this.title
    })
  },
  coachStatus(e) {
    var pages = getCurrentPages(); //当前页面
    var prevPage = pages[pages.length - 2];
    let coach = e.currentTarget.dataset.coach;
    if (this.title == '选择教练') {
      //console.log('选择教练')
      prevPage.setData({
        checked_horse: true,
        currentCoach:coach,
        isChooseCoach:true
      });
      wx.navigateBack({
        delta: 1,
      })
    } else {   
      console.log('教练详情')
      wx.navigateTo({
        url: '/pages/coachDetail/coachDetail?coach='+JSON.stringify(coach),
      })
    }
  },
  getTeacherPrice(id){
    getEquestrianPriceByTeacher(id).then(res=>{
        if(res.data.code ==1){
           this.setData({
            coachList:res.data.data
           })
        }
    })
  },
  getCoachList() {
    let gb_id = wx.getStorageSync('GB_ID')
    getCoachStyleList(gb_id).then(res => {
      if (res.data.code == 1){
        console.log(res);
        this.setData({
          coachList:res.data.data
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})