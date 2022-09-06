// pages/courseDetail/courseDetail.js
import {
  getEquestrianOrderBuyByStored,
  getEquestrianOrderBuyBywxPaySuccess,
  getEquestrianOrderBuyBywxPay
} from '../../service/other.js'
import {
  getEquestrianClass
} from '../../service/other.js'
import {
  getUrlBySign
} from '../../service/login.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // '微信支付'
    array: ['储值支付'],
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
    var that = this;
    // console.log('----32-------', options)
    if (options.course) {
      var course = JSON.parse(options.course)
      if (course.Price || course.SE_Price) {
        this.setData({
          courseDetail: course,
          allPrice: course.Price || course.SE_Price,
          isShowPrice: true
        })
      } else {
        this.setData({
          courseDetail: course,
          isShowPrice: false
        })
      }
    }
    //判断是否是通过分享进入
    if (options.courseInfo) {
      var {
        GB_ID,
        SE_ID,
        sign
      } = JSON.parse(options.courseInfo);
      var UI_ID = wx.getStorageSync('UI_ID') || 0;
      // console.log(GB_ID,UI_ID, SE_ID,sign)
      getUrlBySign(sign).then(res => {
        if (res.data.code == 1) {
          if (wx.getStorageSync('token')) {
            // console.log('有token')
          } else {
            //console.log('没有token')
            wx.setStorageSync('token', res.data.user_token);
            wx.setStorageSync('GB_ID', GB_ID)
          }
          // console.log('---63-----',res)
          //数据
          getEquestrianClass(GB_ID, UI_ID, SE_ID).then(res => {
            if (res.data.code == 1) {
              //console.log('----67------',res)
              if (Number(res.data.data[0].Price) > 0) {
                that.setData({
                  courseDetail: res.data.data[0],
                  allPrice: res.data.data[0].Price,
                  isShowPrice: true
                })
              } else {
                that.setData({
                  courseDetail: res.data.data[0],
                  isShowPrice: false
                })
              }
            }
          })
        }
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
    let univalence = 0;
    //单价
    if (this.data.courseDetail.Price) {
      univalence = Number(this.data.courseDetail.Price);
    } else {
      univalence = Number(this.data.courseDetail.SE_Price);
    }
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
    let univalence = 0;
    if (this.data.courseDetail.Price) {
      univalence = Number(this.data.courseDetail.Price);
    } else {
      univalence = Number(this.data.courseDetail.SE_Price);
    }
    let totlePrice = univalence * num;
    this.setData({
      courseNum: num,
      allPrice: totlePrice.toFixed(2)
    })
  },
  //买课
  payClass() {
    this.getStoredPay();
    // if (this.data.pay_index == 1) {
    //   console.log('储值支付')
    //   this.getStoredPay();
    // } else {
    //   console.log('微信支付')
    //   this.getWechat()
    // }
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
        that.getpaydata(res.data.data[0].OrderNo, res.data.businessNo,(res.data.data[0].MoneyShould * 100).toFixed(0))
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
      url: "https://shop.360ruyu.cn/api/gym/gym.asmx/GetPayDataAppletV3",
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
       // wx.hideLoading()
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      },
    })
  },
  ordersuccess(order) {
    var that = this;
    getEquestrianOrderBuyBywxPaySuccess(order).then(res => {
      if (res.data.code == 1) {
        wx.navigateTo({
          url: '/page2/success/success?type=1&SE_ID=' + that.data.courseDetail.SE_ID,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  //联系我们
  concatMe() {
    var phoneNumber = app.globalData.storePhone
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
  //储值支付
  getStoredPay() {
    var that = this;
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
        wx.navigateTo({
          url: '/page2/success/success?type=1&SE_ID=' + that.data.courseDetail.SE_ID,
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.msg
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
  //分享
  onShareAppMessage() {
    var courseInfo = {
      GB_ID: wx.getStorageSync('GB_ID'),
      // UI_ID: wx.getStorageSync('UI_ID') || 0,
      SE_ID: this.data.courseDetail.SE_ID,
      sign: wx.getStorageSync('sign')
    }
   // console.log("/pages/courseDetail/courseDetail?courseInfo=" + JSON.stringify(courseInfo))
    return {
      title: '课程详情',
      path: "/pages/courseDetail/courseDetail?courseInfo=" + JSON.stringify(courseInfo),
      imageUrl: "http://mmbiz.qpic.cn/mmbiz_png/Uh5zpoOsMunRnZvh4wdn9ZQfHib7W4QfKseSD11Ru5dfar7cQhVqLkeMMw6sDia1edriakBA3ibwoPJ49T8TheibwGw/0?wx_fmt=png"
    }
  }
})