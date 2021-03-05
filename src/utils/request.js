/**
 * 请求模块
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
request.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器

export default request
