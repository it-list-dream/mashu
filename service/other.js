import {
  request
} from '../utils/request.js';

export function getClassPriceByTearchId(teacherid) {
  return request({
    url: '/ClassPriceByTearchId',
    data: {
      teacherid
    }
  })
}

export function getEquestrianClassDetails(GB_ID, UI_ID, SE_ID) {
  return request({
    url: '/EquestrianClassDetails',
    data: {
      GB_ID,
      UI_ID,
      SE_ID
    }
  })
}
//1过期
export function getMyEquestrianListHave(GB_ID, UI_ID,isexpire) {
  return request({
    url: '/MyEquestrianListHave',
    data: {
      GB_ID,
      UI_ID,
      isexpire
    }
  })
}

//课程推荐
export function getEquestrianClassAll( GB_ID,UI_ID){
  return request({
    url: '/EquestrianClassAll',
    data: {
      GB_ID,
      UI_ID
    }
  })
}
//我的储值

export function getStoreMoneyRecord(json1) {
  return request({
    url: '/StoreMoneyRecord',
    data: {
      json1
    }
  })
}
//储值支付
export function getEquestrianOrderBuyByStored(json1){
  return request({
    url: '/EquestrianOrderBuyByStored',
    data: {
      json1
    }
  })
}
//微信支付
export function getEquestrianOrderBuyBywxPay(json1){
  return request({
    url: '/EquestrianOrderBuyBywxPay',
    data: {
      json1
    }
  })
}
//支付成功
export function getEquestrianOrderBuyBywxPaySuccess(orderNo){
  return request({
    url: '/EquestrianOrderBuyBywxPay',
    data: {
      orderNo
    }
  })
}