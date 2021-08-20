// pages/tabbar/appointmentRecord/appointmentRecord.js

import {
  getMyReservationList
} from '../../../service/appointment.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs_list: ['已预约', '未完成', '已完成'],
    chooseId: 0,
    //分页的属性
    pageSize: 4,
    //下拉刷新 
    isRefreshing: true,
    //加载更多
    isLoadingMoreData: false,
    //当前选中的元素
    currentType: 'reserved',
    appointmentList: {
      reserved: {
        //当前页数
        pageIndex: 1,
        list: [],
        flag: true
      },
      uncomplete: {
        //当前页数
        pageIndex: 1,
        list: [],
        flag: true
      },
      completed: {
        //当前页数
        pageIndex: 1,
        list: [],
        flag: true
      }
    },
    //返回顶部
    topNum: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // {
    //       "pageindex":1,
    //       "pagesize":10,
    //       "userid":1,
    //       "type":0
    //   }type=0 全部，1预约中，2，已完成，3，已取消
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          windowHeight: result.windowHeight
        })
      }
    })
    //已预约
    this.getReservationList('reserved', 1);
    //未完成
    this.getReservationList('uncomplete', 3);
    //已完成
    this.getReservationList('completed', 2);
  },
  chooseTabs(e) {
    var index = e.currentTarget.dataset.index;
    if (index == this.data.chooseId) {
      return
    }
    //加载数据
    let currentType = ''
    switch (index) {
      case 0:
        currentType = 'reserved';
        break
      case 1:
        currentType = 'uncomplete'
        this.goTop()
        break
      case 2:
        currentType = 'completed'
        this.goTop()
        break
    }
    this.setData({
      currentType: currentType,
      chooseId: index
    })
  },
  //加载更多数据
  loadMore() {
    console.log('下拉加载更多');
    let appointmentList = this.data.appointmentList;
    let type = this.data.currentType;

    if (appointmentList[type].flag) {
      this.setData({
        isRefreshing: true,
        isLoadingMoreData: true
      })
      var my_type = null;
      switch (type) {
        case 'completed':
          my_type = 2;
          break
        case 'uncomplete':
          my_type = 3
          break
        case 'reserved':
          my_type = 1
          break
      }
      appointmentList[type].pageIndex += 1; //获取当前页数并+1
      this.setData({
        appointmentList: appointmentList
      })
      this.getReservationList(type, my_type)
      console.log('加载更多数据');
    }
  },
  //回到顶部
  goTop: function (e) { // 一键回到顶部
    this.setData({
      topNum: 0
    });
  },
  //预约记录
  getReservationList(currentType, type) {
    let ui_id = wx.getStorageSync('UI_ID') || 0;
    var reservation = {
      pageindex: this.data.appointmentList[currentType].pageIndex,
      pagesize: this.data.pageSize,
      userid: ui_id,
      type: type
    };
    getMyReservationList(JSON.stringify(reservation)).then(res => {
      let appointmentList = this.data.appointmentList;
      if (res.data.code == 1) {
        console.log(appointmentList)
        if (res.data.data.length > 0) {
          appointmentList[currentType].list.push(...res.data.data)
          this.setData({
            appointmentList: appointmentList
          })
        } else {
          appointmentList[currentType].flag = false;
          this.setData({
            appointmentList: appointmentList,
            isLoadingMoreData: false
          })
        }
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
})