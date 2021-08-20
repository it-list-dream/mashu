// Pages/tabbar/appointment/appointment.js
const util = require('../../../utils/util.js')
const app = getApp()
import {
  getPrivateClass,
  getMyEquestrianList
} from '../../../service/appointment.js'
//getMyEquestrianList 课程以及券
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
    datatime: [],
    //登录
    isLogin: false,
    //是否指定教练
    isChooseCoach: false,
    num: 0,
    //当前教练
    currentCoach: null,
    //当前课程
    currentCourse: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = util.format(new Date(), 'yyyy-mm-dd');
    this.setData({
      today: today,
      SearchDate: today
    })
    this.getMyChooseCourse();
  },
  isLogin() {
    let status = wx.getStorageSync('loginStatus')
    if (status !== 2) {
      this.setData({
        isLogin: false
      })
    } else {
      this.setData({
        isLogin: true
      })
    }
  },
  //选择日期
  chooseDate(e) {
    var coachId = this.data.currentCoach.TeacherId;
    var dayIndex = e.currentTarget.dataset.index;
    var date = e.currentTarget.dataset.date.replace(/\./g, '-');
    var sdate = this.data.SearchDate;
    var year = new Date(sdate).getFullYear();
    //console.log(date)
    var searchDate = year + '-' + date;
    this.setData({
      choosesDay: dayIndex,
      SearchDate: searchDate,
      num: null
    })
    this.getMyPrivateTime(searchDate, coachId)
    if (this.data.date) {
      this.setData({
        date: false
      })
    }
  },
  getMyPrivateTime(serachDate, CoachID) {
    getPrivateClass(serachDate, CoachID).then(res => {
      if (res.data.code == 1) {
        this.setData({
          datatime: res.data.data
        })
        this.getMyCurrentTime();
      }
    })
  },
  // 
  //显示日期
  showCalendar() {
    this.setData({
      date: !this.data.date
    })
  },
  dayClick(event) {
    console.log(event)
    let clickYear = event.detail.year;
    let clickMonth = event.detail.month;
    let clickDay = event.detail.day;
    clickMonth < 10 ? clickMonth = "0" + clickMonth : clickMonth
    clickDay < 10 ? clickDay = "0" + clickDay : clickDay
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    // console.log(changeDay,changeBg)
    let chose_date = clickYear + '-' + clickMonth + "-" + clickDay
    var caniclick = Date.parse(chose_date) >= Date.parse(this.data.today)
    if (caniclick) {
      this.setData({
        [changeDay]: clickDay,
        [changeBg]: "#84e7d0",
        date: false,
        SearchDate: chose_date
      })
      this.getWeekList(chose_date);
      this.getMyPrivateTime(chose_date, this.data.currentCoach.TeacherId)
    } else {
      wx.showToast({
        icon: "none",
        title: '时间已过',
      })
    }
  },
  //指定教练
  applyCoach() {
    var id = this.data.currentCourse.SE_ID;
    // if(this.data.currentCourse.EO_ID){
    //     id = this.data.currentCourse.EO_ID
    // }else{
    //   id = this.data.currentCourse.SE_ID
    // }
    wx.navigateTo({
      url: '/pages/chooseCoach/chooseCoach?title=选择教练&id=' + id,
    })
  },
  //选择课程
  chooseCourse() {
    wx.navigateTo({
      url: '/pages/chooseCourse/chooseCourse',
    })
  },
  showch() {
    wx.showToast({
      icon: "none",
      title: '不可预约',
    })
  },
  showch1(e) {
    //获取上课的结束时间
    var stime = e.currentTarget.dataset.s;
    var classTime = this.data.currentCourse.SE_Time;
    var sdate = this.data.SearchDate + ' ' + stime;
    sdate = new Date(sdate);
    sdate = sdate.setMinutes(sdate.getMinutes() + Number(classTime));
    console.log(util.format(sdate, 'yyyy-MM-dd hh:mm'))
    this.setData({
      num: e.currentTarget.dataset.num,
      starttime: this.data.SearchDate + ' ' + stime,
      endtime: util.format(sdate, 'yyyy-MM-dd hh:mm')
    })
  },
  // 判断哪些时间已过期
  getMyCurrentTime: function () {
    var dataTime = this.data.datatime;
    for (var i = 0; i < dataTime.length; i++) {
      if (dataTime[i].StateMsg === '已预约') {
        dataTime[i].type = 1;
      } else if (dataTime[i].StateMsg === '可预约') {
        dataTime[i].type = 2;
      } else {
        //不可预约
        dataTime[i].type = 0;
      }
    }
    this.setData({
      datatime: dataTime
    })
  },
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  getMyChooseCourse() {
    var gb_id = wx.getStorageSync('GB_ID');
    var ui_id = wx.getStorageSync('UI_ID') || 0;
    getMyEquestrianList(gb_id, ui_id).then(res => {
      let newList = res.data.data;
      // console.log(res)
      if (res.data.code == 1) {
        newList.forEach(item => {
          if( item.EO_ActiveEnd !==''){
            item.EO_ActiveEnd = util.format(item.EO_ActiveEnd, 'yyyy-mm-dd')
          }
        })
        this.setData({
          currentCourse: res.data.data[0]
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
    this.isLogin();
    if (this.data.currentCoach) {
      let id = this.data.currentCoach.FK_AL_TeachCoach_ID ? this.data.currentCoach.FK_AL_TeachCoach_ID : this.data.currentCoach.TeacherId
      this.getMyPrivateTime(this.data.SearchDate, id);
      this.getWeekList();
    }
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
  appoinment() {
    if (!this.data.num) {
      wx.showToast({
        title: '请选择时间',
        icon: 'none'
      })
    } else if (!this.data.currentCoach) {
      wx.showToast({
        title: '请选择教练',
        icon: 'none'
      })
    } else {
      let appoinmentObj = {
        starttime: this.data.starttime,
        endtime: this.data.endtime,
        SearchDate: this.data.SearchDate,
        chooseCourse: this.data.currentCourse,
        chooseCoach: this.data.currentCoach
      }
      wx.navigateTo({
        url: '/pages/courseBooking/courseBooking?appoinemntInfo=' + JSON.stringify(appoinmentObj),
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      date: false,
      num: null
    })
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