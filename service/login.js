var { request} = require('../utils/request.js')

export function getUrlBySign(sign) {
  return request({
    url: '/GetUrlBySign',
    data: {
      sign,
    }
  })
}

export function getWxUserLogin(code) {
  return request({
    url: '/WxUserLogin',
    data: {
      code
    }
  })
}
export function getUserPhoneBind(encryptedDataStr, iv) {
  return request({
    url: '/userPhoneBind',
    data: {
      encryptedDataStr,
      iv
    }
  })
}