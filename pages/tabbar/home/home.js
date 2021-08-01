// pages/tabbar/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['/asset/images/home/banner.png','/asset/images/home/banner.png','/asset/images/home/banner.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  goShop(){
    wx.navigateTo({
      url: '/pages/shop/shop',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //显示地图
  showMap(){
    this.openLocationFun(34.203,108.923,15,"李大力健身房","");
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
openLocationFun: function(latitude, longitude, scale, name, address, cbSuccessFun, cbFailFun, cbCompleteFun){  
  var openObj= {};  
  openObj.latitude = latitude;  
  openObj.longitude = longitude;  
  openObj.scale = 15;  
  if(scale>0 && scale < 29) {
    openObj.scale = scale;
  }  
  if(name) {
    openObj.name = name;
  }  
  if(address) {
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
  wx.openLocation(openObj);
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