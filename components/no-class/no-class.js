// components/no-class/no-class.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value: 0
    },
    title: {
      type: String,
      value: '',
      // observer: function (oldVal, newVal) {
      //   console.log(oldVal, newVal)
      // }
    }
  },
  ready: function () {
    console.log(this.properties.title)
    console.log(this.properties.type)
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handleBtn() {
      // console.log(this.properties.type)
      // console.log(this.properties.title)
      if (this.properties.type == 1) {
        console.log('登录！')
        wx.navigateTo({
          url: '/pages/login/login',
        })
      } else {
        //console.log('联系我们')
        var phoneNumber = app.globalData.storePhone
        console.log(phoneNumber)
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
      }
    }
  }
})