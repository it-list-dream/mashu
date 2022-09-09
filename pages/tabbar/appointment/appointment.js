const util = require('../../../utils/util.js')
const app = getApp();

import {
  getPrivateClass,
  getMyEquestrianList
} from '../../../service/appointment.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    //是否有卡
    hasCard: false,
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
    });
  },
  checkLogin() {
    var status = wx.getStorageSync('loginStatus');
    var ui_id = wx.getStorageSync('UI_ID')
    this.status = status;
    if (status == 0 || status == 1) {
      this.setData({
        isLogin: false,
        hasCard: false
      });
    } else {
      if (ui_id > 0) {
        this.setData({
          hasCard: true
        });
      } else {
        this.setData({
          hasCard: false
        })
      }
      this.setData({
        isLogin: true
      })
    }
  },
  //选择日期
  chooseDate(e) {
    console.log(this.data.currentCoach)
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
  //教练的预约事件
  getMyPrivateTime(serachDate, CoachID, resolve) {
    getPrivateClass(serachDate, CoachID).then(res => {
      if (res.data.code == 1) {
        this.setData({
          datatime: res.data.data
        })
        this.getMyCurrentTime();
        typeof resolve == 'function' && resolve();
      }
    })
  },
  //显示日期
  showCalendar() {
    this.setData({
      date: !this.data.date
    })
  },
  dayClick(event) {
    //console.log(event)
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
    // let appoinmentTime = Date.parse(chose_date) - Date.parse(this.data.today);
    // && appoinmentTime - 6 * 1000 * 60 * 60 * 24<=0
    if (caniclick) {
      this.setData({
        [changeDay]: clickDay,
        [changeBg]: "#84e7d0",
        date: false,
        SearchDate: chose_date,
        choosesDay: 0,
        num: null
      });
      this.getWeekList(chose_date);
      this.getMyPrivateTime(chose_date, this.data.currentCoach.TeacherId)
    } else {
      wx.showToast({
        icon: "none",
        title: '时间已过或该时间段不能预约',
      })
    }
  },
  //指定教练
  applyCoach() {
    var id = this.data.currentCourse.SE_ID,
      that = this;
    wx.navigateTo({
      url: '/pages/chooseCoach/chooseCoach?title=选择教练&id=' + id,
      events: {
        updateCoach: function (res) {
          that.setData({
            currentCoach: res.coach,
            checked_horse: true,
            isChooseCoach: true
          });
          // console.log('选中预约的课程信息')
          that.getWeekList();
          that.getMyPrivateTime(that.data.SearchDate, res.coach.TeacherId);
        }
      }
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
    stime = this.data.SearchDate + ' ' + stime
    var sdate = new Date(stime.replace(/-/g, '/'));
    sdate = sdate.setMinutes(sdate.getMinutes() + Number(classTime));
    this.setData({
      num: e.currentTarget.dataset.num,
      starttime: this.data.SearchDate + ' ' + stime,
      endtime: util.formatTime(new Date(sdate))
    });
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
      if (dataTime[i].StartTime == "12:00" || dataTime[i].StartTime == "13:00") {
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
      if (res.data.data.length > 0) {
        newList.forEach(item => {
          if (item.EO_ActiveEnd !== '') {
            item.EO_ActiveEnd = util.format(item.EO_ActiveEnd, 'yyyy-mm-dd')
          }
        })
        this.setData({
          currentCourse: res.data.data[0]
        });
      } else {
        this.setData({
          currentCourse: null
        });
        wx.showToast({
          icon: "none",
          title: '余课不足，请联系门店',
        });
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/tabbar/home/home',
          });
        }, 1500);
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
    this.checkLogin();
    if (this.status == 2) {
      //选中上次约课的课程
      if (JSON.stringify(this.data.currentCourse) == "{}" || !this.data.currentCourse || app.globalData.switchStores) {
        this.getMyChooseCourse();
      }
    } else {
      this.setData({
        currentCourse: {},
        currentCoach: {},
        isChooseCoach: false,
        checked_horse: false,
        datatime: []
      })
    }

    if (app.globalData.switchCard) {
      console.log('切卡')
      this.setData({
        checked_horse: false,
        isChooseCoach: false,
        currentCoach: null
      });
      app.globalData.switchCard = false;
      if(!app.globalData.aboutCourse){
        this.getMyChooseCourse();
      }
    }

    if (app.globalData.aboutCourse) {
      this.setData({
        currentCourse: app.globalData.aboutCourse,
        currentCoach: null,
        isChooseCoach: false,
        checked_horse: false,
        datatime: []
      });
      app.globalData.aboutCourse = null;
      return;
    }
   

    if (this.data.currentCoach) {
      let coachId = this.data.currentCoach.TeacherId;
      //找到当前的课程并且刷新
      let eo_id = this.data.currentCourse.EO_ID,
        idx = 0;
      var gb_id = wx.getStorageSync('GB_ID');
      var ui_id = wx.getStorageSync('UI_ID') || 0;
      getMyEquestrianList(gb_id, ui_id).then(res => {
        let newList = res.data.data;
        if (res.data.data.length > 0) {
          newList.forEach((item, index) => {
            if (item.EO_ActiveEnd !== '') {
              item.EO_ActiveEnd = util.format(item.EO_ActiveEnd, 'yyyy-mm-dd')
            }
            if (item.EO_ID == eo_id) {
              idx = index;
            }
          });
          this.setData({
            currentCourse: newList[idx]
          });
        } else {
          this.setData({
            currentCourse: null,
            checked_horse: false,
            isChooseCoach: false
          });
          wx.showToast({
            icon: "none",
            title: '余课不足，请联系门店',
          });
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/tabbar/home/home',
            });
          }, 1500);
        }
      })
      this.getMyPrivateTime(this.data.SearchDate, coachId);
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
    } else {
      let appoinmentObj = {
        starttime: this.data.starttime,
        endtime: this.data.endtime,
        SearchDate: this.data.SearchDate,
        chooseCourse: this.data.currentCourse,
        chooseCoach: this.data.currentCoach
      }
      //console.log(this.data.starttime)
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