// pages/order/order.js
import {
  getMyOrderList
} from '../../service/other.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    pageSize: 5,
    isEnd: false,
    orderList: [],
    //下拉刷新 
    isRefreshing: true,
    //加载更多
    isLoadingMoreData: false,
  },
  //{"pageindex":1,"pagesize":20,"userid":3834
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyOrderRewrad();
  },
  getMyOrderRewrad() {
    var order = {
      pageindex: this.data.pageIndex,
      pagesize: this.data.pageSize,
      userid: wx.getStorageSync('UI_ID') || 0
    }
    //获取订单列表
    getMyOrderList(JSON.stringify(order)).then(res => {
      if (res.data.code == 1) {
        var newOrder = res.data.data;
        var order = this.data.orderList;
        if (res.data.data.length > 0) {
          order.push(...newOrder)
          this.setData({
            orderList: order
          })
        } else {
          this.setData({
            isEnd: true,
            isLoadingMoreData:false
          })
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
    //console.log('触底了')
    if (!this.data.isEnd) {
      //console.log(1111)
      var page = this.data.pageIndex
      page += 1;
      this.setData({
        isLoadingMoreData: true,
        pageIndex: page
      })
      this.getMyOrderRewrad();
    }
  }
})