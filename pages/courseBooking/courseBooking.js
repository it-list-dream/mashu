// pages/courseBooking/courseBooking.js
var uitl = require('../../utils/util.js')
let animationShowHeight = 600;
import {
  getPrivateClass,
  getEquestrianPriceByTeacher,
  getMyEquestrianList
} from '../../service/appointment.js'
import {
  getEquestrianOrderByStored,
  getEquestrianOrderClassByStored,
  getEquestrianOrderBywxPay,
  getEquestrianOrderClassBywxPay,
  getEquestrianOrderClassBywxPaySuccess,
  getEquestrianBywxPaySuccess
} from '../../service/pay.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //查看课时券
    useCoupon: false,
    animationData: "",
    pay_index: 0,
    payList: ['微信支付', '储值支付'],
    //选择日期
    startDate: null,
    lastDate: null,
    // date: "2021-07-21",
    appoinemntInfo: null,
    //最终价格
    finalPrice: 0,
    //总价
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    if (options.appoinemntInfo) {
      var appoinemntInfo = JSON.parse(options.appoinemntInfo);
     // console.log(appoinemntInfo)
      var price = 0;
      if (Number(appoinemntInfo.chooseCourse.EO_Have) > 0) {
        price = Number(appoinemntInfo.chooseCoach.ST_Price)
        this.setData({
          isUseConpoun: true
        })
      } else {
        price = Number(appoinemntInfo.chooseCourse.Price) + Number(appoinemntInfo.chooseCoach.ST_Price)
        this.setData({
          isUseConpoun: false
        })
      }
      appoinemntInfo.starttime = appoinemntInfo.starttime.substring(appoinemntInfo.starttime.length - 5);
      appoinemntInfo.endtime = appoinemntInfo.endtime.substring(appoinemntInfo.endtime.length - 5);
      
      this.setData({
        appoinemntInfo: appoinemntInfo,
        finalPrice: price,
        totalPrice: price
      })
    }
    this.selectDate();
    //选择时间
    this.chooseCoachPrivateTime();
    //选择教练
    this.chooseCoachList();
    //选择课程
    this.getMyChooseCourse1()
  },
  selectDate() {
    var startDate = uitl.format(new Date(), 'yyyy-mm-dd');
    let today = new Date().getTime();
    //获取30天后的日期
    let lastDate = uitl.format((today + 60 * 60 * 1000 * 24 * 30), 'yyyy-mm-dd');
    this.setData({
      startDate: startDate,
      lastDate: lastDate
    })
  },
  switchCoupon() {
    this.showModal();
  },
  useCoupon1(e) {
    // wx.showLoading({
    //   title: '加载中',
    //   mask:true
    // })
    //当前的课程  
    var curr_course = this.data.appoinemntInfo.chooseCourse;
    //选择的课程
    var choose_course = e.currentTarget.dataset.course;
    if (Number(curr_course.EO_ID) == Number(choose_course.EO_ID) && Number(choose_course.EO_Have) > 0) {
      //表示仅仅使用优惠券
      this.setData({
        isUseConpoun: true
      })
      //重新计算价格
      this.afreshCountPrice();
      //关闭弹窗
      this.hideModal();
      return;
    } else if (Number(curr_course.EO_ID) == Number(choose_course.EO_ID) && Number(choose_course.EO_Have) == 0) {
      //重新计算价格
      this.afreshCountPrice();
      //关闭弹窗
      this.hideModal();
      return;
    } else if (Number(choose_course.EO_Have) > 0) {
      this.setData({
        isUseConpoun: true
      })
    } else {
      //说明没有优惠券
      this.setData({
        isUseConpoun: false
      })
    }
    this.setData({
      'appoinemntInfo.chooseCourse': choose_course
    })
    // //重新选择教练
    var se_id = this.data.appoinemntInfo.chooseCourse.SE_ID
    var GB_ID = wx.getStorageSync('GB_ID')
    getEquestrianPriceByTeacher(GB_ID, se_id).then(res => {
      if (res.data.code == 1) {
        this.setData({
          coachList: res.data.data,
          'appoinemntInfo.chooseCoach': res.data.data[0],
          'appoinemntInfo.SearchDate': "请选择",
          'appoinemntInfo.endtime': null,
          'appoinemntInfo.starttime': null
        })
        //更新教练的时间
        this.chooseCoachPrivateTime(() => {
          // wx.hideLoading()
        })
        //重新计算价格
        this.afreshCountPrice();
        wx.showToast({
          icon: 'none',
          title: '你重新选择了课程,请重新选择教练和时间',
          duration: 2000
        })
        //关闭弹窗
        this.hideModal();
      }
    })
  },
  //不使用优惠券
  noUse() {
    this.hideModal();
    this.setData({
      isUseConpoun: false
    })
    //重新计算
    this.afreshCountPrice();
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      useCoupon: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        useCoupon: false
      })
    }.bind(this), 200)
  },
  bindChange(e) {
    var value = e.detail.value
    this.setData({
      pay_index: value
    })
  },
  //日期
  bindDateChange(e) {
    //选择了日期重新更新教练的时间
    if (this.data.appoinemntInfo.SearchDate == e.detail.value) {
      return
    }
    this.setData({
      'appoinemntInfo.SearchDate': e.detail.value,
      "appoinemntInfo.starttime": null,
      "appoinemntInfo.endtime": null
    })
    this.chooseCoachPrivateTime();
  },
  //选择时间
  chooseCoachPrivateTime(fn) {
    var searchDate = this.data.appoinemntInfo.SearchDate;
    var coachId = this.data.appoinemntInfo.chooseCoach.TeacherId;
    getPrivateClass(searchDate, coachId).then(res => {
      var time = res.data.data;
      if (res.data.code == 1) {
        let newList = time.filter(item => item.StateMsg == '可预约')
        if (newList.length == 0) {
          wx.showToast({
            icon: "none",
            title: '教练休息，请重新选择时间',
          })
        }
        this.setData({
          datatime: newList
        })
        if (typeof fn == 'function') {
          fn();
        }
      }
    })
  },
  //所有教练
  chooseCoachList() {
    //SE_ID
    var se_id = this.data.appoinemntInfo.chooseCourse.SE_ID;
    var gb_id = wx.getStorageSync('GB_ID')
    getEquestrianPriceByTeacher(gb_id, se_id).then(res => {
      if (res.data.code == 1) {
        this.setData({
          coachList: res.data.data
        })
      }
    })
  },
  //重新选择教练
  anewChooseCoach(e) {
    var chooseCoach = this.data.coachList[e.detail.value];
    var currCoach = this.data.appoinemntInfo.chooseCoach;
    if (currCoach.TeacherId !== chooseCoach.TeacherId) {
      //更新时间
      this.chooseCoachPrivateTime()
      this.setData({
        'appoinemntInfo.chooseCoach': chooseCoach,
        'appoinemntInfo.SearchDate': "请选择",
        'appoinemntInfo.endtime': null,
        'appoinemntInfo.starttime': null
      })
      wx.showToast({
        icon: "none",
        title: '请重新选择日期和时间',
      })
    }
    this.afreshCountPrice();
  },
  //重新计算费用
  afreshCountPrice() {
    //最终的价格
    var finalPrice;
    //总价
    var totalPrice;
    //判断是否使用优惠券
    if (this.data.isUseConpoun) {
      finalPrice = Number(this.data.appoinemntInfo.chooseCoach.ST_Price)
    } else {
      finalPrice = Number(this.data.appoinemntInfo.chooseCoach.ST_Price) + Number(this.data.appoinemntInfo.chooseCourse.Price);
    }
    totalPrice = Number(this.data.appoinemntInfo.chooseCoach.ST_Price) + Number(this.data.appoinemntInfo.chooseCourse.Price)
    this.setData({
      totalPrice: totalPrice,
      finalPrice: finalPrice
    })
  },
  //选择时间
  anewChooseTime(e) {
    //下标
    console.log(e)
    if (this.data.appoinemntInfo.SearchDate == '请选择') {
      wx.showToast({
        icon: "none",
        title: '请先选择日期',
      })
      return
    }
    var my_time = this.data.datatime[e.detail.value];
    //获取当前教练的时长
    var se_time = this.data.appoinemntInfo.chooseCourse.SE_Time;
    //时间
    var startTime = this.data.appoinemntInfo.SearchDate + ' ' + my_time.StartTime;
    var endTime = this.data.appoinemntInfo.SearchDate + ' ' + my_time.StartTime;
    startTime = new Date(startTime.replace(/-/g, '/'));
    endTime = new Date(endTime.replace(/-/g, '/'))
    endTime = endTime.setMinutes(endTime.getMinutes() + Number(se_time));
    startTime = uitl.formatTime(startTime);
    endTime = uitl.formatTime(new Date(endTime));
    console.log(startTime, endTime)
    startTime = startTime.substring(startTime.length - 5);
    endTime = endTime.substring(endTime.length - 5);
    this.setData({
      'appoinemntInfo.starttime': startTime,
      'appoinemntInfo.endtime': endTime
    })
  },
  getMyChooseCourse1() {
    var gb_id = wx.getStorageSync('GB_ID');
    var ui_id = wx.getStorageSync('UI_ID') || 0;
    getMyEquestrianList(gb_id, ui_id).then(res => {
      if (res.data.code == 1) {
        this.setData({
          courseList1: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //取消
  cancelMask() {
    this.hideModal();
  },
  //微信支付
  getByWechat() {
    /**
     * {"userId":3840, "eo_id":12, "teacherId":586, "gymId":88, "startdate":"2021-08-06 19:00", "enddate":"2021-08-06 20:00" }
     */
    //判断是否使用
    if (!this.data.appoinemntInfo.SearchDate || !this.data.appoinemntInfo.starttime || !this.data.appoinemntInfo.endtime) {
      wx.showToast({
        icon: "none",
        title: '请选择日期或时间',
      })
    }
    var wechatObj = {
      userId: wx.getStorageSync('UI_ID'),
      teacherId: this.data.appoinemntInfo.chooseCoach.TeacherId,
      gymId: wx.getStorageSync('GB_ID'),
      startdate: this.data.appoinemntInfo.SearchDate + ' ' + this.data.appoinemntInfo.starttime,
      enddate: this.data.appoinemntInfo.SearchDate + ' ' + this.data.appoinemntInfo.endtime
    }
    //使用优惠券
    if (this.data.isUseConpoun) {
      console.log('使用优惠券')
      //getEquestrianOrderBywxPay
      wechatObj.eo_id = this.data.appoinemntInfo.chooseCourse.EO_ID
      getEquestrianOrderBywxPay(JSON.stringify(wechatObj)).then(res => {
        if (res.data.code == 1) {
          //微信支付
          this.getpaydata(res.data.data[0].OrderNo, res.data.businessNo, res.data.data[0].MoneyReal * 100)
        }
      })
    } else {
      console.log('没有优惠券')
      wechatObj.se_id = this.data.appoinemntInfo.chooseCourse.SE_ID
      getEquestrianOrderClassBywxPay(JSON.stringify(wechatObj)).then(res => {
        if (res.data.code == 1) {
          console.log('没有使用优惠券',res.data.data[0].MoneyReal)
          //微信支付
          this.getpaydata(res.data.data[0].OrderNo, res.data.businessNo, res.data.data[0].MoneyReal * 100)
        }
      })
    }
  },
  //储值支付
  getByStored() {
    var pages = getCurrentPages(); //当前页面
    var prevPage = pages[pages.length - 2]; //上一页面
    console.log(prevPage.data.currentCourse)
    //return
    var that = this;
    if (!this.data.appoinemntInfo.SearchDate || !this.data.appoinemntInfo.starttime || !this.data.appoinemntInfo.endtime) {
      wx.showToast({
        icon: "none",
        title: '请选择日期或时间',
      })
    }
    //使用
    var json = {
      userId: wx.getStorageSync('UI_ID'),
      teacherId: this.data.appoinemntInfo.chooseCoach.TeacherId,
      gymId: wx.getStorageSync('GB_ID'),
      startdate: this.data.appoinemntInfo.SearchDate + ' ' + this.data.appoinemntInfo.starttime,
      enddate: this.data.appoinemntInfo.SearchDate + ' ' + this.data.appoinemntInfo.endtime
    }
    if (this.data.isUseConpoun) {
      json.eo_id = this.data.appoinemntInfo.chooseCourse.EO_ID;
      getEquestrianOrderByStored(JSON.stringify(json)).then(res => {
        if (res.data.code == 1) {
          if (prevPage.data.currentCourse.EO_Have > 0) {
            var eo_have = Number(prevPage.data.currentCourse.EO_Have) - 1
            prevPage.setData({
              'currentCourse.EO_Have': eo_have
            })
          }
          wx.navigateTo({
            url: '/page2/success/success?type=2&SE_ID=' + that.data.appoinemntInfo.chooseCourse.SE_ID,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
        }
      })
    } else {
      json.se_id = this.data.appoinemntInfo.chooseCourse.SE_ID;
      getEquestrianOrderClassByStored(JSON.stringify(json)).then(res => {
        if (res.data.code == 1) {
          wx.navigateTo({
            url: '/page2/success/success?type=2&SE_ID=' + that.data.appoinemntInfo.chooseCourse.SE_ID,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
        }
      })
    }
  },
  //付款
  payMoney() {
    //获取微信支付
    var payWay = this.data.pay_index
    if (payWay == 0) {
      console.log('微信支付')
      //微信支付
      this.getByWechat();
    } else {
      console.log('储值支付')
      this.getByStored();
    }
  },
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
        console.log(res.data)
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
  //订单支付成功
  ordersuccess(order) {
    var pages = getCurrentPages(); //当前页面
    var prevPage = pages[pages.length - 2];
    //如果是使用优惠券
    if (this.data.isUseConpoun) {
      getEquestrianBywxPaySuccess(order).then(res => {
        if (res.data.code == 1) {
          if (prevPage.data.currentCourse.EO_Have > 0) {
            var eo_have = Number(prevPage.data.currentCourse.EO_Have) - 1
            prevPage.setData({
              'currentCourse.EO_Have': eo_have
            })
          }
          wx.navigateTo({
            url: '/page2/success/success?type=2&SE_ID=' + that.data.appoinemntInfo.chooseCourse.SE_ID,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
        }
      })
    } else {
      //不使用优惠券
      getEquestrianOrderClassBywxPaySuccess(order).then(res => {
        if (res.data.code == 1) {
          wx.navigateTo({
            url: '/page2/success/success?type=2&SE_ID=' + that.data.appoinemntInfo.chooseCourse.SE_ID,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.msg,
          })
        }
      })
    }
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

  }
})