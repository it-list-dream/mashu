// pages/courseDetail/courseDetail.js
import {
  getEquestrianOrderBuyByStored,
  getEquestrianOrderBuyBywxPaySuccess,
  getEquestrianOrderBuyBywxPay
} from '../../service/other.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['微信支付', '储值支付'],
    pay_index: 0,
    //课程的总价
    allPrice: 0,
    courseNum: 1,
    //是否显示价格
    isShowPrice: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.course)
    if (options.course) {
      var course = JSON.parse(options.course)
      if (course.Price) {
        this.setData({
          isShowPrice: true,
          allPrice: course.Price
        })
      } else {
        this.setData({
          isShowPrice: false
        })
      }
      this.setData({
        courseDetail: course
      })
    }
  },
  bindPickerChange(e) {
    this.setData({
      pay_index: e.detail.value
    })
  },
  reduce() {
    let num = Number(this.data.courseNum) - 1;
    //单价
    let univalence = Number(this.data.courseDetail.Price);
    if (Number(this.data.courseNum) > 1) {
      let totlePrice = univalence * num;
      this.setData({
        courseNum: num,
        allPrice: totlePrice.toFixed(2)
      })

    } else {
      wx.showToast({
        icon: "none",
        title: '课程数量不能为0',
      })
    }
  },
  plus() {
    let num = Number(this.data.courseNum) + 1;
    //单价
    let univalence = Number(this.data.courseDetail.Price);
    let totlePrice = univalence * num;
    this.setData({
      courseNum: num,
      allPrice: totlePrice.toFixed(2)
    })
  },
  //买课
  payClass() {
    if (this.data.pay_index == 1) {
      console.log('储值支付')
      this.getStoredPay();
    } else {
      console.log('微信支付')
      this.getWechat()
    }
  },
  //微信支付
  getWechat() {
    var that = this;
    var ui_id = wx.getStorageSync('UI_ID') || 0;
    var gb_id = wx.getStorageSync('GB_ID');
    var payInfo = {
      userId: ui_id,
      se_id: this.data.courseDetail.SE_ID,
      num: this.data.courseNum,
      gymId: gb_id
    }
    getEquestrianOrderBuyBywxPay(JSON.stringify(payInfo)).then(res => {
      if (res.data.code == 1) {
        that.getpaydata(res.data.data[0].OrderNo, res.data.businessNo, res.data.data[0].MoneyShould * 100)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    });
  },
  //微信
  getpaydata(order, businessNo, money) {
    var that = this
    console.log(order, businessNo, money)
    wx.request({
      url: "https://shop.360ruyu.cn/api/gym/gym.asmx/GetPayDataAppletV2",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        UserOpenId: wx.getStorageSync("userOpenid"),
        out_trade_no: order,
        productId: "aa",
        body: "ss",
        attach: "df",
        sub_mch_id: businessNo,
        total_fee: money
      },
      method: 'POST',
      success: function (res) {
        // 微信支付接口
        wx.requestPayment({
          'timeStamp': res.data.data[0].timeStamp,
          'nonceStr': res.data.data[0].nonceStr,
          'package': res.data.data[0].package,
          'signType': 'MD5',
          'paySign': res.data.data[0].paySign,
          'success': function (res) {
            that.ordersuccess(order)
          },
          'fail': function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '支付失败，请重新支付',
              icon: 'none'
            })
          },
          'complete': function (res) {}
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      },
    })
  },
  ordersuccess(order) {
    getEquestrianOrderBuyBywxPaySuccess(order).then(res => {
      if (res.data.code == 1) {
        wx.navigateTo({
          url: '/page2/success/success?type=1',
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  //储值支付
  getStoredPay() {
    //var 
    var ui_id = wx.getStorageSync('UI_ID') || 0;
    var gb_id = wx.getStorageSync('GB_ID');
    var payInfo = {
      userId: ui_id,
      se_id: this.data.courseDetail.SE_ID,
      num: this.data.courseNum,
      gymId: gb_id
    }
    getEquestrianOrderBuyByStored(JSON.stringify(payInfo)).then(res => {
      if (res.data.code == 1) {
        // console.log(res.data.data)
        wx.navigateTo({
          url: '/page2/success/success?type=1',
        })
      } else {
        wx.showToast({
          icon: none,
          title: res.data.msg,
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

  }
})