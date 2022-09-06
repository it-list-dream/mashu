const app = getApp();
import {
  getUrlBySign
} from '../../../service/login.js';

import {
  getMyCardList
} from '../../../service/my.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    unloginUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    myStoredValue: 0,
    myCoupon: 0,

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      isIphone: app.globalData.isIphone
    })
  },
  getMyCard() {
    let gb_id = wx.getStorageSync('GB_ID'),
      ui_id = wx.getStorageSync('UI_ID');
    getMyCardList(gb_id).then(res => {
      if (res.data.data.length > 0) {
        let allList = res.data.data,
          selectCard = null;
        if (ui_id) {
          for (let i = 0; i < allList.length; i++) {
            if (ui_id == allList[i].UI_ID) {
              selectCard = allList[i];
              break;
            }
          }
          this.setData({
            myCard: selectCard,
            myStoredValue: selectCard.UI_Money || 0,
            myCoupon: selectCard.EO_Have || 0
          })
        } else {
          this.setData({
            myCard: res.data.data[0],
            myStoredValue: res.data.data[0].UI_Money || 0,
            myCoupon: res.data.data[0].EO_Have || 0
          });
          wx.setStorageSync('UI_ID', res.data.data[0].UI_ID);
        }
      } else {
        this.setData({
          myCard: null,
          myStoredValue: 0,
          myCoupon: 0
        });
      }
    })
  },
  stored() {
    var phone = wx.getStorageSync('phone');
    if (phone) {
      wx.navigateTo({
        url: '/page2/myStored/myStored?money=' + this.data.myStoredValue,
      })
    } else {
      this.loginout();
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //登录
  loginout() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  //预约日程
  appointmentSchedule() {
    wx.switchTab({
      url: '/pages/tabbar/appointmentRecord/appointmentRecord',
    })
  },
  //我的订单
  myOrder() {
    var phone = wx.getStorageSync('phone')
    if (phone) {
      wx.navigateTo({
        url: '/pages/order/order',
      })
    } else {
      this.loginout();
    }
  },
  myCoupon() {
    var phone = wx.getStorageSync('phone')
    if (phone) {
      wx.navigateTo({
        url: '/pages/myCourse/myCourse',
      })
    } else {
      this.loginout();
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.showMyInfo();
    this.getMyCard();
  },
  showMyInfo() {
    let status = wx.getStorageSync('loginStatus') || 0;
    let phone = wx.getStorageSync('phone') || null;
    let user = wx.getStorageSync('userInfo');
    this.setData({
      status: status,
      user: user,
      phone: phone
    });
  },
  //退出
  exit() {
    var that = this;
    wx.showModal({
      title: '',
      content: '确定是否需要退出',
      success(res) {
        if (res.confirm) {
          //清除所有的登录状态
          // wx.clearStorageSync();
          wx.removeStorageSync('token')
          wx.removeStorageSync('phone')
          wx.removeStorageSync('UI_ID')
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('hasUserInfo')
          wx.setStorageSync('loginStatus', 0)
          that.getStoreSign("wdly");
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  callPhone(phoneNumber) {
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
  getStoreSign(sign) {
    var that = this;
    getUrlBySign(sign).then(res => {
      if (res.data.code == 1) {
        wx.setStorageSync('token', res.data.user_token);
        that.getMyCard();
        that.showMyInfo();
      }
    });
  },
  myCardBag() {
    wx.navigateTo({
      url: '/page2/cardBag/cardBag',
    })
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