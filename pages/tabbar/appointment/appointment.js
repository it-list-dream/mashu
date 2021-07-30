// Pages/tabbar/appointment/appointment.js
const util = require('../../../utils/util.js')
let dateList = [{
  "StartTime": "08:00",
  "EndTime": "08:30",
}, {
  "StartTime": "08:30",
  "EndTime": "09:00"
}, {
  "StartTime": "09:00",
  "EndTime": "09:30"
}, {
  "StartTime": "09:30",
  "EndTime": "10:00"
}, {
  "StartTime": "10:00",
  "EndTime": "10:30"
}, {
  "StartTime": "10:30",
  "EndTime": "11:00"
}, {
  "StartTime": "11:00",
  "EndTime": "11:30"
}, {
  "StartTime": "11:30",
  "EndTime": "12:00"
}, {
  "StartTime": "12:00",
  "EndTime": "12:30"
}, {
  "StartTime": "12:30",
  "EndTime": "13:00"
}, {
  "StartTime": "13:00",
  "EndTime": "13:30"
}, {
  "StartTime": "13:30",
  "EndTime": "14:00"
}, {
  "StartTime": "14:00",
  "EndTime": "14:30"
}, {
  "StartTime": "14:30",
  "EndTime": "15:00"
}, {
  "StartTime": "15:00",
  "EndTime": "15:30"
}, {
  "StartTime": "15:30",
  "EndTime": "16:00"
}, {
  "StartTime": "16:00",
  "EndTime": "16:30"
}, {
  "StartTime": "16:30",
  "EndTime": "17:00"
}, {
  "StartTime": "17:00",
  "EndTime": "17:30"
}, {
  "StartTime": "17:30",
  "EndTime": "18:00"
}, {
  "StartTime": "18:00",
  "EndTime": "18:30"
}, {
  "StartTime": "18:30",
  "EndTime": "19:00"
}, {
  "StartTime": "19:00",
  "EndTime": "19:30"
}, {
  "StartTime": "19:30",
  "EndTime": "20:00"
}, {
  "StartTime": "20:00",
  "EndTime": "20:30"
}, {
  "StartTime": "20:30",
  "EndTime": "21:00"
}, {
  "StartTime": "21:00",
  "EndTime": "21:30"
}, {
  "StartTime": "21:30",
  "EndTime": "22:00"
}, {
  "StartTime": "22:00",
  "EndTime": "22:30"
}, {
  "StartTime": "22:30",
  "EndTime": "23:00"
}];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // tabsList: [],
    checked_horse: false,
    dayStyle: [{
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
        background: '#AAD4F5'
      },
      {
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
        background: '#AAD4F5'
      }
    ],
    //日期的显示和隐藏
    date: false,
    SearchDate: null,
    today: null,
    weekList: [],
    //选择星期
    choosesDay: 0,
    datatime: dateList,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = util.format(new Date(), 'yyyy-mm-dd')
    this.setData({
      today: today,
      SearchDate: today,
    })
    this.getWeekList();
  },
  //选择日期
  chooseDate(e) {
    var dayIndex = e.currentTarget.dataset.index;
    var date = e.currentTarget.dataset.date.replace(/\./g, '-');
    var sdate = this.data.SearchDate;
    var year = new Date(sdate).getFullYear();
    //console.log(date)
    this.setData({
      choosesDay: dayIndex,
      SearchDate: year + '-' + date
    })
    
    if(this.data.date){
       this.setData({
         date:false
       })
    }
  },
  //显示日期
  showCalendar() {
    this.setData({
      date: !this.data.date
    })
  },
  dayClick(event) {
    let clickDay = event.detail.day;
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    //console.log(changeDay,changeBg)
    this.setData({
      [changeDay]: clickDay,
      [changeBg]: "#84e7d0",
      date: false
    })
  },
  //指定教练
  applyCoach(){
     wx.navigateTo({
       url: '/pages/chooseCoach/chooseCoach',
     })
  },
  chooseCourse(){
     wx.navigateTo({
       url: '/pages/chooseCourse/chooseCourse',
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
  getWeekList: function (t) {
    let dayList = [];
    var myDate;
    if (t) {
      myDate = new Date(t)
    } else {
      myDate = new Date()
    }
    dayList.push({
      'day': myDate.getDate(),
      'month': myDate.getMonth() + 1,
      'week': util.toWeekDay(myDate),
      'year': myDate.getFullYear()
    });
    for (var i = 0; i < 4; i++) {
      myDate.setDate(myDate.getDate() + 1);
      dayList.push({
        'day': myDate.getDate(),
        'month': myDate.getMonth() + 1,
        'week': util.toWeekDay(myDate),
        'year': myDate.getFullYear()
      });
    }
    for (var i = 0; i < dayList.length; i++) {
      if (dayList[i].month < 10) {
        dayList[i].month = '0' + dayList[i].month
      }
      if (dayList[i].day < 10) {
        dayList[i].day = '0' + dayList[i].day
      }
    }
    console.log(dayList)
    this.setData({
      weekList: dayList
    })
  },
  appoinment(){
    wx.navigateTo({
      url: '/pages/courseBooking/courseBooking',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})