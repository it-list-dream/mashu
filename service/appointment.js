var { request} = require('../utils/request.js')
//
export function getPrivateClass(SearchDate, CoachID) {
  return request({
    url: '/MyEquestrianPrivateClassReservationList',
    data: {
      SearchDate,
      CoachID
    }
  })
}

export function getMyEquestrianList(GB_ID, UI_ID) {
  return request({
    url: '/MyEquestrianList',
    data: {
      GB_ID,
      UI_ID
    }
  })
}

export function getMyReservationList(json1) {
  return request({
    url: "/MyReservationList",
    data: {
      json1
    }
  })
}

export function getEquestrianPriceByTeacher(GB_ID,SE_ID){
  return request({
    url: "/EquestrianPriceByTeacher",
    data: {
      GB_ID,
      SE_ID
    }
  })
}
//取消
export function getCancelReservation(orderNo){
  return request({
    url: "/CancelReservation",
    data: {
      orderNo
    }
  })
}