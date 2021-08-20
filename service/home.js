import {request} from '../utils/request.js';

export function getCoachStyleList(GB_ID) {
  return request({
    url: '/CoachStyleList',
    data: {
      GB_ID,
    }
  })
}

export function getSuggestEquestrianClass(GB_ID,UI_ID) {
  return request({
    url: '/SuggestEquestrianClass',
    data: {
      GB_ID,
      UI_ID
    }
  })
}

export function getGymList() {
  return request({
    url: '/GymList',
    data: {}
  })
}

export function getSearchGymQR() {
  return request({
    url: '/SearchGymQR',
    data: {}
  })
}