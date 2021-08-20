// pages/tabbar/home/home.js
const app = getApp();
import {
  getGymList,
  getCoachStyleList,
  getSuggestEquestrianClass,
  getSearchGymQR
} from '../../../service/home.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['/asset/images/home/banner.png', '/asset/images/home/banner.png', '/asset/images/home/banner.png'],
    navigateTitle: '教练列表',
    coachList: [],
    suggestionList: [],
    storeLogo: null,
    myStore: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.getStoreLogo();
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
      menuRight: app.globalData.menuRight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getStyleList() {
    let GB_ID = wx.getStorageSync('GB_ID');
    getCoachStyleList(GB_ID).then(res => {
      console.log(res)
      if (res.data.code == 1) {
        this.setData({
          coachList: res.data.data
        })
      }
    })
  },
  getEquestrianClass() {
    let GB_ID = wx.getStorageSync('GB_ID');
    //3838
    let UI_ID = wx.getStorageSync('UI_ID') || 0;
    getSuggestEquestrianClass(GB_ID, UI_ID).then(res => {
      //console.log(res)
      var suggestList = res.data.data;
      if (res.data.code == 1) {
        this.setData({
          suggestionList: suggestList.length>4?suggestList.slice(0,4):suggestList 
        })
      }
    })
  },
  getStoreLogo() {
    //getSearchGymQR
    getSearchGymQR().then(res => {
      if (res.data.code == 1) {
        //console.log(res)
        wx.setStorageSync('storeLogo', res.data.data[0].GymLogo)
        this.setData({
          storeLogo: res.data.data[0].GymLogo
        })
      }
    })
  },
  callPhone(phoneNumber) {
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getGymList().then(res => {
      if (res.data.code == 1) {
        this.setData({
          storeList: res.data.data,
          myStore: res.data.data[0]
        })
        wx.setStorageSync('GB_ID', res.data.data[0].GB_ID)
        //保存门店的电话
        app.globalData.storePhone = res.data.data[0].GymTel
        this.getStyleList();
        this.getEquestrianClass();
      }
    })
  },
  //显示地图
  showMap() {
    this.openLocationFun(31.252159, 121.521873, 15, "上海市杨浦区大连路地铁站", "");
  },
  /**  
   * 使用微信内置地图查看位置  
   * 1、latitude：     纬度，范围为-90~90，负数表示南纬 必填  
   * 2、longitude：    经度，范围为-180~180，负数表示西经 必填  
   * 3、scale：        缩放比例，范围1~28，默认为28 选填  
   * 4、name：         位置名 选填  
   * 5、address：      地址的详细说明 选填  
   * 6、cbSuccessFun： 接口调用成功的回调函数 选填  
   * 7、cbFailFun：    接口调用失败的回调函数 选填  
   * 8、cbCompleteFun：接口调用结束的回调函数（调用成功、失败都会执行） 选填  
   */
  openLocationFun: function (latitude, longitude, scale, name, address, cbSuccessFun, cbFailFun, cbCompleteFun) {
    var openObj = {};
    openObj.latitude = latitude;
    openObj.longitude = longitude;
    openObj.scale = 15;
    if (scale > 0 && scale < 29) {
      openObj.scale = scale;
    }
    if (name) {
      openObj.name = name;
    }
    if (address) {
      openObj.address = address;
    }
    openObj.success = function (res) {
      if (cbSuccessFun) {
        cbSuccessFun();
      }
    }
    openObj.fail = function (res) {
      if (cbFailFun) {
        cbFailFun();
      } else {
        console.log("openLocation fail:" + res.errMsg);
      }
    }
    openObj.complete = function (res) {
      if (cbCompleteFun) {
        cbCompleteFun();
      }
    }
    console.log(openObj)
    wx.openLocation(openObj);
  },
  //教练
  coachDetail(e) {
    // console.log(e.currentTarget.dataset.coach)
    let coach = JSON.stringify(e.currentTarget.dataset.coach)
    wx.navigateTo({
      url: '/pages/coachDetail/coachDetail?coach=' + coach,
    })
  },
  courseDetail(e) {
    // console.log(e.currentTarget.dataset.course)
    let course = JSON.stringify(e.currentTarget.dataset.course)
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?course=' + course,
    })
  },
  cardDetail() {
    wx.navigateTo({
      url: '/pages/cardDetail/cardDetail',
    })
  },
  contactMe(e) {
    console.log(e.currentTarget.dataset.price)
    var price = e.currentTarget.dataset.price;
    if(!price) {
      this.callPhone(this.data.myStore.GymTel);
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