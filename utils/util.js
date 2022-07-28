const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
 // const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function format(date, fmt) {
  let d = new Date(date)
  var o = {
    "M+": d.getMonth() + 1, //月份
    "d+": d.getDate(), //日
    "h+": d.getHours(), //小时
    "m+": d.getMinutes(), //分
    "s+": d.getSeconds(), //秒
    "q+": Math.floor((d.getMonth() + 3) / 3), //季度
    "S": d.getMilliseconds() //毫秒
  };
  //  获取年份 
  if (/(y+)/i.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")", "i").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
function toWeekDay(date) { // 传入数据  讲一周的某一天返回成中文状态下的字符
  //console.log(date)
  var today = new Date();
  var currTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var nextDay = new Date(date)
  var nextTime = nextDay.getFullYear() + '-' + (nextDay.getMonth() + 1) + '-' + nextDay.getDate();
  if (currTime == nextTime) {
    return '今天'
  }
  switch (date.getDay()) {
    case 1:
      return '周一';
      break;
    case 2:
      return '周二';
      break;
    case 3:
      return '周三';
      break;
    case 4:
      return '周四';
      break;
    case 5:
      return '周五';
      break;
    case 6:
      return '周六';
      break;
    case 0:
      return '周日';
      break;
    default:
      break;
  }
  return '传入未知参数';
}
module.exports = {
  formatTime,
  format,
  toWeekDay
}