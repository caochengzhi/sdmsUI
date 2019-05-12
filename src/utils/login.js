import request from '@/utils/request'

export function loginByUsername(username, password, captcha) {
  /*
  const data = {
    username,
    password,
    captcha
  }
  */
  return request({
    url: '/login?userN='+username,
    method: 'post',
    //data,
    params:{
      username: username,
      password: password,
      captcha: captcha
    }
  })
}

export function logout() {
  return request({
    url: '/getout',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}