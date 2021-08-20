
const app = getApp()
import {getStoreMoneyRecord} from '../../service/other.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storedTabs: ['全部', '充值', '消费'],
    stored_index: 0,
    pagesSize:10,
    //当前页数
    pageIndex:1,
    //列表
    storedList:[],
    //下拉
    flag:true,
    money:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowHeihgt: app.globalData.windowHeight,
      money:options.money || 0
    })
    this.getMoneyRecord();
  },
  //
  handleTabs(e) {
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    if(this.data.stored_index == index){
       return
    }
    this.setData({
      stored_index: index,
      pageIndex:1,
      flag:true,
      storedList:[]
    })
    this.getMoneyRecord();
  },
  getMoneyRecord(){
    ////{ "pageindex":1, "pagesize":20, "userid":3838, "type":0  }
    var ui_id = wx.getStorageSync('UI_ID')||0;
    var record = {
      pageindex:this.data.pageIndex,
      pagesize:this.data.pagesSize,
      userid:ui_id,
      type:this.data.stored_index
    }
    var stored = this.data.storedList;
    getStoreMoneyRecord(JSON.stringify(record)).then(res=>{
      console.log(res.data.data)
       if(res.data.code == 1){
         if(res.data.data.length>0){
          stored.push(...res.data.data)
          this.setData({
            storedList:stored
           })
         }else{
           this.setData({
             flag:false
           })
         }     
       }
    })
  },
  //加载更过
  loadMore(){
      console.log('下拉加载更多')
      if(this.data.flag){
        var currPage = this.data.pageIndex +1;
         this.setData({
          pageIndex:currPage
         })
         this.getMoneyRecord();
      }
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