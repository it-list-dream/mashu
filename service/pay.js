import {
  request
} from '../utils/request.js';

//EquestrianOrderByStored
/**
 * {"userId":3840, "eo_id":12, "teacherId":586, "gymId":88, "startdate":"2021-08-06 19:00", "enddate":"2021-08-06 20:00" }
 */
//马术在线预约(已购买课程,储值支付)
export function getEquestrianOrderByStored(json1) {
  return request({
    url: '/EquestrianOrderByStored',
    data: {
      json1
    }
  })
}
//马术在线预约(未购买课程,储值支付)
export function getEquestrianOrderClassByStored(json1) {
  return request({
    url: '/EquestrianOrderClassByStored',
    data: {
      json1
    }
  })
}

//EquestrianOrderBywxPay 马术在线预约(已购买课程,微信支付)
export function getEquestrianOrderBywxPay(json1) {
  return request({
    url: '/EquestrianOrderBywxPay',
    data: {
      json1
    }
  })
}
//EquestrianOrderClassBywxPay
//马术在线预约(未购买课程,微信支付支付)
export function getEquestrianOrderClassBywxPay(json1) {
  return request({
    url: '/EquestrianOrderClassBywxPay',
    data: {
      json1
    }
  })
}

//EquestrianOrderClassBywxPaySuccess
//马术在线预约(已购课程,微信支付成功)
export function getEquestrianBywxPaySuccess(orderNo) {
  return request({
    url: '/EquestrianOrderBywxPaySuccess',
    data: {
      orderNo
    }
  })
}
//马术在线预约(未购买课程,微信支付支付成功)
export function getEquestrianOrderClassBywxPaySuccess(orderNo) {
  return request({
    url: '/EquestrianOrderClassBywxPaySuccess',
    data: {
      orderNo
    }
  })
}