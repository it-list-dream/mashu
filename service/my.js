var { request} = require('../utils/request.js')

export function getMyCardList(GB_ID) {
  return request({
    url: '/MyCardList',
    data: {
      GB_ID,
    }
  })
}

