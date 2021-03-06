/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

// JSONBig 可以处理数据中超出 javascript 安全整数范围的问题
// JSONBig.parse()  //把JSON格式的字符串转为javascript对象
// JSONBig.stringify()  // 把javascript 对象 转为 JSON格式的字符串

const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
  // transformResponse` 在传递给 then/catch 前，允许修改响应数据
  // 自定义后端返回的原始数据
  // data:后端返回的原始数据，说白了就是JSON 格式的字符串
  transformResponse: [
    function(data) {
      // 对 data 进行任意转换处理
      try {
        // 把data 转为对象模式
        return JSONBig.parse(data)
      } catch (err) {
        return data
      }
    }
  ]
})

// 请求拦截器
// Add a request interceptor
// 是给上面那个request添加拦截器,统一设置token
request.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    // 请求发起会经过这里
    //  config 配置对象：本次请求的请求配置对象
    // console.log(config)

    const { user } = store.state
    // 如果user是有效的 并且user也携带token的话就添加给config添加token
    if (user && user.token) {
      config.headers.Authorization = ` Bearer ${user.token}`
    }
    // 注意：这里务必要返回 config配置对象，否则请求就停在这里
    // console.log(config)
    return config
  },
  function(error) {
    // Do something with request error
    // 如果请求出错了（还没有发出去）会进入这里
    return Promise.reject(error)
  }
)

// 响应拦截器

export default request
