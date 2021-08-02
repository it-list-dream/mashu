// pages/courseDetail/courseDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['微信支付', '储值支付'],
    pay_index: 0,
    coursePrice:300,
    allPricce:300,
    courseNum:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindPickerChange(e) {
    //console.log(e)
    this.setData({
      pay_index: e.detail.value
    })
  },
  reduce(){
    console.log('---------')
    let num = this.data.courseNum -1;
    if(this.data.courseNum >1){
      this.setData({
        courseNum:num,
        allPricce:this.data.coursePrice * num
      })
    }else{
      wx.showToast({
        icon:"none",
        title: '课程数量不能为0',
      })
    }
  },
  plus(){
    let num = this.data.courseNum + 1;
    this.setData({
      courseNum:num,
      allPricce:this.data.coursePrice * num
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