import {
  request
} from '../utils/request.js';
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

export function getEquestrianPriceByTeacher(SE_ID){
  return request({
    url: "/EquestrianPriceByTeacher",
    data: {
      SE_ID
    }
  })
}