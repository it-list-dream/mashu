// page2/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipMessage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // type 1 表示购买成功 2 表示预约成功
    var tip;
    if (options.type == 1) {
      tip = '购买成功'
      this.se_id = options.SE_ID;
    } else {
      tip = '预约成功'
      this.se_id = options.SE_ID;
    }
    this.setData({
      tipMessage: tip
    })
  },
  backHome() {
    wx.switchTab({
      url: '/pages/tabbar/home/home',
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
  // 分享
  onShareAppMessage({
    from
  }) {
    var shareContent = {
      GB_ID: wx.getStorageSync('GB_ID'),
      SE_ID: this.se_id,
      sign: wx.getStorageSync('sign')
    }
    var pathUrl = '';
    if (from == 'button') {
      console.log('来自按钮的分享');
      pathUrl = "/pages/courseDetail/courseDetail?courseInfo=" + JSON.stringify(shareContent)
    } else {
      console.log('来自菜单栏的分享');
      pathUrl = "/pages/courseDetail/courseDetail?courseInfo=" + JSON.stringify(shareContent)
    }
    return {
      title: '课程详情',
      imageUrl: 'http://mmbiz.qpic.cn/mmbiz_png/Uh5zpoOsMunRnZvh4wdn9ZQfHib7W4QfKseSD11Ru5dfar7cQhVqLkeMMw6sDia1edriakBA3ibwoPJ49T8TheibwGw/0?wx_fmt=png',
      path: pathUrl
    }
  }
})