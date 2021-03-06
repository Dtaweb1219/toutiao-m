/**
 * 用户相关的请求模块
 */

import request from '@/utils/request'
// import store from '@/store'

/**
 * 获取用户自己的信息
 */
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: data
  })
}
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
/**
 * 获取用户自己的信息
 */
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // 发送请求头数据
    // headers: {
    //   // 注意：该接口需要授权才能访问
    //   //       token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
    //   // 引用store的user数据要在上面先import store
    //   // Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
/**
 * 获取频道列表
 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
// 关注用户接口
export const addFollow = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target
    }
  })
}

// 取消关注用户接口
export const deleteFollow = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${target}`
  })
}
